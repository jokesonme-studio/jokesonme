// 最後更新：2026-11-28 22:30
// 誰幫忙的：Claude Code（Claude Opus 5.5）
// 修改摘要：對齊精簡版 past-quotes.md（11 筆）：報價原則、參考價位、已成交／已確認 2 筆、已報價未合作 8 筆（一行簡述，Hahow 未成交移到這裡）、進行中 1 筆；移除舊的婉拒、來邀、結果未知分組。
//
// 商演合作（/deals）。刻意不進資料庫：沒有資料表、沒有 migration、跟財務資料無關，改內容只要改這個檔案再部署。
// 來源：/workspace/jokesonme-partnerships/past-quotes.md（整理自 jokesonme Gmail，2026-11-28）。
// 文字與金額一律照原文：不換算、不補稅、不推測；原文寫「信中未見」就照寫。不要放銀行帳號、統編。
//
// 怎麼新增一筆合作：
//   1. 在 COMMERCIAL_DEALS 陣列加一個物件，group 選一個：
//        "closed"  已成交／已確認
//        "quoted"  已報價、未合作（頁面上顯示成一行簡述）
//        "ongoing" 進行中
//      之後狀態變了，改 group 就會移到對應分區。頁面在同一分區內照陣列順序顯示（跟來源檔順序一致）。
//   2. id 取不重複的小寫英數短名，例如 "sogo-2026-05"。
//   3. title 是對象、date 照原文寫時間，兩者必填。
//   4. people、detail、amount、note、result 原文有就填，沒有就省略；amount 是字串、原樣顯示，原文沒寫金額就省略，不要猜。
//      "quoted" 的一行簡述會組成「date title（people）：amount」，填的時候讓組出來的句子跟來源檔那行一字不差。
//   5. 跑 npm test，lib/commercial-deals.test.ts 會檢查必填欄位、id 不重複、group 合法。
//      （測試裡有「總數 11 筆」和各組筆數 2／8／1 的檢查，新增後記得一起改。）

export type DealGroup = "closed" | "quoted" | "ongoing";

export type CommercialDeal = {
  id: string;
  group: DealGroup;
  /** 對象。 */
  title: string;
  /** 原文時間。 */
  date: string;
  /** 人員（組別）。 */
  people?: string;
  /** 合作內容說明。 */
  detail?: string;
  /** 金額／方案，原樣顯示。 */
  amount?: string;
  note?: string;
  /** 結果。 */
  result?: string;
};

/** 分區，照來源檔順序。 */
export const DEAL_GROUPS: readonly { key: DealGroup; title: string }[] = [
  { key: "closed", title: "已成交／已確認" },
  { key: "quoted", title: "已報價、未合作" },
  { key: "ongoing", title: "進行中" },
];

/** 報價原則（Jesse 定）。 */
export const PRICING_PRINCIPLES: readonly string[] = [
  "一律報未稅，5% 營業稅另計，發票走射程範圍有限公司。",
  "依人數分級：人越多總價越高、每人單價越低，讓全員最划算；人少每人撐越久，單價較高。",
  "過年等特殊期間成員需從外縣市趕回，可拉高報價。",
  "不報單一組別撐全場的價格；4 人與 8 人不同價。",
  "客製化段子需較多準備，比只做企劃貴。",
  "暫不接分潤型合作。",
];

/** 參考價位。 */
export const REFERENCE_PRICES: readonly string[] = [
  "四組拼盤客製企劃套案（現場約15分鐘企劃＋YT長片1＋短片4＋IG Reels 4，短片3個月投放授權）：$60,000 未稅（神來也成交、神明戀愛確認、禾創提案）。",
  "過年商演一小時（NOKE）：四人 $100,000／六人 $130,000／八人 $150,000，未稅。",
  "四人一小時百貨活動（廣三SOGO）：企劃為主 $40,000；含客製漫才 $70,000；30–45分鐘 $30,000／$55,000，未稅。",
  "支薪好友單獨商演（BenQ）：既有段子 $15,000；客製段子 $25,000，未稅。",
  "電視廣告（博報堂，兩人）：8小時內 $40,000 未稅含首年全通路授權；第二年 $25,000 或 $35,000／年。",
  "巧芭達 IG Reels：自由發揮 $10,000；指定切角 $25,000，未稅。",
  "巧芭達單場演出 $6,000，車馬費自付（新竹SOGO，未成交，未註明稅）。",
];

