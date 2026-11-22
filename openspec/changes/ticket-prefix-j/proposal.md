## Why

Jesse 與柏文同時在處理公司 Jebby Dashboard 的任務懸賞，那邊的票號也是 `T-<n>`。兩邊的外掛同時裝在 Claude 裡，說「我來做 T-20」時，人和 Claude 都可能認到另一邊的票。Jesse 2026-11-22 決定看我笑話改用 `J-`（Dashboard 是全公司在用，改這邊代價最小）。

## What Changes

- 票號前綴從 `T-` 改成 `J-`：票頁、首頁、錯誤訊息、開工指令。號碼不變（T-20 就是 J-20），網址 `/tickets?t=<n>` 不變。
- 開工指令開頭寫明「看我笑話平台的 J-n」；分支改 `feat/J-<n>-<短名>`、PR 標題改 `fix(J-<n>): …`（`COLLABORATION.md` 同步）。
- 「PR 已合併」提示同時認 `(J-n)` 與改名前的 `(T-n)`（舊 PR 標題改不了）。
- 外掛 `jokesonme-studio/jokesonme-plugins`（另一個 repo、同一次改動）：工具回覆與說明改 `J-`，並加上「使用者說 T-n 或沒講是哪個平台時先問，不要猜」。

## Non-Goals

- 不改資料庫（前綴只是顯示，`dev_tickets.number` 不動）、不改 API 的參數與回傳格式（票號一直是數字欄位），`API_VERSION` 不變。
- 不改公司 Jebby Dashboard 與它的外掛。
- 不改已封存的 Spectra 提案、舊 PR 與舊 commit 裡的 `T-`。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `dev-tickets`: 票號前綴改為 `J-`；已合併 PR 的提示同時認新舊標題

## Impact

- platform/lib/tickets/flow.ts（新增 `TICKET_PREFIX`、`ticketLabel`）、turn.ts、kickoff.ts、operations.ts、github.ts（註解）
- platform/components/ticket-board.tsx、platform/app/(app)/home/page.tsx
- COLLABORATION.md
- 外掛 repo：plugins/jokesonme/mcp/jokesonme.mjs、skills/ticket-rules/SKILL.md、README.md
