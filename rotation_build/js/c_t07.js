/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 동력 P = τ ω 와 기어 비. 항목별 대표 값은 공개 자료의 어림(예시).
   검증(손계산) : 전기차 모터 τ=250 N·m · 4000 rpm → ω=419 rad/s → P=104.7 kW · 기어 비 10 → 출력 τ=2500 N·m · 400 rpm (P 같음)
   ─────────────────────────────────────────────────────────────────────────── */
var MACH=[ {n:'자전거 페달(성인)', tau:20, rpm:90}, {n:'믹서 · 가전 모터', tau:0.3, rpm:15000}, {n:'전동 드릴', tau:3, rpm:1000}, {n:'전기차 구동 모터(예시)', tau:250, rpm:4000},
  {n:'풍력 터빈 저속 축(1.5 MW급)', tau:955000, rpm:15}, {n:'대형 선박 엔진(20 MW급)', tau:1900000, rpm:100}, {n:'협동 로봇 관절(감속기 출력)', tau:100, rpm:30}, {n:'위성 반작용 휠', tau:0.05, rpm:2000} ];
var T7=mkTab(7,{ state:{k:4,n:1}, fmt:{k:function(v){ return MACH[v-1].n; },n:function(v){ return v+' : 1'; }},
  readout:function(S){ var q=MACH[S.k-1], w=rpm2w(q.rpm), P=q.tau*w, to=q.tau*S.n, wo=w/S.n; function f(v,u){ return v>=1e6? (v/1e6).toFixed(2)+' M'+u : (v>=1e3? (v/1e3).toFixed(2)+' k'+u : v.toFixed(2)+' '+u); }
    setTxt('t7-oT',f(q.tau,'N·m')); setTxt('t7-oW',q.rpm+' rpm ('+w.toFixed(1)+' rad/s)'); setTxt('t7-oP',f(P,'W')); setTxt('t7-oO',f(to,'N·m')+' @ '+w2rpm(wo).toFixed(1)+' rpm'); setTxt('t7-oN',(P/746).toFixed(1)+' 마력 (참고)'); },
  anim:function(ctx,w,h,t,S){ var mx=0; MACH.forEach(function(q){ mx=Math.max(mx,Math.log10(q.tau*rpm2w(q.rpm))); }); var x0=210, rh=(h-46)/MACH.length, fr=Math.min(1,t/2);
    cvText(ctx,'동력 P = τ·ω (W, 로그 눈금) — 토크가 커도 느리면 동력은 작을 수 있다',12,18,COL.text,'bold 12px system-ui,sans-serif');
    MACH.forEach(function(q,i){ var y=34+i*rh, sel=(i===S.k-1), P=q.tau*rpm2w(q.rpm), bw=(w-x0-140)*(Math.log10(P)+2)/(mx+2)*fr;
      cvText(ctx,q.n,x0-8,y+rh*0.5,sel?COL.amber:COL.tick,(sel?'bold ':'')+'11.5px system-ui,sans-serif','right'); ctx.fillStyle=sel?COL.amber:COL.blue; ctx.globalAlpha=sel?1:0.6; ctx.fillRect(x0,y+4,Math.max(2,bw),rh-10); ctx.globalAlpha=1;
      cvText(ctx,(P>=1e6?(P/1e6).toFixed(1)+' MW':(P>=1e3?(P/1e3).toFixed(1)+' kW':P.toFixed(0)+' W')),x0+Math.max(2,bw)+6,y+rh*0.5,sel?COL.amber:COL.tick,'11px system-ui,sans-serif'); }); },
  graph:function(ctx,w,h,S){ var q=MACH[S.k-1], hh=Math.floor(h*0.55), pts=[], k, P=q.tau*rpm2w(q.rpm);
    for(k=1;k<=20;k+=1){ pts.push([k,q.tau*k]); }
    subPlot(ctx,0,0,w,hh,{xmin:1,xmax:20,ymin:0,ymax:q.tau*20*1.05,ylabel:'출력 토크 (N·m)',title:'기어 비 대 출력 토크 (손실 무시) — 기어비에 비례',left:70,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=1e6?(v/1e6).toFixed(1)+'M':(v>=1e3?(v/1e3).toFixed(0)+'k':v.toFixed(0)); }}, function(P2){ plotLine(ctx,P2,pts,COL.ok,2.4); plotPoints(ctx,P2,[[S.n,q.tau*S.n]],COL.amber,7); });
    var pr=[]; for(k=1;k<=20;k+=1) pr.push([k,w2rpm(rpm2w(q.rpm)/k)]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:1,xmax:20,ymin:0,ymax:q.rpm*1.05,xlabel:'기어 비 n : 1',ylabel:'출력 회전수 (rpm)',title:'기어 비 대 출력 회전수 — 1/n (동력 P 는 같다)',left:70,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=1e3?(v/1e3).toFixed(1)+'k':v.toFixed(0); }}, function(P2){ plotLine(ctx,P2,pr,COL.blue,2.4); plotPoints(ctx,P2,[[S.n,q.rpm/S.n]],COL.amber,7); }); }
});
