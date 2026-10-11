/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : v² = (2g/K)h (직선)    종합2 : T = √K · x (직선)    종합3 : Q = x/μ (직선)
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


/** 종합 한 개 만들기 : cfg 에 따라 슬라이더 · 기록 · 읽기 · 그림 · 그래프를 묶는다 */
function synthMake(cfg){
  var n=cfg.n, pre='k'+n, st={x:cfg.x0, s:cfg.s0}, cnt=0, started=false, key=cfg.rep==='A'?undefined:cfg.rep;
  function rows(){ return key? reportExtra(key).rows : REPORT_DATA.rows; }
  function cols(){ return key? reportExtra(key).cols : REPORT_DATA.cols; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  function push(cells,x,y){ if(key) reportPush(cells,x,y,key); else reportPush(cells,x,y); }
  function clear(){ if(key) reportClear(key); else reportClear(); cnt=0; table(); readout(); graph(); }
  function table(){ synthTable(pre+'-tbl',pre+'-cnt',cols(),rows()); }
  function record(){
    var r=rng32(cnt*cfg.seed+Math.round(st.x*7)+Math.round(st.s*13)+11), y=cfg.truth(st.x)+cfg.noise(st.s)*gaussR(r); cnt++;
    var c=cfg.cells(cnt,st,y); push(c,cfg.xOf(st.x),y); table(); readout(); graph();
  }
  function readout(){
    var f=fit(), rs=rows(), last=rs.length? rs[rs.length-1].y : null;
    setTxt(pre+'-'+cfg.xid+'V', cfg.fmtX(st.x)); setTxt(pre+'-SV', cfg.fmtS(st.s));
    cfg.readout(f, rs, last, st, function(id,v){ setTxt(pre+'-'+id, v); });
  }
  function anim(t){ var cv=document.getElementById(pre+'-cv'); if(!cv) return; var s0=setupCanvas(cv); s0.ctx.fillStyle=COL.cvbg; s0.ctx.fillRect(0,0,s0.w,s0.h); cfg.anim(s0.ctx,s0.w,s0.h,t,st); }
  function graph(){
    var cv=document.getElementById(pre+'-cv2'); if(!cv) return; var s0=setupCanvas(cv), f=fit();
    synthFit(s0.ctx,s0.w,s0.h,{xm:cfg.xm,ym:cfg.ym(),xl:cfg.xl,yl:cfg.yl,title:cfg.gtitle,xd:cfg.xd,yd:cfg.yd,strue:cfg.slope(),f:f,
      pts:rows().map(function(r){ return [r.x,r.y]; }),now:[cfg.xOf(st.x),cfg.truth(st.x)],lab:cfg.lab});
  }
  function init(){
    if(!started){ started=true;
      function bindS(id,k){ document.getElementById(pre+'-'+id).addEventListener('input',function(){ st[k]=+this.value; readout(); anim(Anim.time(n)); graph(); }); }
      bindS(cfg.xid,'x'); bindS('S','s');
      document.getElementById(pre+'-rec').addEventListener('click', record);
      document.getElementById(pre+'-rec10').addEventListener('click', function(){ var x0=st.x, i; for(i=0;i<5;i++){ st.x=cfg.randX(); record(); } st.x=x0; readout(); });
      document.getElementById(pre+'-clr').addEventListener('click', clear);
      document.getElementById(pre+'-new').addEventListener('click', function(){ cfg.newTrue(); clear(); anim(Anim.time(n)); });
      table(); synthSetup(n, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
}

/* ══ 종합 1 : v² 대 h → 총 손실 계수 K ═════════════════════════════ */
var K_TRUE=4.8;
reportSetMeta({ title:'높이차 대 v² — 사이펀의 총 손실 계수 K', tabName:'[종합1] 높이차 대 v²',
  xLabel:'높이차 h (m)', yLabel:'유속의 제곱 v² (m²/s²)', cols:['#','h (cm)','σ (m²/s²)','v² (m²/s²)','v²/h (m/s²)'], zero:true,
  interpret:function(f){ return {label:'총 손실 계수 K', value:2*G/f.a, unit:'', trueValue:K_TRUE, formula:'v² = (2g/K)h → 기울기 = 2g/K → K = 2g/기울기', digits:3}; } });
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = synthMake({ n:15, rep:'A', xid:'h', x0:50, s0:0.08, seed:977,
  truth:function(h){ return 2*G/K_TRUE*h/100; }, noise:function(s){ return s; }, slope:function(){ return 2*G/K_TRUE; }, xOf:function(h){ return h/100; },
  xm:1.05, ym:function(){ return 2*G/K_TRUE*1.05*1.1; }, xl:'높이차 h (m)', yl:'유속의 제곱 v² (m²/s²)', gtitle:'v² 대 h — 기울기 = 2g/K', xd:1, yd:1,
  lab:function(f){ return '내 회귀 : K '+(2*G/f.a).toFixed(2)+' (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(h){ return h+' cm'; }, fmtS:function(s){ return s.toFixed(2)+' (m/s)²'; },
  randX:function(){ return 10+5*Math.floor(Math.random()*19); }, newTrue:function(){ K_TRUE=+(2.5+Math.random()*4.5).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(2),y.toFixed(2),(y/(st.x/100)).toFixed(2)]; },
  readout:function(f,rs,last,st,set){ set('oT',(2*G/K_TRUE*st.x/100).toFixed(2)+' (m/s)²'); set('oM',last==null?'—':last.toFixed(2)+' (m/s)²'); set('oF',f? f.a.toFixed(2)+' m/s²':'— (2개 이상)'); set('oE',f? (2*G/f.a).toFixed(2):'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var v=Math.sqrt(2*G/K_TRUE*st.x/100); siphonDraw(ctx,0,26,w,h-30,{hU:st.x,Hc:25,hL:null,v:v,on:true,tankH:35},t); cvText(ctx,'높이차 h = '+st.x+' cm → v² = '+(v*v).toFixed(2)+' (m/s)² · 숨은 손실 계수 K 때문에 v 가 정해진다',12,14,COL.text,'bold 12px system-ui,sans-serif'); } });

/* ══ 종합 2 : T 대 x → 총 손실 계수 K ══════════════════════════════ */
var K2_TRUE=5.2, AHOSE=PI*0.01*0.01/4;
function xT(A){ return (A*1e-4/AHOSE)*Math.sqrt(2*0.25/G); }
reportDefine('C',{ title:'배수 시간 — 통 · 관 면적비와 총 손실 계수 K', tabName:'[종합2] 배수 시간', xLabel:'x = (A_t/a)√(2h₀/g) (s)', yLabel:'배수 시간 T (s)',
  cols:['#','A_t (cm²)','σ (s)','T (s)','T/x'], mode:'line', zero:true,
  interpret:function(f){ return {label:'총 손실 계수 K', value:f.a*f.a, unit:'', trueValue:K2_TRUE, formula:'T = √K · x → 기울기 = √K → K = 기울기²', digits:3}; },
  method:'① 단면적이 다른 통과 호스(지름 10 mm · 1 m)로 사이펀을 시동했다(입으로 빨지 않음)\n② 처음 수위차 25 cm 에서 완전히 비워질 때까지의 시간 T 를 쟀다\n③ T 대 x 직선의 기울기에서 총 손실 계수 K 를 구했다' });
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = synthMake({ n:16, rep:'C', xid:'A', x0:300, s0:4, seed:613,
  truth:function(A){ return Math.sqrt(K2_TRUE)*xT(A); }, noise:function(s){ return s; }, slope:function(){ return Math.sqrt(K2_TRUE); }, xOf:function(A){ return xT(A); },
  xm:xT(800)*1.05, ym:function(){ return Math.sqrt(K2_TRUE)*xT(800)*1.1; }, xl:'x = (A_t/a)√(2h₀/g) (s)', yl:'배수 시간 T (s)', gtitle:'T 대 x — 기울기 = √K', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : K '+(f.a*f.a).toFixed(2)+' (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(v){ return v+' cm²'; }, fmtS:function(s){ return s.toFixed(0)+' s'; },
  randX:function(){ return 100+50*Math.floor(Math.random()*15); }, newTrue:function(){ K2_TRUE=+(3+Math.random()*5).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(0),y.toFixed(0),(y/xT(st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oT',xT(st.x).toFixed(0)+' s'); set('oM',last==null?'—':last.toFixed(0)+' s'); set('oF',f? f.a.toFixed(3):'— (2개 이상)'); set('oE',f? (f.a*f.a).toFixed(2):'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var T=Math.sqrt(K2_TRUE)*xT(st.x), f=Math.min(1,(t%12)/10), c=(AHOSE/(st.x*1e-4))*Math.sqrt(G/(2*K2_TRUE)), hh=Math.pow(Math.max(0,Math.sqrt(0.25)-c*f*T),2)*100; siphonDraw(ctx,0,26,w,h-30,{hU:hh,Hc:25,hL:null,v:hh>0.5?1.2:0,on:hh>0.5,tankH:35},t); cvText(ctx,'A_t = '+st.x+' cm² · 수위차 '+hh.toFixed(1)+' cm · 실제 시간 '+(f*T).toFixed(0)+' / 숨은 총 시간',12,14,COL.text,'bold 12px system-ui,sans-serif'); } });

/* ══ 종합 3 : Q 대 x → 점성 μ ═══════════════════════════════════════ */
var MU_TRUE=1.0;
function xV(D){ var d=D/1000; return PI*RHO*G*0.4*Math.pow(d,4)/(128*0.5)*1e9; }
reportDefine('D',{ title:'가는 관 유량 — 물의 점성 μ', tabName:'[종합3] 가는 관 유량', xLabel:'x = πρghD⁴/(128L) (×10⁻⁹)', yLabel:'유량 Q (mL/s)',
  cols:['#','D (mm)','σ (mL/s)','Q (mL/s)','Q/x'], mode:'line', zero:true,
  interpret:function(f){ return {label:'물의 점성 μ', value:1/f.a, unit:'mPa·s', trueValue:MU_TRUE, formula:'Q = x/μ → 기울기 = 1/μ → μ = 1/기울기 (mPa·s)', digits:3}; },
  method:'① 지름이 다른 가는 관(길이 0.5 m)을 높이차 40 cm 사이펀으로 만들었다(주사기로 시동)\n② 50 mL 를 받는 시간으로 유량 Q 를 쟀다\n③ Q 대 x 직선의 기울기에서 물의 점성 μ 를 구하고 수온의 알려진 값과 비교했다' });
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = synthMake({ n:17, rep:'D', xid:'D', x0:2.5, s0:0.05, seed:1013,
  truth:function(D){ return xV(D)/MU_TRUE; }, noise:function(s){ return s; }, slope:function(){ return 1/MU_TRUE; }, xOf:function(D){ return xV(D); },
  xm:xV(3.5)*1.05, ym:function(){ return xV(3.5)/MU_TRUE*1.1; }, xl:'x = πρghD⁴/(128L) (×10⁻⁹)', yl:'유량 Q (mL/s)', gtitle:'Q 대 x — 기울기 = 1/μ', xd:0, yd:1,
  lab:function(f){ return '내 회귀 : μ '+(1/f.a).toFixed(3)+' mPa·s (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(v){ return v.toFixed(2)+' mm'; }, fmtS:function(s){ return s.toFixed(2)+' mL/s'; },
  randX:function(){ return 1.5+0.25*Math.floor(Math.random()*9); }, newTrue:function(){ MU_TRUE=+(0.8+Math.random()*0.6).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x.toFixed(2),st.s.toFixed(2),y.toFixed(2),(y/xV(st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oX',xV(st.x).toFixed(1)); set('oM',last==null?'—':last.toFixed(2)+' mL/s'); set('oF',f? f.a.toFixed(3):'— (2개 이상)'); set('oE',f? (1/f.a).toFixed(3)+' mPa·s':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var Q=xV(st.x)/MU_TRUE; siphonDraw(ctx,0,26,w,h-30,{hU:40,Hc:15,hL:null,v:Math.min(1.5,Q/(PI*st.x*st.x/4)*0.3),on:true,tankH:30},t); cvText(ctx,'가는 관 D = '+st.x.toFixed(2)+' mm → Q = x/μ = '+Q.toFixed(2)+' mL/s · 숨은 점성 μ',12,14,COL.text,'bold 12px system-ui,sans-serif'); } });
