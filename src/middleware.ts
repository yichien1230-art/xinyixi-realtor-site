import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 保護會顯示客戶個資的路徑。
 *
 * 後台、預約狀態修改、確認信預覽都含有客戶姓名、電話與需求內容，
 * 一旦公開部署就等於把個資攤在網路上，因此一律要求 Basic 認證。
 * 客戶端要用的 /api/appointment/create 與 /slots 不在此列，維持公開。
 */
const PROTECTED = ["/admin", "/api/appointments", "/api/appointment/preview"];

function unauthorized() {
  return new NextResponse("需要登入才能存取後台。", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' }
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // 沒設密碼就整個關閉，避免部署時忘了設定而全面外洩。
  if (!expectedPassword) {
    return new NextResponse(
      "後台尚未設定 ADMIN_PASSWORD，為保護客戶個資已停用此頁面。",
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    let decoded = "";
    try {
      decoded = atob(encoded);
    } catch {
      return unauthorized();
    }
    const separator = decoded.indexOf(":");
    if (separator !== -1) {
      const user = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);
      if (user === expectedUser && password === expectedPassword) {
        return NextResponse.next();
      }
    }
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/appointments/:path*", "/api/appointment/preview"]
};
