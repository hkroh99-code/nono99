/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ MRI : 스핀 세차(느린 애니메이션) + TR · TE 로 만드는 가중 영상 + T1 · T2 곡선
   모형 : S = PD (1−e^(−TR/T1)) e^(−TE/T2) · 1.5 T 어림 조직값(MRI_T). 검증 : TR 500 · TE 15 → 백색질 0.28 · CSF 0.12 · 지방 0.60 (지방이 가장 밝다)
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[5] = function(){ T5.init(); };
TabDraw[5] = function(){ T5.graph(); Anim.kick(5); };
var T5 = (function(){
  var tr=500, te=15, N=64, LB=makeHead(N), NZ=[], tb=null, DUR=10, i0;
  (function(){ var r=rng32(55); for(i0=0;i0<N*N;i0++) NZ.push(gaussR(r)); })();
  function sig(L){ return mriSignal(L,tr,te); }
  function hi(){ return 1.05*Math.max(sig(2),sig(3),sig(4),sig(5),sig(6),1e-4); }
  function kind(){ if(tr<=900&&te<=40) return 'T1 강조'; if(tr>=2000&&te>=80) return 'T2 강조'; if(tr>=2000&&te<=40) return '양성자밀도 강조'; return '혼합 대조'; }
  function readout(){
    setTxt('t5-trV',tr+' ms'); setTxt('t5-teV',te+' ms'); var f15=SUBJ.gamma*1.5, f3=SUBJ.gamma*3;
    setTxt('t5-oF',f15.toFixed(1)+' · '+f3.toFixed(1)+' MHz'); setTxt('t5-oG',sig(3).toFixed(2)+' · '+sig(4).toFixed(2)+' · '+sig(5).toFixed(2));
    setTxt('t5-oC',(100*(sig(3)-sig(4))/(sig(3)+sig(4))).toFixed(0)+' %'); setTxt('t5-oV',(100*(sig(6)-sig(4))/(sig(6)+sig(4))).toFixed(0)+' %'); setTxt('t5-oS',kind());
  }
  function spin(ctx,x0,y0,w,h,tm){
    var cx=x0+w/2, cy=y0+h/2+14, R=Math.min(w,h)*0.34, T1s=3.6, T2s=0.5, tau=tm-2.2, mz, mxy, ang, X, Y, Z;
    function P2(X,Y,Z){ return [cx+R*(X+0.45*Y), cy-R*(Z*0.95+0.22*Y)]; }
    ctx.strokeStyle=COL.ok; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx,cy+R*0.2); ctx.lineTo(cx,cy-R*1.25); ctx.stroke(); cvText(ctx,'B₀',cx+8,cy-R*1.25,COL.ok,'bold 12px system-ui,sans-serif');
    ctx.strokeStyle=COL.dim; ctx.setLineDash([3,3]); ctx.beginPath(); var a; for(a=0;a<=6.3;a+=0.2){ var p=P2(Math.cos(a),Math.sin(a),0); if(a===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]); } ctx.stroke(); ctx.setLineDash([]);
    if(tm<1.5){ mz=1; mxy=0; ang=0; } else if(tm<2.2){ var q=(tm-1.5)/0.7; mz=Math.cos(q*Math.PI/2); mxy=Math.sin(q*Math.PI/2); ang=q*6; } else { mz=1-Math.exp(-tau/T1s); mxy=Math.exp(-tau/T2s); ang=2.2*6/0.7*0+tau*Math.PI*4; }
    X=mxy*Math.cos(ang); Y=mxy*Math.sin(ang); Z=mz; var o=P2(0,0,0), e=P2(X,Y,Z);
    ctx.strokeStyle=COL.amber; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(o[0],o[1]); ctx.lineTo(e[0],e[1]); ctx.stroke(); ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(e[0],e[1],5,0,6.2832); ctx.fill();
    if(tm>=1.5&&tm<2.2){ cvText(ctx,'RF 펄스 → 눕는다',cx-R*1.2,cy-R*0.9,COL.grav,'bold 11.5px system-ui,sans-serif'); }
    cvText(ctx,'스핀 (수소 핵) — 라모어 세차',x0+w/2,y0+16,COL.text,'bold 12px system-ui,sans-serif','center');
    cvText(ctx,tm<1.5?'① B₀ 방향으로 정렬(평형)':(tm<2.2?'② RF 펄스로 90° 눕힘':'③ 세차하며 가로 신호 ↓(T₂) · 세로 ↑(T₁) — 시간을 늘려 보임'),x0+w/2,y0+h-12,COL.tick,'10.5px system-ui,sans-serif','center');
    cvText(ctx,'M_z '+mz.toFixed(2)+' · M_xy '+mxy.toFixed(2),x0+8,y0+h-30,COL.amber,'11px system-ui,sans-serif');
  }
  function draw(tm){
    var cv=document.getElementById('t5-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, wl=Math.floor(w*0.44), s=Math.max(60,Math.min(w-wl-24,h-50)), arr=new Float32Array(N*N), i, hh=hi();
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); spin(ctx,0,0,wl,h,tm);
    for(i=0;i<N*N;i++) arr[i]=mriSignal(LB[i],tr,te)+0.012*hh*NZ[i];
    var xx=wl+(w-wl-s)/2; drawHU(ctx,arr,N,xx,26,s,0,hh); cvText(ctx,kind()+' · TR '+tr+' / TE '+te+' ms',xx+s/2,16,COL.ok,'bold 12px system-ui,sans-serif','center');
    cvText(ctx,'검은 띠 = 두개골(신호 거의 없음) · 밝은 바깥 = 두피 지방',xx+s/2,h-14,COL.tick,'10px system-ui,sans-serif','center');
    readout(); cv.setAttribute('aria-label','MRI 영상 시뮬레이션. TR '+tr+' ms, TE '+te+' ms, '+kind());
  }
  function graph(){
    var cv=document.getElementById('t5-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, hh=Math.floor(h/2), i, T=[[4,'백색질',COL.blue],[3,'회색질',COL.ok],[5,'뇌척수액',COL.violet||'#a78bfa'],[2,'지방',COL.amber]];
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:4500,ymin:0,ymax:1.05,ylabel:'세로 자화 M_z/M₀',title:'T₁ 회복 (TR 에서 얼마나 회복했나)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(1); }}, function(P){
      T.forEach(function(t){ var pts=[]; for(i=0;i<=60;i++){ var x=4500*i/60; pts.push([x,1-Math.exp(-x/MRI_T[t[0]][1])]); } plotLine(ctx,P,pts,t[2],2); }); plotLine(ctx,P,[[tr,0],[tr,1.05]],COL.grav,1.6,[5,4]); cvText(ctx,'TR',P.X(tr)+4,P.y1+12,COL.grav,'bold 11px system-ui,sans-serif');
      legend(ctx,P.x1-100,P.y0-72,T.map(function(t){ return [t[1],t[2]]; })); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:250,ymin:0,ymax:1.05,xlabel:'시간 (ms)',ylabel:'신호 S (상대)',title:'T₂ 감소 (TE 에서 읽는 신호, 지금 TR 기준)',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(1); }}, function(P){
      T.forEach(function(t){ var pts=[], p=MRI_T[t[0]], m0=p[0]*(1-Math.exp(-tr/p[1])); for(i=0;i<=60;i++){ var x=250*i/60; pts.push([x,m0*Math.exp(-x/p[2])]); } plotLine(ctx,P,pts,t[2],2); });
      plotLine(ctx,P,[[te,0],[te,1.05]],COL.grav,1.6,[5,4]); cvText(ctx,'TE',P.X(te)+4,P.y1+12,COL.grav,'bold 11px system-ui,sans-serif'); });
  }
  function setup(){ readout(); if(!tb){ tb=buildTimeBar('t5-time',5,{dur:DUR,unit:'s',digits:1}); Anim.register(5,{dur:DUR,loop:true,autoplay:true,draw:function(tm){ draw(tm); },onTick:function(tm,p){ if(tb) tb.sync(tm,p); }}); } draw(Anim.time(5)); graph(); }
  function bind(){
    function on(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); setup(); }); }
    on('t5-tr',function(v){ tr=v; }); on('t5-te',function(v){ te=v; });
    [[500,15],[4000,100],[4000,15]].forEach(function(q,i){ document.getElementById('t5-p'+i).addEventListener('click',function(){ tr=q[0]; te=q[1]; document.getElementById('t5-tr').value=tr; document.getElementById('t5-te').value=te; setup(); }); });
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
