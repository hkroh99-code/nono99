/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 상황 도우미(베르누이 식이 얼마나 핵심인가 + 대표 값) + 타임라인
   검증(손계산) : 비행기 k=5 → v=50 m/s → L=½·1.2·50²·16·1.2=28.8 kN · 분무기 k=5 → v=15 → Δp=135 Pa
                 벤투리 k=5 → 면적비 6 → Δp=½·1000·1²·(36−1)=17.5 kPa · 태풍 k=8 → v=40 → q=960 Pa
   ─────────────────────────────────────────────────────────────────────────── */
var SIT=[
  {n:'비행기 이륙', ps:8, ar:8, lab:'속력 (m/s)',  f:function(k){ return 10*k; },   q:function(k){ return 0.5*1.2*Math.pow(10*k,2)*16*1.2/1000; }, ql:'양력 (kN) · 날개 16 m² · CL 1.2', k:'날개 위 · 아래의 압력 차이(베르누이)와 공기를 아래로 꺾는 반작용이 함께 양력을 만든다'},
  {n:'분무기', ps:9, ar:2, lab:'공기 속력 (m/s)', f:function(k){ return 3*k; }, q:function(k){ return 0.5*1.2*Math.pow(3*k,2); }, ql:'압력 감소 (Pa)', k:'빠른 공기 속의 낮은 압력이 액체를 빨아올린다 — 베르누이의 대표 응용'},
  {n:'수도관 벤투리', ps:10,ar:1, lab:'면적비 A₁/A₂', f:function(k){ return k+1; }, q:function(k){ return 0.5*1000*1*(Math.pow(k+1,2)-1)/1000; }, ql:'압력 강하 (kPa) · 입구 1 m/s', k:'좁은 목에서 속력 ↑ 압력 ↓ — 압력 차로 유량을 잰다'},
  {n:'야구 커브볼', ps:5, ar:8, lab:'회전수 (×300 rpm)', f:function(k){ return 300*k; }, q:function(k){ var S=(300*k*TAU/60)*0.0366/38, CL=Math.min(0.35,S), F=0.5*1.2*38*38*0.00421*CL, a=F/0.145, t=18.4/38; return 0.5*a*t*t*100; }, ql:'옆으로 휨 (cm) · 38 m/s 투구', k:'회전 때문에 양쪽 공기 속력이 달라진다(마그누스 효과) — 압력 차 + 공기 꺾임'},
  {n:'태풍과 지붕', ps:7, ar:5, lab:'풍속 (m/s)', f:function(k){ return 5*k; }, q:function(k){ return 0.5*1.2*Math.pow(5*k,2)/1000*100/9.8; }, ql:'지붕 1 m² 를 들어 올리는 힘 (kgf, 압력 감소 ½ρv² 가정)', k:'지붕 위 빠른 바람의 낮은 압력과 안쪽의 대기압 차이가 지붕을 들어 올린다'},
  {n:'피토관 속도계', ps:10,ar:1, lab:'속력 (m/s)', f:function(k){ return 20*k; }, q:function(k){ return 0.5*1.2*Math.pow(20*k,2)/1000; }, ql:'동압 (kPa) — 속도계가 읽는 압력', k:'정체점 압력과 정압의 차이 $\\tfrac12\\rho v^2$ 로 속도를 계산한다'}
];
TabInit[1] = function(){
  var tl=document.getElementById('t1-timeline'); if(tl && !tl.children.length){
    TIMELINE.forEach(function(t){ var d=document.createElement('button'); d.type='button'; d.className='tl-card';
      d.innerHTML='<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div><div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click',function(){ showTab(t.go); }); tl.appendChild(d); }); }
  T1.redraw();
};
var T1=mkTab(1,{ state:{s:1,k:5}, fmt:{s:function(v){ return SIT[v-1].n; }}, unit:{k:' 단계'},
  readout:function(S){ var q=SIT[S.s-1], v=q.q(S.k); setTxt('t1-oB', q.ps>=q.ar? '베르누이(압력 · 속도)' : '회전 · 운동량 효과'); setTxt('t1-oS',q.ps+' : '+q.ar); setTxt('t1-oN',q.lab+' = '+q.f(S.k)); setTxt('t1-oW',v>=100? v.toFixed(0):v.toFixed(1)); setTxt('t1-oC',q.ql); },
  anim:function(ctx,w,h,t,S){
    var fr=Math.min(1,t/2.2), x0=120, y0=46, rh=(h-90)/6;
    cvText(ctx,'상황별로 베르누이 식이 얼마나 핵심인가 (0 ~ 10)',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    SIT.forEach(function(q,i){ var y=y0+i*rh, sel=(i===S.s-1), lw=(w-x0-30)/2;
      cvText(ctx,q.n,x0-8,y+rh*0.4,sel?COL.amber:COL.tick,(sel?'bold ':'')+'12px system-ui,sans-serif','right');
      ctx.fillStyle=COL.blue; ctx.globalAlpha=sel?1:0.5; ctx.fillRect(x0,y+4,lw*q.ps/10*fr,rh*0.32); ctx.fillStyle=COL.ok; ctx.fillRect(x0,y+4+rh*0.36,lw*q.ar/10*fr,rh*0.32); ctx.globalAlpha=1;
      if(sel){ ctx.strokeStyle=COL.amber; ctx.lineWidth=2; ctx.strokeRect(2,y,w-4,rh); ctx.lineWidth=1; }
      cvText(ctx,'베르누이 '+q.ps,x0+lw*q.ps/10*fr+4,y+4+rh*0.16,COL.blue,'10.5px system-ui,sans-serif'); cvText(ctx,'다른 효과 '+q.ar,x0+lw*q.ar/10*fr+4,y+4+rh*0.52,COL.ok,'10.5px system-ui,sans-serif'); });
    var q=SIT[S.s-1]; cvText(ctx,q.ql+' = '+(q.q(S.k)>=100?q.q(S.k).toFixed(0):q.q(S.k).toFixed(1)),12,h-14,COL.amber,'bold 12.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var q=SIT[S.s-1], pts=[], k, mx=0; for(k=1;k<=10;k++){ pts.push([k,q.q(k)]); mx=Math.max(mx,q.q(k)); }
    var P=makePlot(ctx,w,h,{xmin:1,xmax:10,ymin:0,ymax:mx*1.1,xlabel:'규모 단계 k  ('+q.lab+' = '+q.f(1)+' … '+q.f(10)+')',ylabel:q.ql.split(' ·')[0].split(' (')[0],title:q.n+' — 대표 값은 규모에 어떻게 변하나',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v>=100? v.toFixed(0): v.toFixed(1); }});
    plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,pts,COL.blue,3); plotPoints(ctx,P,[[S.k,q.q(S.k)]],COL.amber,7); }
});
