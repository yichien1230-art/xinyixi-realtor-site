import Image from "next/image";
import Link from "next/link";
import { PROFILE } from "@/lib/profile";
import "./home.css";

const AREAS = [
  {
    icon: "🏙️",
    name: "鼓山區",
    highlight: "農十六・凹子底・美術館特區",
    text: "高雄指標級重劃區，掌握三大特區的價格帶、產品線與換屋族置產動向。"
  },
  {
    icon: "🚄",
    name: "左營區",
    highlight: "高鐵特區・巨蛋特區・生態園區",
    text: "交通樞紐與商圈核心，熟悉重劃區推案節奏與長期增值潛力。"
  },
  {
    icon: "🏘️",
    name: "三民區",
    highlight: null,
    text: "學區與生活機能兼具，協助自住與置產客戶找到合適物件。"
  }
];

const SERVICES = [
  {
    num: "01",
    title: "資產配置規劃",
    text: "依照您的財務狀況與人生階段，規劃不動產在整體資產配置中的角色，兼顧保值、現金流與長期增值潛力。"
  },
  {
    num: "02",
    title: "不動產稅務諮詢",
    text: "協助釐清買賣、繼承、贈與過程中常見的稅務眉角與風險，提前規劃、避免多繳冤枉稅。"
  },
  {
    num: "03",
    title: "簡易裝潢建議",
    text: "從格局到預算提供實用的居住美學建議，讓房子從交屋到入住都能順利銜接，兼顧美感與成本控制。"
  }
];

const INSIGHTS = [
  { icon: "📊", title: "農十六・凹子底・美術館特區", text: "鼓山三大特區行情分析，文章準備中。" },
  { icon: "📈", title: "高鐵・巨蛋・生態園區", text: "左營重劃區推案與增值趨勢，文章準備中。" },
  { icon: "🏠", title: "三民區生活圈趨勢", text: "文章準備中，敬請期待。" }
];

