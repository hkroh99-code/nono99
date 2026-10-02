/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② CT : 머리 팬텀 64×64 → 평행빔 투영(포아송 잡음) → 램프 필터 역투영(투영을 하나씩 더하며 애니메이션)
   검증(node) : nth 90 · 잡음 없음 → 백색질 평균 ≈ 30 HU(참 30), 병변 근처 CNR 확인
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[3] = function(){ T3.init(); };
TabDraw[3] = function(){ T3.graph(); Anim.kick(3); };
var T3 = (function(){
  var N=64, nth=90, mAs=200, filt=true, bw=true, LAB_=makeHead(N), HU=huMap(LAB_), CACHE=null, FIN=null, STAT=null, tb=null, DUR=10, seed=7, bmask=[], i0;
  for(i0=0;i0<N*N;i0++) bmask.push(LAB_[i0]>=3&&LAB_[i0]<=6);
  function compute(){
    var f=new Float32Array(N*N), i, nd=Math.ceil(N*1.45);
    for(i=0;i<f.length;i++) f[i]=muOfHU(HU[i]);
    var pr=radonFwd(f,N,nth,nd), ps=noisyProj(pr,mAs*500,SUBJ.pix,rng32(seed)), q=filt? rampFilter(ps,nth,nd,'sl') : ps;
    CACHE={sino:ps, q:q, nd:nd}; FIN=recon(nth); stats();
  }
  function recon(k){
    var out=backProj(CACHE.q,N,nth,CACHE.nd,k), i, sc=nth/Math.max(1,k);
    for(i=0;i<out.length;i++) out[i]=filt? huOf(out[i]*sc) : out[i]*sc;
    return out;
  }
  function stats(){
    var i, se=0, nb=0, wm=[], le=[];
    for(i=0;i<N*N;i++){ if(bmask[i]){ var d=FIN[i]-HU[i]; se+=d*d; nb++; } if(LAB_[i]===4) wm.push(FIN[i]); if(LAB_[i]===6) le.push(FIN[i]); }
    STAT={rmse:Math.sqrt(se/nb), wm:mean(wm), wms:stdev(wm), les:mean(le)};
  }
  function win(arr){ if(!filt) { var s=Array.prototype.slice.call(arr).sort(function(a,b){ return a-b; }); return [s[Math.floor(s.length*0.02)], s[Math.floor(s.length*0.995)]]; } return bw? [-15,85] : [-300,1100]; }
  function readout(){
    setTxt('t3-nV',nth+' 장'); setTxt('t3-dV',mAs+' mAs');
    if(!STAT) return; var sg=1/Math.sqrt(mAs/200);
    setTxt('t3-oR', filt? STAT.rmse.toFixed(0)+' HU' : '필터 꺼짐 — 의미 없음'); setTxt('t3-oW', filt? STAT.wm.toFixed(0)+' ± '+STAT.wms.toFixed(0)+' HU' : '—');
    setTxt('t3-oL', filt? ((STAT.les-STAT.wm)/Math.max(STAT.wms,1e-6)).toFixed(1) : '—'); setTxt('t3-oT','×'+(mAs/200).toFixed(2)+' · 잡음 ∝ '+sg.toFixed(2)); setTxt('t3-oN',Math.round(Math.PI/2*N)+' 장');
  }
  function draw(tm){
    var cv=document.getElementById('t3-cv'); if(!cv||!CACHE) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, s=Math.max(60,Math.min((w-36)/2,h-52));
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var k=Math.max(1,Math.min(nth,Math.ceil(Math.min(1,tm/7.5)*nth))), img=(k>=nth)? FIN : recon(k), wn=win(img), xA=(w-2*s-16)/2, xB=xA+s+16, y=28;
    cvText(ctx,'참값(팬텀)',xA+s/2,18,COL.text,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,HU,N,xA,y,s,bw?-15:-300,bw?85:1100);
    cvText(ctx,'재구성 '+k+' / '+nth+' 각도'+(filt?'(필터 역투영)':'(단순 역투영)'),xB+s/2,18,filt?COL.ok:COL.grav,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,img,N,xB,y,s,wn[0],wn[1]);
    var a=Math.PI*k/nth; ctx.strokeStyle=COL.amber; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(xB+s/2-Math.sin(a)*s*0.62,y+s/2+Math.cos(a)*s*0.62); ctx.lineTo(xB+s/2+Math.sin(a)*s*0.62,y+s/2-Math.cos(a)*s*0.62); ctx.stroke();
    cvText(ctx,bw?'뇌 창 WL 35 · WW 100 (병변 = 밝은 점)':'넓은 창 (뼈가 잘 보임)',w/2,h-14,COL.tick,'11px system-ui,sans-serif','center');
    cv.setAttribute('aria-label','CT 재구성. 투영 '+nth+'장 중 '+k+'장 사용'); readout();
  }
  function graph(){
    var cv=document.getElementById('t3-cv2'); if(!cv||!CACHE) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, wl=Math.floor(w*0.42), i, mn=1e9, mxs=-1e9;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(i=0;i<CACHE.sino.length;i++){ var v=CACHE.sino[i]; if(v<mn) mn=v; if(v>mxs) mxs=v; }
    cvText(ctx,'사이노그램 (가로 위치 · 세로 각도 0 → 180°)',10,16,COL.title||COL.text,'bold 11.5px system-ui,sans-serif'); grayImage2(ctx,CACHE.sino,CACHE.nd,nth,10,26,wl-18,h-60,mn,mxs,false); ctx.strokeStyle=COL.dim; ctx.strokeRect(10,26,wl-18,h-60);
    cvText(ctx,'점 하나 = 사인 곡선 하나',10+(wl-18)/2,h-14,COL.tick,'10.5px system-ui,sans-serif','center');
    var j=N>>1, row=[], tr=[]; for(i=0;i<N;i++){ row.push([i,FIN[j*N+i]]); tr.push([i,HU[j*N+i]]); }
    subPlot(ctx,wl,0,w-wl,h,{xmin:0,xmax:N-1,ymin:-100,ymax:150,xlabel:'가운데 줄의 화소 위치',ylabel:'HU',title:'중심선 HU 프로파일(뇌 부분)',left:48,top:24,bottom:36,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      ctx.save(); ctx.beginPath(); ctx.rect(P.x0,P.y1,P.x1-P.x0,P.y0-P.y1); ctx.clip(); plotLine(ctx,P,tr,COL.white,1.4,[4,3]); if(filt) plotLine(ctx,P,row,COL.blue,2); ctx.restore(); legend(ctx,P.x1-110,P.y1+14,[['참값',COL.white],['재구성',COL.blue]]); });
  }
  function setup(){ compute(); if(!tb){ tb=buildTimeBar('t3-time',3,{dur:DUR,unit:'s',digits:1}); Anim.register(3,{dur:DUR,loop:true,autoplay:true,draw:function(tm){ draw(tm); },onTick:function(tm,p){ if(tb) tb.sync(tm,p); }}); } Anim.reset(3); Anim.play(3); draw(0); graph(); }
  function bind(){
    function on(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); setup(); }); }
    on('t3-n',function(v){ nth=v; }); on('t3-d',function(v){ mAs=v; });
    document.getElementById('t3-f').addEventListener('change',function(){ filt=this.checked; setup(); });
    document.getElementById('t3-w').addEventListener('change',function(){ bw=this.checked; setup(); });
    [6,24,90].forEach(function(v,i){ document.getElementById('t3-p'+i).addEventListener('click',function(){ nth=v; document.getElementById('t3-n').value=v; setup(); }); });
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
