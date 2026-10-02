/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① 낙하와 종단속도 : 힘 막대(mg · F) + 진공 대비 + v(t) · a(t) 그래프
   모형 : descend() 로 200 m 에서 방출. 공기 저항 N = a_drag·m·g (a_drag = 저항 가속도 / g, 바람 0 이면 연직)
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[2] = function(){ T2.init(); };
TabDraw[2] = function(){ T2.graph(); Anim.kick(2); };
var T2 = (function(){
  var m=0.35, D=0.4, vac=true, H0=200, DESC=null, tb=null, DUR=60, VT=5.4, TAU=0.55;
  function recompute(){
    DESC=descend({h0:H0, m:m, D:D, wind:0});
    VT=vTermAt(m, dragArea(D), 0); TAU=VT/SUBJ.g;
    DUR=Math.min(140, Math.ceil(DESC.T)+3);
  }
  function readout(t){
    var i=descAt(DESC, Math.min(t,DESC.T-0.02)).i, Fd=DESC.a[i]*m*SUBJ.g, W=m*SUBJ.g;
    setTxt('t2-mV', m.toFixed(2)+' kg'); setTxt('t2-dV', D>0? (D*100).toFixed(0)+' cm' : '펴지 않음');
    setTxt('t2-oV', VT.toFixed(1)+' m/s'); setTxt('t2-oTau', TAU.toFixed(2)+' s'); setTxt('t2-oT', DESC.T.toFixed(1)+' s');
    setTxt('t2-oTv', Math.sqrt(2*H0/SUBJ.g).toFixed(1)+' s'); setTxt('t2-oF', W.toFixed(2)+' N · '+Fd.toFixed(2)+' N');
  }
  function bar(ctx, x, yb, wd, hpx, col, lab, val){
    ctx.fillStyle=col; ctx.fillRect(x, yb-hpx, wd, hpx);
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=1; ctx.strokeRect(x, yb-hpx, wd, hpx);
    ctx.fillStyle=COL.text; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText(val, x+wd/2, yb-hpx-3); ctx.textBaseline='top'; ctx.fillStyle=COL.tick; ctx.fillText(lab, x+wd/2, yb+4);
  }
  function draw(t){
    var cv=document.getElementById('t2-cv'); if(!cv || !DESC) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, gy=h-34, top=26, tt=Math.min(t, DESC.T-0.02);
    var cur=descAt(DESC, tt), i=cur.i, Fd=DESC.a[i]*m*SUBJ.g, W=m*SUBJ.g;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var wl=Math.min(w*0.56, w-170);        // 왼쪽(낙하 장면) 영역 너비
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,wl,h); ctx.clip();
    skyBg(ctx,wl,h,gy); groundBg(ctx,wl,h,gy);
    var sc=(gy-top-44)/H0, k;
    ctx.strokeStyle=COL.axis; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.lineWidth=1;
    for(k=0;k<=H0;k+=50){ var yy=gy-k*sc; ctx.beginPath(); ctx.moveTo(34,yy); ctx.lineTo(42,yy); ctx.stroke(); ctx.fillText(k+' m',2,yy-0); }
    ctx.beginPath(); ctx.moveTo(42,gy); ctx.lineTo(42,gy-H0*sc); ctx.stroke();
    var cx=wl*0.40, canH=26, y=gy-cur.h*sc-canH, s=t<1?0:Math.min(1,(t-1)/1.2); s=s*s*(3-2*s);
    if(D>0) drawChute(ctx,cx,y,38,12+34*(D/0.6),s);
    drawCan(ctx,cx,y,canH);
    if(vac){
      var hv=Math.max(0,H0-0.5*SUBJ.g*t*t), yv=gy-hv*sc-canH, cx2=cx+Math.min(70,wl*0.22);
      ctx.save(); ctx.setLineDash([4,3]); ctx.strokeStyle=COL.light; ctx.lineWidth=1.4; ctx.strokeRect(cx2-7.5,yv,15,canH); ctx.restore();
      ctx.fillStyle=COL.light; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText('진공', cx2, yv-3);
    }
    ctx.restore();
    /* 오른쪽 : 힘 막대 */
    var x0=wl+14, bw=Math.max(34,(w-wl-50)/2), fmax=Math.max(W*1.15, Fd*1.05, 2), hp=(gy-top-30)/fmax;
    var bx1=x0+8, bx2=x0+8+bw+18;
    ctx.fillStyle=COL.tick; ctx.font='bold 11.5px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('힘의 크기 (N)', x0, 6);
    bar(ctx,bx1,gy,bw,W*hp,COL.grav,'중력 mg',W.toFixed(2));
    bar(ctx,bx2,gy,bw,Fd*hp,COL.norm,'공기 저항',Fd.toFixed(2));
    var net=W-Fd, bal=Math.abs(net)<0.03*W;
    ctx.fillStyle= bal? COL.ok : COL.amber; ctx.font='bold 11.5px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText(bal? '합력 ≈ 0 → 등속 (종단속도)' : '알짜힘 '+(net>=0?'+':'')+net.toFixed(2)+' N ('+(net>0?'가속':'감속')+')', x0, 24, w-x0-4);
    ctx.fillStyle=COL.tick; ctx.font='11px system-ui,sans-serif'; ctx.textBaseline='bottom'; ctx.textAlign='left';
    ctx.fillText('t = '+Math.min(t,DESC.T).toFixed(1)+' s · 고도 '+Math.max(0,cur.h).toFixed(0)+' m · 속도 '+(-cur.vy).toFixed(1)+' m/s', 6, h-6, w-12);
    readout(t);
    cv.setAttribute('aria-label','낙하 장면. 고도 '+Math.max(0,cur.h).toFixed(0)+' 미터, 속도 '+(-cur.vy).toFixed(1)+' 미터 매 초, 중력 '+W.toFixed(2)+' 뉴턴, 공기 저항 '+Fd.toFixed(2)+' 뉴턴');
  }
  function graph(){
    var cv=document.getElementById('t2-cv2'); if(!cv || !DESC) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, i, step=Math.max(1,Math.floor(DESC.t.length/500)), vmax=0;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(i=0;i<DESC.t.length;i+=step){ var v=-DESC.vy[i]; if(v>vmax) vmax=v; }
    vmax=Math.max(Math.ceil(vmax*1.25/5)*5, 10);
    var Tm=Math.ceil(DESC.T), t=Anim.time(2), tc=Math.min(t,DESC.T), hh=Math.floor(h/2), amin=0;
    for(i=0;i<DESC.t.length;i+=step){ var an=SUBJ.g*(1-DESC.a[i]); if(an<amin) amin=an; }
    var aLo=Math.min(-12, Math.floor(amin*1.15/5)*5);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:Tm,ymin:0,ymax:vmax,ylabel:'속도 (m/s)',title:'낙하 속도 v(t)',left:50,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var sp=[], vv=[]; for(i=0;i<DESC.t.length;i+=step){ sp.push([DESC.t[i], -DESC.vy[i]]); }
      if(vac){ var tv=Math.sqrt(2*H0/SUBJ.g); for(i=0;i<=60;i++){ var tq=tv*i/60; vv.push([tq, SUBJ.g*tq]); } plotLine(ctx,P,vv,COL.light,1.4,[4,3]); }
      plotLine(ctx,P,sp,COL.blue,2.2); plotLine(ctx,P,[[0,VT],[Tm,VT]],COL.pink2,1.4,[6,4]);
      plotLine(ctx,P,[[tc,0],[tc,vmax]],COL.ok,1.5);
      legend(ctx,P.x1-120,P.y1+14,[['공기 속',COL.blue],['진공',COL.light],['종단속도',COL.pink2]]);
    });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:Tm,ymin:aLo,ymax:11,xlabel:'시간 t (s)',ylabel:'가속도 (m/s²)',title:'알짜 가속도 a = (mg − F)/m',left:50,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var ac=[]; for(i=0;i<DESC.t.length;i+=step){ ac.push([DESC.t[i], SUBJ.g*(1-DESC.a[i])]); }
      plotLine(ctx,P,[[0,0],[Tm,0]],COL.axis2,1,[2,3]);
      plotLine(ctx,P,ac,COL.amber,2.2); plotLine(ctx,P,[[tc,aLo],[tc,11]],COL.ok,1.5);
    });
    cv.setAttribute('aria-label','낙하 속도와 알짜 가속도 그래프. 종단속도 '+VT.toFixed(1)+' 미터 매 초');
  }
  function setup(){
    recompute(); readout(0);
    tb=buildTimeBar('t2-time', 2, {dur:DUR, unit:'s', digits:1});
    Anim.register(2,{dur:DUR, loop:false, autoplay:true, draw:function(t){ draw(t); graph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
    var b2=document.querySelector('#t2-time [data-sp="2"]'); if(b2) b2.click();
    draw(0); graph();
  }
  function bind(){
    var ms=document.getElementById('t2-m'), ds=document.getElementById('t2-d');
    function syncP(){ [0,0.2,0.4].forEach(function(v,i){ var b=document.getElementById('t2-p'+i); if(b) b.setAttribute('aria-pressed', Math.abs(D-v)<0.001?'true':'false'); }); }
    ms.addEventListener('input', function(){ m=+this.value; setup(); });
    ds.addEventListener('input', function(){ D=+this.value; syncP(); setup(); });
    document.getElementById('t2-vac').addEventListener('change', function(){ vac=this.checked; draw(Anim.time(2)); graph(); });
    [0,0.2,0.4].forEach(function(v,i){ document.getElementById('t2-p'+i).addEventListener('click', function(){ D=v; ds.value=v; syncP(); setup(); }); });
    syncP();
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
