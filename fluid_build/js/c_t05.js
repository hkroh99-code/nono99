/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ 뜨기 · 가라앉기 · 안정 : 직육면체 배(길이 2 m · 폭 1 m · 높이 0.5 m)
   흘수 d = m/(ρLB) · KB=d/2 · BM=B²/(12d) · GM = KB + BM − KG  (GM>0 이면 복원력이 있어 안정)
   검증(손계산) : m=400 kg · 담수 → d=0.2 m · KB=0.1 · BM=1/(12·0.2)=0.417 · KG=0.3 → GM=0.217 m > 0 (안정)
   ─────────────────────────────────────────────────────────────────────────── */
var SH_L=2, SH_B=1, SH_H=0.5;
var T5=mkTab(5,{ state:{m:400,KG:0.3,w:1}, unit:{m:' kg',KG:' m'}, fmt:{w:function(v){ return v===1?'담수(1000)':'해수(1025)'; }},
  readout:function(S){ var o=ship(S.m,SH_L,SH_B,SH_H,S.w===1?1000:1025,S.KG); setTxt('t5-oD',o.d.toFixed(3)+' m'); setTxt('t5-oFb',o.free.toFixed(3)+' m'); setTxt('t5-oK',(o.KB+o.BM).toFixed(3)+' m (KM)'); setTxt('t5-oG',o.GM.toFixed(3)+' m'); setTxt('t5-oJ',!o.ok?'침몰(흘수 > 높이)': (o.GM>0?'안정(복원력 있음)':'불안정(뒤집힘)')); },
  anim:function(ctx,w,h,t,S){
    var rf=S.w===1?1000:1025, o=ship(S.m,SH_L,SH_B,SH_H,rf,S.KG), sc=Math.min(w*0.34,150), cx=w*0.36, wl=h*0.52, Bp=SH_B*sc, Hp=SH_H*sc, dp=Math.min(o.d,SH_H*1.6)*sc, ph=Math.min(1,t/3);
    /* 흔들림 : GM>0 이면 감쇠 진동, GM<0 이면 점점 기운다 */
    var ang; if(o.GM>0){ var wn=Math.sqrt(Math.max(o.GM,0.01))*3.2; ang=0.20*Math.exp(-0.22*t)*Math.cos(wn*t); } else { ang=Math.min(1.45,0.05*Math.exp(0.5*t)); }
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(0,wl,w,h-wl); ctx.strokeStyle='rgba(125,211,252,.7)'; ctx.beginPath(); ctx.moveTo(0,wl); ctx.lineTo(w,wl); ctx.stroke();
    cvText(ctx,S.w===1?'담수':'해수',10,wl+16,COL.blue,'11px system-ui,sans-serif');
    ctx.save(); ctx.translate(cx,wl); ctx.rotate(ang);
    var bt=dp; /* 선체 바닥 = +dp, 윗면 = dp-Hp */
    ctx.fillStyle='rgba(148,163,184,.5)'; ctx.fillRect(-Bp/2,bt-Hp,Bp,Hp); ctx.strokeStyle=COL.white; ctx.lineWidth=2; ctx.strokeRect(-Bp/2,bt-Hp,Bp,Hp); ctx.lineWidth=1;
    var yG=bt-S.KG*sc, yB=bt-o.KB*sc, yM=bt-(o.KB+o.BM)*sc;
    ctx.fillStyle=COL.grav; ctx.beginPath(); ctx.arc(0,yG,5,0,6.283); ctx.fill(); cvText(ctx,'G(무게중심)',10,yG,COL.grav,'11px system-ui,sans-serif');
    ctx.fillStyle=COL.ok; ctx.beginPath(); ctx.arc(0,yB,5,0,6.283); ctx.fill(); cvText(ctx,'B(부력중심)',10,yB+13,COL.ok,'11px system-ui,sans-serif');
    ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(0,yM,4.5,0,6.283); ctx.fill(); cvText(ctx,'M(메타센터)',10,yM-6,COL.amber,'11px system-ui,sans-serif');
    ctx.restore();
    cvText(ctx,'m = '+S.m+' kg · 흘수 '+o.d.toFixed(3)+' m · GM = '+o.GM.toFixed(3)+' m → '+(!o.ok?'침몰':(o.GM>0?'안정':'불안정')),12,18,o.GM>0&&o.ok?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif');
    cvText(ctx,'GM>0 : 기울면 부력과 무게가 배를 바로 세우는 방향으로 돌림힘(복원력)을 만든다',12,h-12,COL.tick,'11px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var rf=S.w===1?1000:1025, hh=Math.floor(h*0.52), i;
    subPlot(ctx,0,0,w,hh,{xmin:50,xmax:1000,ymin:-0.3,ymax:1.0,ylabel:'GM (m)',title:'적재 질량 → 복원력 지표 GM (0 위가 안정)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      var pts=[]; for(i=50;i<=1000;i+=25) pts.push([i,ship(i,SH_L,SH_B,SH_H,rf,S.KG).GM]); plotLine(ctx,P,[[50,0],[1000,0]],COL.dim,1.3,[5,4]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[S.m,ship(S.m,SH_L,SH_B,SH_H,rf,S.KG).GM]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:50,xmax:1100,ymin:0,ymax:0.8,xlabel:'적재 질량 m (kg)',ylabel:'흘수 (m)',title:'질량 → 흘수 (선체 높이 0.5 m 를 넘으면 침몰)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      var a=[],b=[]; for(i=50;i<=1100;i+=25){ a.push([i,i/(1000*SH_L*SH_B)]); b.push([i,i/(1025*SH_L*SH_B)]); } plotLine(ctx,P,[[50,SH_H],[1100,SH_H]],COL.grav,1.6,[6,4]); plotLine(ctx,P,a,COL.blue,1.8,S.w===1?null:[4,3]); plotLine(ctx,P,b,COL.ok,1.8,S.w===2?null:[4,3]); plotPoints(ctx,P,[[S.m,ship(S.m,SH_L,SH_B,SH_H,rf,S.KG).d]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['담수',COL.blue],['해수',COL.ok],['높이(침몰선)',COL.grav]]); });
  }
});
