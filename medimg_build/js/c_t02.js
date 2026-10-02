/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① X선 감약 : 광자 시뮬레이션 + μ(E) · 대조도 그래프
   모형 : 단색 X선, 평행 빔. 연조직(근육) μ(E) · 뼈 μ(E) = muE().  뼈는 연조직 두께의 일부(x_b)를 「바꾼」 것으로 계산.
   검증(손계산) : E=60, x_s=12, x_b=1.5 → T_s=0.079, T_b/T_s=exp(−(0.570−0.212)·1.5)=0.585, C=0.41
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[2] = function(){ T2.init(); };
TabDraw[2] = function(){ T2.graph(); Anim.kick(2); };
var T2 = (function(){
  var E=60, xs=12, xb=1.5, tb=null, DUR=10, NP=40, RS=[], RB=[], i0;
  (function(){ var r=rng32(2024); for(i0=0;i0<NP*3;i0++){ RS.push(1-r()); RB.push(1-r()); } })();
  function mus(e){ return muE('muscle',e); } function mub(e){ return muE('bone',e); }
  function Ts(e){ return Math.exp(-mus(e)*xs); }
  function Tb(e){ return Math.exp(-mus(e)*(xs-xb)-mub(e)*xb); }
  function Cc(e){ return 1-Tb(e)/Ts(e); }
  function readout(){
    setTxt('t2-eV',E+' keV'); setTxt('t2-xsV',xs+' cm'); setTxt('t2-xbV',xb.toFixed(2)+' cm');
    setTxt('t2-oS',(Ts(E)*100).toFixed(1)+' %'); setTxt('t2-oB',(Tb(E)*100).toFixed(1)+' %'); setTxt('t2-oC',Cc(E).toFixed(2));
    setTxt('t2-oH',(Math.LN2/mus(E)).toFixed(2)+' cm'); setTxt('t2-oD',(Ts(60)/Ts(E)).toFixed(2)+' 배 (60 keV = 1)');
  }
  function draw(t){
    var cv=document.getElementById('t2-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var wl=Math.min(w*0.64,w-170), top=40, y0=top+46, y1=h-96, sx=wl/2, bx=[wl*0.28, wl*0.72], slabH=y1-y0, pxcm=slabH/Math.max(xs,1);
    /* 선원 */
    var k, j;
    ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(wl/2,top+4,6,0,6.2832); ctx.fill(); cvText(ctx,'X선 선원',wl/2+12,top+4,COL.amber,'11px system-ui,sans-serif');
    /* 조직 띠(연조직) + 뼈 */
    ctx.fillStyle='rgba(251,113,133,.14)'; ctx.fillRect(10,y0,wl-20,slabH); ctx.strokeStyle=COL.dim; ctx.strokeRect(10,y0,wl-20,slabH);
    var bh=Math.min(slabH-6, xb*pxcm), by=y0+(slabH-bh)/2; if(xb>0){ ctx.fillStyle='rgba(226,232,240,.85)'; ctx.fillRect(bx[1]-34,by,68,bh); cvText(ctx,'뼈 '+xb.toFixed(1)+' cm',bx[1]+40,by+bh/2,COL.white,'11px system-ui,sans-serif'); }
    cvText(ctx,'연조직 '+xs+' cm',14,y0-8,COL.mut||COL.tick,'11px system-ui,sans-serif');
    /* 광자 : 연속 흐름 (각 광자는 1.6 s 주기로 선원에서 검출기까지). 흡수된 광자는 흡수된 깊이에 붉은 점으로 남는다 */
    function depthOf(k,tau){            // tau = 광학 깊이 → 흡수 깊이(cm), 통과하면 -1
      var ms=mus(E), mb=mub(E);
      if(k===0) return tau<ms*xs? tau/ms : -1;
      var a2=(xs-xb)/2, t1=ms*a2, t2=t1+mb*xb, t3=t2+ms*a2;
      if(tau<t1) return tau/ms; if(tau<t2) return a2+(tau-t1)/mb; if(tau<t3) return a2+xb+(tau-t2)/ms; return -1; }
    for(k=0;k<2;k++){ for(j=0;j<NP;j++){
      var ph=t/1.6+j/NP, cyc=Math.floor(ph), p=ph-cyc, tau=-Math.log((k===0?RS:RB)[j+NP*(((cyc%3)+3)%3)]), py=top+10+(y1+60-(top+10))*p, dep=depthOf(k,tau), xx=bx[k]+((j*5)%7-3)*9;
      if(dep>=0){ var ya=y0+dep/xs*slabH; if(py>=ya){ ctx.fillStyle='rgba(251,113,133,.85)'; ctx.fillRect(xx-1.5,ya-1.5,3,3); continue; } }
      ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(xx,py,2.4,0,6.2832); ctx.fill(); } }
    /* 검출기 */
    var dy=y1+66; ctx.fillStyle=COL.cvbg2||'#0f172a'; ctx.fillRect(10,dy,wl-20,12); ctx.strokeStyle=COL.dim; ctx.strokeRect(10,dy,wl-20,12);
    [Ts(E),Tb(E)].forEach(function(v,q){ var g=Math.round(255*Math.min(1,v/Math.max(Ts(E),1e-9)*0.9)); ctx.fillStyle='rgb('+g+','+g+','+g+')'; ctx.fillRect(bx[q]-30,dy+1,60,10); });
    cvText(ctx,'검출기(밝을수록 많이 도달)',wl/2,dy+26,COL.tick,'10.5px system-ui,sans-serif','center');
    /* 오른쪽 : 신호 막대 */
    var x0=wl+16, bw=Math.max(30,(w-wl-52)/2), fh=h-top-96, maxv=Math.max(Ts(E),1e-4);
    cvText(ctx,'도달 신호(상대)',x0,top+fh+42,COL.text,'bold 11.5px system-ui,sans-serif');
    [[Ts(E),COL.ok,'살 뒤'],[Tb(E),COL.grav,'뼈 뒤']].forEach(function(q,m){ var bxx=x0+m*(bw+14), hh=fh*q[0]/maxv; ctx.fillStyle=q[1]; ctx.fillRect(bxx,top+fh-hh,bw,hh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bxx,top,bw,fh); ctx.fillStyle=COL.text; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText((q[0]*100).toFixed(1)+' %',bxx+bw/2,top+fh-hh-3); ctx.textBaseline='top'; ctx.fillStyle=COL.tick; ctx.fillText(q[2],bxx+bw/2,top+fh+4); });
    cvText(ctx,'대조도 C = '+Cc(E).toFixed(2),x0,top+fh+26,COL.amber,'bold 12px system-ui,sans-serif');
    cvText(ctx,'E '+E+' keV · I = I₀ e^(−μx)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cv.setAttribute('aria-label','X선 광자 시뮬레이션. 에너지 '+E+' 킬로전자볼트, 연조직 통과 비율 '+(Ts(E)*100).toFixed(1)+' 퍼센트, 뼈 포함 '+(Tb(E)*100).toFixed(1)+' 퍼센트');
    readout();
  }
  function graph(){
    var cv=document.getElementById('t2-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, hh=Math.floor(h/2), i, es=[];
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); for(i=0;i<=45;i++) es.push(30+i*2);
    subPlot(ctx,0,0,w,hh,{xmin:30,xmax:120,ymin:0.05,ymax:5,ylog:true,ylabel:'μ (cm⁻¹)',title:'선감약계수 μ(E)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q>=1? q.toFixed(0) : q.toFixed(1); }}, function(P){
      plotLine(ctx,P,es.map(function(e){ return [e,mub(e)]; }),COL.grav,2.2); plotLine(ctx,P,es.map(function(e){ return [e,mus(e)]; }),COL.ok,2.2); plotLine(ctx,P,[[E,0.05],[E,5]],COL.amber,1.5);
      legend(ctx,P.x1-120,P.y1+14,[['뼈',COL.grav],['연조직',COL.ok],['지금 E',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:30,xmax:120,ymin:0,ymax:1,xlabel:'X선 에너지 E (keV)',ylabel:'대조도 C',title:'뼈 · 살 대조도 C(E) (지금 두께)',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(1); }}, function(P){
      plotLine(ctx,P,es.map(function(e){ return [e,Cc(e)]; }),COL.blue,2.2); plotLine(ctx,P,[[E,0],[E,1]],COL.amber,1.5); plotPoints(ctx,P,[[E,Cc(E)]],COL.amber,6); });
    cv.setAttribute('aria-label','감약계수와 대조도의 에너지 의존 그래프');
  }
  function setup(){ readout(); if(!tb){ tb=buildTimeBar('t2-time',2,{dur:DUR,unit:'s',digits:1}); Anim.register(2,{dur:DUR,loop:true,autoplay:true,draw:function(t){ draw(t); },onTick:function(t,p){ if(tb) tb.sync(t,p); }}); } draw(Anim.time(2)); graph(); }
  function bind(){
    function on(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); setup(); }); }
    on('t2-e',function(v){ E=v; }); on('t2-xs',function(v){ xs=v; if(xb>xs) xb=xs; }); on('t2-xb',function(v){ xb=Math.min(v,xs); });
  }
  return { init:function(){ bind(); setup(); Anim.play(2); }, graph:graph };
})();
