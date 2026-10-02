/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : Δm = ρ_f V (직선)    종합2 : F₂ = η(A₂/A₁)F₁ (직선)    종합3 : p = ρ g h (직선)
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
    var r=rng32(cnt*cfg.seed+Math.round(st.x*7)+Math.round(st.s*13)+11), y=cfg.truth(st.x)+st.s*gaussR(r); cnt++;
    var c=cfg.cells(cnt,st,y); push(c,cfg.xOf(st.x),y); table(); readout(); graph();
  }
  function readout(){
    var f=fit(), rs=rows(), last=rs.length? rs[rs.length-1].y : null;
    setTxt(pre+'-xV', cfg.fmtX(st.x)); setTxt(pre+'-SV', cfg.fmtS(st.s));
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

/* ══ 종합 1 : 부력으로 액체 밀도 ═══════════════════════════════════════ */
var RHOF_TRUE=1.12;   // g/mL (숨은 값)
reportSetMeta({ title:'부력으로 재는 액체 밀도 — 아르키메데스 원리', tabName:'[종합1] 부력으로 재는 액체 밀도',
  xLabel:'잠긴 부피 V (mL)', yLabel:'저울 증가 Δm (g)', cols:['#','V (mL)','σ (g)','Δm (g)','Δm/V (g/mL)'], zero:true,
  interpret:function(f){ return {label:'액체 밀도 ρ_f', value:f.a*1000, unit:'kg/m³', trueValue:RHOF_TRUE*1000, formula:'Δm = ρ_f·V → 기울기 = ρ_f (g/mL) → ×1000 = kg/m³', digits:0}; } });
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = synthMake({ n:15, rep:'A', xid:'V', x0:100, s0:0.4, seed:977,
  truth:function(v){ return RHOF_TRUE*v; }, slope:function(){ return RHOF_TRUE; }, xOf:function(v){ return v; },
  xm:200, ym:function(){ return RHOF_TRUE*200*1.15; }, xl:'잠긴 부피 V (mL)', yl:'저울 증가 Δm (g)', gtitle:'Δm 대 V — 기울기 = ρ_f', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : ρ_f '+f.a.toFixed(3)+' g/mL (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(v){ return v+' mL'; }, fmtS:function(s){ return s.toFixed(1)+' g'; },
  randX:function(){ return 10*(1+Math.floor(Math.random()*20)); }, newTrue:function(){ RHOF_TRUE=+(0.95+Math.random()*0.30).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(1),y.toFixed(1),(y/st.x).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oB',(RHOF_TRUE*st.x*9.80/1000).toFixed(3)+' N'); set('oM',last==null?'—':last.toFixed(1)+' g'); set('oF',f? f.a.toFixed(3)+' g/mL':'— (2개 이상)'); set('oE',f? ((f.a-1)*100).toFixed(1)+' %':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,W,H,t,st){
    var bx=40, bw=Math.min(180,W*0.4), by=H-40, bh=H-110, top=by-bh, lvl=top+bh*0.28, ph=Math.min(1,(t/10)*1.5), v=st.x*ph, wv=st.x/200;
    cvRect(ctx,bx,lvl,bw,by-lvl,'rgba(56,189,248,.28)',null); cvRect(ctx,bx,top,bw,bh,null,COL.axis2||COL.tick,2);
    var oh=22+60*wv, oy=lvl+8+(by-lvl-oh-14)*ph*wv*0.9-30*(1-ph); cvLine(ctx,[[bx+bw/2,20],[bx+bw/2,oy]],COL.tick,1.2); cvRect(ctx,bx+bw/2-18,oy,36,oh,COL.amber,null);
    cvText(ctx,'추 (담근 부피 '+Math.round(v)+' mL)',bx+bw/2,by+16,COL.tick,'11px system-ui,sans-serif','center');
    var sx=bx+bw+70, sw=Math.min(150,W-sx-14); cvRect(ctx,sx,by-80,sw,80,'#1e293b',COL.axis2||COL.tick,1.5); var dm=RHOF_TRUE*v;
    cvText(ctx,dm.toFixed(1)+' g',sx+sw/2,by-40,COL.ok,'bold 22px system-ui,sans-serif','center'); cvText(ctx,'저울 증가 Δm = ρ_f V',sx+sw/2,by+16,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'숨은 액체 밀도 ρ_f (측정으로 알아낼 것)',12,14,COL.text,'bold 12px system-ui,sans-serif');
  } });

/* ══ 종합 2 : 유압 힘 증폭 ═════════════════════════════════════════════ */
var ETA_TRUE=0.85, AR=9;
reportDefine('C',{ title:'주사기 유압의 힘 증폭 — 파스칼 원리', tabName:'[종합2] 주사기 유압의 힘 증폭', xLabel:'입력 힘 F₁ (N)', yLabel:'출력 힘 F₂ (N)',
  cols:['#','F₁ (N)','σ (N)','F₂ (N)','F₂/F₁'], mode:'line', zero:true,
  interpret:function(f){ return {label:'유압 효율 η', value:f.a/AR, unit:'', trueValue:ETA_TRUE, formula:'F₂ = η(A₂/A₁)F₁ → 기울기 = η·'+AR+' → η = 기울기/'+AR, digits:3}; },
  method:'① 안지름이 다른 두 주사기를 물로 연결했다\n② 입력 힘 F₁ 을 바꾸며 출력 힘 F₂ 를 저울로 쟀다\n③ F₂ 대 F₁ 직선의 기울기를 면적비(안지름비의 제곱)와 비교해 효율 η 를 구했다' });
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = synthMake({ n:16, rep:'C', xid:'F', x0:5, s0:0.4, seed:613,
  truth:function(f1){ return ETA_TRUE*AR*f1; }, slope:function(){ return ETA_TRUE*AR; }, xOf:function(v){ return v; },
  xm:10, ym:function(){ return AR*10*1.1; }, xl:'입력 힘 F₁ (N)', yl:'출력 힘 F₂ (N)', gtitle:'F₂ 대 F₁ — 기울기 = η·'+AR, xd:0, yd:0,
  lab:function(f){ return '내 회귀 : η '+(f.a/AR).toFixed(3); },
  fmtX:function(v){ return v.toFixed(1)+' N'; }, fmtS:function(s){ return s.toFixed(1)+' N'; },
  randX:function(){ return 1+Math.floor(Math.random()*19)*0.5; }, newTrue:function(){ ETA_TRUE=+(0.70+Math.random()*0.25).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x.toFixed(1),st.s.toFixed(1),y.toFixed(2),(y/st.x).toFixed(2)]; },
  readout:function(f,rs,last,st,set){ set('oT',(AR*st.x).toFixed(1)+' N'); set('oM',last==null?'—':last.toFixed(2)+' N'); set('oF',f? f.a.toFixed(2):'— (2개 이상)'); set('oE',f? (f.a/AR).toFixed(3):'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,W,H,t,st){
    var cy=H*0.62, x0=24, s=Math.sin((t/10)*Math.PI*2)*0.5+0.5, push=s*40, rA=16, rB=rA*3, cx1=x0+80, cx2=W-90;
    cvRect(ctx,x0+30,cy-rA,160,2*rA,'rgba(56,189,248,.28)',COL.tick,1.5); cvRect(ctx,x0+190,cy-rB,W-190-x0-30-30,2*rB,'rgba(56,189,248,.28)',COL.tick,1.5);
    cvRect(ctx,x0+30+push-20,cy-rA+2,20,2*rA-4,COL.grav,null); cvLine(ctx,[[x0+30+push-20,cy],[x0+push-30,cy]],COL.grav,5);
    var up=push/9; cvRect(ctx,W-60-up,cy-rB+2,18,2*rB-4,COL.ok,null); cvLine(ctx,[[W-42-up,cy],[W-20,cy]],COL.ok,5);
    cvText(ctx,'F₁ = '+st.x.toFixed(1)+' N  (A₁ 작음)',x0+60,cy-rA-18,COL.grav,'bold 12px system-ui,sans-serif','left');
    cvText(ctx,'F₂ = '+(ETA_TRUE*AR*st.x).toFixed(1)+' N  (A₂ = 9A₁)',W-180,cy-rB-14,COL.ok,'bold 12px system-ui,sans-serif','left');
    cvText(ctx,'작은 쪽 이동 '+(push/4).toFixed(1)+' cm → 큰 쪽 이동 '+(push/36).toFixed(2)+' cm (거리 ÷9)',12,14,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'숨은 효율 η 는 마찰 · 공기 방울로 1 보다 작음',12,H-10,COL.tick,'11px system-ui,sans-serif');
  } });

/* ══ 종합 3 : 압력 대 깊이 ═════════════════════════════════════════════ */
var RHOP_TRUE=1000, G0=9.80;
reportDefine('D',{ title:'압력 대 깊이 — 정수압 p = ρgh', tabName:'[종합3] 압력 대 깊이', xLabel:'깊이 h (cm)', yLabel:'게이지 압력 p (Pa)',
  cols:['#','h (cm)','σ (Pa)','p (Pa)','p/h (Pa/cm)'], mode:'line', zero:true,
  interpret:function(f){ return {label:'액체 밀도 ρ', value:f.a*100/G0, unit:'kg/m³', trueValue:RHOP_TRUE, formula:'p = ρgh → 기울기(Pa/cm) = ρg/100 → ρ = 기울기×100/g', digits:0}; },
  method:'① 압력센서(또는 U자관)를 깊이를 바꿔 가며 물 속에 넣었다\n② 게이지 압력 p 대 깊이 h 그래프를 그렸다\n③ 기울기 ρg 에서 액체 밀도를 구하고 참값과 비교했다' });
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = synthMake({ n:17, rep:'D', xid:'h', x0:10, s0:20, seed:1013,
  truth:function(h){ return RHOP_TRUE*G0/100*h; }, slope:function(){ return RHOP_TRUE*G0/100; }, xOf:function(v){ return v; },
  xm:30, ym:function(){ return RHOP_TRUE*G0/100*30*1.15; }, xl:'깊이 h (cm)', yl:'게이지 압력 p (Pa)', gtitle:'p 대 h — 기울기 = ρg', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : ρ '+(f.a*100/G0).toFixed(0)+' kg/m³'; },
  fmtX:function(v){ return v+' cm'; }, fmtS:function(s){ return s.toFixed(0)+' Pa'; },
  randX:function(){ return 2+Math.floor(Math.random()*29); }, newTrue:function(){ RHOP_TRUE=Math.round(990+Math.random()*210); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(0),y.toFixed(0),(y/st.x).toFixed(1)]; },
  readout:function(f,rs,last,st,set){ set('oP',(RHOP_TRUE*G0*st.x/100).toFixed(0)+' Pa'); set('oM',last==null?'—':last.toFixed(0)+' Pa'); set('oF',f? (f.a*100/G0).toFixed(0)+' kg/m³':'— (2개 이상)'); set('oE',f? ((f.a*100/G0/1000-1)*100).toFixed(1)+' %':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,W,H,t,st){
    var tx=40, tw=Math.min(200,W*0.45), ty=44, th=H-80, ph=Math.min(1,(t/10)*1.5), hh=st.x*ph, py=ty+th*(hh/30);
    cvRect(ctx,tx,ty,tw,th,'rgba(56,189,248,.22)',COL.tick,2); cvLine(ctx,[[tx+tw/2,ty-24],[tx+tw/2,py]],COL.tick,1.5); cvCirc(ctx,tx+tw/2,py,7,COL.amber,null);
    cvText(ctx,'깊이 '+hh.toFixed(1)+' cm',tx+tw+10,py,COL.amber,'bold 12px system-ui,sans-serif','left');
    var bx=tx+tw+130, bw=Math.min(40,W-bx-14), p=RHOP_TRUE*G0/100*hh, bar=th*Math.min(1,p/(RHOP_TRUE*G0/100*30*1.1));
    if(bw>10){ cvRect(ctx,bx,ty,bw,th,'#1e293b',COL.tick,1); cvRect(ctx,bx,ty+th-bar,bw,bar,COL.grav,null); cvText(ctx,p.toFixed(0)+' Pa',bx+bw/2,ty+th+14,COL.text,'bold 12px system-ui,sans-serif','center'); }
    cvText(ctx,'p = ρ g h  (ρ 는 숨은 값)',12,14,COL.text,'bold 12px system-ui,sans-serif');
  } });
