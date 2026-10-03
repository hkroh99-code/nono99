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

/* ── 회전 장면 공용 그리기 (프로젝트 모의실험이 재사용) ─────────────────── */
/** 바퀴/원판/고리: 중심 (cx,cy) 반지름 R, 회전각 ang, 모양 k(1 고리, 0.5 원판, 0.4 구) */
function drawWheel(ctx,cx,cy,R,ang,k,col){ ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang); col=col||'rgba(148,163,184,.65)';
  if(k>=0.9){ ctx.strokeStyle='rgba(203,213,225,.95)'; ctx.lineWidth=Math.max(4,R*0.12); ctx.beginPath(); ctx.arc(0,0,R,0,TAU); ctx.stroke(); ctx.lineWidth=1.5; for(var i=0;i<6;i++){ ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R*Math.cos(i*TAU/6),R*Math.sin(i*TAU/6)); ctx.stroke(); } }
  else { ctx.fillStyle=col; ctx.beginPath(); ctx.arc(0,0,R,0,TAU); ctx.fill(); ctx.strokeStyle=COL.white; ctx.lineWidth=1.5; ctx.stroke(); ctx.fillStyle=COL.amber; ctx.fillRect(R*0.45,-3,R*0.5,6); }
  ctx.restore(); cvCirc(ctx,cx,cy,3,COL.dim,null); }
/** 막대: 양 끝 (x1,y1) (x2,y2) */
function drawBeam(ctx,x1,y1,x2,y2,w,col){ cvLine(ctx,[[x1,y1],[x2,y2]],col||COL.tick,w||8); }
/** 받침점 삼각형 */
function drawPivot(ctx,x,y,s){ s=s||14; ctx.fillStyle='rgba(148,163,184,.4)'; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-s,y+s*1.8); ctx.lineTo(x+s,y+s*1.8); ctx.closePath(); ctx.fill(); cvCirc(ctx,x,y,4,COL.amber,COL.white,1.2); }
/** 회전 화살표(호) */
function arcArrow(ctx,cx,cy,r,a0,a1,col,lw){ ctx.strokeStyle=col; ctx.lineWidth=lw||2; ctx.beginPath(); ctx.arc(cx,cy,r,a0,a1,a1<a0); ctx.stroke(); ctx.lineWidth=1; var ex=cx+r*Math.cos(a1), ey=cy+r*Math.sin(a1), d=a1>a0?1:-1, tx=-Math.sin(a1)*d, ty=Math.cos(a1)*d; ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(ex+tx*6,ey+ty*6); ctx.lineTo(ex-ty*4,ey+tx*4); ctx.lineTo(ex+ty*4,ey-tx*4); ctx.closePath(); ctx.fill(); }
/** 막대 비교 : items=[[라벨, 값, 색]] , 범위 0~max */
function barRows(ctx,x,y,w,h,items,max,unit){ var rh=h/items.length; items.forEach(function(q,i){ var bw=(w-120)*Math.min(1,q[1]/max); cvText(ctx,q[0],x+110,y+i*rh+rh*0.5,COL.tick,'11.5px system-ui,sans-serif','right'); cvRect(ctx,x+118,y+i*rh+4,Math.max(2,bw),rh-9,q[2]||COL.blue,null); cvText(ctx,q[1].toFixed(q[1]>=100?0:(q[1]>=10?1:2))+(unit||''),x+118+Math.max(2,bw)+6,y+i*rh+rh*0.5,COL.text,'11px system-ui,sans-serif'); }); }
