/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 항목별 대표 규모(예시, 공개 자료의 어림)로 사이펀 유량 Q = A v 계산
   검증(손계산) : 사이펀 여수로 D=0.6 m · h=3 m · L=15 m → v≈7 m/s → Q≈2 m³/s 급(마찰 포함 어림)
   ─────────────────────────────────────────────────────────────────────────── */
var SIPH=[ {n:'실험실 사이펀(피펫 · 가는 관)', D:0.004, h:0.2, L:0.8}, {n:'어항 물갈이 호스', D:0.012, h:0.5, L:1.5}, {n:'정원 호스로 물 옮기기', D:0.016, h:0.8, L:5}, {n:'논 관개 사이펀 튜브', D:0.04, h:0.1, L:3},
  {n:'사이펀식 변기 배수관', D:0.05, h:0.3, L:0.6}, {n:'농업 수로 사이펀(큰 관)', D:0.8, h:0.5, L:20}, {n:'소규모 사이펀 여수로', D:0.6, h:3, L:15}, {n:'하수 · 배수 사이펀(펌프 없이)', D:0.3, h:1, L:10} ];
var T7=mkTab(7,{ state:{k:2,n:1}, fmt:{k:function(v){ return SIPH[v-1].n; },n:function(v){ return '× '+v; }},
  readout:function(S){ var q=SIPH[S.k-1], r=siphon(q.h*S.n,q.D,q.L,1e-3,1.5); function f(v){ return v>=1? v.toFixed(2)+' m³/s' : (v>=1e-3? (v*1000).toFixed(2)+' L/s' : (v*1e6).toFixed(1)+' mL/s'); }
    setTxt('t7-oD',(q.D*1000).toFixed(0)+' mm'); setTxt('t7-oH',(q.h*S.n).toFixed(2)+' m'); setTxt('t7-oQ',f(r.Q)); setTxt('t7-oV',r.v.toFixed(2)+' m/s ('+r.reg+')'); setTxt('t7-oN',(r.Q*3600).toFixed(r.Q*3600>10?0:2)+' m³/시간 (참고)'); },
  anim:function(ctx,w,h,t,S){ var x0=230, rh=(h-46)/SIPH.length, fr=Math.min(1,t/2), vals=SIPH.map(function(q){ return siphon(q.h*S.n,q.D,q.L,1e-3,1.5).Q; }), mx=Math.max.apply(null,vals), mn=Math.min.apply(null,vals);
    cvText(ctx,'유량 Q (로그 눈금, 같은 높이차 배율 × '+S.n+') — 규모가 작은 실험실부터 큰 여수로까지',12,18,COL.text,'bold 12px system-ui,sans-serif');
    SIPH.forEach(function(q,i){ var y=34+i*rh, sel=(i===S.k-1), Q=vals[i], bw=(w-x0-130)*(Math.log10(Q)-Math.log10(mn)+0.3)/(Math.log10(mx)-Math.log10(mn)+0.3)*fr;
      cvText(ctx,q.n,x0-8,y+rh*0.5,sel?COL.amber:COL.tick,(sel?'bold ':'')+'11.5px system-ui,sans-serif','right'); ctx.fillStyle=sel?COL.amber:COL.blue; ctx.globalAlpha=sel?1:0.6; ctx.fillRect(x0,y+4,Math.max(2,bw),rh-10); ctx.globalAlpha=1;
      cvText(ctx,(Q>=1?Q.toFixed(2)+' m³/s':(Q>=1e-3?(Q*1000).toFixed(1)+' L/s':(Q*1e6).toFixed(1)+' mL/s')),x0+Math.max(2,bw)+6,y+rh*0.5,sel?COL.amber:COL.tick,'11px system-ui,sans-serif'); }); },
  graph:function(ctx,w,h,S){ var q=SIPH[S.k-1], hh=Math.floor(h*0.55), pts=[], k, pd=[];
    for(k=1;k<=10;k+=0.5) pts.push([k,siphon(q.h*k,q.D,q.L,1e-3,1.5).Q*1000]);
    subPlot(ctx,0,0,w,hh,{xmin:1,xmax:10,ymin:0,ymax:pts[pts.length-1][1]*1.05,ylabel:'유량 (L/s)',title:'높이차 배율 대 유량 — √h 에 비례(곡선)',left:70,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=100? v.toFixed(0):v.toFixed(2); }}, function(P2){ plotLine(ctx,P2,pts,COL.ok,2.4); plotPoints(ctx,P2,[[S.n,siphon(q.h*S.n,q.D,q.L,1e-3,1.5).Q*1000]],COL.amber,7); });
    for(k=0.5;k<=2.01;k+=0.1) pd.push([k,siphon(q.h*S.n,q.D*k,q.L,1e-3,1.5).Q*1000]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:2,ymin:0,ymax:pd[pd.length-1][1]*1.05,xlabel:'지름 배율 (현재 = 1)',ylabel:'유량 (L/s)',title:'지름 대 유량 — 약 D²~D⁴ 로 급증한다',left:70,top:24,bottom:40,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v>=100? v.toFixed(0):v.toFixed(2); }}, function(P2){ plotLine(ctx,P2,pd,COL.blue,2.4); plotPoints(ctx,P2,[[1,siphon(q.h*S.n,q.D,q.L,1e-3,1.5).Q*1000]],COL.amber,7); }); }
});
