/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : ln(I₀/I) = μ x (직선)    종합2 : t = 2d/c (직선)    종합3 : SNR = SNR₁ √N (직선)
   ─────────────────────────────────────────────────────────────────────────── */
function synthTable(tblId, cntId, cols, rows){
  var th=document.querySelector('#'+tblId+' thead'), tb=document.querySelector('#'+tblId+' tbody'); if(!th||!tb) return;
  th.innerHTML='<tr>'+cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr>'; tb.innerHTML='';
  rows.slice(-12).forEach(function(r,i,a){ var tr=document.createElement('tr'); if(i===a.length-1) tr.className='cur'; tr.innerHTML=r.cells.map(function(c){ return '<td>'+c+'</td>'; }).join(''); tb.appendChild(tr); });
  setTxt(cntId, rows.length+'개'+(rows.length>12?' (최근 12개 표시)':''));
}
function synthSetup(n, drawAnim, drawGraph, readout){
  var tb=buildTimeBar('k'+n+'-time', n, {dur:10, unit:'s', digits:1});
  Anim.register(n,{dur:10, loop:true, autoplay:true, draw:function(t){ drawAnim(t); drawGraph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
  Anim.reset(n); Anim.play(n); readout(); drawAnim(0); drawGraph();
}
/** 공통 직선 그래프 : 내 점 · 내 회귀 · 숨은 참 직선 · 지금 설정 */
function synthFit(ctx,W,H,o){
  ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
  var P=makePlot(ctx,W,H,{xmin:0,xmax:o.xm,ymin:0,ymax:o.ym,xlabel:o.xl,ylabel:o.yl,title:o.title,left:56,xfmt:function(q){ return q.toFixed(o.xd); },yfmt:function(q){ return q.toFixed(o.yd); }});
  plotLine(ctx,P,[[0,0],[o.xm,o.strue*o.xm]],COL.white,1.2,[5,4]);
  if(o.f) plotLine(ctx,P,[[0,o.f.b],[o.xm,o.f.a*o.xm+o.f.b]],COL.grav,2.2);
  plotPoints(ctx,P,o.pts,COL.blue,5); plotPoints(ctx,P,[o.now],COL.amber,6.5);
  legend(ctx,P.x1-200,P.y0-62,[['숨은 참 직선',COL.white],[o.f? o.lab(o.f):'내 회귀(2점 이상)',COL.grav],['내 측정',COL.blue],['지금 설정',COL.amber]]);
}

/* ══ 종합 1 : 감약계수 ═════════════════════════════════════════════════ */
var MU_TRUE=0.20;
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = (function(){
  var x=6, N0=5000, cnt=0, started=false;
  function rows(){ return REPORT_DATA.rows; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  reportSetMeta({ title:'감약계수 μ 재기 — 램버트–비어 법칙', tabName:'[종합1] 감약계수 μ 재기',
    xLabel:'두께 x (cm)', yLabel:'ln(I₀/I)', cols:['#','x (cm)','N₀','I (계수)','ln(I₀/I)'], zero:true,
    interpret:function(f){ return {label:'감약계수 μ', value:f.a, unit:'cm⁻¹', trueValue:MU_TRUE, formula:'ln(I₀/I) = μ·x → 기울기 = μ,  반가층 HVL = ln2/μ = '+(Math.LN2/f.a).toFixed(2)+' cm', digits:3}; } });
  function meas(xx,n0,r){ var I=poisN(n0*Math.exp(-MU_TRUE*xx),r), I0=poisN(n0,r); I=Math.max(1,I); return {I:I, y:Math.log(Math.max(1,I0)/I)}; }
  function record(){
    var r=rng32(cnt*977+x*31+Math.round(N0/200)*7+13), m=meas(x,N0,r); cnt++;
    reportPush([cnt,x,N0,m.I,m.y.toFixed(3)], x, m.y); synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); graph();
  }
  function readout(){
    var f=fit(); setTxt('k15-xV',x+' cm'); setTxt('k15-N0V',N0);
    setTxt('k15-oI',Math.exp(-MU_TRUE*x).toFixed(4)); setTxt('k15-oL',(MU_TRUE*x).toFixed(3)); setTxt('k15-oM',rows().length? rows()[rows().length-1].y.toFixed(3):'—');
    setTxt('k15-oF',f? f.a.toFixed(3)+' cm⁻¹' : '— (2개 이상)'); setTxt('k15-oH',f&&f.a>0? (Math.LN2/f.a).toFixed(2)+' cm':'—');
  }
  function anim(t){
    var cv=document.getElementById('k15-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, r=rng32(5), i, y0=H/2, bx0=W*0.38, bw=Math.max(30,W*0.24*x/20+20), n=70;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(125,211,252,.15)'; ctx.fillRect(bx0,y0-60,bw,120); ctx.strokeStyle=COL.blue; ctx.strokeRect(bx0,y0-60,bw,120);
    cvText(ctx,'흡수체 '+x+' cm',bx0+bw/2,y0+78,COL.blue,'11.5px system-ui,sans-serif','center');
    cvCirc(ctx,30,y0,10,COL.amber,null,0); cvText(ctx,'광원',30,y0+26,COL.tick,'11px system-ui,sans-serif','center');
    ctx.fillStyle=COL.panel||'#1e293b'; ctx.fillRect(W-50,y0-60,18,120); cvText(ctx,'검출기',W-41,y0+78,COL.tick,'11px system-ui,sans-serif','center');
    var T=Math.exp(-MU_TRUE*x), got=0;
    for(i=0;i<n;i++){ var ph=((t/10)*2+i/n)%1, yy=y0-52+(i*37%104), absorbed=(r()>T), xa=bx0+bw*r(); var px=30+ph*(W-80);
      if(absorbed){ if(px<xa){ cvCirc(ctx,px,yy,2.5,COL.amber,null,0); } else if(px<xa+14){ cvCirc(ctx,xa,yy,3+(px-xa)*0.3,'rgba(251,113,133,.5)',null,0); } }
      else { cvCirc(ctx,px,yy,2.5,COL.amber,null,0); if(px>W-50) got++; } }
    cvText(ctx,'통과 확률 e^(−μx) = '+(T*100).toFixed(1)+' %  (μ 는 숨은 값)',12,16,COL.text,'bold 12px system-ui,sans-serif');
  }
  function graph(){
    var cv=document.getElementById('k15-cv2'); if(!cv) return; var s0=setupCanvas(cv), rs=rows(), f=fit();
    synthFit(s0.ctx,s0.w,s0.h,{xm:20,ym:Math.max(4.6,MU_TRUE*20*1.25),xl:'두께 x (cm)',yl:'ln(I₀/I)',title:'ln(I₀/I) 대 x — 기울기 = μ',xd:0,yd:1,strue:MU_TRUE,f:f,pts:rs.map(function(r){ return [r.x,r.y]; }),now:[x,MU_TRUE*x],lab:function(f){ return '내 회귀 : μ '+f.a.toFixed(3)+' (R² '+f.r2.toFixed(3)+')'; }});
  }
  function init(){
    if(!started){ started=true;
      function bindS(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); readout(); anim(Anim.time(15)); graph(); }); }
      bindS('k15-x',function(v){ x=v; }); bindS('k15-N0',function(v){ N0=v; });
      document.getElementById('k15-rec').addEventListener('click', record);
      document.getElementById('k15-rec10').addEventListener('click', function(){ var i,x0=x; for(i=0;i<5;i++){ x=1+Math.floor(Math.random()*20); record(); } x=x0; readout(); });
      document.getElementById('k15-clr').addEventListener('click', function(){ reportClear(); cnt=0; synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); graph(); });
      document.getElementById('k15-new').addEventListener('click', function(){ MU_TRUE=+(0.15+Math.random()*0.13).toFixed(3); reportClear(); cnt=0; synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); anim(Anim.time(15)); graph(); });
      synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows());
      synthSetup(15, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();

/* ══ 종합 2 : 초음파 왕복 시간 ═════════════════════════════════════════ */
var C_TRUE=1540;
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = (function(){
  var d=8, S=0.5, cnt=0, started=false;
  function tth(dd){ return 2e4*dd/C_TRUE; }
  reportDefine('C',{ title:'초음파로 재는 깊이 — 음속과 왕복 시간', tabName:'[종합2] 초음파로 재는 깊이', xLabel:'깊이 d (cm)', yLabel:'왕복 시간 t (μs)',
    cols:['#','d (cm)','σ (μs)','t (μs)','t/d (μs/cm)'], mode:'line', zero:true,
    interpret:function(f){ var c=2e4/f.a; return {label:'음속 c', value:c, unit:'m/s', trueValue:C_TRUE, formula:'t = 2d/c → 기울기 = 2/c (μs/cm) → c = 2×10⁴ / 기울기', digits:0}; },
    method:'① 깊이를 바꿔 가며 초음파 펄스의 왕복 시간 t 를 기록했다\n② t 대 d 그래프를 그리고 원점을 지나는 직선으로 맞췄다\n③ 기울기 2/c 에서 음속 c 를 구하고 1540 m/s 와 비교했다' });
  function rows(){ return reportExtra('C').rows; }
  function cols(){ return reportExtra('C').cols; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  function record(){
    var r=rng32(cnt*613+d*3+29), t=tth(d)+S*gaussR(r); cnt++;
    reportPush([cnt,d,S.toFixed(1),t.toFixed(2),(t/d).toFixed(2)], d, t, 'C'); synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); graph();
  }
  function readout(){
    var f=fit(); setTxt('k16-dV',d+' cm'); setTxt('k16-SV',S.toFixed(1)+' μs'); setTxt('k16-oT',tth(d).toFixed(1)+' μs');
    setTxt('k16-oM',rows().length? rows()[rows().length-1].y.toFixed(2)+' μs':'—');
    var cf=f&&f.a>0? 2e4/f.a:null; setTxt('k16-oF',cf? cf.toFixed(0)+' m/s':'— (2개 이상)'); setTxt('k16-oE',((1540/C_TRUE-1)*100).toFixed(1)+' %'); setTxt('k16-oN',rows().length+' 개');
  }
  function anim(t){
    var cv=document.getElementById('k16-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, y0=H/2, x0=70, x1=W-60, tt=tth(d), ph=(t/10)*1.6, T=Math.min(1,ph);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=COL.panel||'#1e293b'; ctx.fillRect(14,y0-26,40,52); cvText(ctx,'탐촉자',34,y0+44,COL.tick,'11px system-ui,sans-serif','center');
    ctx.fillStyle='rgba(251,113,133,.14)'; ctx.fillRect(54,20,W-54,H-40);
    var xr=x0+(x1-x0)*d/20; ctx.fillStyle=COL.grav; ctx.fillRect(xr,y0-20,8,40); cvText(ctx,'반사체 d = '+d+' cm',xr,y0-30,COL.grav,'11.5px system-ui,sans-serif','center');
    var go=Math.min(1,T*2), back=Math.max(0,T*2-1), px=x0+(xr-x0)*go-(xr-x0)*back; cvCirc(ctx,px,y0+(back>0?10:0),6,back>0?COL.ok:COL.amber,null,0);
    cvLine(ctx,[[x0,y0+34],[x1,y0+34]],COL.axis2,1); cvText(ctx,'t = 2d/c = '+tt.toFixed(1)+' μs (타이머 : '+(tt*Math.min(1,T)).toFixed(1)+' μs)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'숨은 음속 c 는 조직마다 다름 — 1450 ~ 1600 m/s',12,H-10,COL.tick,'11px system-ui,sans-serif');
  }
  function graph(){
    var cv=document.getElementById('k16-cv2'); if(!cv) return; var s0=setupCanvas(cv), rs=rows(), f=fit(), st=2e4/C_TRUE;
    synthFit(s0.ctx,s0.w,s0.h,{xm:20,ym:st*20*1.2,xl:'깊이 d (cm)',yl:'왕복 시간 t (μs)',title:'t 대 d — 기울기 = 2/c',xd:0,yd:0,strue:st,f:f,pts:rs.map(function(r){ return [r.x,r.y]; }),now:[d,tth(d)],lab:function(f){ return '내 회귀 : c '+(2e4/f.a).toFixed(0)+' m/s'; }});
  }
  function init(){
    if(!started){ started=true;
      function bindS(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); readout(); anim(Anim.time(16)); graph(); }); }
      bindS('k16-d',function(v){ d=v; }); bindS('k16-S',function(v){ S=v; });
      document.getElementById('k16-rec').addEventListener('click', record);
      document.getElementById('k16-rec10').addEventListener('click', function(){ var d0=d, i; for(i=0;i<5;i++){ d=2+Math.floor(Math.random()*19); record(); } d=d0; readout(); });
      document.getElementById('k16-clr').addEventListener('click', function(){ reportClear('C'); cnt=0; synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); graph(); });
      document.getElementById('k16-new').addEventListener('click', function(){ C_TRUE=Math.round(1450+Math.random()*150); reportClear('C'); cnt=0; synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); anim(Anim.time(16)); graph(); });
      synthTable('k16-tbl','k16-cnt',cols(),rows());
      synthSetup(16, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();

/* ══ 종합 3 : SNR √N ═══════════════════════════════════════════════════ */
var SNR1_TRUE=3.0;
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = (function(){
  var Nf=8, cnt=0, started=false, ph=null;
  reportDefine('D',{ title:'잡음과 평균 — SNR 의 √N 법칙', tabName:'[종합3] 잡음과 평균', xLabel:'√N', yLabel:'SNR',
    cols:['#','N','√N','SNR(측정)'], mode:'line', zero:true,
    interpret:function(f){ return {label:'한 장의 SNR₁', value:f.a, unit:'', trueValue:SNR1_TRUE, formula:'SNR = SNR₁·√N → 기울기 = SNR₁ · 목표 SNR 12 를 얻는 평균 장 수 N = (12/SNR₁)² = '+Math.pow(12/f.a,2).toFixed(0)+' 장', digits:2}; },
    method:'① 평균 장 수 N 을 바꿔 가며 평균 영상의 SNR 을 측정했다\n② SNR 대 √N 그래프를 그리고 원점을 지나는 직선으로 맞췄다\n③ 기울기 = 한 장의 SNR 이며 화질 2 배에 N 4 배가 필요함을 확인했다' });
  function rows(){ return reportExtra('D').rows; }
  function cols(){ return reportExtra('D').cols; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  function record(){
    var r=rng32(cnt*1013+Nf*17+3), y=SNR1_TRUE*Math.sqrt(Nf)*(1+0.07*gaussR(r)); cnt++;
    reportPush([cnt,Nf,Math.sqrt(Nf).toFixed(2),y.toFixed(2)], Math.sqrt(Nf), y, 'D'); synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); graph();
  }
  function readout(){
    var f=fit(); setTxt('k17-NfV',Nf+' 장'); setTxt('k17-oS',(SNR1_TRUE*Math.sqrt(Nf)).toFixed(2)); setTxt('k17-oM',rows().length? rows()[rows().length-1].y.toFixed(2):'—');
    setTxt('k17-oF',f? f.a.toFixed(2):'— (2개 이상)'); setTxt('k17-oR',(Nf)+' 배 시간/선량 → 화질 '+Math.sqrt(Nf).toFixed(1)+' 배'); setTxt('k17-oN',rows().length+' 개');
  }
  function noiseImg(N,seed){ var S=40, a=new Float32Array(S*S), r=rng32(seed), i,j; for(j=0;j<S;j++) for(i=0;i<S;i++){ var cx=(i-S/2)/(S/2), cy=(j-S/2)/(S/2), s=(cx*cx+cy*cy<0.55)?(Math.hypot(cx-0.2,cy+0.1)<0.22?1.0:0.6):0; a[j*S+i]=s+ (1/SNR1_TRUE)*0.6*gaussR(r)/Math.sqrt(N); } return a; }
  function anim(t){
    var cv=document.getElementById('k17-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, sz=Math.min((W-60)/2,H-70), x0=20, y0=34, key=Nf+'|'+SNR1_TRUE;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H); if(!ph||ph.k!==key) ph={k:key,a:noiseImg(1,3),b:noiseImg(Nf,4)};
    grayImage(ctx,ph.a,40,x0,y0,sz,sz,-0.3,1.3,false); grayImage(ctx,ph.b,40,x0+sz+20,y0,sz,sz,-0.3,1.3,false); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,sz,sz); ctx.strokeRect(x0+sz+20,y0,sz,sz);
    cvText(ctx,'한 장 (SNR₁ = '+SNR1_TRUE.toFixed(1)+' 숨은 값)',x0+sz/2,y0-8,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,Nf+' 장 평균 (SNR ≈ '+(SNR1_TRUE*Math.sqrt(Nf)).toFixed(1)+')',x0+sz*1.5+20,y0-8,COL.ok,'bold 11.5px system-ui,sans-serif','center');
  }
  function graph(){
    var cv=document.getElementById('k17-cv2'); if(!cv) return; var s0=setupCanvas(cv), rs=rows(), f=fit();
    synthFit(s0.ctx,s0.w,s0.h,{xm:8,ym:Math.max(8,SNR1_TRUE*8*1.15),xl:'√N',yl:'SNR',title:'SNR 대 √N — 기울기 = SNR₁',xd:0,yd:0,strue:SNR1_TRUE,f:f,pts:rs.map(function(r){ return [r.x,r.y]; }),now:[Math.sqrt(Nf),SNR1_TRUE*Math.sqrt(Nf)],lab:function(f){ return '내 회귀 : SNR₁ '+f.a.toFixed(2); }});
  }
  function init(){
    if(!started){ started=true;
      document.getElementById('k17-Nf').addEventListener('input',function(){ Nf=+this.value; readout(); anim(Anim.time(17)); graph(); });
      document.getElementById('k17-rec').addEventListener('click', record);
      document.getElementById('k17-rec10').addEventListener('click', function(){ var n0=Nf, i, ns=[1,4,9,16,25,36,49,64]; for(i=0;i<5;i++){ Nf=ns[Math.floor(Math.random()*ns.length)]; record(); } Nf=n0; readout(); });
      document.getElementById('k17-clr').addEventListener('click', function(){ reportClear('D'); cnt=0; synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); graph(); });
      document.getElementById('k17-new').addEventListener('click', function(){ SNR1_TRUE=+(2+Math.random()*3).toFixed(1); ph=null; reportClear('D'); cnt=0; synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); anim(Anim.time(17)); graph(); });
      synthTable('k17-tbl','k17-cnt',cols(),rows());
      synthSetup(17, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();
