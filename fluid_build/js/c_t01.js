/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 상황 도우미(어떤 원리가 핵심인가 + 대표 값) + 타임라인
   검증(손계산) : 잠수 k=5 → h=25 m → p=1+1025·9.8·25/101325=3.48 기압 · 유압 k=5 → 면적비 25 → F₂=2500 N(F₁=100 N)
   ─────────────────────────────────────────────────────────────────────────── */
var SIT=[
  {n:'스쿠버 잠수', ps:9, ar:4, lab:'수심 (m)',  f:function(k){ return 5*k; },   q:function(k){ return 1+1025*G*5*k/P0; }, ql:'절대 압력 (기압)', k:'압력은 깊이에 비례($p=p_0+\\rho gh$) — 10 m 마다 약 1기압 증가'},
  {n:'유압 잭',     ps:10,ar:0, lab:'면적비 A₂/A₁', f:function(k){ return 5*k; }, q:function(k){ return 100*5*k; },       ql:'출력 힘 (N) · 입력 100 N', k:'밀폐 유체의 압력이 같으므로 $F_2=F_1A_2/A_1$ (일은 같다)'},
  {n:'화물선 적재', ps:2, ar:10,lab:'적재량 (만 t)', f:function(k){ return k; },   q:function(k){ return k*1e7/(1025*200*30); }, ql:'흘수 (m) · 길이 200 m · 폭 30 m', k:'배가 밀어낸 물의 무게 = 배의 무게(아르키메데스) → 많이 실을수록 더 잠긴다'},
  {n:'구명조끼',   ps:1, ar:10,lab:'발포체 부피 (L)', f:function(k){ return k; }, q:function(k){ return 1000*G*k/1000; }, ql:'부력 (N)', k:'잠긴 부피 × 물의 밀도 × g — 50 N 급 · 100 N 급 등으로 분류'},
  {n:'심해 잠수정', ps:10,ar:8, lab:'수심 (km)', f:function(k){ return k; },     q:function(k){ return 1+1025*G*1000*k/P0; }, ql:'절대 압력 (기압)', k:'1 km 마다 약 100기압 — 내압 구조 + 밸러스트로 뜨고 가라앉는다'},
  {n:'열기구',     ps:1, ar:10,lab:'기구 부피 (×500 m³)', f:function(k){ return k; }, q:function(k){ return 0.25*500*k; }, ql:'들어 올리는 질량 (kg)', k:'공기도 유체 — 뜨거운 공기(밀도 약 0.95)가 찬 공기(약 1.2)를 밀어낸 차이가 부력'}
];
TabInit[1] = function(){
  var tl=document.getElementById('t1-timeline'); if(tl && !tl.children.length){
    TIMELINE.forEach(function(t){ var d=document.createElement('button'); d.type='button'; d.className='tl-card';
      d.innerHTML='<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div><div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click',function(){ showTab(t.go); }); tl.appendChild(d); }); }
  T1.redraw();
};
var T1=mkTab(1,{ state:{s:1,k:5}, fmt:{s:function(v){ return SIT[v-1].n; }}, unit:{k:' 단계'},
  readout:function(S){ var q=SIT[S.s-1], v=q.q(S.k); setTxt('t1-oB', q.ps>=q.ar? '파스칼 · 압력' : '아르키메데스 · 부력'); setTxt('t1-oS',q.ps+' : '+q.ar); setTxt('t1-oN',q.lab+' = '+q.f(S.k)); setTxt('t1-oW',v>=100? v.toFixed(0):v.toFixed(1)); setTxt('t1-oC',q.ql); },
  anim:function(ctx,w,h,t,S){
    var fr=Math.min(1,t/2.2), bw=Math.min(36,(w-150)/12), x0=120, y0=46, rh=(h-90)/6;
    cvText(ctx,'상황별로 두 원리가 얼마나 핵심인가 (0 ~ 10)',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    SIT.forEach(function(q,i){ var y=y0+i*rh, sel=(i===S.s-1), lw=(w-x0-30)/2;
      cvText(ctx,q.n,x0-8,y+rh*0.4,sel?COL.amber:COL.tick,(sel?'bold ':'')+'12px system-ui,sans-serif','right');
      ctx.fillStyle=COL.blue; ctx.globalAlpha=sel?1:0.5; ctx.fillRect(x0,y+4,lw*q.ps/10*fr,rh*0.32); ctx.fillStyle=COL.ok; ctx.fillRect(x0,y+4+rh*0.36,lw*q.ar/10*fr,rh*0.32); ctx.globalAlpha=1;
      if(sel){ ctx.strokeStyle=COL.amber; ctx.lineWidth=2; ctx.strokeRect(2,y,w-4,rh); ctx.lineWidth=1; }
      cvText(ctx,'압력 '+q.ps,x0+lw*q.ps/10*fr+4,y+4+rh*0.16,COL.blue,'10.5px system-ui,sans-serif'); cvText(ctx,'부력 '+q.ar,x0+lw*q.ar/10*fr+4,y+4+rh*0.52,COL.ok,'10.5px system-ui,sans-serif'); });
    var q=SIT[S.s-1]; cvText(ctx,q.ql+' = '+(q.q(S.k)>=100?q.q(S.k).toFixed(0):q.q(S.k).toFixed(1)),12,h-14,COL.amber,'bold 12.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var q=SIT[S.s-1], pts=[], k, mx=0; for(k=1;k<=10;k++){ pts.push([k,q.q(k)]); mx=Math.max(mx,q.q(k)); }
    var P=makePlot(ctx,w,h,{xmin:1,xmax:10,ymin:0,ymax:mx*1.1,xlabel:'규모 단계 k  ('+q.lab+' = '+q.f(1)+' … '+q.f(10)+')',ylabel:q.ql,title:q.n+' — 대표 값은 규모에 어떻게 변하나',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=100? v.toFixed(0): v.toFixed(1); }});
    plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,pts,COL.blue,3); plotPoints(ctx,P,[[S.k,q.q(S.k)]],COL.amber,7); }
});
