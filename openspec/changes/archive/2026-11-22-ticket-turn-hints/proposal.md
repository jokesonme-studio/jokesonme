## Why

Jesse 2026-11-22 檢查開發票流程：T-20、T-21 在 11/20 上線，兩天後票還停在「處理中」；T-19 的 PR 11/10 合併，11/19 才按交付。原因是 PR 合併、部署之後平台沒有任何提示，全靠人記得；票也只出現在電腦版左側欄的「開發」頁，首頁看不到「輪到我」。另外 T-18：`0014_show_series.sql` 沒有寫入 `_migrations`，沒記錄的資料庫每次 `db:migrate` 都會重跑它，而且 `shows` 有資料時會因為沒有操作者被 audit 擋下（柏文做 T-20 時踩到）。

## What Changes

- 票頁「下一步」：處理中的票如果有標題帶 `(T-<n>)` 的 PR 已經合併，改寫成「PR #n 已經合併。Jesse 部署後，輪到認領人按交付」。給 Claude 的 API 回同一句。
- 首頁新增「輪到你的開發票」區塊：自己認領還在處理中的票、等自己驗收的票；沒有就不顯示。
- 合併狀態讀 GitHub 公開 API（repo 是公開的、不帶金鑰），記憶體快取 5 分鐘；讀不到就不顯示提示，頁面照常。
- T-18：0014 補上操作者與 `_migrations` 紀錄；`test:db` 檢查每支 migration 都有記錄。

## Non-Goals

- 不自動替人按交付（合併不等於已部署）。
- 不推播、不寄通知。
- 不改資料庫結構、不改 API 的參數與回傳格式（`nextStep` 仍是字串，`API_VERSION` 不變）；外掛不用改。
- 不知道「部署了沒」：平台讀不到部署狀態，文字只說「部署後」。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `dev-tickets`: 新增已合併 PR 的提示、首頁輪到我的清單、每支 migration 必須記錄

## Impact

- 新增 platform/lib/tickets/turn.ts（純函式＋測試）、platform/lib/tickets/github.ts
- 改 platform/lib/tickets/flow.ts（`nextStep` 多一個可省略的參數）、platform/app/(app)/tickets/page.tsx、platform/app/(app)/home/page.tsx、platform/app/api/claude/tickets/[number]/route.ts
- 改 platform/supabase/migrations/0014_show_series.sql（只加操作者與紀錄；正式庫已記錄 0014，不會重跑）、platform/scripts/test-db.sh
- 對外連線：伺服器端多一個到 api.github.com 的唯讀請求
