#!/usr/bin/env bash
# 각 대학 기출문제/다운로드목록.tsv 의 파일을 기출문제/원문/ 폴더로 내려받는다.
# 사용법: bash 수시진학자료/tools/download_gichul.sh   (인터넷 연결된 PC에서 실행)
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
for list in "$ROOT"/[0-9][0-9]_*/기출문제/다운로드목록.tsv; do
  out="$(dirname "$list")/원문"
  mkdir -p "$out"
  grep -v '^#' "$list" | while IFS=$'\t' read -r name url; do
    [ -z "${url:-}" ] && continue
    if [ -s "$out/$name" ]; then echo "건너뜀(이미 있음): $name"; continue; fi
    if curl -fsSL -A "Mozilla/5.0" -m 120 -o "$out/$name" "$url"; then
      echo "완료: $name"
    else
      echo "실패: $name  ← 브라우저로 직접 받기: $url"; rm -f "$out/$name"
    fi
  done
done
