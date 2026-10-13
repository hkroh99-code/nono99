#!/usr/bin/env bash
# sources.tsv 에 있는 자료를 pdf/<category>/ 아래로 내려받는다.
# 사용법: bash tokyo-physics-materials/scripts/download.sh
set -u
root="$(cd "$(dirname "$0")/.." && pwd)"
ok=0; fail=0
while IFS=$'\t' read -r category year filename url description; do
  [ "$category" = "category" ] && continue
  dest="$root/pdf/$category/$filename"
  mkdir -p "$(dirname "$dest")"
  if [ -s "$dest" ]; then echo "skip  $filename"; ok=$((ok+1)); continue; fi
  if curl -fsSL -m 120 --retry 3 -o "$dest" "$url"; then
    echo "ok    $filename"; ok=$((ok+1))
  else
    rm -f "$dest"; echo "FAIL  $filename  ($url)"; fail=$((fail+1))
  fi
done < "$root/sources.tsv"
echo "done: $ok ok, $fail failed"
