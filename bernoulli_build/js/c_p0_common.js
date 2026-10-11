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

/* ── 바람 · 물 장면 공용 그리기 (프로젝트 모의실험이 재사용) ─────────────── */
/** 오른쪽으로 흐르는 입자 : 영역 [x0,x1]×[y0,y1], 속력 v(m/s)에 비례해 빨라진다 */
function flowDots(ctx,t,v,x0,x1,y0,y1,n,col){ var i; n=n||44; for(i=0;i<n;i++){ var yy=y0+(((i*37)%19)+0.5)/19*(y1-y0), sp=0.5+((i*7)%5)*0.12, xx=x0+((i*53/n)*(x1-x0)+t*(14+v*5)*sp)%(x1-x0); cvCirc(ctx,xx,yy,1.9,col||'rgba(125,211,252,.85)',null); } }
/** 선풍기 : 중심 (x,y) 반지름 r, 회전 t */
function drawFan(ctx,x,y,r,t,v){ cvCirc(ctx,x,y,r,'rgba(148,163,184,.12)',COL.axis2,2); var k, a=t*(2+v*0.6); for(k=0;k<3;k++){ var an=a+k*TAU/3; ctx.fillStyle='rgba(203,213,225,.75)'; ctx.beginPath(); ctx.moveTo(x,y); ctx.arc(x,y,r*0.9,an,an+0.7); ctx.closePath(); ctx.fill(); } cvCirc(ctx,x,y,r*0.12,COL.dim,null); cvRect(ctx,x-r*0.12,y+r,r*0.24,r*0.5,'#475569',null); }
/** 날개 단면(NACA 비슷) : 중심 (cx,cy), 시위 ch(px), 받음각 al(도) */
function drawFoil(ctx,cx,cy,ch,al,fill){ var ang=al*Math.PI/180, i, up=[], dn=[]; function pt(u,upper){ var x=(u-0.5)*ch, th=0.6*ch*(0.2969*Math.sqrt(u)-0.126*u-0.3516*u*u+0.2843*u*u*u-0.1015*u*u*u*u)*0.5*0.8, cam=0.04*ch*Math.sin(Math.PI*u*0.95)*0.6, y=-(upper? th : -th)-cam, c=Math.cos(-ang), s=Math.sin(-ang); return [cx+x*c-y*s, cy+x*s+y*c]; }
  for(i=0;i<=24;i++){ up.push(pt(i/24,true)); dn.push(pt(i/24,false)); }
  ctx.beginPath(); up.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(i=dn.length-1;i>=0;i--) ctx.lineTo(dn[i][0],dn[i][1]); ctx.closePath(); ctx.fillStyle=fill||'rgba(148,163,184,.65)'; ctx.fill(); ctx.strokeStyle=COL.white; ctx.stroke(); }
/** 물통 + 수면 : (x,y,w,h), 수위 비율 lv(0~1) */
function drawTank(ctx,x,y,w,h,lv,col){ ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(x,y+h*(1-lv),w,h*lv); vessel(ctx,x,y,w,h,col||COL.axis2); cvLine(ctx,[[x,y+h*(1-lv)],[x+w,y+h*(1-lv)]],COL.blue,1.5); }
/** U자 마노미터 : (x,y) 왼쪽 위, 폭 w, 높이 h, 높이차 dh(px, 오른쪽이 높으면 +) */
function drawU(ctx,x,y,w,h,dh){ ctx.strokeStyle=COL.axis2; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+h); ctx.lineTo(x+w,y+h); ctx.lineTo(x+w,y); ctx.stroke(); ctx.lineWidth=1; var l0=y+h*0.55; ctx.fillStyle='rgba(56,189,248,.45)'; ctx.fillRect(x+1,l0+dh/2,5,y+h-(l0+dh/2)); ctx.fillRect(x+w-6,l0-dh/2,5,y+h-(l0-dh/2)); ctx.fillRect(x+1,y+h-5,w-2,4); cvLine(ctx,[[x-8,l0+dh/2],[x+14,l0+dh/2]],COL.amber,1.3,[3,3]); cvLine(ctx,[[x+w-14,l0-dh/2],[x+w+8,l0-dh/2]],COL.amber,1.3,[3,3]); }
/** 막대 비교 : items=[[라벨, 값, 색]] , 범위 0~max */
function barRows(ctx,x,y,w,h,items,max,unit){ var rh=h/items.length; items.forEach(function(q,i){ var bw=(w-120)*Math.min(1,q[1]/max); cvText(ctx,q[0],x+110,y+i*rh+rh*0.5,COL.tick,'11.5px system-ui,sans-serif','right'); cvRect(ctx,x+118,y+i*rh+4,Math.max(2,bw),rh-9,q[2]||COL.blue,null); cvText(ctx,q[1].toFixed(q[1]>=100?0:(q[1]>=10?1:2))+(unit||''),x+118+Math.max(2,bw)+6,y+i*rh+rh*0.5,COL.text,'11px system-ui,sans-serif'); }); }
