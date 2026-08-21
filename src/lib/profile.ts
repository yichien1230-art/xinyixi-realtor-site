export const PROFILE = {
  name: "辛沂茜",
  title: "高雄房仲 茜茜老蘇",
  /**
   * 得獎紀錄，新的排前面。
   * 115 年這筆的名稱取自頒獎典禮大螢幕與本人彩帶，兩處一致：
   * 「永義房屋 2026年度高雄區第二季個人業績 菁英獎」、「菁英獎 TOP 18」。
   */
  awards: [
    {
      year: "115 年度",
      title: "高雄區第二季 菁英獎 TOP 18",
      note: "永義房屋 高雄大順龍華加盟店 個人業績",
      short: "115 年菁英獎 TOP 18"
    },
    {
      year: "114 年度",
      title: "永義房屋 年度標竿獎",
      note: "感謝客戶的信任，持續以專業與誠信服務高雄在地房產需求。",
      short: "114 年永義房屋年度標竿獎"
    }
  ],
  slogan: "專精農十六、凹子底、美術館特區、高鐵特區、巨蛋、生態園區，提供資產配置、稅務諮詢與簡易裝潢建議。",
  phone: "0930-095-388",
  phoneRaw: "0930095388",
  lineId: "zefira1230",
  serviceArea: "高雄市鼓山區・左營區・三民區",
  latinName: "HSIN YI-CHIEN",
  store: "永義房屋｜高雄大順龍華店",
  website: "https://xinyixi-realtor-site.vercel.app",
  photoUrl: "/card/xinyixi.jpg",
  social: {
    line: "https://line.me/ti/p/~zefira1230",
    // 由茜茜提供的分享連結解析出的正式網址（分享連結會過期，不直接使用）
    facebook: "https://www.facebook.com/profile.php?id=100085056948470",
    instagram: "https://www.instagram.com/chien2su/",
    tiktok: "https://www.tiktok.com/@hsin_chien"
  }
} as const;
