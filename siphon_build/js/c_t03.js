/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② 정점 압력과 최대 높이 : p_c = p_atm − ρ g H_c − ½ρ v² ≥ p_v → H_max = (p_atm − p_v)/(ρ g) − v²/2g
   검증(손계산) : T=20 °C → p_v=2.34 kPa → H_max=(101.3−2.34)/9.8=10.1 m(v≈0) · H_c=4 m · v=2 m/s → p_c=101.3−39.2−2=60.1 kPa
   ─────────────────────────────────────────────────────────────────────────── */
function t3calc(S){ var r=siphon(S.h/100,0.012,2*S.Hc+1.5,muW(S.T),1.0), p=pCrest(S.Hc,r.v), pv=pvap(S.T), hm=HcMax(S.T,r.v); return {v:r.v,p:p,pv:pv,hm:hm,ok:p>pv&&S.h>0}; }
var T3=mkTab(3,{ state:{Hc:4,h:50,T:20}, unit:{Hc:' m',h:' cm',T:' °C'}, fmt:{Hc:function(v){ return v.toFixed(1)+' m'; }},
  readout:function(S){ var c=t3calc(S);
    setTxt('t3-oP',c.p.toFixed(1)+' kPa'); setTxt('t3-oV',c.pv.toFixed(2)+' kPa'); setTxt('t3-oH',c.hm.toFixed(1)+' m'); setTxt('t3-oM',(c.hm-S.Hc>=0?'+':'')+(c.hm-S.Hc).toFixed(1)+' m'); setTxt('t3-oS',c.ok?'✅ 흐른다(v = '+c.v.toFixed(2)+' m/s)':'⚠ 정점에서 기포 · 끊김'); },
  anim:function(ctx,w,h,t,S){ var c=t3calc(S), Hv=Math.min(70,6+S.Hc*7), bub=[]; if(!c.ok){ bub.push({s:0.42+0.04*Math.sin(t*3),len:1.6},{s:0.5,len:1},{s:0.56+0.03*Math.cos(t*2),len:1.3}); }
    siphonDraw(ctx,0,10,w,h-24,{hU:S.h*0.5,Hc:Hv,hL:null,v:c.ok?c.v:0,on:c.ok,prime:c.ok?1:0.5,tankH:25,bubbles:bub,pTop:c.p,T:S.T},t);
    cvText(ctx,'정점 압력 p꜀ = p_atm − ρgH꜀ − ½ρv² = '+c.p.toFixed(1)+' kPa  (물의 증기압 '+c.pv.toFixed(2)+' kPa)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'그림의 정점 높이는 보기 좋게 줄여 그렸습니다(실제 H꜀ = '+S.Hc.toFixed(1)+' m).',12,h-8,COL.dim,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), c=t3calc(S), pr=[], k, hv=[];
    for(k=0;k<=100;k+=2){ var f=k/100, z; if(f<0.3) z=-0.3+ (S.Hc+0.3)*(f/0.3); else if(f<0.55) z=S.Hc; else z=S.Hc-(S.Hc+S.h/100)*((f-0.55)/0.45); pr.push([k,PATM-RHO*G*z/1000-0.5*RHO*c.v*c.v/1000]); }
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:100,ymin:-20,ymax:140,ylabel:'압력 p (kPa)',title:'관을 따라 압력 — 정점에서 가장 낮고, 증기압 아래면 기포(빨강 선)',left:60,top:24,bottom:22,xfmt:function(v){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,[[0,c.pv],[100,c.pv]],COL.grav,1.8,[6,4]); plotLine(ctx,P,pr,COL.ok,2.4); });
    for(k=0;k<=90;k+=3) hv.push([k,HcMax(k,c.v)]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:90,ymin:0,ymax:11,xlabel:'수온 T (°C)',ylabel:'이론 최대 정점 높이 (m)',title:'수온 대 이론 최대 높이 — 따뜻한 물일수록 낮아진다',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,hv,COL.blue,2.4); plotPoints(ctx,P,[[S.T,Math.min(11,c.hm)]],COL.amber,7); }); }
});
