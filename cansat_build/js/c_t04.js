/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 위치와 유도 : 위에서 본 지도, GPS 조향(순수 추적) · 도달 가능 영역
   모형 : guideSim() — V_g = (L/D) v_s, 지상속도 = V_g(cosθ, sinθ) + (w, 0), 최대 선회율 1 rad/s, GPS 잡음 0
          방출점 (−X₀, +120 m) → 목표 (0,0).  유도 안 하면 착륙점 = (−X₀ + wT, 120).  검증 : X₀ = wT 이면 유도 없이 오차 120 m
          도달 가능 영역 : 중심 (−X₀ + wT, 120), 반지름 V_g·T
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[4] = function(){ T4.init(); };
TabDraw[4] = function(){ T4.graph(); Anim.kick(4); };
var T4 = (function(){
  var w=3, LD=2.5, X0=300, h0=300, vs=5, S=null, N0=null, T=60, DUR=63, tb=null, B=null;
  function recompute(){
    T=h0/vs; var p0=[-X0,120];
    S=guideSim({h0:h0, vs:vs, LD:LD, wind:[w,0], p0:p0, target:[0,0], gps:0, dt:0.05, turn:1});
    N0=guideSim({h0:h0, vs:vs, LD:0,  wind:[w,0], p0:p0, target:[0,0], gps:0, dt:0.05});
    DUR=Math.ceil(T)+3;
    var xs=[0,p0[0]], ys=[0,p0[1]], i, st=Math.max(1,Math.floor(S.x.length/200));
    for(i=0;i<S.x.length;i+=st){ xs.push(S.x[i]); ys.push(S.y[i]); }
    xs.push(N0.x[N0.x.length-1]); ys.push(N0.y[N0.y.length-1]);
    var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
    var bw=Math.max(300,x1-x0), bh=Math.max(240,y1-y0), cx=(x0+x1)/2, cy=(y0+y1)/2;
    B={cx:cx, cy:cy, bw:bw*1.25, bh:bh*1.35};
  }
  function readout(){
    var Vg=LD*vs;
    setTxt('t4-wV', w.toFixed(1)+' m/s'); setTxt('t4-lV', LD>0? LD.toFixed(2) : '0 (유도 없음)'); setTxt('t4-xV', X0+' m'); setTxt('t4-hV', h0+' m');
    setTxt('t4-oM', S.miss.toFixed(0)+' m'); setTxt('t4-oT', T.toFixed(0)+' s'); setTxt('t4-oV', Vg.toFixed(1)+' m/s');
    setTxt('t4-oR', (Vg*T).toFixed(0)+' m'); setTxt('t4-oN', N0.miss.toFixed(0)+' m'); setTxt('t4-oQ', Vg>0? (w/Vg).toFixed(2) : '—');
  }
  function draw(t){
    var cv=document.getElementById('t4-cv'); if(!cv || !S) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, m=26;
    var sc=Math.min((W-2*m)/B.bw, (H-2*m-14)/B.bh);
    function X(x){ return W/2+(x-B.cx)*sc; } function Y(y){ return H/2-(y-B.cy)*sc+4; }
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=COL.plotbg; ctx.fillRect(6,6,W-12,H-12);
    /* 격자 */
    var st=niceStep(Math.max(B.bw,B.bh)/2.2,4), gx0=B.cx-W/2/sc, gx1=B.cx+W/2/sc, gy0=B.cy-H/2/sc, gy1=B.cy+H/2/sc, q;
    ctx.strokeStyle=COL.gridln; ctx.lineWidth=1; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
    for(q=Math.ceil(gx0/st)*st;q<=gx1;q+=st){ ctx.beginPath(); ctx.moveTo(X(q),8); ctx.lineTo(X(q),H-8); ctx.stroke(); ctx.fillText(q+' m',X(q),H-20); }
    ctx.textAlign='left'; ctx.textBaseline='middle';
    for(q=Math.ceil(gy0/st)*st;q<=gy1;q+=st){ ctx.beginPath(); ctx.moveTo(8,Y(q)); ctx.lineTo(W-8,Y(q)); ctx.stroke(); if(Y(q)>58 && Y(q)<H-24) ctx.fillText(q+' m',10,Y(q)-7); }
    /* 바람 화살표 */
    if(w>0){ var ax, ay; for(ax=0;ax<5;ax++) for(ay=0;ay<3;ay++){ var px=W*(0.14+0.18*ax), py=H*(0.2+0.3*ay); arrow2(ctx,px,py,px+6+w*3.2,py,'rgba(253,224,71,.28)',1.6); } }
    /* 도달 가능 영역 */
    var Vg=LD*vs;
    ctx.save(); ctx.beginPath(); ctx.rect(8,8,W-16,H-16); ctx.clip();
    if(Vg>0){ var rc=S.reach; ctx.beginPath(); ctx.arc(X(rc.cx),Y(rc.cy),Vg*T*sc,0,6.2832); ctx.fillStyle='rgba(251,191,36,.07)'; ctx.fill(); ctx.setLineDash([6,4]); ctx.strokeStyle=COL.amber; ctx.lineWidth=1.4; ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    /* 목표 과녁 */
    [50,10].forEach(function(r){ cvCirc(ctx,X(0),Y(0),Math.max(3,r*sc),null,COL.grav,1.2); });
    cvLine(ctx,[[X(0)-7,Y(0)-7],[X(0)+7,Y(0)+7]],COL.grav,2.4); cvLine(ctx,[[X(0)-7,Y(0)+7],[X(0)+7,Y(0)-7]],COL.grav,2.4);
    pill(ctx,'목표',X(0)+10,Y(0)-14,COL.grav);
    /* 방출점 */
    cvCirc(ctx,X(-X0),Y(120),4,COL.dim,COL.dev,1); pill(ctx,'방출',X(-X0)+7,Y(120)-12,COL.tick);
    /* 유도하지 않은 경로 */
    var n0=[], i; for(i=0;i<N0.x.length;i+=6) n0.push([X(N0.x[i]),Y(N0.y[i])]); n0.push([X(N0.x[N0.x.length-1]),Y(N0.y[N0.y.length-1])]);
    if(LD>0) cvLine(ctx,n0,COL.dim,1.4,[4,4]);
    /* 유도 경로 (지나온 부분) */
    var tt=Math.min(t,T), idx=Math.min(S.x.length-1, Math.floor(tt/0.05)), pts=[]; for(i=0;i<=idx;i+=2) pts.push([X(S.x[i]),Y(S.y[i])]); pts.push([X(S.x[idx]),Y(S.y[idx])]);
    cvLine(ctx,pts,COL.ok,2.4);
    var cx=X(S.x[idx]), cy=Y(S.y[idx]), th=S.th[idx];
    cvCirc(ctx,cx,cy,5.5,COL.amber,COL.dev,1.2);
    if(Vg>0) arrow2(ctx,cx,cy,cx+16*Math.cos(th),cy-16*Math.sin(th),COL.amber,2);
    var dnow=Math.hypot(S.x[idx],S.y[idx]), landed=t>=T;
    if(landed) pill(ctx,'착륙 · 목표에서 '+S.miss.toFixed(0)+' m',cx+8,cy+14,COL.ok);
    ctx.fillStyle=COL.text; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText('t = '+tt.toFixed(0)+' s · 고도 '+Math.max(0,h0-vs*tt).toFixed(0)+' m · 목표까지 '+dnow.toFixed(0)+' m', 14, 12, W-130);
    ctx.fillStyle=COL.tick; ctx.font='10.5px system-ui,sans-serif'; ctx.fillText('바람 → '+w.toFixed(1)+' m/s', 14, 30);
    readout();
    cv.setAttribute('aria-label','유도 낙하 지도. 시각 '+tt.toFixed(0)+' 초, 목표까지 '+dnow.toFixed(0)+' 미터');
  }
  function graph(){
    var cv=document.getElementById('t4-cv2'); if(!cv || !S) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, hh=Math.floor(H*0.5), i, tt=Math.min(Anim.time(4),T);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var dmax=0, d0=[], d1=[], st=Math.max(1,Math.floor(S.x.length/300));
    for(i=0;i<S.x.length;i+=st){ var a=Math.hypot(S.x[i],S.y[i]), b=Math.hypot(N0.x[i],N0.y[i]); d1.push([S.t[i],a]); d0.push([N0.t[i],b]); if(a>dmax) dmax=a; if(b>dmax) dmax=b; }
    dmax=Math.ceil(dmax*1.1/100)*100;
    subPlot(ctx,0,0,W,hh,{xmin:0,xmax:T,ymin:0,ymax:dmax,ylabel:'목표까지 거리 (m)',title:'목표까지의 거리 d(t)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      if(LD>0) plotLine(ctx,P,d0,COL.dim,1.4,[4,3]); plotLine(ctx,P,d1,COL.ok,2.2); plotLine(ctx,P,[[tt,0],[tt,dmax]],COL.amber,1.5);
      legend(ctx,P.x1-132,P.y1+14,[['유도(지금 설정)',COL.ok],['유도 안 함',COL.dim]]);
    });
    var wm=8, L1=[], L2=[], k, ymax2=0;
    for(k=0;k<=40;k++){ var wv=wm*k/40, dc=Math.hypot(X0-wv*T,120); L1.push([wv,dc]); if(dc>ymax2) ymax2=dc; }
    ymax2=Math.max(Math.ceil(Math.max(ymax2,LD*vs*T)*1.1/100)*100,200);
    subPlot(ctx,0,hh,W,H-hh,{xmin:0,xmax:wm,ymin:0,ymax:ymax2,xlabel:'풍속 w (m/s)',ylabel:'거리 (m)',title:'목표가 도달 가능 영역 안에 있는가?',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      plotLine(ctx,P,L1,COL.amber,2); plotLine(ctx,P,[[0,LD*vs*T],[wm,LD*vs*T]],COL.ok,2);
      plotPoints(ctx,P,[[w,Math.hypot(X0-w*T,120)]],COL.grav,6);
      legend(ctx,P.x1-168,P.y1+14,[['목표 ↔ 영역 중심 거리',COL.amber],['도달 반경 V_g·T',COL.ok]]);
    });
    cv.setAttribute('aria-label','목표까지 거리와 풍속별 도달 가능 여부 그래프');
  }
  function setup(){
    recompute(); readout();
    tb=buildTimeBar('t4-time', 4, {dur:DUR, unit:'s', digits:0});
    Anim.register(4,{dur:DUR, loop:false, autoplay:true, draw:function(t){ draw(t); graph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
    var b2=document.querySelector('#t4-time [data-sp="2"]'); if(b2) b2.click();
    draw(0); graph();
  }
  function bind(){
    function on(id, fn){ document.getElementById(id).addEventListener('input', function(){ fn(+this.value); syncP(); setup(); }); }
    function syncP(){ [0,2,3].forEach(function(v,i){ var b=document.getElementById('t4-p'+i); if(b) b.setAttribute('aria-pressed', Math.abs(LD-v)<0.001?'true':'false'); }); }
    on('t4-w', function(v){ w=v; }); on('t4-l', function(v){ LD=v; }); on('t4-x', function(v){ X0=v; }); on('t4-h', function(v){ h0=v; });
    [0,2,3].forEach(function(v,i){ document.getElementById('t4-p'+i).addEventListener('click', function(){ LD=v; document.getElementById('t4-l').value=v; syncP(); setup(); }); });
    document.getElementById('t4-best').addEventListener('click', function(){ X0=Math.min(800,Math.round(w*(h0/vs)/10)*10); document.getElementById('t4-x').value=X0; setup(); });
    syncP();
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
