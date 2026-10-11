# -*- coding: utf-8 -*-
"""캔위성 학습자료 조립기 : parts/*.html + js/*.js  →  /home/user/nono99/cansat_highschool.html"""
import re, glob, os, sys
B=os.path.dirname(os.path.abspath(__file__))
OUT=sys.argv[1] if len(sys.argv)>1 else os.path.join(B,'..','cansat_highschool.html')
def rd(p):
    with open(os.path.join(B,p),encoding='utf-8') as f: return f.read()

TITLE='15. 캔위성(CanSat) | 교과서형 19탭 인터랙티브'

# ── 머리말 · CSS (엔진 그대로)
head=rd('parts/_head_css.html')
head=re.sub(r'<title>.*?</title>','<title>'+TITLE+'</title>',head,count=1)
banner='''<!-- ═══════════════════════════════════════════════════════════════════════════
     15. 캔위성(CanSat) — 교과서형 19탭 인터랙티브 시뮬레이션
     · 공통 템플릿(교과서형 10탭) + 클라드니(14) · 비접촉 당도 측정(13) 단원의 확장 구조를 따른다.
     · 활용 현황(한국 · 미국 · 일본) · 원리 5 · R&E 10 · 창의 10 · 발명 10 · 도구함 · 종합실험 3 · 진단 · 보고서
     · 외부 라이브러리는 Tailwind · MathJax 두 개뿐(템플릿 규약). 더블클릭(file://)으로 열린다.
     ═══════════════════════════════════════════════════════════════════════════ -->'''
head=re.sub(r'^<!DOCTYPE html>\n<!--.*?-->','<!DOCTYPE html>\n'+banner,head,count=1,flags=re.S)

extra=rd('parts/_extra.css')
i=head.rfind('</style>'); head=head[:i]+extra+head[i:]

# ── 본문 앞부분(헤더)
header=rd('parts/header.html')
tabs='\n\n'.join(rd(f) for f in sorted(glob.glob(os.path.join(B,'parts','t[0-9][0-9]*.html'))) ) if False else ''
tab_files=sorted(glob.glob(os.path.join(B,'parts','t[0-9][0-9]*.html')))
sys.path.insert(0,B)
import figs
def sub_figs(t):
    return re.sub(r'\{\{FIG:(\w+)\}\}', lambda m: figs.PLACE[m.group(1)](), t)
tabs='\n\n'.join(sub_figs(open(f,encoding='utf-8').read()) for f in tab_files)
footer=rd('parts/footer.html')

# ── JS
eng=rd('js/_engineB.js')
eng=eng.replace("window.APP_TITLE = '14. 클라드니 무늬';","window.APP_TITLE = '15. 캔위성(CanSat)';")
eng=eng.replace('atomapp:','cansat15:')
fsxmap=rd('js/fsxmap.js')
eng,n=re.subn(r'  var MAP = \{.*?\n  \};',lambda m: fsxmap.rstrip('\n'),eng,count=1,flags=re.S)
assert n==1,'FSX.MAP 교체 실패'
qr=rd('js/_quizreport.js').replace('atomapp:','cansat15:').replace("'mk','mlam','mdiff',","'mk','mlam','mdiff','m1','AA',")
ws=rd('js/workshop.js')
import json, projfigs
figs_js='var FIGS='+json.dumps({k:{'fig':v[0],'tg':v[1]} for k,v in projfigs.PF.items()}, ensure_ascii=False)+';'
js_parts=['"use strict";', rd('js/zoneA.js'), eng, rd('js/_zoneC0.js'),
          rd('js/lib.js'), ws, figs_js]
for f in sorted(glob.glob(os.path.join(B,'js','c_*.js'))):
    js_parts.append(open(f,encoding='utf-8').read())
js_parts += [rd('js/report_manual.js'), qr, rd('js/boot.js')]
js='\n\n'.join(js_parts)

html=head+'\n'+header+'\n'+tabs+'\n\n'+footer+'\n<script>\n'+js+'\n</script>\n'
html+=rd('parts/appendix.html') if os.path.exists(os.path.join(B,'parts/appendix.html')) else ''
html+='\n</body>\n</html>\n'
with open(OUT,'w',encoding='utf-8') as f: f.write(html)
print('written',OUT,len(html)//1024,'KB', len(tab_files),'tab files')
