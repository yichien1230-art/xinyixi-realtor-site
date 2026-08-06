import type { Metadata } from "next";
import "./globals.css";

const TITLE = "辛沂茜 茜茜老蘇｜高雄房仲・鼓山左營三民・永義房屋";
const DESCRIPTION =
  "高雄房仲茜茜老蘇（辛沂茜），永義房屋114年度標竿獎得主，專精高雄農十六、凹子底、美術館特區、高鐵特區、巨蛋特區、生態園區，提供資產配置規劃、不動產稅務諮詢、簡易裝潢建議。加LINE免費諮詢：zefira1230。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "茜茜老蘇",
    "房仲老蘇",
    "農十六",
    "凹子底",
    "美術館特區",
    "高鐵特區",
    "巨蛋特區",
    "生態園區",
    "高雄房仲",
    "鼓山房仲",
    "左營房仲",
    "三民房仲",
    "永義房屋",
    "辛沂茜",
    "資產配置",
    "不動產稅務諮詢",
    "高雄房地產顧問"
  ],
  // 後台與預約頁不希望被搜尋引擎收錄，個別頁面另行覆寫。
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/profile.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/profile.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "辛沂茜",
              telephone: "+886-930-095-388",
              image: "/images/profile.jpg",
              areaServed: [
                { "@type": "AdministrativeArea", name: "高雄市鼓山區" },
                { "@type": "AdministrativeArea", name: "高雄市左營區" },
                { "@type": "AdministrativeArea", name: "高雄市三民區" }
              ],
              award: "114年永義房屋年度標竿獎",
              makesOffer: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "資產配置規劃" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "不動產稅務諮詢" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "簡易裝潢建議" } }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
