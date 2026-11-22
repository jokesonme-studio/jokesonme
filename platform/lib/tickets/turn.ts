// 「輪到誰」與「PR 已合併」的判斷（change ticket-turn-hints；spec dev-tickets「My turn list」「Merged PR hint」）。純函式。
import type { Role } from "../auth/access.ts";
import type { TicketState } from "./flow.ts";

export type TurnKind = "develop" | "review";

/**
 * 這張票現在是不是輪到這個人動手。
 * develop：他認領、還在處理中。review：待驗收，而且他是該驗收的人——
 * 回報人（不是認領人時）；回報人自己做的票則輪到管理員。管理員雖然能驗收任何票，但別人該驗的不算輪到他。
 */
export function turnFor(t: TicketState, me: { id: string; role: Role | null }): TurnKind | null {
  if (me.role !== "admin" && me.role !== "member") return null;
  if (t.status === "in_progress") return t.ownerId === me.id ? "develop" : null;
  if (t.status !== "review") return null;
  const selfMade = t.ownerId === t.reporterId;
  if (selfMade) return me.role === "admin" ? "review" : null;
  return t.reporterId === me.id ? "review" : null;
}

/** PR 標題裡的票號：`fix(T-20): …` → 20；沒有就回 null。 */
export function ticketNumberFromPrTitle(title: string): number | null {
  const m = /\(T-(\d+)\)/.exec(title);
  return m ? Number(m[1]) : null;
}

export type MergedPr = { number: number; mergedAt: string };

/** 票號 → 最後合併的那個 PR。只收已合併（mergedAt 有值）而且標題帶票號的。 */
export function mergedPrByTicket(prs: { number: number; title: string; mergedAt: string | null }[]): Map<number, MergedPr> {
  const out = new Map<number, MergedPr>();
  for (const p of prs) {
    const n = ticketNumberFromPrTitle(p.title);
    if (n === null || !p.mergedAt) continue;
    const cur = out.get(n);
    if (!cur || p.mergedAt > cur.mergedAt) out.set(n, { number: p.number, mergedAt: p.mergedAt });
  }
  return out;
}
