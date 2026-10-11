/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ 통신 : 로그 거리 경로 손실 · 링크 버짓 · 패킷 수신
   모형 : PL(d) = 20 log10(f_MHz) − 27.55 + 10 n log10 d,  P_rx = P_tx − PL,  패킷 수신 확률 = 1/(1+e^(−margin/1.5))
   검증(손계산) : 433 MHz, 14 dBm, n = 2, 1 km → P_rx = −71.2 dBm (여유 28.8 dB) · 최대 거리 n=2 약 27.5 km, n=3.5 약 344 m
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[5] = function(){ T5.init(); };
TabDraw[5] = function(){ T5.graph(); Anim.kick(5); };
var T5 = (function(){
  var u=703, Ptx=14, n=2.7, S=-100, f=433, seed=1, DUR=10, tb=null;
  function dist(){ return Math.pow(10, 1+2.7*u/1000); }
  function fmtD(v){ return v>=1000? (v/1000).toFixed(v>=10000?0:(v%1000?1:0))+' km' : Math.round(v)+' m'; }
  function margin(d){ return rxPower(Ptx,d,n,f)-S; }
  function prob(d){ return pktOK(margin(d)); }
  function maxRange(){ return Math.pow(10, (Ptx-S-pl1m(f))/(10*n)); }
  function pk(k){ return rng32(seed*997+k*131+7)(); }              // 패킷 k 의 운수(0~1)
  function readout(){
    var d=dist(), Pr=rxPower(Ptx,d,n,f), m=Pr-S, R=maxRange();
    setTxt('t5-dV', fmtD(d)); setTxt('t5-pV', Ptx+' dBm ('+(Math.pow(10,Ptx/10)).toFixed(0)+' mW)'); setTxt('t5-nV', n.toFixed(1)+(n<2.05?' (자유 공간)':(n<3?' (열린 지형)':' (건물 · 숲)')));
    setTxt('t5-sV', S+' dBm');
    setTxt('t5-oR', Pr.toFixed(1)+' dBm'); setTxt('t5-oL', pathLoss(d,n,f).toFixed(1)+' dB'); setTxt('t5-oM', (m>=0?'+':'')+m.toFixed(1)+' dB');
    setTxt('t5-oK', (prob(d)*100).toFixed(0)+' %'); setTxt('t5-oX', R>100000? '100 km 이상' : fmtD(R)); setTxt('t5-oD', '+'+(10*n*Math.log10(2)).toFixed(1)+' dB');
  }
  function draw(t){
    var cv=document.getElementById('t5-cv'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, d=dist(), Pr=rxPower(Ptx,d,n,f), m=Pr-S, p=prob(d), gx=70, y0=H*0.46;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var xs=function(dd){ return gx+(W-gx-60)*(Math.log10(Math.max(10,dd))-1)/2.7; }, cx=xs(d);
    /* 거리 눈금(로그) */
    ctx.strokeStyle=COL.axis; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.lineWidth=1;
    [10,30,100,300,1000,3000].forEach(function(v){ var x=xs(v); ctx.beginPath(); ctx.moveTo(x,y0+40); ctx.lineTo(x,y0+46); ctx.stroke(); ctx.fillText(fmtD(v),x,y0+49); });
    ctx.beginPath(); ctx.moveTo(gx,y0+40); ctx.lineTo(W-60,y0+40); ctx.stroke();
    /* 지상국 */
    ctx.strokeStyle=COL.dev; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(gx,y0+36); ctx.lineTo(gx,y0-26); ctx.stroke();
    ctx.lineWidth=1.8; [[-14,-26],[-9,-34],[-4,-42]].forEach(function(a){ ctx.beginPath(); ctx.moveTo(gx+a[0]*0.0-(-a[0]),y0+a[1]); ctx.lineTo(gx-a[0],y0+a[1]); ctx.stroke(); });
    ctx.fillStyle=COL.tick; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText('지상국', gx, y0-62);
    /* 캔위성 + 안테나 */
    drawCan(ctx,cx,y0-10,24); ctx.strokeStyle=COL.dev; ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(cx,y0-10); ctx.lineTo(cx,y0-26); ctx.stroke(); cvCirc(ctx,cx,y0-27,2.6,COL.amber);
    /* 점선 링크 + 전파 호 */
    ctx.setLineDash([3,5]); ctx.strokeStyle=COL.axis2; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx+4,y0-2); ctx.lineTo(cx-8,y0-2); ctx.stroke(); ctx.setLineDash([]);
    var ph=(t%1), alpha=Math.max(0.08, Math.min(0.85, (m+20)/60)), r;
    for(r=0;r<3;r++){ var rr=10+((ph+r/3)%1)*48; ctx.strokeStyle='rgba(125,211,252,'+(alpha*(1-rr/62)).toFixed(3)+')'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(cx,y0-2,rr,Math.PI*0.62,Math.PI*1.38); ctx.stroke(); }
    /* 패킷 : 방출 후 0.8 s 동안 날아가고 도착 → 성공이면 초록 , 아니면 중간에서 사라진다 */
    var k, sent=0, ok=0;
    for(k=0;k<10;k++){ var success=pk(k)<p; sent++; if(success) ok++;
      var tau=t-k; if(tau<0 || tau>1.0) continue;
      var fr=Math.min(1,tau/0.8), px=cx-(cx-gx-14)*fr, py=y0-2-6;
      if(success){ ctx.fillStyle=COL.ok; ctx.fillRect(px-6,py-4,12,8); ctx.fillStyle=COL.cvbg; ctx.font='bold 8px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(k+1,px,py); }
      else { var life=Math.max(0,1-Math.max(0,tau-0.35)/0.45), px2=cx-(cx-gx-14)*Math.min(0.45,fr);
        ctx.fillStyle='rgba(251,113,133,'+life.toFixed(2)+')'; ctx.fillRect(px2-6,py-4,12,8); ctx.strokeStyle='rgba(251,113,133,'+life.toFixed(2)+')'; ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(px2-5,py-8); ctx.lineTo(px2+5,py+8); ctx.moveTo(px2+5,py-8); ctx.lineTo(px2-5,py+8); ctx.stroke(); }
    }
    /* 수신 세기 막대 */
    var bx0=40, bx1=W-40, by=H-52, bw=bx1-bx0;
    function xv(dB){ return bx0+bw*(Math.max(-140,Math.min(-20,dB))+140)/120; }
    ctx.fillStyle='rgba(120,150,190,.18)'; ctx.fillRect(bx0,by,bw,16); ctx.strokeStyle=COL.axis2; ctx.lineWidth=1; ctx.strokeRect(bx0,by,bw,16);
    ctx.fillStyle= m>=10? COL.ok : (m>=0? COL.amber : COL.grav); ctx.fillRect(bx0,by,xv(Pr)-bx0,16);
    ctx.strokeStyle=COL.grav; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xv(S),by-6); ctx.lineTo(xv(S),by+22); ctx.stroke();
    ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
    [-140,-120,-100,-80,-60,-40,-20].forEach(function(v){ ctx.fillText(v, xv(v), by+22); });
    ctx.fillStyle=COL.grav; ctx.textBaseline='bottom'; ctx.fillText('감도 '+S, xv(S), by-8);
    ctx.fillStyle=COL.text; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText('d = '+fmtD(d)+' · 수신 '+Pr.toFixed(1)+' dBm · 여유 '+(m>=0?'+':'')+m.toFixed(1)+' dB', 12, 10, W-150);
    ctx.fillStyle=COL.tick; ctx.font='11px system-ui,sans-serif'; ctx.fillText('이번 10 개 패킷 중 '+ok+' 개 수신 ('+(sent-ok)+' 개 손실)', 12, 28);
    readout();
    cv.setAttribute('aria-label','통신 링크 장면. 거리 '+fmtD(d)+', 수신 세기 '+Pr.toFixed(1)+' dBm, 링크 여유 '+m.toFixed(1)+' dB');
  }
  function graph(){
    var cv=document.getElementById('t5-cv2'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, hh=Math.floor(H*0.56), d=dist(), i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    function xf(v){ var dd=Math.pow(10,v); return dd>=1000? (+(dd/1000).toPrecision(2))+'k' : (+dd.toPrecision(2))+''; }
    subPlot(ctx,0,0,W,hh,{xmin:1,xmax:3.7,ymin:-160,ymax:0,ylabel:'수신 세기 (dBm)',title:'거리에 따른 수신 세기 (가로 = 로그 거리)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var L=[], L2=[]; for(i=0;i<=60;i++){ var lv=1+2.7*i/60, dd=Math.pow(10,lv); L.push([lv,rxPower(Ptx,dd,n,f)]); L2.push([lv,rxPower(Ptx,dd,2,f)]); }
      if(Math.abs(n-2)>0.05) plotLine(ctx,P,L2,COL.dim,1.3,[4,3]);
      plotLine(ctx,P,L,COL.amber,2.2); plotLine(ctx,P,[[1,S],[3.7,S]],COL.grav,1.6,[6,4]);
      var lg=Math.log10(d); plotLine(ctx,P,[[lg,-160],[lg,0]],COL.ok,1.4); plotPoints(ctx,P,[[lg,rxPower(Ptx,d,n,f)]],COL.ok,5.5);
      legend(ctx,P.x1-136,P.y1+14,[['지금 n = '+n.toFixed(1),COL.amber],['n = 2 (자유 공간)',COL.dim],['수신 감도',COL.grav]]);
    });
    subPlot(ctx,0,hh,W,H-hh,{xmin:1,xmax:3.7,ymin:0,ymax:1.05,xlabel:'거리 d (m, 로그 눈금)',ylabel:'수신 확률',title:'패킷 수신 확률 (한계 근처의 절벽)',left:56,top:24,bottom:38,xfmt:xf,yfmt:function(q){ return q.toFixed(1); }}, function(P){
      var Lp=[]; for(i=0;i<=120;i++){ var lv=1+2.7*i/120, dd=Math.pow(10,lv); Lp.push([lv,prob(dd)]); }
      plotLine(ctx,P,Lp,COL.blue,2.2); var lg2=Math.log10(d); plotLine(ctx,P,[[lg2,0],[lg2,1.05]],COL.ok,1.4); plotPoints(ctx,P,[[lg2,prob(d)]],COL.ok,5.5);
    });
    cv.setAttribute('aria-label','수신 세기와 패킷 수신 확률 그래프');
  }
  function setup(){
    readout();
    if(!tb){ tb=buildTimeBar('t5-time', 5, {dur:DUR, unit:'s', digits:1}); Anim.register(5,{dur:DUR, loop:true, autoplay:true, draw:function(t){ draw(t); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }}); }
    draw(Anim.time(5)); graph();
  }
  function bind(){
    function syncF(){ [433,915,2400].forEach(function(v,i){ var b=document.getElementById('t5-f'+i); if(b) b.setAttribute('aria-pressed', f===v?'true':'false'); }); }
    function on(id, fn){ document.getElementById(id).addEventListener('input', function(){ fn(+this.value); setup(); }); }
    on('t5-d', function(v){ u=v; }); on('t5-p', function(v){ Ptx=v; }); on('t5-n', function(v){ n=v; }); on('t5-s', function(v){ S=v; });
    [433,915,2400].forEach(function(v,i){ document.getElementById('t5-f'+i).addEventListener('click', function(){ f=v; syncF(); setup(); }); });
    document.getElementById('t5-new').addEventListener('click', function(){ seed++; Anim.reset(5); Anim.play(5); setup(); });
    syncF();
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
