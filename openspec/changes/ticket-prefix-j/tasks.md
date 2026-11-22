## 1. 平台

- [x] 1.1 依 Ticket record：新增 `ticketLabel`，票頁、首頁、衝突訊息都顯示 `J-<n>`（Ticket status transitions、Conflict-safe claiming、Ticket history、Ticket board page、My turn list 的情境只是票號寫法跟著改，行為不變）；驗證：`grep` 平台程式（測試以外）沒有寫死的 `T-`、`typecheck` 通過；畫面等部署後在正式站看
- [x] 1.2 依 Kickoff prompt：開工指令寫「看我笑話平台的 J-n」、分支 `feat/J-n-`、PR 標題 `fix(J-n)`；驗證：`kickoff.test.ts`（含「不出現 T-9」）
- [x] 1.3 依 Merged PR hint：`ticketNumberFromPrTitle` 同時認 `(J-n)` 與 `(T-n)`；驗證：`turn.test.ts`（J、T 都認，其他字母不認）；部署後在正式站確認 J-20 票頁仍顯示 PR #18
- [x] 1.4 `COLLABORATION.md` 的分支、PR 標題改 J-，並寫明 J- 與 Dashboard 的 T- 的分別

## 2. 外掛

- [x] 2.1 外掛的工具回覆、說明、README 改 J-；工具說明與 ticket-rules 加「說 T-n 或沒講平台時先問」；驗證：外掛 `npm test`

## 3. 上線

- [ ] 3.1 四項自檢通過、給 Jesse 看過後兩個 repo 各開 PR；合併部署後正式站票頁顯示 J-，並通知柏文更新外掛
