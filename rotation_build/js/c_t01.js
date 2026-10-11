/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 상황 도우미(토크 vs 관성·각운동량 중요도 + 대표 값) + 타임라인
   검증(손계산) : 문 k=5 → r=0.5 m · F=10 N → τ=5 N·m · 렌치 k=5 → 길이 30 cm · F=50 N → 15 N·m · 구르기 k=5 → 15° → a=2.45 m/s² · 속이 찬 원통 a=g sinθ/1.5=1.69
   ─────────────────────────────────────────────────────────────────────────── */
var SIT=[
  {n:'문 열기', ps:10, ar:3, lab:'손잡이 위치 (경첩에서 cm)',  f:function(k){ return 10*k; },   q:function(k){ return 10*0.1*k; }, ql:'토크 (N·m) · 힘 10 N', k:'같은 힘도 경첩에서 멀수록 토크가 크다 ($\\tau=rF$)'},
  {n:'렌치로 볼트 조이기', ps:10, ar:1, lab:'렌치 길이 (cm)', f:function(k){ return 5+5*k; }, q:function(k){ return 50*(5+5*k)/100; }, ql:'토크 (N·m) · 힘 50 N', k:'긴 렌치 = 같은 힘으로 큰 토크 (지렛대 이득)'},
  {n:'시소', ps:9, ar:2, lab:'아이의 앉은 거리 (cm)', f:function(k){ return 20*k; }, q:function(k){ return 20*G*0.2*k; }, ql:'토크 (N·m) · 질량 20 kg', k:'양쪽 토크의 합이 0 이면 평형 ($m_1d_1=m_2d_2$)'},
  {n:'피겨 스케이팅 스핀', ps:1, ar:10, lab:'팔 오므림 정도', f:function(k){ return k; }, q:function(k){ return 1+0.4*k; }, ql:'회전 속도 배율 (팔 벌렸을 때 = 1)', k:'각운동량 보존: 관성 모멘트가 줄면 각속도가 는다'},
  {n:'자전거 바퀴 자이로', ps:2, ar:9, lab:'바퀴 회전수 (rpm)', f:function(k){ return 60*k; }, q:function(k){ return 0.1*60*k*TAU/60; }, ql:'각운동량 L (kg·m²/s) · I=0.1 kg·m²', k:'빨리 도는 바퀴일수록 방향을 바꾸기 어렵다'},
  {n:'경사면 구르기', ps:3, ar:8, lab:'경사각 (°)', f:function(k){ return 3*k; }, q:function(k){ return rollA(0.5,3*k); }, ql:'가속도 (m/s²) · 속이 찬 원통', k:'질량과 반지름에 무관하고 모양(관성 계수)이 가속도를 정한다'}
];
TabInit[1] = function(){
  var tl=document.getElementById('t1-timeline'); if(tl && !tl.children.length){
    TIMELINE.forEach(function(t){ var d=document.createElement('button'); d.type='button'; d.className='tl-card';
      d.innerHTML='<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div><div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click',function(){ showTab(t.go); }); tl.appendChild(d); }); }
  T1.redraw();
};
var T1=mkTab(1,{ state:{s:1,k:5}, fmt:{s:function(v){ return SIT[v-1].n; }}, unit:{k:' 단계'},
  readout:function(S){ var q=SIT[S.s-1], v=q.q(S.k); setTxt('t1-oB', q.ps>=q.ar? '토크(돌리는 힘)' : '관성 · 각운동량'); setTxt('t1-oS',q.ps+' : '+q.ar); setTxt('t1-oN',q.lab+' = '+q.f(S.k)); setTxt('t1-oW',v>=100? v.toFixed(0):v.toFixed(2)); setTxt('t1-oC',q.ql); },
  anim:function(ctx,w,h,t,S){
    var fr=Math.min(1,t/2.2), x0=140, y0=46, rh=(h-90)/6;
    cvText(ctx,'상황별로 토크(파랑)와 관성 · 각운동량(초록)이 얼마나 핵심인가 (0 ~ 10)',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    SIT.forEach(function(q,i){ var y=y0+i*rh, sel=(i===S.s-1), lw=(w-x0-30)/2;
      cvText(ctx,q.n,x0-8,y+rh*0.4,sel?COL.amber:COL.tick,(sel?'bold ':'')+'12px system-ui,sans-serif','right');
      ctx.fillStyle=COL.blue; ctx.globalAlpha=sel?1:0.5; ctx.fillRect(x0,y+4,lw*q.ps/10*fr,rh*0.32); ctx.fillStyle=COL.ok; ctx.fillRect(x0,y+4+rh*0.36,lw*q.ar/10*fr,rh*0.32); ctx.globalAlpha=1;
      if(sel){ ctx.strokeStyle=COL.amber; ctx.lineWidth=2; ctx.strokeRect(2,y,w-4,rh); ctx.lineWidth=1; }
      cvText(ctx,'토크 '+q.ps,x0+lw*q.ps/10*fr+4,y+4+rh*0.16,COL.blue,'10.5px system-ui,sans-serif'); cvText(ctx,'관성·각운동량 '+q.ar,x0+lw*q.ar/10*fr+4,y+4+rh*0.52,COL.ok,'10.5px system-ui,sans-serif'); });
    var q=SIT[S.s-1]; cvText(ctx,q.ql+' = '+(q.q(S.k)>=100?q.q(S.k).toFixed(0):q.q(S.k).toFixed(2)),12,h-14,COL.amber,'bold 12.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var q=SIT[S.s-1], pts=[], k, mx=0; for(k=1;k<=10;k++){ pts.push([k,q.q(k)]); mx=Math.max(mx,q.q(k)); }
    var P=makePlot(ctx,w,h,{xmin:1,xmax:10,ymin:0,ymax:mx*1.1,xlabel:'규모 단계 k  ('+q.lab+' = '+q.f(1)+' … '+q.f(10)+')',ylabel:q.ql.split(' ·')[0].split(' (')[0],title:q.n+' — 대표 값은 규모에 어떻게 변하나',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=100? v.toFixed(0): v.toFixed(1); }});
    plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,pts,COL.blue,3); plotPoints(ctx,P,[[S.k,q.q(S.k)]],COL.amber,7); }
});
