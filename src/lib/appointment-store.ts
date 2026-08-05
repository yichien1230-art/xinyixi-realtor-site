import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const DATA_DIR = path.join(process.cwd(), "data");
const DATABASE_FILE = path.join(DATA_DIR, "appointments.json");
const SEED_FILE = path.join(DATA_DIR, "appointments.seed.json");

/**
 * 有設定資料庫連線就用 Postgres，否則退回本機 JSON 檔。
 *
 * 雲端部署（Vercel）的檔案系統是暫存的，重新部署或閒置後會清空，
 * 預約紀錄會消失，因此正式環境必須使用資料庫。
 * 本機開發沒有連線字串時仍走 JSON 檔，維持原本的課堂體驗。
 */
const CONNECTION_STRING =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

export const usingDatabase = Boolean(CONNECTION_STRING);

export type AppointmentStatus = "confirmed" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  meetType: string;
  intent: string[];
  urgency: string | null;
  note: string;
  slotIso: string;
  status: AppointmentStatus;
  aiHeat: "high" | "mid" | "low";
  aiSuggestion: string;
  aiSummary: string;
  aiNextAction: string;
  previewFile: string | null;
  createdAt: string;
};

export class SlotConflictError extends Error {
  constructor() {
    super("這個時段剛剛被預約，請重新選擇。");
    this.name = "SlotConflictError";
  }
}

/* ------------------------------------------------------------------ */
/* Postgres                                                            */
/* ------------------------------------------------------------------ */

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      max: 3
    });
  }
  return pool;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await getPool().query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id             TEXT PRIMARY KEY,
          name           TEXT NOT NULL,
          phone          TEXT NOT NULL,
          email          TEXT NOT NULL DEFAULT '',
          meet_type      TEXT NOT NULL,
          intent         JSONB NOT NULL DEFAULT '[]'::jsonb,
          urgency        TEXT,
          note           TEXT NOT NULL DEFAULT '',
          slot_iso       TEXT NOT NULL,
          status         TEXT NOT NULL,
          ai_heat        TEXT NOT NULL,
          ai_suggestion  TEXT NOT NULL DEFAULT '',
          ai_summary     TEXT NOT NULL DEFAULT '',
          ai_next_action TEXT NOT NULL DEFAULT '',
          preview_file   TEXT,
          created_at     TEXT NOT NULL
        )
      `);
      // 由資料庫保證同一時段只會有一筆「已確認」預約，
      // 即使兩位客戶同時送出也不會撞號。
      await getPool().query(`
        CREATE UNIQUE INDEX IF NOT EXISTS appointments_confirmed_slot
          ON appointments (slot_iso) WHERE status = 'confirmed'
      `);
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  meet_type: string;
  intent: unknown;
  urgency: string | null;
  note: string;
  slot_iso: string;
  status: AppointmentStatus;
  ai_heat: "high" | "mid" | "low";
  ai_suggestion: string;
  ai_summary: string;
  ai_next_action: string;
  preview_file: string | null;
  created_at: string;
};

function toAppointment(row: Row): Appointment {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    meetType: row.meet_type,
    intent: Array.isArray(row.intent) ? (row.intent as string[]) : [],
    urgency: row.urgency,
    note: row.note,
    slotIso: row.slot_iso,
    status: row.status,
    aiHeat: row.ai_heat,
    aiSuggestion: row.ai_suggestion,
    aiSummary: row.ai_summary,
    aiNextAction: row.ai_next_action,
    previewFile: row.preview_file,
    createdAt: row.created_at
  };
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "23505";
}

/* ------------------------------------------------------------------ */
/* JSON 檔（本機開發用）                                                */
/* ------------------------------------------------------------------ */

let writeQueue: Promise<unknown> = Promise.resolve();

function withLock<T>(operation: () => Promise<T>) {
  const run = writeQueue.then(operation, operation);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function readJson(file: string): Promise<Appointment[]> {
  const raw = await fs.readFile(file, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as Appointment[]) : [];
}

async function readFileAppointments(): Promise<Appointment[]> {
  try {
    return await readJson(DATABASE_FILE);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return readJson(SEED_FILE);
  }
}

async function writeAppointments(rows: Appointment[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temporary = `${DATABASE_FILE}.${process.pid}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  await fs.rename(temporary, DATABASE_FILE);
}

