#!/usr/bin/env bash
# 在本機 Postgres 建一個拋棄式測試庫，套用全部 migration 後跑 supabase/test/*.test.sql。
# 只動名為 jokesonme_test 的本機資料庫，不碰 Supabase 正式庫。
set -euo pipefail
cd "$(dirname "$0")/.."
DB=jokesonme_test
dropdb --if-exists "$DB"
createdb "$DB"
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f supabase/test/local-shim.sql
for f in supabase/migrations/*.sql; do
  psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f"
done
# 每支 migration 都要把自己記進 _migrations，否則 db:migrate 會每次重跑它（T-18：0014 曾經漏記）
files=$(ls supabase/migrations/*.sql | wc -l | tr -d ' ')
recorded=$(psql -tA -v ON_ERROR_STOP=1 -d "$DB" -c "select count(*) from _migrations")
if [[ "$files" != "$recorded" ]]; then
  echo "FAIL: migration 檔案 $files 支，但 _migrations 只記了 $recorded 筆。沒記到的："
  for f in supabase/migrations/*.sql; do
    name=$(basename "$f" .sql)
    [[ $(psql -tA -d "$DB" -c "select count(*) from _migrations where name = '$name'") == "1" ]] || echo "  $name"
  done
  exit 1
fi
for t in supabase/test/*.test.sql; do
  echo "== $t"
  psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$t"
done
