// 讀 GitHub 上已合併的 PR，用標題裡的 (T-n) 對回票（change ticket-turn-hints；spec dev-tickets「Merged PR hint」）。
// repo 是公開的，不帶金鑰。只是提示用：讀不到（逾時、被限流）就當作沒有，絕不讓頁面壞掉。
import { mergedPrByTicket, type MergedPr } from "./turn.ts";

const PULLS_URL = "https://api.github.com/repos/jokesonme-studio/jokesonme/pulls?state=closed&sort=updated&direction=desc&per_page=50";
const CACHE_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 2500;

let cache: { at: number; map: Map<number, MergedPr> } | null = null;

export async function mergedPrs(now = Date.now()): Promise<Map<number, MergedPr>> {
  if (cache && now - cache.at < CACHE_MS) return cache.map;
  try {
    const res = await fetch(PULLS_URL, {
      headers: { accept: "application/vnd.github+json", "user-agent": "jokesonme-platform" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`github ${res.status}`);
    const rows = (await res.json()) as { number: number; title: string; merged_at: string | null }[];
    const map = mergedPrByTicket(rows.map((r) => ({ number: r.number, title: r.title, mergedAt: r.merged_at })));
    cache = { at: now, map };
    return map;
  } catch (err) {
    console.error("[tickets] read merged PRs failed", err instanceof Error ? err.message : err);
    return cache?.map ?? new Map();
  }
}