/* ------------------------------------------------------------------ */
/* 對外介面                                                            */
/* ------------------------------------------------------------------ */

export async function readAppointments(): Promise<Appointment[]> {
  if (!usingDatabase) return readFileAppointments();
  await ensureSchema();
  const result = await getPool().query<Row>("SELECT * FROM appointments");
  return result.rows.map(toAppointment);
}

export async function bookedSlots() {
  if (!usingDatabase) {
    const rows = await readFileAppointments();
    return new Set(rows.filter((row) => row.status === "confirmed").map((row) => row.slotIso));
  }
  await ensureSchema();
  const result = await getPool().query<{ slot_iso: string }>(
    "SELECT slot_iso FROM appointments WHERE status = 'confirmed'"
  );
  return new Set(result.rows.map((row) => row.slot_iso));
}

export async function listAppointments(status = "all") {
  if (!usingDatabase) {
    const rows = await readFileAppointments();
    const filtered = status === "all" ? rows : rows.filter((row) => row.status === status);
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  await ensureSchema();
  const result =
    status === "all"
      ? await getPool().query<Row>("SELECT * FROM appointments ORDER BY created_at DESC")
      : await getPool().query<Row>(
          "SELECT * FROM appointments WHERE status = $1 ORDER BY created_at DESC",
          [status]
        );
  return result.rows.map(toAppointment);
}

type CreateAppointmentInput = Omit<Appointment, "id" | "status" | "previewFile" | "createdAt">;

export async function createAppointment(input: CreateAppointmentInput) {
  const appointment: Appointment = {
    ...input,
    id: crypto.randomUUID(),
    status: "confirmed",
    previewFile: null,
    createdAt: new Date().toISOString()
  };

  if (!usingDatabase) {
    return withLock(async () => {
      const rows = await readFileAppointments();
      if (rows.some((row) => row.status === "confirmed" && row.slotIso === input.slotIso)) {
        throw new SlotConflictError();
      }
      rows.push(appointment);
      await writeAppointments(rows);
      return appointment;
    });
  }

  await ensureSchema();
  try {
    await getPool().query(
      `INSERT INTO appointments (
         id, name, phone, email, meet_type, intent, urgency, note,
         slot_iso, status, ai_heat, ai_suggestion, ai_summary, ai_next_action,
         preview_file, created_at
       ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        appointment.id,
        appointment.name,
        appointment.phone,
        appointment.email,
        appointment.meetType,
        JSON.stringify(appointment.intent),
        appointment.urgency,
        appointment.note,
        appointment.slotIso,
        appointment.status,
        appointment.aiHeat,
        appointment.aiSuggestion,
        appointment.aiSummary,
        appointment.aiNextAction,
        appointment.previewFile,
        appointment.createdAt
      ]
    );
  } catch (error) {
    // 唯一索引擋下同時段的重複預約
    if (isUniqueViolation(error)) throw new SlotConflictError();
    throw error;
  }
  return appointment;
}

export async function attachPreview(id: string, previewFile: string) {
  if (!usingDatabase) {
    return withLock(async () => {
      const rows = await readFileAppointments();
      const appointment = rows.find((row) => row.id === id);
      if (!appointment) return;
      appointment.previewFile = previewFile;
      await writeAppointments(rows);
    });
  }
  await ensureSchema();
  await getPool().query("UPDATE appointments SET preview_file = $1 WHERE id = $2", [previewFile, id]);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  if (!usingDatabase) {
    return withLock(async () => {
      const rows = await readFileAppointments();
      const appointment = rows.find((row) => row.id === id);
      if (!appointment) return null;
      appointment.status = status;
      await writeAppointments(rows);
      return appointment;
    });
  }
  await ensureSchema();
  const result = await getPool().query<Row>(
    "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows.length ? toAppointment(result.rows[0]) : null;
}

export async function resetDemoAppointments() {
  if (!usingDatabase) {
    return withLock(async () => {
      try {
        await fs.unlink(DATABASE_FILE);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    });
  }
  await ensureSchema();
  await getPool().query("DELETE FROM appointments");
}
