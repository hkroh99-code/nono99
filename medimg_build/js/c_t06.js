/* ───────────────────────────────────────────────────────────────────────────
   TAB 6 — 원리⑤ 영상 품질 · 선량 · 안전
   모형 : σ = 8·√((200/mAs)(5/t)) HU · 병변 대비 35 HU · CNR = 35/σ · 유효선량 E = 2 mSv × mAs/200(두부 CT 기본값) · 자연방사선 2.4 mSv/년
   검증(손계산) : mAs 200 · t 5 mm → σ=8, CNR 4.4, E 2 mSv = 자연방사선 약 304 일(≈ 10 개월)
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[6] = function(){ T6.init(); };
TabDraw[6] = function(){ T6.graph(); };
var T6 = (function(){
  var N=64, LB=makeHead(N), HU=huMap(LB), m=100, t=5, seed=11, Z1=[], Z2=[], DEL=35;
  function noise(){ var r=rng32(seed), r2=rng32(seed+101), i; Z1=[]; Z2=[]; for(i=0;i<N*N;i++){ Z1.push(gaussR(r)); Z2.push(gaussR(r2)); } }
  function sg(mm,tt){ return 8*Math.sqrt((200/mm)*(5/tt)); }
  function dose(mm){ return 2*mm/200; }
  function judge(c){ return c>=4? '✅ 보인다' : (c>=3? '⚠ 경계' : '❌ 안 보인다'); }
  function readout(){
    var s=sg(m,t), c=DEL/s, E=dose(m);
    setTxt('t6-mV',m+' mAs'); setTxt('t6-zV',t+' mm'); setTxt('t6-oS',s.toFixed(1)+' HU'); setTxt('t6-oC',c.toFixed(1)); setTxt('t6-oD',E.toFixed(2)+' mSv'); setTxt('t6-oB','자연방사선 '+(E/(SUBJ.bg/365)).toFixed(0)+' 일 분량'); setTxt('t6-oJ',judge(c));
  }
  function draw(){
    var cv=document.getElementById('t6-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, s=Math.max(60,Math.min((w-40)/2,h-56)), i, a=new Float32Array(N*N), b=new Float32Array(N*N), s1=sg(m,t), s2=sg(Math.min(1600,m*4),t);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(i=0;i<N*N;i++){ a[i]=HU[i]+s1*Z1[i]; b[i]=HU[i]+s2*Z2[i]; }
    var xA=(w-2*s-16)/2, xB=xA+s+16; cvText(ctx,'지금 : '+m+' mAs · σ '+s1.toFixed(1)+' HU',xA+s/2,18,COL.text,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,a,N,xA,28,s,-15,85);
    cvText(ctx,'비교 : 선량 4 배 · σ '+s2.toFixed(1)+' HU (½)',xB+s/2,18,COL.ok,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,b,N,xB,28,s,-15,85);
    cvText(ctx,'병변 = 가운데 아래 오른쪽의 약간 밝은 원(+35 HU) · 두 영상은 같은 팬텀',w/2,h-12,COL.tick,'10.5px system-ui,sans-serif','center');
    cv.setAttribute('aria-label','잡음이 있는 CT 영상. 선량 '+m+' mAs, 병변 CNR '+(DEL/s1).toFixed(1)); readout();
  }
  function graph(){
    var cv=document.getElementById('t6-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, hh=Math.floor(h*0.52), i, ms=[]; for(i=20;i<=400;i+=10) ms.push(i);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:20,xmax:400,ymin:0,ymax:14,xlabel:'선량 (상대 mAs)',ylabel:'병변 CNR',title:'선량 대 병변 CNR (로즈 기준 4)',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      [[2,COL.blue],[5,COL.ok],[10,COL.violet||'#a78bfa']].forEach(function(q){ plotLine(ctx,P,ms.map(function(mm){ return [mm,DEL/sg(mm,q[0])]; }),q[1],1.4); });
      plotLine(ctx,P,ms.map(function(mm){ return [mm,DEL/sg(mm,t)]; }),COL.amber,2.6); plotLine(ctx,P,[[20,4],[400,4]],COL.grav,1.4,[5,4]); plotPoints(ctx,P,[[m,DEL/sg(m,t)]],COL.amber,6.5);
      legend(ctx,P.x1-150,P.y1+14,[['t 2 mm',COL.blue],['t 5 mm',COL.ok],['t 10 mm',COL.violet||'#a78bfa'],['지금 t '+t+' mm',COL.amber],['로즈 기준 4',COL.grav]]); });
    /* 아래 : 로그 막대 */
    var items=[['흉부 X선',0.1,COL.ok],['지금 설정',dose(m),COL.amber],['두부 CT(200 mAs)',2,COL.blue],['자연방사선(연)',SUBJ.bg,COL.violet||'#a78bfa'],['복부 CT',9,COL.grav]], y0=hh+30, y1=h-30, lo=Math.log10(0.05), hi=Math.log10(15), bw=Math.min(70,(w-90)/items.length-12);
    cvText(ctx,'유효선량 비교 (로그 눈금, mSv)',14,hh+16,COL.text,'bold 12px system-ui,sans-serif');
    ctx.strokeStyle=COL.axis2; ctx.beginPath(); ctx.moveTo(48,y1); ctx.lineTo(w-10,y1); ctx.stroke();
    items.forEach(function(q,k){ var x=60+k*(bw+14), yy=y1-(Math.log10(q[1])-lo)/(hi-lo)*(y1-y0); ctx.fillStyle=q[2]; ctx.globalAlpha=(k===1)?1:0.6; ctx.fillRect(x,yy,bw,y1-yy); ctx.globalAlpha=1; ctx.fillStyle=COL.text; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(q[1].toFixed(q[1]<1?2:1),x+bw/2,yy-2); ctx.textBaseline='top'; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.fillText(q[0],x+bw/2,y1+4,bw+10); });
    cv.setAttribute('aria-label','선량 대 CNR 그래프와 검사별 선량 비교');
  }
  function setup(){ readout(); draw(); graph(); }
  function bind(){
    function on(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); setup(); }); }
    on('t6-m',function(v){ m=v; }); on('t6-z',function(v){ t=v; });
    document.getElementById('t6-p0').addEventListener('click',function(){ m=40; document.getElementById('t6-m').value=40; setup(); });
    document.getElementById('t6-p1').addEventListener('click',function(){ m=200; document.getElementById('t6-m').value=200; setup(); });
    document.getElementById('t6-go').addEventListener('click',function(){ seed+=13; noise(); setup(); });
  }
  return { init:function(){ noise(); bind(); setup(); }, graph:graph };
})();
