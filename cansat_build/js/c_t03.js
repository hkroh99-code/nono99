/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② 대기 : 기압 · 고도 · 온도 (기압 고도계)
   모형 : P(h) = P_w (1 − L h / T_g)^5.256 (T_g 지상 기온 K, L = 6.5 K/km) + 정규 잡음 σ.
          고도 계산 h_est = 44330.77 [1 − (P/P_ref)^0.19026] (표준 기온 가정).  P_ref = 보정 ON : 방출 직전 지상 기압(10 개 평균) · OFF : 1013.25 hPa
          검증(손계산) : T_g=35 ℃ , h=3000 m → h_est = 2805 m (오차 −195 m) · P_w=1030, 보정 OFF → 지상 −139 m
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[3] = function(){ T3.init(); };
TabDraw[3] = function(){ T3.graph(); Anim.kick(3); };
var T3 = (function(){
  var H=2000, Pw=1013, Tg=15, sig=0.3, cal=true, seed=1, N=121, DT=0.25, DUR=30, A=null, tb=null;
  function recompute(){
    var rg=rng32(seed*7919+13), TgK=Tg+273.15, Pref=cal? Pw+sig*gaussR(rg)/Math.sqrt(10) : 1013.25, i;
    A={h:[],P:[],Pt:[],E:[],T:[],err:[],Pref:Pref};
    for(i=0;i<N;i++){
      var t=i*DT, h=H*(1-t/DUR), Pt=Pw*Math.pow(1-SUBJ.lapse*h/TgK, 5.25588), Pm=Pt+sig*gaussR(rng32(seed*104729+i*31+5));
      var he=baroAlt(Pm*100, Pref*100);
      A.h.push(h); A.Pt.push(Pt); A.P.push(Pm); A.E.push(he); A.T.push(Tg-6.5*h/1000); A.err.push(he-h);
    }
  }
  function trueP(h){ return Pw*Math.pow(1-SUBJ.lapse*h/(Tg+273.15), 5.25588); }
  function readout(t){
    var i=Math.min(N-1, Math.floor(t/DT)), h=H*(1-Math.min(t,DUR)/DUR);
    var TK=A.T[i]+273.15, rho=A.P[i]*100/(287.05*TK);
    setTxt('t3-hV', H+' m'); setTxt('t3-pV', Pw.toFixed(0)+' hPa'); setTxt('t3-tV', Tg+' ℃'); setTxt('t3-sV', sig.toFixed(2)+' hPa');
    setTxt('t3-oH', h.toFixed(0)+' m'); setTxt('t3-oP', A.P[i].toFixed(1)+' hPa'); setTxt('t3-oE', A.E[i].toFixed(0)+' m');
    setTxt('t3-oD', (A.err[i]>=0?'+':'')+A.err[i].toFixed(0)+' m'); setTxt('t3-oT', A.T[i].toFixed(1)+' ℃'); setTxt('t3-oR', (100/(rho*SUBJ.g)).toFixed(1)+' m');
  }
  function draw(t){
    var cv=document.getElementById('t3-cv'); if(!cv || !A) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, tt=Math.min(t,DUR), i=Math.min(N-1, Math.floor(tt/DT));
    var hh=H*(1-tt/DUR), top=30, gy=h-52;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var wl=w*0.34; ctx.save(); ctx.beginPath(); ctx.rect(0,0,wl,h); ctx.clip(); skyBg(ctx,wl,h,gy); groundBg(ctx,wl,h,gy);
    var sc=(gy-top-14)/H, st=niceStep(H,5), k;
    ctx.strokeStyle=COL.axis; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.lineWidth=1;
    for(k=0;k<=H;k+=st){ var yy=gy-k*sc; ctx.beginPath(); ctx.moveTo(40,yy); ctx.lineTo(48,yy); ctx.stroke(); ctx.fillText(k>=1000? (k/1000).toFixed(k%1000?1:0)+' km' : k+' m',2,yy); }
    ctx.beginPath(); ctx.moveTo(48,gy); ctx.lineTo(48,gy-H*sc); ctx.stroke();
    var cx=wl*0.62, y=gy-hh*sc-18; drawCan(ctx,cx,y,18);
    var ye=gy-Math.max(-60,Math.min(H*1.1,A.E[i]))*sc;                       // 고도계가 말하는 높이(가는 선)
    ctx.strokeStyle= Math.abs(A.err[i])<0.03*Math.max(H,200)? COL.ok : COL.grav; ctx.lineWidth=1.6; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(52,ye); ctx.lineTo(wl-6,ye); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=ctx.strokeStyle; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='right'; ctx.fillText('고도계', wl-8, ye-8);
    ctx.restore();
    /* 기압계 다이얼 */
    var gx=w*0.62, gcy=h*0.47, R=Math.min(w*0.2, h*0.33), a0=135, span=270, P=A.P[i];
    function ang(Pv){ return (a0+span*Math.max(0,Math.min(1,(Pv-400)/700)))*Math.PI/180; }
    ctx.lineWidth=10; ctx.strokeStyle=COL.glass; ctx.beginPath(); ctx.arc(gx,gcy,R,a0*Math.PI/180,(a0+span)*Math.PI/180); ctx.stroke();
    ctx.lineWidth=10; ctx.strokeStyle='rgba(56,189,248,.55)'; ctx.beginPath(); ctx.arc(gx,gcy,R,a0*Math.PI/180,ang(P)); ctx.stroke();
    ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    for(k=400;k<=1100;k+=100){ var a=ang(k), x1=gx+(R-14)*Math.cos(a), y1=gcy+(R-14)*Math.sin(a), x2=gx+(R-22)*Math.cos(a), y2=gcy+(R-22)*Math.sin(a), x3=gx+(R-36)*Math.cos(a), y3=gcy+(R-36)*Math.sin(a);
      ctx.strokeStyle=COL.axis2; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.fillStyle=COL.tick; ctx.fillText(k, x3, y3); }
    var an=ang(P); ctx.strokeStyle=COL.amber; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(gx,gcy); ctx.lineTo(gx+(R-16)*Math.cos(an), gcy+(R-16)*Math.sin(an)); ctx.stroke();
    cvCirc(ctx,gx,gcy,5,COL.amber,COL.dev,1);
    ctx.fillStyle=COL.text; ctx.font='bold 14px system-ui,sans-serif'; ctx.textBaseline='top'; ctx.fillText(P.toFixed(1)+' hPa', gx, gcy+R*0.42);
    ctx.fillStyle=COL.tick; ctx.font='10.5px system-ui,sans-serif'; ctx.fillText('기압계', gx, gcy+R*0.42+20);
    /* 온도계 */
    var tx=w-38, ty0=50, ty1=h-70, frac=Math.max(0,Math.min(1,(A.T[i]+40)/80));
    ctx.fillStyle='rgba(120,150,190,.18)'; ctx.fillRect(tx-7,ty0,14,ty1-ty0); ctx.strokeStyle=COL.axis2; ctx.lineWidth=1.2; ctx.strokeRect(tx-7,ty0,14,ty1-ty0);
    ctx.fillStyle= A.T[i]>0? COL.grav : COL.norm; ctx.fillRect(tx-7, ty1-(ty1-ty0)*frac, 14, (ty1-ty0)*frac);
    cvCirc(ctx,tx,ty1+8,12,A.T[i]>0? COL.grav : COL.norm,COL.axis2,1.2);
    ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
    [-40,-20,0,20,40].forEach(function(v){ var yy=ty1-(ty1-ty0)*(v+40)/80; ctx.fillText(v, tx-11, yy); });
    ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillStyle=COL.text; ctx.font='bold 12px system-ui,sans-serif'; ctx.fillText(A.T[i].toFixed(1)+' ℃', tx, ty1+24);
    ctx.fillStyle=COL.tick; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='bottom';
    ctx.fillText('참 높이 '+hh.toFixed(0)+' m · 고도계 '+A.E[i].toFixed(0)+' m ('+(A.err[i]>=0?'+':'')+A.err[i].toFixed(0)+' m)'+(cal?' · P₀ 보정 ON':' · P₀ 보정 OFF (1013.25)'), 6, h-6, w-12);
    readout(t);
    cv.setAttribute('aria-label','기압 고도계. 참 높이 '+hh.toFixed(0)+' 미터, 고도계 표시 '+A.E[i].toFixed(0)+' 미터');
  }
  function graph(){
    var cv=document.getElementById('t3-cv2'); if(!cv || !A) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, tt=Math.min(Anim.time(3),DUR), i, hh=Math.floor(h*0.52), now=Math.min(N-1,Math.floor(tt/DT));
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var pLo=Math.floor(trueP(H)/20)*20-20, pHi=Math.ceil(Pw/20)*20+20;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:H,ymin:pLo,ymax:pHi,ylabel:'기압 P (hPa)',title:'높이에 따른 기압 (곡선 = 참, 점 = 측정)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var L=[], q; for(q=0;q<=60;q++){ var hq=H*q/60; L.push([hq, trueP(hq)]); }
      plotLine(ctx,P,L,COL.amber,2);
      var pts=[]; for(i=0;i<=now;i++) pts.push([A.h[i],A.P[i]]); plotPoints(ctx,P,pts,COL.blue,2.6);
      plotPoints(ctx,P,[[A.h[now],A.P[now]]],COL.ok,5.5);
      legend(ctx,P.x1-122,P.y1+14,[['참(표준 모형)',COL.amber],['측정 점',COL.blue]]);
    });
    var emax=20; for(i=0;i<N;i++){ var ea=Math.abs(A.err[i]); if(ea>emax) emax=ea; } emax=Math.ceil(emax*1.1/10)*10;
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:H,ymin:-emax,ymax:emax,xlabel:'참 높이 h (m)',ylabel:'고도 오차 (m)',title:'고도 계산 오차 = 고도계 − 참',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,0],[H,0]],COL.axis2,1,[2,3]);
      var pts=[]; for(i=0;i<=now;i++) pts.push([A.h[i],A.err[i]]); plotPoints(ctx,P,pts,COL.grav,2.6);
      plotPoints(ctx,P,[[A.h[now],A.err[now]]],COL.ok,5.5);
    });
    cv.setAttribute('aria-label','기압 대 높이 그래프와 고도 오차 그래프');
  }
  function setup(){
    recompute(); readout(0);
    tb=buildTimeBar('t3-time', 3, {dur:DUR, unit:'s', digits:1});
    Anim.register(3,{dur:DUR, loop:true, autoplay:true, draw:function(t){ draw(t); graph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
    draw(0); graph();
  }
  function bind(){
    function on(id, fn){ document.getElementById(id).addEventListener('input', function(){ fn(+this.value); setup(); }); }
    on('t3-h', function(v){ H=v; }); on('t3-p', function(v){ Pw=v; }); on('t3-t', function(v){ Tg=v; }); on('t3-s', function(v){ sig=v; });
    document.getElementById('t3-cal').addEventListener('change', function(){ cal=this.checked; setup(); });
    document.getElementById('t3-new').addEventListener('click', function(){ seed++; setup(); });
    document.getElementById('t3-def').addEventListener('click', function(){ H=2000; Pw=1013; Tg=15; sig=0.3; cal=true;
      document.getElementById('t3-h').value=H; document.getElementById('t3-p').value=Pw; document.getElementById('t3-t').value=Tg; document.getElementById('t3-s').value=sig; document.getElementById('t3-cal').checked=true; setup(); });
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
