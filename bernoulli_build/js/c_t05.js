/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ 응용 : 1 피토관 · 2 벤투리 유량계 · 3 분무기 · 4 토리첼리. 슬라이더 a, b 는 1~100 으로 모드마다 물리량에 사상한다.
   검증(손계산) : 피토 v=50 m/s 해수면 → Δp=½·1.225·2500=1531 Pa · 벤투리 D₁=4 cm D₂=2 cm Δp=10 kPa → Q=0.98·A₂·√(2·10000/(1000·(1−1/16)))=0.98·3.14e-4·4.62=1.42 L/s
   ─────────────────────────────────────────────────────────────────────────── */
var MODE5=['','피토관(속도계)','벤투리 유량계','분무기','토리첼리(구멍 유출)'];
function t5(S){ var m=S.mode, a=S.a, b=S.b, o={};
  if(m===1){ o.v=10+(a-1)/99*240; o.alt=(b-1)/99*11; var is=isa(o.alt); o.rho=is.rho; o.dp=dynP(is.rho,o.v); o.ias=Math.sqrt(2*o.dp/1.225); o.M=o.v/is.a; o.na='속력 v = '+o.v.toFixed(0)+' m/s'; o.nb='고도 = '+o.alt.toFixed(1)+' km'; }
  if(m===2){ o.Q=(0.2+(a-1)/99*2.8)/1000; o.D2=1+(b-1)/99*2.2; var A1=Math.PI*0.04*0.04/4, A2=Math.PI*Math.pow(o.D2/100,2)/4, be=o.D2/4; o.A1=A1; o.A2=A2; o.v2=o.Q/A2/0.98; o.dp=0.5*RHO_W*o.v2*o.v2*(1-Math.pow(be,4)); o.v1=o.Q/A1; o.na='유량 Q = '+(o.Q*1000).toFixed(2)+' L/s'; o.nb='목 지름 = '+o.D2.toFixed(1)+' cm (D₁ = 4 cm)'; }
  if(m===3){ o.v=5+(a-1)/99*40; o.h=2+(b-1)/99*8; o.dp=dynP(1.2,o.v); o.hyd=1000*G*o.h/100; o.na='공기 속력 = '+o.v.toFixed(0)+' m/s'; o.nb='액면 높이 차 = '+o.h.toFixed(1)+' cm'; o.rise=o.dp/(1000*G)*100; }
  if(m===4){ o.h=5+(a-1)/99*95; o.d=2+(b-1)/99*8; o.v=torr(o.h/100); var A=Math.PI*Math.pow(o.d/1000,2)/4; o.Q=0.62*A*o.v; o.na='구멍 깊이 h = '+o.h.toFixed(0)+' cm'; o.nb='구멍 지름 = '+o.d.toFixed(1)+' mm'; o.dp=0.5*RHO_W*o.v*o.v; }
  return o; }
