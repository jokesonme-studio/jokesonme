// 最後更新：2026-11-28 22:00
// 誰幫忙的：Claude Code（Claude Opus 5.5）
// 修改摘要：對齊精簡版 past-quotes.md，照來源檔順序分區：報價原則、參考價位、已成交／已確認（卡片）、已報價未合作（一行簡述清單）、進行中（卡片）。
import { requirePage } from "@/lib/auth/current";
import { DEAL_GROUPS, PRICING_PRINCIPLES, REFERENCE_PRICES, dealSummaryLine, dealsInGroup, type CommercialDeal } from "@/lib/commercial-deals";
import TopBar from "@/components/top-bar";

// 商演合作（/deals）：靜態內容，不讀資料庫。admin、member 可看；財務夥伴沒有 planning 權限，requirePage 會導回財務首頁。
// 權限沿用「演出」的 planning 區域（商演屬於演出規劃），不另開新區域。
const ANCHORS = [
  { id: "principles", title: "報價原則" },
  { id: "reference", title: "參考價位" },
  ...DEAL_GROUPS.map((g) => ({ id: g.key, title: g.title })),
];

export default async function DealsPage() {
  const me = await requirePage("planning", "/deals");
  return (
    <main className="page">
      <TopBar me={me} title="商演合作" sub="報價原則與過往商演、業配報價紀錄（整理自 jokesonme Gmail，2026-11-28）" />
      <div className="content">
        <p className="notice">
          金額依信件原文；找不到寫「信中未見」。
        </p>

        <nav className="deal-toc" aria-label="分區">
          {ANCHORS.map((a) => <a key={a.id} href={`#${a.id}`}>{a.title}</a>)}
        </nav>

        <section id="principles" className="deal-anchor">
          <div className="section"><h2>報價原則</h2><span>Jesse 定</span></div>
          <ol className="deal-list">
            {PRICING_PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
          </ol>
        </section>

        <section id="reference" className="deal-anchor">
          <div className="section"><h2>參考價位</h2></div>
          <ul className="deal-list">
            {REFERENCE_PRICES.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>

        {DEAL_GROUPS.map((g) => {
          const deals = dealsInGroup(g.key);
          return (
            <div key={g.key} id={g.key} className="deal-anchor">
              <div className="section"><h2>{g.title}</h2><span>{deals.length} 筆</span></div>
              {g.key === "quoted" ? (
                <div className="card">
                  <ul className="deal-list">
                    {deals.map((d) => <li key={d.id}>{dealSummaryLine(d)}</li>)}
                  </ul>
                </div>
              ) : (
                deals.map((d, i) => <DealCard key={d.id} d={d} no={g.key === "closed" ? i + 1 : undefined} />)
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function DealCard({ d, no }: { d: CommercialDeal; no?: number }) {
  return (
    <article className="card deal-card">
      <h3 className="title">{no ? <span className="deal-no">{no}.</span> : null}{d.title}</h3>
      <div className="meta">
        <span>{d.date}</span>
        {d.people ? <span className="tag">{d.people}</span> : null}
      </div>
      {d.detail ? <p className="deal-line"><b>說明</b>{d.detail}</p> : null}
      {d.amount ? <p className="deal-line"><b>金額／方案</b>{d.amount}</p> : null}
      {d.note ? <p className="deal-line"><b>備註</b>{d.note}</p> : null}
      {d.result ? <p className="deal-line"><b>結果</b>{d.result}</p> : null}
    </article>
  );
}
