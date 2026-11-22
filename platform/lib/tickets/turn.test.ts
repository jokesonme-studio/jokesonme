import { test } from "node:test";
import assert from "node:assert/strict";
import { mergedPrByTicket, ticketNumberFromPrTitle, turnFor } from "./turn.ts";
import { nextStep, type TicketState } from "./flow.ts";

const admin = { id: "U_jesse", role: "admin" as const };
const bowen = { id: "U_bowen", role: "member" as const };
const qiaoda = { id: "U_qiaoda", role: "member" as const };
const fin = { id: "U_fin", role: "finance_partner" as const };
const t = (status: TicketState["status"], ownerId: string | null, reporterId: string): TicketState => ({ status, ownerId, reporterId });

test("處理中：只輪到認領人", () => {
  const s = t("in_progress", bowen.id, qiaoda.id);
  assert.equal(turnFor(s, bowen), "develop");
  assert.equal(turnFor(s, qiaoda), null);
  assert.equal(turnFor(s, admin), null);
});

test("待驗收：別人做的票輪到回報人，不算輪到管理員", () => {
  const s = t("review", bowen.id, qiaoda.id);
  assert.equal(turnFor(s, qiaoda), "review");
  assert.equal(turnFor(s, bowen), null);
  assert.equal(turnFor(s, admin), null);
});

test("待驗收：回報人自己做的票輪到管理員，不輪到他自己", () => {
  const s = t("review", bowen.id, bowen.id);
  assert.equal(turnFor(s, admin), "review");
  assert.equal(turnFor(s, bowen), null);
});

test("待處理、已完成、不做都不輪到任何人；財務夥伴永遠沒有", () => {
  for (const st of ["open", "done", "wontfix"] as const) assert.equal(turnFor(t(st, st === "open" ? null : bowen.id, qiaoda.id), qiaoda), null);
  assert.equal(turnFor(t("review", fin.id, "U_x"), fin), null);
  assert.equal(turnFor(t("in_progress", fin.id, "U_x"), fin), null);
});

test("PR 標題取票號", () => {
  assert.equal(ticketNumberFromPrTitle("fix(J-22): 票號改成 J"), 22);
  assert.equal(ticketNumberFromPrTitle("fix(T-20): 平台新增工具箱頁"), 20); // 改名前的 PR 標題
  assert.equal(ticketNumberFromPrTitle("feat(T-21): 現場投票"), 21);
  assert.equal(ticketNumberFromPrTitle("chore: 封存 J-20 的提案"), null);
  assert.equal(ticketNumberFromPrTitle("fix(X-20): 別的系統"), null);
  assert.equal(ticketNumberFromPrTitle("fix: 外掛安裝說明"), null);
});

test("只收已合併的 PR；同一張票取最後合併的", () => {
  const m = mergedPrByTicket([
    { number: 18, title: "fix(T-20): a", mergedAt: "2026-11-19T23:47:00Z" },
    { number: 25, title: "fix(T-20): 補修", mergedAt: "2026-11-21T01:00:00Z" },
    { number: 19, title: "fix(T-21): b", mergedAt: null },
    { number: 17, title: "chore: c", mergedAt: "2026-11-12T05:55:00Z" },
  ]);
  assert.deepEqual(m.get(20), { number: 25, mergedAt: "2026-11-21T01:00:00Z" });
  assert.equal(m.has(21), false);
  assert.equal(m.size, 1);
});

test("下一步：處理中而且 PR 已合併時，提醒部署後交付", () => {
  const name = (id: string | null) => (id === bowen.id ? "柏文" : "巧達");
  const s = t("in_progress", bowen.id, qiaoda.id);
  assert.match(nextStep(s, name, 18), /PR #18 已經合併/);
  assert.match(nextStep(s, name, 18), /柏文/);
  assert.match(nextStep(s, name, 18), /交付/);
  assert.doesNotMatch(nextStep(s, name), /已經合併/);
  // 其他狀態不受影響
  assert.doesNotMatch(nextStep(t("review", bowen.id, qiaoda.id), name, 18), /已經合併/);
});
