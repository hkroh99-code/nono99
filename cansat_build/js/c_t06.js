/* ───────────────────────────────────────────────────────────────────────────
   TAB 6 — 원리⑤ 전력 · 충격 · 안전
   모형 : 일정 감속  a = v²/(2d),  t_s = 2d/v,  y(τ) = d(2τ − τ²)  (τ = 시간/정지시간).  m = 0.35 kg.
          전력 : 동작 시간 = 0.8·C / ΣI  (부하 평균 전류 : 컨트롤러 80 · GPS 25 · 센서 5 · LoRa 25 · 서보 60 · 카메라 150 mA)
          검증 : v=6, d=20 mm → 91.8 g, t_s = 6.67 ms ;  100 mA · 1000 mAh · 80 % → 8 h
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[6] = function(){ T6.init(); };
TabDraw[6] = function(){ T6.graph(); Anim.kick(6); };
var T6 = (function(){
  var v=6, dmm=20, C=1000, ON=[1,1,1,1,0,0], LOAD=[80,25,5,25,60,150], DUR=10, tb=null, GOAL=100;
  function aG(vv,dd){ return impactG(vv, dd/1000); }
  function curI(){ var s=0,i; for(i=0;i<LOAD.length;i++) if(ON[i]) s+=LOAD[i]; return s; }
  function readout(){
    var a=aG(v,dmm), I=curI(), E=0.5*SUBJ.canM*v*v;
    setTxt('t6-vV', v.toFixed(1)+' m/s'); setTxt('t6-dV', dmm+' mm'); setTxt('t6-cV', C+' mAh');
    setTxt('t6-oA', a.toFixed(0)+' g'); setTxt('t6-oT', (impactT(v,dmm/1000)*1000).toFixed(1)+' ms'); setTxt('t6-oE', E.toFixed(1)+' J');
    setTxt('t6-oJ', a<=GOAL? '✅ 목표 이내' : '⚠ 목표 초과'); setTxt('t6-oI', I+' mA'); setTxt('t6-oH', I>0? (0.8*C/I).toFixed(1)+' 시간' : '—');
  }
  function draw(t){
    var cv=document.getElementById('t6-cv'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, gy=H-34, sc=1.4, a=aG(v,dmm), ts=impactT(v,dmm/1000);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var wl=W-110; ctx.save(); ctx.beginPath(); ctx.rect(0,0,wl,H); ctx.clip();
    skyBg(ctx,wl,H,gy); groundBg(ctx,wl,H,gy);
    var foamH=dmm*sc, canH=100, cx=wl*0.45, tau=0, ycomp=0, phase='fall', canBottom;
    if(t<3){ canBottom=(gy-foamH)-90*(3-t)/3; }
    else { tau=Math.min(1,(t-3)/4); phase= tau<1?'impact':'stop'; ycomp=dmm*(2*tau-tau*tau); canBottom=gy-foamH+ycomp*sc; }
    var canTop=canBottom-canH;
    var fh=foamH-(phase==='fall'?0:ycomp*sc);
    ctx.fillStyle='rgba(251,191,36,.30)'; ctx.fillRect(cx-44,gy-fh,88,fh); ctx.strokeStyle=COL.amber; ctx.lineWidth=1.4; ctx.setLineDash([4,3]); ctx.strokeRect(cx-44,gy-fh,88,fh); ctx.setLineDash([]);
    drawCan(ctx,cx,canTop,canH);
    ctx.restore();
    /* 감속 화살표 */
    var inImp=(t>=3&&t<7), aShow=inImp? a : 0;
    if(inImp){ var L=Math.min(110, 20+Math.log10(1+a)*34); arrow2(ctx,cx-62,canBottom,cx-62,canBottom-L,COL.grav,3);
      ctx.fillStyle=COL.grav; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle'; ctx.fillText('a = '+a.toFixed(0)+' g', cx-70, canBottom-L/2); }
    /* 치수 d */
    ctx.strokeStyle=COL.hint; ctx.lineWidth=1; ctx.fillStyle=COL.tick; ctx.font='10.5px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.beginPath(); ctx.moveTo(cx+56,gy-foamH); ctx.lineTo(cx+56,gy); ctx.stroke(); ctx.fillText('d = '+dmm+' mm', cx+62, gy-foamH/2);
    /* g 막대 */
    var bx=W-70, bw=26, by0=40, by1=gy-8, gm=Math.max(a*1.15, 150);
    ctx.fillStyle='rgba(120,150,190,.18)'; ctx.fillRect(bx,by0,bw,by1-by0); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bx,by0,bw,by1-by0);
    var hh=(by1-by0)*Math.min(1,aShow/gm); ctx.fillStyle= aShow>GOAL? COL.grav : COL.ok; ctx.fillRect(bx,by1-hh,bw,hh);
    var yg=by1-(by1-by0)*GOAL/gm; ctx.strokeStyle=COL.grav; ctx.setLineDash([4,3]); ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(bx-8,yg); ctx.lineTo(bx+bw+8,yg); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.tick; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText('가속도 (g)', bx+bw/2, by0-6); ctx.fillStyle=COL.grav; ctx.textBaseline='bottom'; ctx.fillText('100 g', bx+bw/2, yg-3);
    ctx.fillStyle=COL.text; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    var tphys=(t<3?0:Math.min(1,(t-3)/4))*ts*1000;
    ctx.fillText(t<3? '접근 중 · 속도 '+v.toFixed(1)+' m/s' : (tau<1? '충격 (느리게 보기) · 실제 시간 '+tphys.toFixed(1)+' ms / '+(ts*1000).toFixed(1)+' ms · 속도 '+(v*(1-tau)).toFixed(1)+' m/s' : '정지 — 평균 충격 '+a.toFixed(0)+' g'), 12, 10, wl-20);
    ctx.fillStyle=COL.tick; ctx.font='10.5px system-ui,sans-serif'; ctx.fillText('(그림의 완충재 두께 d 는 같은 비율, 캔은 표시용 크기)', 12, 28);
    readout();
    cv.setAttribute('aria-label','착지 충격. 착지 속도 '+v.toFixed(1)+' 미터 매 초, 완충 '+dmm+' 밀리미터, 평균 충격 '+a.toFixed(0)+' g');
  }
  function graph(){
    var cv=document.getElementById('t6-cv2'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, hh=Math.floor(H*0.47), a=aG(v,dmm), ts=impactT(v,dmm/1000)*1000, i, t=Anim.time(6);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var tmax=Math.max(ts*1.6,5), amax=Math.max(Math.ceil(a*1.3/50)*50,150), tp=(t<3?0:Math.min(1,(t-3)/4))*ts;
    subPlot(ctx,0,0,W,hh,{xmin:0,xmax:tmax,ymin:0,ymax:amax,ylabel:'가속도 (g)',title:'충격 가속도 a(t) — 일정 감속 모형',left:56,top:24,bottom:40,xlabel:'시간 (ms)',xfmt:function(q){ return q.toFixed(q<10?1:0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var L=[[0,0],[0,a],[ts,a],[ts,0],[tmax,0]]; plotLine(ctx,P,L,COL.grav,2.4);
      ctx.save(); ctx.fillStyle='rgba(251,113,133,.15)'; ctx.beginPath(); ctx.moveTo(P.X(0),P.Y(0)); ctx.lineTo(P.X(0),P.Y(a)); ctx.lineTo(P.X(ts),P.Y(a)); ctx.lineTo(P.X(ts),P.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      plotLine(ctx,P,[[tp,0],[tp,amax]],COL.ok,1.4); plotLine(ctx,P,[[0,GOAL],[tmax,GOAL]],COL.amber,1.2,[5,4]);
    });
    subPlot(ctx,0,hh,W,H-hh,{xmin:0,xmax:60,ymin:1,ymax:10000,ylog:true,xlabel:'완충 두께 d (mm)',ylabel:'평균 충격 (g)',title:'충격 대 완충 두께',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); }}, function(P){
      var A=[],B=[]; for(i=1;i<=120;i++){ var d=60*i/120; A.push([d,aG(v,d)]); B.push([d,aG(v/2,d)]); }
      plotLine(ctx,P,B,COL.dim,1.4,[4,3]); plotLine(ctx,P,A,COL.amber,2.2); plotLine(ctx,P,[[0,GOAL],[60,GOAL]],COL.grav,1.4,[6,4]);
      plotPoints(ctx,P,[[dmm,a]],COL.ok,6);
      legend(ctx,P.x1-170,P.y1+14,[['지금 착지 속도 '+v.toFixed(1)+' m/s',COL.amber],['½ 속도',COL.dim],['목표 100 g',COL.grav]]);
    });
    cv.setAttribute('aria-label','충격 가속도와 완충 두께 그래프');
  }
  function setup(){
    readout();
    if(!tb){ tb=buildTimeBar('t6-time', 6, {dur:DUR, unit:'s', digits:1}); Anim.register(6,{dur:DUR, loop:false, autoplay:true, draw:function(t){ draw(t); graph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }}); }
    Anim.reset(6); Anim.play(6); draw(0); graph();
  }
  function bind(){
    function on(id, fn){ document.getElementById(id).addEventListener('input', function(){ fn(+this.value); setup(); }); }
    on('t6-v', function(q){ v=q; }); on('t6-d', function(q){ dmm=q; }); on('t6-c', function(q){ C=q; });
    for(var k=0;k<6;k++){ (function(j){ document.getElementById('t6-l'+j).addEventListener('change', function(){ ON[j]=this.checked?1:0; readout(); }); })(k); }
    document.getElementById('t6-go').addEventListener('click', function(){ Anim.reset(6); Anim.play(6); });
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