export default function HomePage() {
  return (
    <div className="lp">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand"><span className="dot" />{PROFILE.name} · 永義房屋</div>
          <nav className="nav-links">
            <a href="#area">專業服務</a>
            <a href="#achieve">戰績</a>
            <a href="#services">服務項目</a>
            <a href="#insights">市場觀點</a>
            <a href="#booking">預約諮詢</a>
          </nav>
          <a className="nav-cta" href="#booking">免費諮詢</a>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-kicker">🏆 {PROFILE.award}｜高雄房地產財富顧問</span>
            <h1>{PROFILE.name}</h1>
            <div className="hero-title">{PROFILE.title}｜高雄鼓山・左營・三民區</div>
            <p className="hero-desc">
              以在地市場洞察為根基，為客戶規劃資產配置、稅務與居住美學的整體方案——不只是幫您買賣房子，更是您長期信賴的不動產顧問。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={PROFILE.social.line} target="_blank" rel="noreferrer">
                加 LINE 免費諮詢
              </a>
              <a className="btn btn-outline" href={`tel:${PROFILE.phoneRaw}`}>📞 {PROFILE.phone}</a>
            </div>
          </div>
          <div className="hero-portrait-wrap">
            <Image
              className="hero-portrait"
              src="/images/profile.jpg"
              width={260}
              height={260}
              priority
              alt={`${PROFILE.name}個人形象照`}
            />
          </div>
        </div>
      </section>

      <section id="area" className="area-section">
        <div className="container section-head">
          <span className="section-tag">Professional Expertise</span>
          <h2 className="section-title">在地深耕・市場洞察</h2>
          <p className="section-sub">
            專精高雄核心重劃區——鼓山的農十六、凹子底、美術館特區，左營的高鐵特區、巨蛋特區、生態園區。熟悉各特區的價格帶、產品定位與發展趨勢，用第一線市場資訊協助客戶做出精準判斷。
          </p>
        </div>
        <div className="container area-grid">
          {AREAS.map((area) => (
            <div className="area-card" key={area.name}>
              <div className="area-icon">{area.icon}</div>
              <h3>{area.name}</h3>
              <p>
                {area.highlight ? <><strong>{area.highlight}</strong><br /></> : null}
                {area.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="achieve" className="achieve-section">
        <div className="container section-head">
          <span className="section-tag">Achievement</span>
          <h2 className="section-title">我的戰績</h2>
          <p className="section-sub">用實績說話，陪每一位客戶把不動產決定做到位。</p>
        </div>
        <div className="container">
          <div className="achieve-badge">
            <div className="medal">🏆</div>
            <div className="year">114 年度</div>
            <h3>永義房屋 年度標竿獎</h3>
            <p>感謝客戶的信任，持續以專業與誠信服務高雄在地房產需求。</p>
          </div>
          <div className="trust-row">
            <div className="trust-item"><strong>累計成交總額</strong><span>資料更新中</span></div>
            <div className="trust-item"><strong>服務客戶數</strong><span>資料更新中</span></div>
            <div className="trust-item"><strong>客戶滿意度</strong><span>資料更新中</span></div>
          </div>
          <p className="stats-note">＊實際成交數據將於本人提供後更新，暫不刊登未經確認之數字。</p>
        </div>
      </section>

      <section id="testimonials" className="services-section">
        <div className="container section-head">
          <span className="section-tag">Client Voice</span>
          <h2 className="section-title">客戶好評見證</h2>
          <p className="section-sub">真實成交客戶的回饋，是最有力的專業佐證——此區塊保留給日後上線的真實見證。</p>
        </div>
        <div className="container service-grid">
          {["01", "02", "03"].map((n) => (
            <div className="service-card testimonial-placeholder" key={n}>
              <div className="service-num">見證 {n}</div>
              <h3>敬請期待</h3>
              <p>客戶好評整理中，歡迎日後提供真實回饋文字或截圖，我會協助上架。</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="container section-head">
          <span className="section-tag">Value-Added Services</span>
          <h2 className="section-title">不只是仲介，是您的房地產財富顧問</h2>
          <p className="section-sub">
            從買賣到資產規劃，以顧問角度陪您思考不動產在人生財務藍圖中的位置，解決的不只是「成交」，而是長期的資產增值與風險控管。
          </p>
        </div>
        <div className="container service-grid">
          {SERVICES.map((service) => (
            <div className="service-card" key={service.num}>
              <div className="service-num">{service.num}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="insights" className="area-section">
        <div className="container section-head">
          <span className="section-tag">Market Insights</span>
          <h2 className="section-title">市場觀點</h2>
          <p className="section-sub">定期發布高雄鼓山、左營、三民區的深度市場分析，陸續上線中。</p>
        </div>
        <div className="container area-grid">
          {INSIGHTS.map((item) => (
            <div className="area-card insight-card" key={item.title}>
              <div className="area-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="booking-section">
        <div className="container section-head">
          <span className="section-tag">Booking</span>
          <h2 className="section-title">預約一對一專業諮詢</h2>
          <p className="section-sub">
            由永義房屋114年度標竿獎得主親自為您規劃。線上挑選方便的時段，或直接加 LINE 詢問都可以。
          </p>
        </div>
        <div className="container booking-wrap">
          <div className="booking-form">
            <h3 className="booking-lead">加 LINE 直接諮詢</h3>
            <p className="booking-lead-text">
              最快也最確實的聯繫方式。加我 LINE 後直接說明您的需求，我會親自回覆，並與您約定方便的時間。
            </p>
            <a
              className="btn btn-primary booking-cta"
              href={PROFILE.social.line}
              target="_blank"
              rel="noreferrer"
            >
              加 LINE 好友（{PROFILE.lineId}）
            </a>
            <p className="form-note">
              想先看看可預約的時段？<Link href="/card/booking">線上預約系統</Link>
              　·　<Link href="/card">我的電子名片</Link>
            </p>
          </div>

          <aside className="contact-card">
            <h3>直接聯繫{PROFILE.name}</h3>
            <p>高雄鼓山・左營・三民區在地房仲，歡迎隨時洽詢。</p>
            <div className="contact-line"><span className="sym">T</span>{PROFILE.phone}</div>
            <div className="contact-line"><span className="sym">L</span>LINE ID：{PROFILE.lineId}</div>
            <div className="contact-line"><span className="sym">A</span>服務區域：{PROFILE.serviceArea}</div>
            <a className="btn btn-primary" href={PROFILE.social.line} target="_blank" rel="noreferrer">加 LINE 好友</a>
          </aside>
        </div>
      </section>

      <footer>
        <div className="container">
          &copy; 2026 <strong>{PROFILE.name}</strong>｜永義房屋・高雄鼓山左營三民區｜{PROFILE.award}
        </div>
      </footer>

      <a className="float-line" href={PROFILE.social.line} target="_blank" rel="noreferrer">LINE</a>
    </div>
  );
}