export const COMMERCIAL_DEALS: readonly CommercialDeal[] = [
  // ── 已成交／已確認 ──
  {
    id: "shenlaiye-2026-05", group: "closed",
    title: "神來也麻將（慧邦科技 Gamesofa／Sally）", date: "2026/5–7",
    people: "四組全員", detail: "6/20 六月號演出＋影片。",
    amount: "$60,000 未稅，含稅實付 $63,000。",
    note: "曾提6+9月兩場8折 $96,000 未採用。",
    result: "已成交。",
  },
  {
    id: "anymind-2026-08", group: "closed",
    title: "AnyMind ×《神明戀愛放送中》", date: "2026/8–9",
    people: "四組全員",
    amount: "$60,000 未稅。",
    result: "已確認，進行中。",
  },

  // ── 已報價、未合作（一行簡述） ──
  { id: "hahow-2025-12", group: "quoted", date: "2025/12", title: "Hahow ×《黑木太太の實用日語課》", people: "又兔了", amount: "分潤 10–15%，未成交" },
  { id: "hakuhodo-tvc-2025-10", group: "quoted", date: "2025/10", title: "博報堂 日系咖啡 TVC", people: "巧芭達、又兔了", amount: "兩人 $40,000 未稅" },
  { id: "asiakol-tutorabc-2025-10", group: "quoted", date: "2025/10", title: "AsiaKOL × TutorABC 直播", people: "又兔了", amount: "$15,000，加短影音 $30,000" },
  { id: "sogo-hsinchu-2025-10", group: "quoted", date: "2025/10", title: "新竹SOGO 喜劇節", people: "巧芭達", amount: "$6,000，後婉拒" },
  { id: "benq-2026-02", group: "quoted", date: "2026/2", title: "BenQ 經銷商春酒", people: "支薪好友", amount: "既有段子 $15,000／客製 $25,000 未稅" },
  { id: "neutrogena-2026-03", group: "quoted", date: "2026/3", title: "Neutrogena 露得清 IG Reels", people: "巧芭達", amount: "$10,000／$25,000 未稅" },
  { id: "sogo-taichung-2026-05", group: "quoted", date: "2026/5", title: "臺中廣三SOGO 四人一小時", amount: "$40,000／$70,000 未稅" },
  { id: "hechuang-2026-08", group: "quoted", date: "2026/8", title: "禾創國際《癲狂三國》四組套案", amount: "$60,000 未稅" },

  // ── 進行中 ──
  {
    id: "noke-2026-11", group: "ongoing",
    title: "NOKE《2027 鬧春有樂市》", date: "2026/11",
    detail: "一小時",
    amount: "四人 $100,000／六人 $130,000／八人 $150,000 未稅",
    result: "等回覆",
  },
];

/** 某一組的合作，照陣列（來源檔）順序。 */
export function dealsInGroup(group: DealGroup, deals: readonly CommercialDeal[] = COMMERCIAL_DEALS): CommercialDeal[] {
  return deals.filter((d) => d.group === group);
}

/** 一行簡述：「date title（people）：amount」，用在「已報價、未合作」。 */
export function dealSummaryLine(d: CommercialDeal): string {
  const who = d.people ? `（${d.people}）` : "";
  const amount = d.amount ? `：${d.amount}` : "";
  return `${d.date} ${d.title}${who}${amount}`;
}
