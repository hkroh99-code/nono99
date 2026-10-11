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
