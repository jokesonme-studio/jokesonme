## 1. 判斷與資料

- [x] 1.1 依 My turn list 寫純函式 `turnFor`（`platform/lib/tickets/turn.ts`）；驗證：`turn.test.ts` 涵蓋規格範例表六列與財務夥伴
- [x] 1.2 依 Merged PR hint 寫 `ticketNumberFromPrTitle`、`mergedPrByTicket` 與 `nextStep` 的已合併文字；驗證：`turn.test.ts`（只收已合併、同票取最後合併、其他狀態文字不變）
- [x] 1.3 依 Merged PR hint 寫 `platform/lib/tickets/github.ts`：不帶金鑰讀已關閉的 PR、快取 5 分鐘、逾時或失敗回空結果；驗證：本機開 T-20 票頁看到 PR #18，再把網址改壞確認頁面照常開

## 2. 畫面與 API

- [x] 2.1 票頁與 `/api/claude/tickets/[number]` 的下一步帶入已合併的 PR（Merged PR hint）；驗證：本機票頁文字、`typecheck`
- [x] 2.2 首頁加「輪到你的開發票」（My turn list），沒有就不顯示；驗證：本機以傑哥與柏文身分各開一次首頁

## 3. T-18

- [x] 3.1 依 Every migration records itself：0014 補操作者與 `_migrations` 紀錄，`scripts/test-db.sh` 檢查每支都有記錄；驗證：`npm run test:db` 通過；把 0014 還原後同一指令失敗並點名 `0014_show_series`；在有資料、沒記錄的本機庫用單一交易重跑 0014 成功（舊版會被 audit 擋下）

## 4. 上線

- [x] 4.1 四項自檢通過、給 Jesse 看效果後 push 開 PR；Jesse 合併部署後，正式站確認 T-20 票頁出現 PR #18 的提示（2026-11-22 PR #20 合併部署，正式站 T-20、T-21 票頁出現 PR #18、#19 的提示）
