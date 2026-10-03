/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : α = τ/I (직선)    종합2 : ω₂ = (I₁/I₂)ω₁ (직선)    종합3 : a = g sinθ/(1+k) (직선)
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

/* ══ 종합 1 : 토크 대 각가속도 → 관성 모멘트 ════════════════════════ */
var I_TRUE=1.8;   // ×10⁻³ kg·m²
var RPUL=0.025;
function tauMN(m){ return m/1000*G*RPUL*1000; }   // mN·m
reportSetMeta({ title:'토크 대 각가속도 — 도르래 원판의 관성 모멘트', tabName:'[종합1] 토크 대 각가속도',
  xLabel:'토크 τ = mgr (mN·m)', yLabel:'각가속도 α (rad/s²)', cols:['#','m (g)','σ (rad/s²)','α (rad/s²)','α / τ (rad/s² per mN·m)'], zero:true,
  interpret:function(f){ return {label:'관성 모멘트 I', value:1/f.a, unit:'×10⁻³ kg·m²', trueValue:I_TRUE, formula:'α = τ/I → 기울기 = 1/I → I = 1/기울기 (τ 는 mN·m)', digits:3}; } });
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = synthMake({ n:15, rep:'A', xid:'m', x0:100, s0:0.4, seed:977,
  truth:function(m){ return tauMN(m)/I_TRUE; }, noise:function(s){ return s; }, slope:function(){ return 1/I_TRUE; }, xOf:function(m){ return tauMN(m); },
  xm:50, ym:function(){ return 50/I_TRUE*1.1; }, xl:'토크 τ = mgr (mN·m)', yl:'각가속도 α (rad/s²)', gtitle:'α 대 τ — 기울기 = 1/I', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : I '+(1/f.a).toFixed(3)+' ×10⁻³ kg·m² (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(m){ return m+' g'; }, fmtS:function(s){ return s.toFixed(1)+' rad/s²'; },
  randX:function(){ return 10+10*Math.floor(Math.random()*20); }, newTrue:function(){ I_TRUE=+(0.8+Math.random()*2.2).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(1),y.toFixed(2),(y/tauMN(st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oT',tauMN(st.x).toFixed(2)+' mN·m'); set('oM',last==null?'—':last.toFixed(2)+' rad/s²'); set('oF',f? f.a.toFixed(3)+' rad/s² per mN·m':'— (2개 이상)'); set('oE',f? (1/f.a).toFixed(3)+' ×10⁻³ kg·m²':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var cx=w*0.3, cy=h*0.4, R=Math.min(h*0.26,w*0.14), al=tauMN(st.x)/I_TRUE, T=3, tc=(t%5)<T? (t%5):T, th=0.5*al*tc*tc*0.15, dy=Math.min(h*0.3,0.5*al*tc*tc*0.15*R*0.35);
    drawWheel(ctx,cx,cy,R,th,0.5); var rx=cx+R*0.35; cvLine(ctx,[[rx,cy],[rx,cy+R*0.5+dy+14]],COL.dim,1.5); cvRect(ctx,rx-16,cy+R*0.5+dy+14,32,22,COL.grav,COL.white,1.2); cvText(ctx,st.x+' g',rx,cy+R*0.5+dy+25,'#07101f','bold 11px system-ui,sans-serif','center');
    cvText(ctx,'τ = '+tauMN(st.x).toFixed(1)+' mN·m · 숨은 관성 모멘트 I 때문에 각가속도 α 가 정해진다',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'t = '+tc.toFixed(1)+' s',12,36,COL.tick,'12px system-ui,sans-serif');
    barRows(ctx,w*0.55,h*0.3,w*0.4,h*0.5,[['토크 τ',tauMN(st.x),COL.blue],['α (×1)',al,COL.ok]],Math.max(tauMN(st.x),al)*1.15,''); } });

/* ══ 종합 2 : 각운동량 보존 → I₁/I₂ ════════════════════════════════ */
var RATIO_TRUE=2.4;
reportDefine('C',{ title:'각운동량 보존 — 팔을 오므릴 때의 관성 모멘트 비', tabName:'[종합2] 각운동량 보존', xLabel:'처음 각속도 ω₁ (rad/s)', yLabel:'나중 각속도 ω₂ (rad/s)',
  cols:['#','ω₁ (rad/s)','σ (rad/s)','ω₂ (rad/s)','ω₂/ω₁'], mode:'line', zero:true,
  interpret:function(f){ return {label:'관성 모멘트 비 I₁/I₂', value:f.a, unit:'', trueValue:RATIO_TRUE, formula:'I₁ω₁ = I₂ω₂ → 기울기 = I₁/I₂', digits:3}; },
  method:'① 회전 의자에서 팔을 벌려(I₁) 천천히 돌려 처음 각속도 ω₁ 을 영상으로 쟀다(보조자 2 명, 낮은 속도)\n② 팔을 오므려(I₂) 나중 각속도 ω₂ 를 쟀다\n③ ω₂ 대 ω₁ 직선의 기울기에서 관성 모멘트 비 I₁/I₂ 를 구하고 팔 길이로 예측한 값과 비교했다' });
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = synthMake({ n:16, rep:'C', xid:'w', x0:1, s0:0.08, seed:613,
  truth:function(w){ return RATIO_TRUE*w; }, noise:function(s){ return s; }, slope:function(){ return RATIO_TRUE; }, xOf:function(w){ return w; },
  xm:2.1, ym:function(){ return RATIO_TRUE*2.1*1.1; }, xl:'처음 각속도 ω₁ (rad/s)', yl:'나중 각속도 ω₂ (rad/s)', gtitle:'ω₂ 대 ω₁ — 기울기 = I₁/I₂', xd:1, yd:1,
  lab:function(f){ return '내 회귀 : I₁/I₂ '+f.a.toFixed(3); },
  fmtX:function(v){ return v.toFixed(1)+' rad/s'; }, fmtS:function(s){ return s.toFixed(2)+' rad/s'; },
  randX:function(){ return 0.3+0.1*Math.floor(Math.random()*18); }, newTrue:function(){ RATIO_TRUE=+(1.8+Math.random()*1.4).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x.toFixed(1),st.s.toFixed(2),y.toFixed(2),(y/st.x).toFixed(2)]; },
  readout:function(f,rs,last,st,set){ set('oT',st.x.toFixed(1)+' rad/s'); set('oM',last==null?'—':last.toFixed(2)+' rad/s'); set('oF',f? f.a.toFixed(3):'— (2개 이상)'); set('oE',f? f.a.toFixed(2)+' 배 (K₂/K₁ = I₁/I₂)':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var cx=w*0.3, cy=h*0.52, sc=Math.min(h*0.34,w*0.2), cyc=10, tc=t%cyc, ph=tc<2? 0:(tc<4? (tc-2)/2:(tc<8? 1:1-(tc-8)/2)), r=1-0.58*ph, om=st.x*(1+(RATIO_TRUE-1)*ph);
    var ang=0, k, steps=Math.floor(tc*20); for(k=0;k<steps;k++){ var tt=k/20, pp=tt<2?0:(tt<4?(tt-2)/2:(tt<8?1:1-(tt-8)/2)); ang+=st.x*(1+(RATIO_TRUE-1)*pp)/20; }
    cvCirc(ctx,cx,cy,14,'rgba(148,163,184,.55)',COL.white,1.2); [0,PI].forEach(function(a0){ var ex=cx+r*sc*Math.cos(ang+a0), ey=cy+r*sc*Math.sin(ang+a0); cvLine(ctx,[[cx,cy],[ex,ey]],COL.tick,4); cvCirc(ctx,ex,ey,9,COL.grav,COL.white,1.2); });
    cvText(ctx,'ω = '+om.toFixed(2)+' rad/s · 팔 '+(r*100).toFixed(0)+' % · 숨은 I₁/I₂ 때문에 오므리면 빨라진다',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'처음 ω₁ = '+st.x.toFixed(1)+' rad/s',12,36,COL.tick,'12px system-ui,sans-serif');
    barRows(ctx,w*0.55,h*0.3,w*0.4,h*0.5,[['ω₁',st.x,COL.blue],['지금 ω',om,COL.ok]],Math.max(st.x*RATIO_TRUE,0.5)*1.1,' rad/s'); } });

/* ══ 종합 3 : 구르기 가속도 → 모양 계수 k ══════════════════════════ */
var K_TRUE=0.5;
function gs(th){ return G*Math.sin(th*PI/180); }
reportDefine('D',{ title:'구르기 가속도 — 경사면에서 모양 계수 k', tabName:'[종합3] 구르기 가속도', xLabel:'g sinθ (m/s²)', yLabel:'가속도 a (m/s²)',
  cols:['#','θ (°)','σ (m/s²)','a (m/s²)','a / (g sinθ)'], mode:'line', zero:true,
  interpret:function(f){ return {label:'모양 계수 k', value:1/f.a-1, unit:'', trueValue:K_TRUE, formula:'a = g sinθ/(1+k) → 기울기 = 1/(1+k) → k = 1/기울기 − 1', digits:3}; },
  method:'① 경사판에서 구르는 물체를 경사각별로 굴리고 스마트폰 슬로 모션으로 출발 위치와 시간을 쟀다\n② a = 2L/t² 로 가속도를 구해 a 대 g sinθ 그래프를 그렸다\n③ 원점을 지나는 직선의 기울기에서 모양 계수 k 를 구하고 이론값(구 0.4, 원통 0.5, 고리 1)과 비교했다' });
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = synthMake({ n:17, rep:'D', xid:'th', x0:10, s0:0.05, seed:1013,
  truth:function(th){ return gs(th)/(1+K_TRUE); }, noise:function(s){ return s; }, slope:function(){ return 1/(1+K_TRUE); }, xOf:function(th){ return gs(th); },
  xm:3.6, ym:function(){ return 3.6/(1+K_TRUE)*1.15; }, xl:'g sinθ (m/s²)', yl:'가속도 a (m/s²)', gtitle:'a 대 g sinθ — 기울기 = 1/(1+k)', xd:1, yd:2,
  lab:function(f){ return '내 회귀 : k '+(1/f.a-1).toFixed(3); },
  fmtX:function(v){ return v+'°'; }, fmtS:function(s){ return s.toFixed(2)+' m/s²'; },
  randX:function(){ return 2+Math.floor(Math.random()*19); }, newTrue:function(){ K_TRUE=+(0.35+Math.random()*0.65).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(2),y.toFixed(3),(y/gs(st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oX',gs(st.x).toFixed(3)+' m/s²'); set('oM',last==null?'—':last.toFixed(3)+' m/s²'); set('oF',f? f.a.toFixed(3):'— (2개 이상)'); set('oE',f? (1/f.a-1).toFixed(3):'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var x0=w*0.1, x1=w*0.85, gy=h*0.82, th=st.x*PI/180, Lr=(x1-x0), hy=Math.min(h*0.6,Lr*Math.tan(th)), a=gs(st.x)/(1+K_TRUE), T=Math.sqrt(2*1/a), tc=(t%(T+2))<T? (t%(T+2)):T, d=Math.min(1,0.5*a*tc*tc/1.0);
    cvLine(ctx,[[x0,gy-hy],[x1,gy]],COL.tick,4); cvLine(ctx,[[x0,gy],[x1,gy]],COL.dim,1); cvText(ctx,'θ = '+st.x+'°',x1-50,gy-8,COL.tick,'12px system-ui,sans-serif','center');
    var px=x0+(x1-x0)*d*0.92, py=gy-hy+(hy)*d*0.92-14; drawWheel(ctx,px,py,14,d*14,K_TRUE>0.9?1:0.5);
    cvText(ctx,'a = '+a.toFixed(2)+' m/s² (g sinθ = '+gs(st.x).toFixed(2)+') · 숨은 모양 계수 k',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'1 m 구르는 시간 '+T.toFixed(2)+' s · t = '+tc.toFixed(2)+' s',12,36,COL.tick,'12px system-ui,sans-serif'); } });
