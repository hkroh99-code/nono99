/* ═══════════════════════════════════════════════════════════════════════════
   프로젝트 공방 — 공용 도우미 (30개 카드 · 미니 모의실험이 함께 쓴다)
   FIGS[id] = {fig, tg} 는 빌드가 projfigs.py 에서 만들어 앞쪽에 넣어 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
/** log–log 최소제곱 : pts=[[x,y],…] (양수) → {p(기울기), c(절편), r2} */
function llFit(pts){ var d=pts.map(function(q){ return [Math.log10(q[0]),Math.log10(q[1])]; }), f=ols(d,false); return f? {p:f.a, c:f.b, r2:f.r2} : {p:0,c:0,r2:0}; }
/** 시드 난수 가우시안 잡음 : 상대 오차 rel */
function nz(r, x, rel){ return x*(1+rel*gaussR(r)); }
/** 표에 쓰는 숫자 : 소수 자리 고정 */
function fx(v,d){ return (+v).toFixed(d==null?1:d); }
/** 슬라이더 이름이 숫자 대신 이름인 항목용 */
function pick(names){ return function(v){ return names[Math.round(v)-1]; }; }
/** 캔버스 안 둥근 모서리 글자 상자 */
function note2(ctx, s, x, y, col){ pill(ctx, s, x, y, col||COL.text); }
/** PROJ 등록 : 도해(FIGS)를 붙인다 */
function mkP(o){ o.fig=FIGS[o.id].fig; o.tg=FIGS[o.id].tg; PROJ[o.id]=o; return o; }
function axisFmt(d){ return function(v){ return v.toFixed(d); }; }
/** 직선 그래프(점 + 이론선) 한 장 : o={xmin,xmax,ymin,ymax,xl,yl,title,pts,line:[[x,y],[x,y]],now:[x,y],left} */
function lineGraph(ctx,w,h,o){
  var P=makePlot(ctx,w,h,{xmin:o.xmin,xmax:o.xmax,ymin:o.ymin,ymax:o.ymax,xlabel:o.xl,ylabel:o.yl,title:o.title,left:o.left||56,xfmt:axisFmt(o.xd==null?0:o.xd),yfmt:axisFmt(o.yd==null?1:o.yd)});
  if(o.curves) o.curves.forEach(function(c){ plotLine(ctx,P,c.pts,c.col,c.lw||2,c.dash||null); });
  if(o.pts) plotPoints(ctx,P,o.pts,o.pcol||COL.blue,4);
  if(o.now) plotPoints(ctx,P,[o.now],COL.amber,7);
  if(o.legend) legend(ctx,P.x1-(o.lw||130),P.y1+14,o.legend);
  return P;
}

/* ── 사이펀 장면 공용 그리기 (프로젝트 모의실험이 재사용) ─────────────────── */
/** 전체 캔버스에 사이펀 한 장 : o 는 siphonDraw 의 인자(hU · Hc · hL · v · on …) */
function siphScene(ctx,w,h,o,t){ return siphonDraw(ctx,0,26,w,h-30,o,t); }
/** 한 줄 제목 */
function ttl(ctx,s,col){ cvText(ctx,s,12,14,col||COL.text,'bold 12px system-ui,sans-serif'); }
/** 이상 유량 대비 막대 : items=[[라벨, 값, 색]] */
function barRows(ctx,x,y,w,h,items,max,unit){ var rh=h/items.length; items.forEach(function(q,i){ var bw=(w-120)*Math.min(1,q[1]/max); cvText(ctx,q[0],x+110,y+i*rh+rh*0.5,COL.tick,'11.5px system-ui,sans-serif','right'); cvRect(ctx,x+118,y+i*rh+4,Math.max(2,bw),rh-9,q[2]||COL.blue,null); cvText(ctx,q[1].toFixed(q[1]>=100?0:(q[1]>=10?1:2))+(unit||''),x+118+Math.max(2,bw)+6,y+i*rh+rh*0.5,COL.text,'11px system-ui,sans-serif'); }); }
/** 통(직사각) 수위 그리기 : (x,y) 왼쪽 위, 폭 w, 높이 h, 수위 비율 f(0~1) */
function tankBox(ctx,x,y,w,h,f,col){ waterFill(ctx,x+2,y+h*(1-f),w-4,h*f,0.34); vessel(ctx,x,y,w,h,col); cvLine(ctx,[[x+2,y+h*(1-f)],[x+w-2,y+h*(1-f)]],'#7dd3fc',2); }

/** 카드 기본값 채우기 : 유형별 type · 평가 · 특별표 · up/next 를 자동으로 붙여 mkP 에 넘긴다 */
function pk(o){
  var kind=o.id.charAt(0), D={R:'R&E · 정량 실험',C:'창의 · 설계 대회',I:'발명 · 시제품'};
  o.type=o.type||D[kind]; o.lv=o.lv||1;
  if(!o.special){ if(kind==='R') o.special=['🎓 연구 설계',[['연구 질문',o.q.split('?')[0]+'?'],['독립변인',o.vars[0]],['종속변인',o.vars[1]],['통제변인',o.vars[2]],['기대 결과',o.expect||'이론 곡선과 일치']]];
    else o.special=[kind==='C'?'🎨 작품 기획서':'🔧 시제품 사양서',o.spec]; }
  o.eval=o.eval||(kind==='R'?[['정확성','이론 대비 오차'],['반복성','3 회 평균 · 표준편차'],['분석','그래프 · 회귀'],['안전','물 · 바닥 미끄럼']]:(kind==='C'?[['창의성','작품 구성'],['과학적 설명','원리 · 식'],['측정','숫자 · 그래프'],['안전','물 · 입으로 빨지 않기']]:[['창의성','설계'],['정확성','성능 숫자'],['반복성','재현성'],['안전','물 · 5 V 이하']]));
  o.tip=o.tip||'결과를 「값 ± 불확도」와 이론 곡선과 함께 보이면 소논문 수준이 됩니다.';
  return mkP(o);
}
