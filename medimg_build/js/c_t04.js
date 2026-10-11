/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 초음파 : 복부 모사 단면 B-모드(줄 단위 스캔) + A-모드 에코 프로파일 + 주파수 대 침투 깊이
   모형 : usImage() — 스펙클 × 감쇠(조직 α·f) + 경계 반사, 축 · 가로 번짐은 파장에 비례(화면 가시성을 위해 4 · 12 배 과장).
   검증(손계산) : f=5 MHz → λ=0.308 mm, 침투 ≈ 60/(2·0.5·5) = 12 cm, 10 cm 에코 왕복 130 μs, 근육–지방 R ≈ 1.4 %
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[4] = function(){ T4.init(); };
TabDraw[4] = function(){ T4.graph(); Anim.kick(4); };
var T4 = (function(){
  var f=5, tgc=40, seed=3, nx=64, nz=128, Hc=12, Wc=10, IMG=null, REF=1, tb=null, DUR=10;
  function lam(){ return SUBJ.cUS/(f*1e6)*100; }                     // cm
  function make(){ IMG=usImage(f,nx,nz,{H:Hc,W:Wc,seed:seed,axial:4*lam(),lateral:12*lam(),tgc:tgc/100}); var s=Array.prototype.slice.call(IMG).sort(function(a,b){ return a-b; }); REF=Math.max(1e-4,s[Math.floor(s.length*0.985)]); }
  function dB(a){ return 20*Math.log10(Math.max(a,1e-6)/REF); }
  function readout(){
    var Zm=usZ('muscle'), Zf=usZ('fat');
    setTxt('t4-fV',f+' MHz'); setTxt('t4-gV',(tgc/100).toFixed(2)+' dB/cm/MHz'); setTxt('t4-oL',(lam()*10).toFixed(2)+' mm'); setTxt('t4-oA','약 '+(lam()*10).toFixed(2)+' mm (펄스 2주기)');
    setTxt('t4-oM','약 '+(60/f).toFixed(0)+' cm'); setTxt('t4-oT',(2*0.10/SUBJ.cUS*1e6).toFixed(0)+' μs'); setTxt('t4-oR',(usR(Zm,Zf)*100).toFixed(2)+' %');
  }
  function draw(tm){
    var cv=document.getElementById('t4-cv'); if(!cv||!IMG) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, ph=h-46, pw=ph*Wc/Hc, x0=46, y0=30, i, j, disp=new Float32Array(nx*nz), k=Math.max(1,Math.ceil(Math.min(1,tm/8)*nx));
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(i=0;i<k;i++) for(j=0;j<nz;j++) disp[j*nx+i]=Math.max(0,Math.min(1,(dB(IMG[i*nz+j])+45)/45));
    grayImage2(ctx,disp,nx,nz,x0,y0,pw,ph,0,1,true); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,pw,ph);
    for(j=0;j<=Hc;j+=2){ var yy=y0+ph*j/Hc; ctx.strokeStyle=COL.axis; ctx.beginPath(); ctx.moveTo(x0-4,yy); ctx.lineTo(x0,yy); ctx.stroke(); cvText(ctx,j+' cm',x0-7,yy,COL.tick,'10px system-ui,sans-serif','right','middle'); }
    var xl=x0+pw*Math.min(1,k/nx); ctx.strokeStyle=COL.amber; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(xl,y0); ctx.lineTo(xl,y0+ph); ctx.stroke();
    cvText(ctx,'탐촉자 ▼ (젤 · 피부)',x0+pw/2,y0-8,COL.tick,'10.5px system-ui,sans-serif','center');
    var lx=x0+pw+12, L=[['피부 · 지방 · 근육',0.9,COL.text],['간 (균일한 회색 질감)',3.3,COL.text],['혈관(검은 원)',4.6,COL.ok],['낭종(검은 원) + 뒤쪽 밝아짐',6.0,COL.ok],['갈비뼈 + 뒤쪽 그림자',2.7,COL.grav]];
    L.forEach(function(q){ cvText(ctx,q[0],lx,y0+ph*q[1]/Hc,q[2],'11px system-ui,sans-serif'); });
    cvText(ctx,'f '+f+' MHz · 침투 약 '+(60/f).toFixed(0)+' cm · TGC '+(tgc/100).toFixed(2),12,16,COL.text,'bold 12px system-ui,sans-serif');
    readout(); cv.setAttribute('aria-label','초음파 B-모드 영상 시뮬레이션. 주파수 '+f+' 메가헤르츠');
  }
  function graph(){
    var cv=document.getElementById('t4-cv2'); if(!cv||!IMG) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, hh=Math.floor(h/2), i, L=[], ix=Math.floor(0.62*nx);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(i=0;i<nz;i++) L.push([(i+0.5)/nz*Hc, dB(IMG[ix*nz+i])]);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:Hc,ymin:-60,ymax:10,ylabel:'에코 (dB)',title:'A-모드 : 낭종을 지나는 한 줄 (깊이 대 에코 세기)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      ctx.save(); ctx.beginPath(); ctx.rect(P.x0,P.y1,P.x1-P.x0,P.y0-P.y1); ctx.clip(); plotLine(ctx,P,L,COL.blue,1.4); ctx.restore(); plotLine(ctx,P,[[0,0],[Hc,-2*0.5*f*Hc+2*tgc/100*f*Hc]],COL.amber,1.4,[5,4]);
      cvText(ctx,'점선 = 간의 평균 감쇠 − TGC 보상',P.x1-6,P.y1+14,COL.amber,'10.5px system-ui,sans-serif','right'); });
    var fs=[]; for(i=2;i<=15;i+=0.5) fs.push(i);
    subPlot(ctx,0,hh,w,h-hh,{xmin:2,xmax:15,ymin:0,ymax:32,xlabel:'탐촉자 주파수 f (MHz)',ylabel:'침투 깊이 (cm)',title:'주파수 대 침투 깊이(≈ 60 dB 왕복 손실)',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      plotLine(ctx,P,fs.map(function(q){ return [q,60/q]; }),COL.ok,2.2); plotLine(ctx,P,[[f,0],[f,32]],COL.amber,1.4); plotPoints(ctx,P,[[f,60/f]],COL.amber,6);
      cvText(ctx,'높은 주파수 = 선명(λ 작음) · 얕다',P.x1-6,P.y1+14,COL.tick,'10.5px system-ui,sans-serif','right'); });
  }
  function setup(){ make(); readout(); if(!tb){ tb=buildTimeBar('t4-time',4,{dur:DUR,unit:'s',digits:1}); Anim.register(4,{dur:DUR,loop:true,autoplay:true,draw:function(tm){ draw(tm); },onTick:function(tm,p){ if(tb) tb.sync(tm,p); }}); } Anim.reset(4); Anim.play(4); draw(0); graph(); }
  function bind(){
    function on(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); setup(); }); }
    on('t4-f',function(v){ f=v; }); on('t4-g',function(v){ tgc=v; });
    document.getElementById('t4-p0').addEventListener('click',function(){ f=4; document.getElementById('t4-f').value=4; setup(); });
    document.getElementById('t4-p1').addEventListener('click',function(){ f=10; document.getElementById('t4-f').value=10; setup(); });
    document.getElementById('t4-go').addEventListener('click',function(){ seed+=7; setup(); });
  }
  return { init:function(){ bind(); setup(); }, graph:graph };
})();
