/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 3D 캔위성 방출 → 낙하산 → 착륙 (바람에 떠내려감)
   모형 : descend() — 캔(CdA 0.0034 m²) + 반구형 낙하산(Cd 1.5), 표준대기 밀도, 바람 w 속에서 공기에 대한 상대속도의 제곱 항력.
          방출 1 s 뒤 낙하산이 1.2 s 동안 펼쳐짐. 검증(손계산) : D=0.4 m → v_t = 5.40 m/s, 낙하산 없음 → 40 m/s.
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[1] = function(){
  var tl = document.getElementById('t1-timeline'); if(tl){
    TIMELINE.forEach(function(t){
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'tl-card';
      d.innerHTML = '<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div>'
                  + '<div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click', function(){ showTab(t.go); });
      tl.appendChild(d);
    });
  }
  T1.init();
};
TabDraw[1] = function(){ T1.graph(); Anim.kick(1); };
var T1 = (function(){
  var h0=300, D=0.4, wind=3, DESC=null, sc=null, tb=null, DUR=60, EXT=300, BOX=[[-60,0,-80],[60,300,80]], VT=5.4;
  var HOME={yaw:-0.62, pitch:0.52}, TRAIL=null;
  function recompute(){
    DESC=descend({h0:h0, m:SUBJ.canM, D:D, wind:wind});
    VT=vTermAt(SUBJ.canM, dragArea(D), 0);
    DUR=Math.min(170, Math.ceil(DESC.T)+4);
    var drift=DESC.dx; EXT=Math.max(h0, Math.abs(drift)*0.9, 120);
    var xa=Math.min(0,drift)-0.14*EXT, xb=Math.max(0,drift)+0.14*EXT;
    BOX=[[xa,0,-0.28*EXT],[xb,h0*1.04,0.28*EXT]];
    if(sc) sc._fit=null;
  }
  function readout(){
    var pk=0, i; for(i=0;i<DESC.a.length;i+=2) if(DESC.a[i]>pk) pk=DESC.a[i];
    setTxt('t1-hV', h0+' m'); setTxt('t1-dV', D>0? (D*100).toFixed(0)+' cm' : '펴지 않음'); setTxt('t1-wV', wind.toFixed(1)+' m/s');
    setTxt('t1-oV', VT.toFixed(1)+' m/s'); setTxt('t1-oT', DESC.T.toFixed(1)+' s');
    setTxt('t1-oX', Math.abs(DESC.dx).toFixed(0)+' m'); setTxt('t1-oA', pk.toFixed(1)+' g');
    setTxt('t1-oE', (0.5*SUBJ.canM*DESC.vland*DESC.vland).toFixed(1)+' J');
  }
  function lineFrom(P, a, b, col, w, dash, ctx){
    var p=P(a[0],a[1],a[2]), q=P(b[0],b[1],b[2]); ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w||1; if(dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.restore();
  }
  function draw(t){
    var cv=document.getElementById('t1-cv'); if(!cv || !DESC) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, hh=s0.h, nw=narrow3(w);
    if(!sc) sc=mk3(cv, function(){ draw(Anim.time(1)); }, HOME);
    var P=fitP(sc,w,hh,BOX,{fw:0.9,fh:0.78,by:8});
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,hh);
    var cur=descAt(DESC, Math.min(t, DESC.T-0.02)), landed=t>=DESC.T-0.02;
    /* 바닥 격자 */
    var gx0=BOX[0][0], gx1=BOX[1][0], gz=BOX[1][2], st=niceStep((gx1-gx0), 7), x;
    ctx.strokeStyle='rgba(120,150,190,.22)'; ctx.lineWidth=1;
    for(x=Math.ceil(gx0/st)*st; x<=gx1; x+=st) lineFrom(P,[x,0,-gz],[x,0,gz],ctx.strokeStyle,1,null,ctx);
    for(var z=-Math.floor(gz/st)*st; z<=gz; z+=st) lineFrom(P,[gx0,0,z],[gx1,0,z],ctx.strokeStyle,1,null,ctx);
    /* 목표 X · 방출 지점 연직선 */
    lineFrom(P,[-EXT*0.04,0,-EXT*0.04],[EXT*0.04,0,EXT*0.04],COL.grav,2.4,null,ctx);
    lineFrom(P,[-EXT*0.04,0,EXT*0.04],[EXT*0.04,0,-EXT*0.04],COL.grav,2.4,null,ctx);
    lineFrom(P,[0,0,0],[0,h0,0],COL.dim,1,[3,4],ctx);
    var pt=P(0,h0,0); pxDot(ctx,pt,3.5,COL.dim,1);
    /* 지나온 경로 */
    var n=cur.i, k, step=Math.max(1,Math.floor(n/260)), pts=[];
    for(k=0;k<=n;k+=step) pts.push([DESC.x[k],DESC.h[k],0]);
    pts.push([cur.x,cur.h,0]);
    sc.path3(ctx,P,pts,COL.blue,2);
    /* 캔 + 낙하산 */
    var s=t<1?0:Math.min(1,(t-1)/1.2); s=s*s*(3-2*s);
    var L=0.07*EXT, R=0.07*EXT*(D/0.6)*(0.25+0.75*s);
    if(D>0){
      var yr=cur.h+L, yc=yr+R*0.35, a, rim=[], crown=[];
      for(a=0;a<4;a++){ var th=a*1.5708+0.3; rim.push([cur.x+R*Math.cos(th), yr, R*Math.sin(th)]); crown.push([cur.x+0.45*R*Math.cos(th), yc, 0.45*R*Math.sin(th)]); }
      for(a=0;a<4;a++){ sc.line3(ctx,P,[cur.x,cur.h,0],rim[a],COL.dim,0.9); sc.line3(ctx,P,rim[a],crown[a],COL.grav,1.2); }
      diskW(sc,ctx,P,[cur.x,0,0],yr,R,'y',COL.grav,1.6,'rgba(251,113,133,.16)');
      diskW(sc,ctx,P,[cur.x,0,0],yc,0.45*R,'y',COL.grav,1.4,'rgba(251,113,133,.30)');
    }
    ball(sc,ctx,P,cur.x,cur.h,0,0.016*EXT,COL.amber,true);
    var pc=P(cur.x,cur.h,0);
    /* 바람 화살표 · 라벨 */
    if(wind>0){ var a0=P(BOX[0][0]+0.05*EXT, h0*0.96, -BOX[1][2]*0.6), a1=P(BOX[0][0]+0.05*EXT+0.18*EXT*Math.min(1,wind/8)+0.05*EXT, h0*0.96, -BOX[1][2]*0.6); arrow2(ctx,a0.x,a0.y,a1.x,a1.y,COL.light,2.2); if(!nw) lbl(ctx,'바람 '+wind.toFixed(1)+' m/s',(a0.x+a1.x)/2,a0.y-12,COL.light,{font:'10.5px system-ui,sans-serif'}); }
    var lx=P(0,0,EXT*0.06); if(!nw) lbl(ctx,'목표 X',lx.x,lx.y+12,COL.grav,{font:'10.5px system-ui,sans-serif'});
    if(landed){ var pl=P(cur.x,0,0); lbl(ctx,'착륙 · 목표에서 '+Math.abs(DESC.dx).toFixed(0)+' m',pl.x,pl.y+16,COL.ok,{font:'bold 11px system-ui,sans-serif'}); }
    hudT(ctx,w,hh,[
      {t:'t = '+Math.min(t,DESC.T).toFixed(1)+' s · 고도 '+Math.max(0,cur.h).toFixed(0)+' m · 낙하 속도 '+(-cur.vy).toFixed(1)+' m/s', b:true, c:COL.text},
      {t: landed? '착륙! 충격 속력 '+DESC.vland.toFixed(1)+' m/s, 에너지 '+(0.5*SUBJ.canM*DESC.vland*DESC.vland).toFixed(1)+' J' : (t<1?'방출 — 아직 낙하산이 닫혀 있다':(s<1?'낙하산이 펼쳐지는 중 …':'종단속도에 가까워지는 중 …')), c: landed? COL.ok : COL.tick}
    ]);
    hint3(ctx,w,hh);
    cv.setAttribute('aria-label','3차원 캔위성 낙하. 고도 '+Math.max(0,cur.h).toFixed(0)+' 미터, 낙하 속도 '+(-cur.vy).toFixed(1)+' 미터 매 초');
  }
  function graph(){
    var cv=document.getElementById('t1-cv2'); if(!cv || !DESC) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, hh=s0.h, vmax=0, i, step=Math.max(1,Math.floor(DESC.t.length/500));
    for(i=0;i<DESC.t.length;i+=step){ var v=-DESC.vy[i]; if(v>vmax) vmax=v; }
    vmax=Math.max(Math.ceil(vmax*1.12/5)*5, 10);
    var Pp=makePlot(ctx,w,hh,{xmin:0,xmax:Math.ceil(DESC.T),ymin:0,ymax:vmax,xlabel:'시간 t (s)',ylabel:'낙하 속도 (m/s)',title:'수직 낙하 속도 v(t) 와 고도',left:50,xfmt:function(v2){ return v2.toFixed(0); },yfmt:function(v2){ return v2.toFixed(0); }});
    var sp=[], al=[]; for(i=0;i<DESC.t.length;i+=step){ sp.push([DESC.t[i], -DESC.vy[i]]); al.push([DESC.t[i], DESC.h[i]/h0*vmax]); }
    plotLine(ctx,Pp,al,COL.amber,1.4,[4,3]);
    plotLine(ctx,Pp,sp,COL.blue,2.2);
    plotLine(ctx,Pp,[[0,VT],[DESC.T,VT]],COL.pink2,1.4,[6,4]);
    var t=Anim.time(1); plotLine(ctx,Pp,[[Math.min(t,DESC.T),0],[Math.min(t,DESC.T),vmax]],COL.ok,1.6);
    legend(ctx,Pp.x1-130,Pp.y1+16,[['낙하 속도 v(t)',COL.blue],['고도(상대)',COL.amber],['종단속도 v_t',COL.pink2]]);
    cv.setAttribute('aria-label','낙하 속도 그래프. 종단속도 '+VT.toFixed(1)+' 미터 매 초');
  }
  function setup(){
    recompute(); readout();
    tb=buildTimeBar('t1-time', 1, {dur:DUR, unit:'s', digits:1});
    Anim.register(1,{dur:DUR, loop:false, autoplay:true, draw:function(t){ draw(t); graph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
    var b2=document.querySelector('#t1-time [data-sp="2"]'); if(b2) b2.click();
    draw(0); graph();
  }
  function bind(){
    var hs=document.getElementById('t1-h'), ds=document.getElementById('t1-d'), ws=document.getElementById('t1-w');
    function syncP(){ [0,0.2,0.4,0.6].forEach(function(v,i){ var b=document.getElementById('t1-p'+i); if(b) b.setAttribute('aria-pressed', Math.abs(D-v)<0.001?'true':'false'); }); }
    hs.addEventListener('input', function(){ h0=+this.value; setup(); });
    ds.addEventListener('input', function(){ D=+this.value; syncP(); setup(); });
    ws.addEventListener('input', function(){ wind=+this.value; setup(); });
    [0,0.2,0.4,0.6].forEach(function(v,i){ document.getElementById('t1-p'+i).addEventListener('click', function(){ D=v; ds.value=v; syncP(); setup(); }); });
    document.getElementById('t1-reset3d').addEventListener('click', function(){ reset3(sc, function(){ draw(Anim.time(1)); }); });
    syncP();
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
