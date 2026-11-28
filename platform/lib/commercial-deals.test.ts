// 最後更新：2026-11-28 22:30
// 誰幫忙的：Claude Code（Claude Opus 5.5）
// 修改摘要：改對應精簡版 past-quotes.md 的 11 筆：總數 11、各組 2／8／1（Hahow 未成交移到已報價未合作）、id 不重複、必填欄位、group 合法、報價原則 6 條與參考價位 7 條、一行簡述與原文一字不差。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  COMMERCIAL_DEALS, DEAL_GROUPS, PRICING_PRINCIPLES, REFERENCE_PRICES, dealSummaryLine, dealsInGroup,
} from "./commercial-deals.ts";

const GROUP_KEYS = new Set(["closed", "quoted", "ongoing"]);

test("全部合作共 11 筆", () => {
  assert.equal(COMMERCIAL_DEALS.length, 11);
});

test("各組筆數與來源檔一致：已成交 2、已報價未合作 8、進行中 1", () => {
  const count = (g: string) => COMMERCIAL_DEALS.filter((d) => d.group === g).length;
  assert.equal(count("closed"), 2);
  assert.equal(count("quoted"), 8);
  assert.equal(count("ongoing"), 1);
  assert.deepEqual(DEAL_GROUPS.map((g) => g.key), ["closed", "quoted", "ongoing"]);
});

test("id 不重複", () => {
  const ids = COMMERCIAL_DEALS.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("每筆都有必填欄位，group 合法", () => {
  for (const d of COMMERCIAL_DEALS) {
    assert.match(d.id, /^[a-z0-9-]+$/, `${d.id}：id 只用小寫英數與 -`);
    assert.ok(d.title.trim(), `${d.id}：對象不能空白`);
    assert.ok(d.date.trim(), `${d.id}：時間不能空白`);
    assert.ok(GROUP_KEYS.has(d.group), `${d.id}：group ${d.group} 不合法`);
    for (const k of ["people", "detail", "amount", "note", "result"] as const) {
      if (d[k] !== undefined) assert.ok(d[k].trim(), `${d.id}：${k} 有填就不能空白`);
    }
  }
});

test("報價原則 6 條、參考價位 7 條，皆不空白", () => {
  assert.equal(PRICING_PRINCIPLES.length, 6);
  assert.equal(REFERENCE_PRICES.length, 7);
  for (const p of [...PRICING_PRINCIPLES, ...REFERENCE_PRICES]) assert.ok(p.trim());
});

test("已報價未合作的一行簡述與來源檔一字不差、順序相同", () => {
  assert.deepEqual(dealsInGroup("quoted").map(dealSummaryLine), [
    "2025/12 Hahow ×《黑木太太の實用日語課》（又兔了）：分潤 10–15%，未成交",
    "2025/10 博報堂 日系咖啡 TVC（巧芭達、又兔了）：兩人 $40,000 未稅",
    "2025/10 AsiaKOL × TutorABC 直播（又兔了）：$15,000，加短影音 $30,000",
    "2025/10 新竹SOGO 喜劇節（巧芭達）：$6,000，後婉拒",
    "2026/2 BenQ 經銷商春酒（支薪好友）：既有段子 $15,000／客製 $25,000 未稅",
    "2026/3 Neutrogena 露得清 IG Reels（巧芭達）：$10,000／$25,000 未稅",
    "2026/5 臺中廣三SOGO 四人一小時：$40,000／$70,000 未稅",
    "2026/8 禾創國際《癲狂三國》四組套案：$60,000 未稅",
  ]);
});

test("已成交照來源檔順序", () => {
  assert.deepEqual(dealsInGroup("closed").map((d) => d.id), ["shenlaiye-2026-05", "anymind-2026-08"]);
});

test("不含銀行帳號或統編", () => {
  const all = JSON.stringify([COMMERCIAL_DEALS, PRICING_PRINCIPLES, REFERENCE_PRICES]);
  assert.doesNotMatch(all, /統編|統一編號|帳號|銀行/);
});
