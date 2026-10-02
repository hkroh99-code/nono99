# 클라드니 파일에서 엔진 조각을 한 번 추출해 parts/ · js/ 에 둔다 (이후 손으로 고친다)
import re, io
SRC='/home/user/nono99/chladni_highschool.html'
L=open(SRC,encoding='utf-8').read().split('\n')
def seg(a,b): return '\n'.join(L[a-1:b])   # 1-indexed inclusive
def find(pat, start=1):
    for i in range(start-1,len(L)):
        if re.search(pat,L[i]): return i+1
    raise SystemExit('not found '+pat)

# --- HTML 조각
head_end=find(r'^</style>')            # 510
body_start=find(r'^<body class="app"')
main_start=find(r'^<main class="wrap"')
quiz_cmt=find(r'TAB 17 — 오개념 진단')-1   # comment banner starts one line above
quiz_sec=find(r'^<section class="panel" id="tab17"')
rep_sec=find(r'^<section class="panel" id="tab18"')
main_end=find(r'^</main>')
script_start=find(r'^<script>', main_end)
print('head_end',head_end,'body_start',body_start,'main_start',main_start,'quiz',quiz_sec,'rep',rep_sec,'main_end',main_end,'script',script_start)

open('parts/_head_css.html','w',encoding='utf-8').write(seg(1,head_end))
open('parts/_header.html','w',encoding='utf-8').write(seg(body_start-1, main_start))   # </head> + body + header + <main>
open('parts/_quiz.html','w',encoding='utf-8').write(seg(quiz_cmt, rep_sec-1))
open('parts/_report.html','w',encoding='utf-8').write(seg(rep_sec-0, main_end-1))
open('parts/_footer.html','w',encoding='utf-8').write(seg(main_end, script_start-1))

# --- JS 조각
engB_start=find(r'⚠ 구역 B — 검증된 엔진')-1
zoneC_start=find(r'★★★ 구역 C — 탭별 시뮬레이션')-1
gen_end=find(r'소립자 물리 단원 공용 도구')-2        # 공용 도구 끝(= 소립자 도구 바로 앞)
print('engB',engB_start,'zoneC',zoneC_start,'gen_end',gen_end)
open('js/_engineB.js','w',encoding='utf-8').write(seg(engB_start, zoneC_start-1))
open('js/_zoneC0.js','w',encoding='utf-8').write(seg(zoneC_start, gen_end))
qr_start=find(r'TAB \(오개념 진단\)')-1
qr_end=find(r'⚠ 구역 D — 부팅')-2
print('quizreport',qr_start,qr_end)
open('js/_quizreport.js','w',encoding='utf-8').write(seg(qr_start, qr_end))
rm_start=find(r'^/\* ★11-B 실험 B')
print('REPORT_MANUAL region',rm_start)
