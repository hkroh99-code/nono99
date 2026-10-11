/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② 토크와 평형 : τ = r F sinθ. 반대쪽 40 cm 에 매단 질량으로 평형 (m g d₂ = τ)
   검증(손계산) : F=20 N · r=30 cm · θ=90° → τ=6 N·m · θ=30° → 3 N·m · 평형 질량(d₂=40 cm) = 6/(9.8·0.4)=1.53 kg
   ─────────────────────────────────────────────────────────────────────────── */
var T3=mkTab(3,{ state:{F:20,r:30,th:90,d2:40}, unit:{F:' N',r:' cm',th:'°',d2:' cm'},
  readout:function(S){ var t=torque(S.r/100,S.F,S.th), m=t/(G*S.d2/100);
    setTxt('t3-oT',t.toFixed(2)+' N·m'); setTxt('t3-oP',(S.F*Math.sin(S.th*PI/180)).toFixed(1)+' N'); setTxt('t3-oM',(S.F*Math.cos(S.th*PI/180)).toFixed(1)+' N'); setTxt('t3-oB',m.toFixed(2)+' kg'); setTxt('t3-oE',(S.th===90?'최대 효율 (수직)':(S.th%180===0?'토크 0 (막대 방향)':(Math.sin(S.th*PI/180)*100).toFixed(0)+' % 효율'))); },
  anim:function(ctx,w,h,t,S){
    var px=w*0.5, py=h*0.55, rr=Math.min(w*0.3,S.r*3.2+30), r2=Math.min(w*0.3,S.d2*3.2+30), th=S.th*PI/180, t0=torque(S.r/100,S.F,S.th), m=t0/(G*S.d2/100);
    cvLine(ctx,[[px-r2,py],[px+rr,py]],COL.tick,8); cvCirc(ctx,px,py,7,COL.amber,COL.white,1.5); ctx.fillStyle='rgba(148,163,184,.3)'; ctx.beginPath(); ctx.moveTo(px,py+8); ctx.lineTo(px-14,py+34); ctx.lineTo(px+14,py+34); ctx.closePath(); ctx.fill();
    var fx=px+rr, fy=py, L=Math.min(80,S.F*2.4+16);
    cvArrow(ctx,fx,fy,fx+L*Math.cos(th),fy-L*Math.sin(th),COL.amber,3); cvText(ctx,'F = '+S.F+' N',fx+L*Math.cos(th)+8,fy-L*Math.sin(th),COL.amber,'bold 12px system-ui,sans-serif'); cvLine(ctx,[[fx,fy],[fx,fy-L*Math.sin(th)]],COL.ok,1.5,[4,3]); cvText(ctx,'F sinθ',fx-6,fy-L*Math.sin(th)/2,COL.ok,'11px system-ui,sans-serif','right');
    ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(fx,fy,26,-th,0,false); ctx.stroke(); ctx.lineWidth=1; cvText(ctx,'θ',fx+30,fy-10,'#a78bfa','12px system-ui,sans-serif');
    var bs=Math.min(40,10+m*10); cvRect(ctx,px-r2-bs/2,py+30,bs,bs,COL.blue,COL.white,1.2); cvLine(ctx,[[px-r2,py],[px-r2,py+30]],COL.tick,1.5); cvText(ctx,m.toFixed(2)+' kg',px-r2,py+30+bs+14,COL.blue,'bold 11.5px system-ui,sans-serif','center');
    cvLine(ctx,[[px,py+46],[px+rr,py+46]],'#a78bfa',1.2); cvText(ctx,'r = '+S.r+' cm',px+rr/2,py+60,'#a78bfa','11px system-ui,sans-serif','center'); cvLine(ctx,[[px-r2,py-22],[px,py-22]],'#a78bfa',1.2); cvText(ctx,'d₂ = '+S.d2+' cm',px-r2/2,py-30,'#a78bfa','11px system-ui,sans-serif','center');
    cvText(ctx,'τ = r F sinθ = '+t0.toFixed(2)+' N·m  →  평형 질량 '+m.toFixed(2)+' kg',12,16,COL.text,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), pa=[], pr=[], k;
    for(k=0;k<=180;k+=3) pa.push([k,torque(S.r/100,S.F,k)]); for(k=0;k<=80;k+=2) pr.push([k,torque(k/100,S.F,S.th)]);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:180,ymin:0,ymax:Math.max(0.5,S.r/100*S.F*1.15),ylabel:'τ (N·m)',title:'힘의 각도 대 토크 — 90° 에서 최대 (sinθ)',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0)+'°'; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pa,COL.ok,2.4); plotPoints(ctx,P,[[S.th,torque(S.r/100,S.F,S.th)]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:80,ymin:0,ymax:Math.max(0.5,0.8*S.F*Math.sin(S.th*PI/180)*1.1),xlabel:'작용점 거리 r (cm)',ylabel:'τ (N·m)',title:'거리 대 토크 — 직선(기울기 F sinθ)',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pr,COL.blue,2.4); plotPoints(ctx,P,[[S.r,torque(S.r/100,S.F,S.th)]],COL.amber,7); }); }
});