var T5=mkTab(5,{ state:{mode:1,a:40,b:1}, fmt:{mode:function(v){ return MODE5[v]; },a:function(v,S){ return t5(S).na; },b:function(v,S){ return t5(S).nb; }},
  readout:function(S){ var o=t5(S), m=S.mode;
    setTxt('t5-oD',(o.dp>=1000? (o.dp/1000).toFixed(2)+' kPa' : o.dp.toFixed(0)+' Pa'));
    if(m===1){ setTxt('t5-oV',o.v.toFixed(0)+' m/s ('+(o.v*3.6).toFixed(0)+' km/h)'); setTxt('t5-oQ','—'); setTxt('t5-oR','계기 속도(IAS) '+o.ias.toFixed(0)+' m/s'); setTxt('t5-oL', o.M>0.3? '마하 '+o.M.toFixed(2)+' — 압축성 보정 필요':'마하 '+o.M.toFixed(2)+' — 비압축성 근사 가능'); }
    if(m===2){ setTxt('t5-oV','목 '+o.v2.toFixed(2)+' m/s'); setTxt('t5-oQ',(o.Q*1000).toFixed(2)+' L/s'); setTxt('t5-oR','입구 '+o.v1.toFixed(2)+' m/s · 면적비 '+(o.A1/o.A2).toFixed(1)); setTxt('t5-oL','유출 계수 C=0.98 가정 · 목이 좁을수록 Δp 큼'); }
    if(m===3){ var ok=o.dp>o.hyd; setTxt('t5-oV',o.v.toFixed(0)+' m/s'); setTxt('t5-oQ','—'); setTxt('t5-oR','액체 끌어올리는 압력 ρgh = '+o.hyd.toFixed(0)+' Pa'); setTxt('t5-oL', ok? '✅ 분무 시작 (Δp > ρgh)':'❌ 액체가 올라오지 못한다 (Δp < ρgh)'); }
    if(m===4){ setTxt('t5-oV',o.v.toFixed(2)+' m/s'); setTxt('t5-oQ',(o.Q*1e6).toFixed(1)+' mL/s'); setTxt('t5-oR','도달 거리 x = 2√(h(H−h)) (H = 1 m 일 때 '+(2*Math.sqrt(Math.min(o.h/100,1)*Math.max(0,1-o.h/100))*100).toFixed(0)+' cm)'); setTxt('t5-oL','구멍 지름이 커도 속력은 같다 · 유량만 커진다'); } },
  anim:function(ctx,w,h,t,S){ var o=t5(S), m=S.mode, x0=24, cy=h*0.5, i;
    cvText(ctx,MODE5[m],12,16,COL.text,'bold 13px system-ui,sans-serif');
    if(m===1){ // 피토관 : 흐름을 마주 보는 L자 관 + 옆 구멍
      var px=w*0.42; for(i=0;i<36;i++){ var y=cy+((i*13)%9-4)*h*0.045, x=(x0+((i*71+t*(40+o.v*0.6)*3)%(w-2*x0))); cvCirc(ctx,x,y,2,'rgba(125,211,252,.85)',null); }
      ctx.fillStyle='#475569'; ctx.fillRect(px,cy-7,w*0.3,14); ctx.fillRect(px+w*0.3,cy-7,10,h*0.34); ctx.fillStyle='#0b1424'; ctx.fillRect(px-2,cy-3,4,6);
      cvCirc(ctx,px+w*0.15,cy-7,3,'#0b1424',null); cvText(ctx,'정압 구멍(옆)',px+w*0.15,cy-22,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'전압 구멍(정면)',px-6,cy-22,COL.amber,'11px system-ui,sans-serif','center');
      cvRect(ctx,px+w*0.3-20,cy+h*0.34+4,50,36,'#1e293b',COL.axis2,1.4); cvText(ctx,'Δp '+(o.dp>=1000?(o.dp/1000).toFixed(1)+' kPa':o.dp.toFixed(0)+' Pa'),px+w*0.3+5,cy+h*0.34+23,COL.ok,'bold 11.5px system-ui,sans-serif','center');
      cvText(ctx,'v = √(2Δp/ρ) = '+o.v.toFixed(0)+' m/s · ρ = '+o.rho.toFixed(3)+' kg/m³',x0,h-12,COL.tick,'11.5px system-ui,sans-serif'); }
    if(m===2){ var L=w-2*x0, d1=h*0.3, d2=d1*o.D2/4, k, top=[], bot=[]; for(k=0;k<=60;k++){ var x=k/60, d=dProf(x,d1,d2); top.push([x0+x*L,cy-d/2]); bot.push([x0+x*L,cy+d/2]); }
      ctx.beginPath(); top.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(k=bot.length-1;k>=0;k--) ctx.lineTo(bot[k][0],bot[k][1]); ctx.closePath(); ctx.fillStyle='rgba(56,189,248,.2)'; ctx.fill(); cvLine(ctx,top,COL.axis2,2.4); cvLine(ctx,bot,COL.axis2,2.4);
      var hh=Math.min(h*0.32,o.dp/20000*h*0.3); [[0.15,0],[0.5,hh]].forEach(function(q,j){ var xx=x0+q[0]*L, yy=cy-(j? d2:d1)/2; ctx.strokeStyle=COL.tick; ctx.beginPath(); ctx.moveTo(xx,yy); ctx.lineTo(xx,yy-h*0.34); ctx.stroke(); ctx.fillStyle='rgba(56,189,248,.5)'; var colH=h*0.34-(j? hh:0)*0+0; ctx.fillRect(xx-3,yy-(h*0.34-(j?hh:0)),6,h*0.34-(j?hh:0)); });
      cvText(ctx,'Δp = '+(o.dp/1000).toFixed(2)+' kPa → Q = '+(o.Q*1000).toFixed(2)+' L/s',x0,h-12,COL.amber,'bold 12px system-ui,sans-serif'); }
    if(m===3){ var bx=w*0.45, by=h*0.78, bw=60; ctx.fillStyle='rgba(56,189,248,.35)'; ctx.fillRect(bx,by-60,bw,60); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(bx,by-80,bw,80); ctx.lineWidth=1;
      var rise=Math.min(80,o.rise*1.5), top3=by-60-Math.max(-6,Math.min(1,(o.dp-o.hyd)/o.hyd))*0; ctx.fillStyle='rgba(56,189,248,.5)'; var lh=Math.max(0,Math.min(140,(o.dp/o.hyd)*40)); ctx.fillRect(bx+bw/2-3,cy-30-0,6,by-60-(cy-30)); cvText(ctx,'빨대',bx+bw/2+8,cy+10,COL.tick,'11px system-ui,sans-serif');
      for(i=0;i<30;i++){ var xx=x0+((i*83+t*(80+o.v*5))%(w-2*x0)), yy=cy-48+((i*7)%5)*2; cvCirc(ctx,xx,yy,2,'rgba(125,211,252,.9)',null); } ctx.fillStyle='#475569'; ctx.fillRect(bx+bw/2-3,cy-52,6,24);
      if(o.dp>o.hyd) for(i=0;i<14;i++){ var u=((i*0.13+t*1.5)%1); cvCirc(ctx,bx+bw/2+u*(w*0.4-bx*0.2),cy-50-Math.sin(u*3)*6+(i%3)*3,1.5,'rgba(147,197,253,.9)',null); }
      cvText(ctx,'Δp = '+o.dp.toFixed(0)+' Pa  vs  ρgh = '+o.hyd.toFixed(0)+' Pa',x0,h-12,o.dp>o.hyd?COL.ok:COL.amber,'bold 12px system-ui,sans-serif'); }
    if(m===4){ var tx=w*0.15, tw=w*0.28, ty=24, th=h-60, hy=ty+th*(1-0.9)+ (o.h/100)*th*0.9, jx=tx+tw; ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(tx,ty+th*0.1,tw,th*0.9); vessel(ctx,tx,ty,tw,th,COL.axis2); cvLine(ctx,[[tx,ty+th*0.1],[tx+tw,ty+th*0.1]],COL.blue,1.5);
      var vs=Math.sqrt(o.h/100*2*G), prev=null, pts=[]; for(i=0;i<=30;i++){ var tt=i*0.012, xx=jx+vs*tt*w*0.18/ Math.max(1,vs)*Math.min(3,vs), yy=hy+0.5*G*tt*tt*th*0.9*2.2; pts.push([xx,yy]); } cvLine(ctx,pts,COL.blue,Math.max(1.5,o.d*0.45)); cvCirc(ctx,jx,hy,Math.max(2,o.d*0.4),'#0b1424',COL.amber,1.5);
      cvArrow(ctx,tx+tw*0.5,ty+th*0.1,tx+tw*0.5,hy,COL.amber,1.6); cvText(ctx,'h = '+o.h.toFixed(0)+' cm',tx+tw*0.5+8,(ty+th*0.1+hy)/2,COL.amber,'bold 11.5px system-ui,sans-serif');
      cvText(ctx,'v = √(2gh) = '+o.v.toFixed(2)+' m/s · 유량 '+(o.Q*1e6).toFixed(1)+' mL/s',tx+tw+16,ty+14,COL.text,'bold 12px system-ui,sans-serif'); } },
  graph:function(ctx,w,h,S){ var o=t5(S), m=S.mode, pts=[], k;
    if(m===1){ for(k=0;k<=250;k+=5) pts.push([k,dynP(o.rho,k)/1000]); lineGraph(ctx,w,h,{xmin:0,xmax:250,ymin:0,ymax:dynP(o.rho,250)/1000*1.05,xl:'속력 v (m/s)',yl:'동압 Δp (kPa)',title:'동압 ½ρv² — 속력의 제곱에 비례',curves:[{pts:pts,col:COL.blue,lw:2.4}],now:[o.v,o.dp/1000],yd:1}); }
    if(m===2){ for(k=0.2;k<=3;k+=0.1){ var v2=k/1000/o.A2/0.98; pts.push([k,0.5*RHO_W*v2*v2*(1-Math.pow(o.D2/4,4))/1000]); } lineGraph(ctx,w,h,{xmin:0,xmax:3,ymin:0,ymax:Math.max(pts[pts.length-1][1]*1.05,1),xl:'유량 Q (L/s)',yl:'압력 강하 Δp (kPa)',title:'유량 대 압력 강하 — Δp ∝ Q²',curves:[{pts:pts,col:COL.blue,lw:2.4}],now:[o.Q*1000,o.dp/1000],yd:1}); }
    if(m===3){ for(k=5;k<=45;k+=1) pts.push([k,dynP(1.2,k)]); lineGraph(ctx,w,h,{xmin:0,xmax:45,ymin:0,ymax:dynP(1.2,45)*1.05,xl:'공기 속력 v (m/s)',yl:'압력 감소 Δp (Pa)',title:'분무 조건 — Δp 가 ρgh(점선)를 넘으면 액체가 올라온다',curves:[{pts:pts,col:COL.blue,lw:2.4},{pts:[[0,o.hyd],[45,o.hyd]],col:COL.grav,lw:1.6,dash:[6,4]}],now:[o.v,o.dp],yd:0,legend:[['Δp = ½ρv²',COL.blue],['ρgh',COL.grav]],lw:130}); }
    if(m===4){ for(k=5;k<=100;k+=2) pts.push([k,torr(k/100)]); lineGraph(ctx,w,h,{xmin:0,xmax:100,ymin:0,ymax:torr(1)*1.05,xl:'구멍 깊이 h (cm)',yl:'유출 속력 v (m/s)',title:'토리첼리 — v = √(2gh) (구멍 크기와 무관)',curves:[{pts:pts,col:COL.blue,lw:2.4}],now:[o.h,o.v],yd:1}); } }
});
