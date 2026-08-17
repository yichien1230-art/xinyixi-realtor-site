import Image from "next/image";
import { PROFILE } from "@/lib/profile";
import "./card.css";

/**
 * 電子名片。這是實際傳給客戶看的頁面，
 * 因此不掛 Topbar（Topbar 含後台連結，不能給客戶看到）。
 */

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="vcard-row-key" aria-hidden="true">{label}</span>
      <span>{value}</span>
    </>
  );
  return href ? (
    <a className="vcard-row" href={href}>{body}</a>
  ) : (
    <div className="vcard-row">{body}</div>
  );
}

export default function CardPage() {
  return (
    <div className="vcard">
      <article className="vcard-inner">
        <div className="vcard-crown">
          <div className="vcard-brandline">永義房屋 · 大順龍華店</div>
        </div>

        <div className="vcard-portrait-wrap">
          <Image
            className="vcard-portrait"
            src={PROFILE.photoUrl}
            width={132}
            height={132}
            priority
            alt={`${PROFILE.name}個人形象照`}
          />
        </div>

        <div className="vcard-head">
          <h1 className="vcard-name">{PROFILE.name}</h1>
          <div className="vcard-latin">{PROFILE.latinName}</div>

          <div className="vcard-rule" aria-hidden="true">
            <span /><i /><span />
          </div>

          <div className="vcard-role">{PROFILE.title}</div>
          <div className="vcard-award">🏆 {PROFILE.award}</div>
          <p className="vcard-slogan">{PROFILE.slogan}</p>
        </div>

        <div className="vcard-actions">
          <a
            className="vcard-btn vcard-btn-line"
            href={PROFILE.social.line}
            target="_blank"
            rel="noreferrer"
          >
            加入 LINE 免費諮詢
          </a>
          <a className="vcard-btn vcard-btn-tel" href={`tel:${PROFILE.phoneRaw}`}>
            📞 撥打電話
          </a>
        </div>

        <div className="vcard-info">
          <InfoRow label="T" value={PROFILE.phone} href={`tel:${PROFILE.phoneRaw}`} />
          <InfoRow label="L" value={`LINE ID：${PROFILE.lineId}`} href={PROFILE.social.line} />
          <InfoRow label="A" value={PROFILE.serviceArea} />
        </div>

        <div className="vcard-social">
          <a href={PROFILE.social.facebook} target="_blank" rel="noreferrer">
            <span className="vcard-social-icon icon-fb">f</span>
            <span>Facebook</span>
          </a>
          <a href={PROFILE.social.instagram} target="_blank" rel="noreferrer">
            <span className="vcard-social-icon icon-ig">◎</span>
            <span>Instagram</span>
          </a>
          <a href={PROFILE.social.tiktok} target="_blank" rel="noreferrer">
            <span className="vcard-social-icon icon-tt">♪</span>
            <span>抖音</span>
          </a>
        </div>

        <div className="vcard-foot">
          <div className="vcard-foot-store">{PROFILE.store}</div>
          <div className="vcard-foot-area">專業 × 信任 × 成交，是我們的日常</div>
        </div>
      </article>
    </div>
  );
}
