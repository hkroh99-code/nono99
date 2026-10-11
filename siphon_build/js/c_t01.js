/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 상황 도우미(높이차·중력 vs 마찰·관 중요도 + 대표 값) + 타임라인
   검증(손계산) : 어항 k=5 → h=0.5 m → v=√(2·9.8·0.5)=3.13 m/s · 피타고라스 컵 k=5 → 5 cm(≤6 cm) → 150 mL 남음 · k=8 → 모두 빠짐 · 정점 k=10 → 9 m → p=101.3−88.2−… ≈ 13 kPa
   ─────────────────────────────────────────────────────────────────────────── */
var SIT=[
  {n:'어항 물갈이 호스', ps:10, ar:3, lab:'높이차 h (cm)',  f:function(k){ return 10*k; },   q:function(k){ return Math.sqrt(2*G*0.1*k); }, ql:'이상 유속 (m/s)', k:'높이차가 클수록 빠르다 ($v=\\sqrt{2gh}$)'},
  {n:'논 관개 사이펀 튜브', ps:8, ar:6, lab:'높이차 h (cm)', f:function(k){ return 5*k; }, q:function(k){ return siphon(0.05*k,0.04,3,1e-3,1).Q*1000; }, ql:'유량 (L/s) · 지름 4 cm · 길이 3 m', k:'굵은 관은 유량이 크지만 길면 마찰이 커진다'},
  {n:'사이펀식 변기(배수관)', ps:7, ar:5, lab:'고인 물의 양 (L)', f:function(k){ return 0.3*k; }, q:function(k){ return 0.3*k/siphon(0.3,0.04,0.5,1e-3,1.5).Q; }, ql:'비워지는 시간 (s) · 배수관 4 cm', k:'정점을 넘는 순간 한꺼번에 빨려 나간다'},
  {n:'피타고라스 컵', ps:9, ar:1, lab:'채운 높이 (cm) — 기둥 6 cm', f:function(k){ return k; }, q:function(k){ return k<=6? 30*k : 0; }, ql:'컵에 남는 물 (mL)', k:'정점(6 cm)을 넘기면 컵이 스스로 모두 비운다'},
  {n:'간헐 샘(주기 사이펀)', ps:6, ar:4, lab:'유입 유량 (mL/s)', f:function(k){ return 2*k; }, q:function(k){ var Qi=2*k, Qo=40; return 100*7/Qi+100*7/(Qo-Qi); }, ql:'한 주기 (s) · 통 100 cm²', k:'채우는 시간과 쏟아내는 시간이 번갈아 반복된다'},
  {n:'정점의 높이 한계', ps:8, ar:2, lab:'정점 높이 (m)', f:function(k){ return 0.9*k; }, q:function(k){ return pCrest(0.9*k,0.5); }, ql:'정점 압력 (kPa) · 증기압 2.3 kPa', k:'압력이 증기압 밑으로 내려가면 기포가 생겨 끊긴다'}
];
TabInit[1] = function(){
  var tl=document.getElementById('t1-timeline'); if(tl && !tl.children.length){
    TIMELINE.forEach(function(t){ var d=document.createElement('button'); d.type='button'; d.className='tl-card';
      d.innerHTML='<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div><div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click',function(){ showTab(t.go); }); tl.appendChild(d); }); }
  T1.redraw();
};
var T1=mkTab(1,{ state:{s:1,k:5}, fmt:{s:function(v){ return SIT[v-1].n; }}, unit:{k:' 단계'},
  readout:function(S){ var q=SIT[S.s-1], v=q.q(S.k); setTxt('t1-oB', q.ps>=q.ar? '높이차(중력)' : '마찰 · 관'); setTxt('t1-oS',q.ps+' : '+q.ar); setTxt('t1-oN',q.lab+' = '+(+q.f(S.k).toFixed(2))); setTxt('t1-oW',v>=100? v.toFixed(0):v.toFixed(2)); setTxt('t1-oC',q.ql); },
  anim:function(ctx,w,h,t,S){
    var fr=Math.min(1,t/2.2), x0=150, y0=46, rh=(h-90)/6;
    cvText(ctx,'상황별로 높이차(파랑)와 마찰 · 관(초록)이 얼마나 핵심인가 (0 ~ 10)',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    SIT.forEach(function(q,i){ var y=y0+i*rh, sel=(i===S.s-1), lw=(w-x0-30)/2;
      cvText(ctx,q.n,x0-8,y+rh*0.4,sel?COL.amber:COL.tick,(sel?'bold ':'')+'12px system-ui,sans-serif','right');
      ctx.fillStyle=COL.blue; ctx.globalAlpha=sel?1:0.5; ctx.fillRect(x0,y+4,lw*q.ps/10*fr,rh*0.32); ctx.fillStyle=COL.ok; ctx.fillRect(x0,y+4+rh*0.36,lw*q.ar/10*fr,rh*0.32); ctx.globalAlpha=1;
      if(sel){ ctx.strokeStyle=COL.amber; ctx.lineWidth=2; ctx.strokeRect(2,y,w-4,rh); ctx.lineWidth=1; }
      cvText(ctx,'높이차 '+q.ps,x0+lw*q.ps/10*fr+4,y+4+rh*0.16,COL.blue,'10.5px system-ui,sans-serif'); cvText(ctx,'마찰·관 '+q.ar,x0+lw*q.ar/10*fr+4,y+4+rh*0.52,COL.ok,'10.5px system-ui,sans-serif'); });
    var q=SIT[S.s-1]; cvText(ctx,q.ql+' = '+(q.q(S.k)>=100?q.q(S.k).toFixed(0):q.q(S.k).toFixed(2)),12,h-14,COL.amber,'bold 12.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var q=SIT[S.s-1], pts=[], k, mx=0; for(k=1;k<=10;k++){ pts.push([k,q.q(k)]); mx=Math.max(mx,q.q(k)); }
    var P=makePlot(ctx,w,h,{xmin:1,xmax:10,ymin:Math.min(0,...pts.map(function(p){ return p[1]; }))*1.1,ymax:mx*1.1+0.001,xlabel:'규모 단계 k  ('+q.lab+' = '+(+q.f(1).toFixed(2))+' … '+(+q.f(10).toFixed(2))+')',ylabel:q.ql.split(' ·')[0].split(' (')[0],title:q.n+' — 대표 값은 규모에 어떻게 변하나',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=100? v.toFixed(0): v.toFixed(1); }});
    plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,pts,COL.blue,3); plotPoints(ctx,P,[[S.k,q.q(S.k)]],COL.amber,7); }
});
