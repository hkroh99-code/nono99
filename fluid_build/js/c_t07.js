/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 심해 잠수정이 받는 압력 (한국 · 미국 · 일본의 대표 장비)
   p = p₀ + ρgh (해수 ρ≈1025). 1 km → 약 100기압, 6,500 m → 약 650기압, 1 cm² 당 약 0.67 t 의 힘.
   장비 최대 수심은 공개 자료의 값(어림) : 해미래(ROV) 6,000 m · 신카이 6500 6,500 m · 앨빈 6,500 m(2021 개량) · 트리에스테 1960 약 10,900 m
   ─────────────────────────────────────────────────────────────────────────── */
var DEEP=[
  {n:'스쿠버 한계(오락용)',c:'-',d:40,  col:'#34d399'},
  {n:'해미래 (한국 · ROV)',c:'한국',d:6000, col:'#38bdf8'},
  {n:'신카이 6500 (일본 · 유인)',c:'일본',d:6500, col:'#fb7185'},
  {n:'앨빈 (미국 · 유인, 2021 개량)',c:'미국',d:6500, col:'#fbbf24'},
  {n:'트리에스테 1960 (미국 해군 · 챌린저 해연)',c:'미국',d:10900, col:'#a78bfa'}
];
var T7=mkTab(7,{ state:{h:3000,rho:1025}, unit:{h:' m',rho:' kg/m³'},
  readout:function(S){ var p=pAbs(S.h,S.rho), ok=DEEP.filter(function(d){ return d.d>=S.h; }).length; setTxt('t7-oP',(p/1e6).toFixed(2)+' MPa'); setTxt('t7-oA',toAtm(p).toFixed(0)+' 기압'); setTxt('t7-oF',(p*1e-4/G).toFixed(0)+' kgf / cm²'); setTxt('t7-oN',ok+' / '+DEEP.length+' 장비가 도달 가능'); setTxt('t7-oJ',S.h<=40?'오락 잠수 가능 범위':(S.h<=6500?'유인 · 무인 연구 잠수정 범위':'초심해(해구) — 극소수 장비만')); },
  anim:function(ctx,w,h,t,S){
    var top=36, bot=h-18, x0=w*0.08, cw=Math.min(70,w*0.12), D=11000, y=function(d){ return top+(bot-top)*d/D; }, i;
    var gr=ctx.createLinearGradient(0,top,0,bot); gr.addColorStop(0,'rgba(56,189,248,.35)'); gr.addColorStop(1,'rgba(3,7,40,.95)'); ctx.fillStyle=gr; ctx.fillRect(x0,top,cw,bot-top); ctx.strokeStyle=COL.axis2; ctx.strokeRect(x0,top,cw,bot-top);
    for(i=0;i<=11;i+=1){ var yy=y(i*1000); ctx.strokeStyle='rgba(148,163,184,.25)'; ctx.beginPath(); ctx.moveTo(x0+cw,yy); ctx.lineTo(x0+cw+6,yy); ctx.stroke(); cvText(ctx,i+' km',x0-6,yy+3,COL.tick,'10px system-ui,sans-serif','right'); }
    DEEP.forEach(function(d,k){ var yy=y(d.d), lx=x0+cw+60+(k%2)*0; ctx.strokeStyle=d.col; ctx.setLineDash([4,3]); ctx.beginPath(); ctx.moveTo(x0,yy); ctx.lineTo(x0+cw+50,yy); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle=d.col; ctx.beginPath(); ctx.arc(x0+cw/2,yy,5,0,6.283); ctx.fill(); cvText(ctx,d.n+' — '+d.d.toLocaleString()+' m ('+(toAtm(pAbs(d.d,1025))).toFixed(0)+'기압)',x0+cw+56,yy+[3,-9,4,15,3][k],d.col,'11px system-ui,sans-serif'); });
    var ph=Math.min(1,t/2), cy=y(S.h*ph); ctx.fillStyle=COL.white; ctx.beginPath(); ctx.moveTo(x0-18,cy); ctx.lineTo(x0-6,cy-6); ctx.lineTo(x0-6,cy+6); ctx.closePath(); ctx.fill();
    cvText(ctx,'수심 '+(S.h*ph).toFixed(0)+' m · 압력 '+toAtm(pAbs(S.h*ph,S.rho)).toFixed(0)+' 기압',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:11000,ymin:0,ymax:1200,ylabel:'압력 (기압)',title:'수심 → 압력 (직선: 1 km 마다 약 100기압)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,toAtm(pAbs(0,S.rho))],[11000,toAtm(pAbs(11000,S.rho))]],COL.blue,2.4); DEEP.forEach(function(d){ plotPoints(ctx,P,[[d.d,toAtm(pAbs(d.d,S.rho))]],d.col,5); }); plotPoints(ctx,P,[[S.h,toAtm(pAbs(S.h,S.rho))]],COL.white,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:5.5,ymin:0,ymax:1200,xlabel:'1 스쿠버 · 2 해미래 · 3 신카이 · 4 앨빈 · 5 트리에스테',ylabel:'최대 압력 (기압)',title:'장비별 견뎌야 하는 최대 압력',left:56,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      DEEP.forEach(function(d,k){ var v=toAtm(pAbs(d.d,S.rho)); ctx.fillStyle=d.col; ctx.fillRect(P.X(k+1-0.3),P.Y(v),P.X(k+1+0.3)-P.X(k+1-0.3),P.y0-P.Y(v)); cvText(ctx,v.toFixed(0),P.X(k+1),P.Y(v)-6,COL.text,'11px system-ui,sans-serif','center'); }); });
  }
});
