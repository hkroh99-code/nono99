/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : Δp = ½ρ·v² (직선)    종합2 : Δp = 45C²(r²−1) (직선)    종합3 : L = C_L·½ρv²S (직선)
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

/* ══ 종합 1 : 피토관 동압 대 v² → 공기 밀도 ═══════════════════════════ */
var RHOA_TRUE=1.10;
reportSetMeta({ title:'동압 대 속력 — 피토관으로 재는 풍속과 공기 밀도', tabName:'[종합1] 동압 대 속력',
  xLabel:'속력의 제곱 v² (m²/s²)', yLabel:'압력 차이 Δp (Pa)', cols:['#','v (m/s)','σ (Pa)','Δp (Pa)','Δp / v² (Pa·s²/m²)'], zero:true,
  interpret:function(f){ return {label:'공기 밀도 ρ', value:f.a*2, unit:'kg/m³', trueValue:RHOA_TRUE, formula:'Δp = ½ρ·v² → 기울기 = ρ/2 → ρ = 2×기울기', digits:3}; } });
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = synthMake({ n:15, rep:'A', xid:'x', x0:12, s0:2, seed:977,
  truth:function(v){ return 0.5*RHOA_TRUE*v*v; }, noise:function(s){ return s; }, slope:function(){ return 0.5*RHOA_TRUE; }, xOf:function(v){ return v*v; },
  xm:1650, ym:function(){ return 0.5*RHOA_TRUE*1650*1.1; }, xl:'속력의 제곱 v² (m²/s²)', yl:'압력 차이 Δp (Pa)', gtitle:'Δp 대 v² — 기울기 = ρ/2', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : ρ '+(2*f.a).toFixed(3)+' kg/m³ (R² '+f.r2.toFixed(3)+')'; },
  fmtX:function(v){ return v+' m/s'; }, fmtS:function(s){ return s.toFixed(1)+' Pa'; },
  randX:function(){ return 3+Math.floor(Math.random()*38); }, newTrue:function(){ RHOA_TRUE=+(0.90+Math.random()*0.35).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x,st.s.toFixed(1),y.toFixed(1),(y/(st.x*st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ set('oP',(0.5*RHOA_TRUE*st.x*st.x).toFixed(1)+' Pa'); set('oM',last==null?'—':last.toFixed(1)+' Pa'); set('oF',f? (2*f.a).toFixed(3)+' kg/m³':'— (2개 이상)'); set('oE',f? ((2*f.a/1.204-1)*100).toFixed(1)+' %':'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var cy=h*0.5, dp=0.5*RHOA_TRUE*st.x*st.x, dh=Math.min(h*0.34,dp/1200*h*0.34*1.2); drawFan(ctx,36,cy,26,t,st.x); flowDots(ctx,t,st.x,70,w*0.5,cy-50,cy+50,40); cvRect(ctx,w*0.45,cy-6,w*0.14,12,'#475569',COL.axis2,1); cvRect(ctx,w*0.59,cy-6,8,h*0.24,'#475569',null);
    drawU(ctx,w*0.78,cy-h*0.22,w*0.1,h*0.5,dh*1.4); cvText(ctx,'Δp = '+dp.toFixed(1)+' Pa → 수주 '+(dp/(RHO_W*G)*1000).toFixed(1)+' mm',w*0.83,cy-h*0.22-12,COL.amber,'bold 12px system-ui,sans-serif','center'); cvText(ctx,'v = '+st.x+' m/s · 숨은 공기 밀도 ρ (측정으로 알아낼 것)',12,16,COL.text,'bold 12px system-ui,sans-serif'); } });

/* ══ 종합 2 : 벤투리 Δp 대 (r²−1) → 손실 계수 ══════════════════════════ */
var CC_TRUE=0.93;
reportDefine('C',{ title:'벤투리 압력 강하 — 면적비와 손실 계수', tabName:'[종합2] 벤투리 압력 강하', xLabel:'면적비 항 r² − 1', yLabel:'압력 강하 Δp (Pa)',
  cols:['#','r','σ (Pa)','Δp (Pa)','Δp/(r²−1)'], mode:'line', zero:true,
  interpret:function(f){ return {label:'손실 계수 C²', value:f.a/45, unit:'', trueValue:CC_TRUE, formula:'Δp = C²·½ρv₁²(r²−1) → 기울기 = 45C² (v₁ = 0.3 m/s) → C² = 기울기/45', digits:3}; },
  method:'① 투명 호스에 벤투리 목(면적비 r)을 만들고 입구 속력을 약 0.3 m/s 로 고정했다\n② 면적비를 바꾸며 입구 · 목의 압력 관 수주 차로 압력 강하 Δp 를 쟀다\n③ Δp 대 (r²−1) 직선의 기울기를 이론값 45 Pa 와 비교해 손실 계수를 구했다' });
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = synthMake({ n:16, rep:'C', xid:'r', x0:3, s0:3, seed:613,
  truth:function(r){ return CC_TRUE*45*(r*r-1); }, noise:function(s){ return s; }, slope:function(){ return CC_TRUE*45; }, xOf:function(r){ return r*r-1; },
  xm:36, ym:function(){ return 45*36*1.05; }, xl:'면적비 항 r² − 1', yl:'압력 강하 Δp (Pa)', gtitle:'Δp 대 (r² − 1) — 기울기 = 45 C²', xd:0, yd:0,
  lab:function(f){ return '내 회귀 : C² '+(f.a/45).toFixed(3); },
  fmtX:function(v){ return v.toFixed(1)+' : 1'; }, fmtS:function(s){ return s.toFixed(1)+' Pa'; },
  randX:function(){ return 1.5+Math.floor(Math.random()*10)*0.5; }, newTrue:function(){ CC_TRUE=+(0.85+Math.random()*0.14).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x.toFixed(1),st.s.toFixed(1),y.toFixed(1),(y/(st.x*st.x-1)).toFixed(1)]; },
  readout:function(f,rs,last,st,set){ set('oT',(45*(st.x*st.x-1)).toFixed(0)+' Pa'); set('oM',last==null?'—':last.toFixed(1)+' Pa'); set('oF',f? f.a.toFixed(1)+' Pa':'— (2개 이상)'); set('oE',f? (f.a/45).toFixed(3):'—'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var x0=24, L=w-2*x0, cy=h*0.62, d1=h*0.2, d2=d1/Math.sqrt(st.x), k, top=[], bot=[]; for(k=0;k<=60;k++){ var x=k/60, dd=dProf(x,d1,d2); top.push([x0+x*L,cy-dd/2]); bot.push([x0+x*L,cy+dd/2]); }
    ctx.beginPath(); top.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(k=bot.length-1;k>=0;k--) ctx.lineTo(bot[k][0],bot[k][1]); ctx.closePath(); ctx.fillStyle='rgba(56,189,248,.2)'; ctx.fill(); cvLine(ctx,top,COL.axis2,2.4); cvLine(ctx,bot,COL.axis2,2.4);
    var i, n=60, N=200, cum=[0], tot=0; for(i=1;i<=N;i++){ var xm=(i-0.5)/N, dd=dProf(xm,1,1/Math.sqrt(st.x)); tot+=dd*dd/N; cum.push(tot); } var rate=tot*0.4;
    for(i=0;i<n;i++){ var V=((i/n)*tot+t*rate)%tot, lo=0, hi=N; while(hi-lo>1){ var m=(lo+hi)>>1; if(cum[m]<=V) lo=m; else hi=m; } var x=(lo+(V-cum[lo])/(cum[hi]-cum[lo]+1e-12))/N, dd=dProf(x,d1,d2), fy=(((i*37)%17)/17-0.5)*0.86; cvCirc(ctx,x0+x*L,cy+fy*dd,2.2,COL.blue,null); }
    var dp=CC_TRUE*45*(st.x*st.x-1), hh=h*0.34, drop=Math.min(hh*0.8,dp/45*0.6); [[0.12,hh,d1],[0.5,hh-drop,d2]].forEach(function(q){ var xx=x0+q[0]*L, y0=cy-q[2]/2; cvLine(ctx,[[xx,y0],[xx,y0-hh]],COL.tick,2); ctx.fillStyle='rgba(56,189,248,.55)'; ctx.fillRect(xx-3,y0-q[1],6,q[1]); });
    cvText(ctx,'면적비 r = '+st.x.toFixed(1)+' · 입구 0.3 m/s → 목 '+(0.3*st.x).toFixed(2)+' m/s · Δp = '+dp.toFixed(0)+' Pa (손실 계수는 숨은 값)',12,16,COL.text,'bold 12px system-ui,sans-serif'); } });

/* ══ 종합 3 : 양력 L 대 ½ρv²S → C_L ═══════════════════════════════════ */
var CL_TRUE=0.78, SW=0.03;
function qS(v){ return 0.5*1.204*v*v*SW; }
reportDefine('D',{ title:'양력 대 속력 — 날개의 양력 계수 C_L', tabName:'[종합3] 양력 대 속력', xLabel:'동압 × 면적 ½ρv²S (N)', yLabel:'양력 L (N)',
  cols:['#','v (m/s)','σ (g중)','L (N)','L / (½ρv²S)'], mode:'line', zero:true,
  interpret:function(f){ return {label:'양력 계수 C_L', value:f.a, unit:'', trueValue:CL_TRUE, formula:'L = C_L·½ρv²S → 기울기 = C_L (S = 0.03 m², ρ = 1.204)', digits:3}; },
  method:'① 날개 모형의 받음각을 고정(약 6°)하고 풍속을 바꿔 가며 저울 읽음 감소로 양력을 쟀다\n② 양력 L 대 ½ρv²S 그래프를 그리고 원점을 지나는 직선으로 맞췄다\n③ 기울기에서 양력 계수 C_L 을 구하고 받음각별 값과 비교했다' });
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = synthMake({ n:17, rep:'D', xid:'v', x0:10, s0:0.3, seed:1013,
  truth:function(v){ return CL_TRUE*qS(v); }, noise:function(s){ return s*G/1000; }, slope:function(){ return CL_TRUE; }, xOf:function(v){ return qS(v); },
  xm:5, ym:function(){ return CL_TRUE*5*1.1; }, xl:'동압 × 면적 ½ρv²S (N)', yl:'양력 L (N)', gtitle:'L 대 ½ρv²S — 기울기 = C_L', xd:1, yd:1,
  lab:function(f){ return '내 회귀 : C_L '+f.a.toFixed(3); },
  fmtX:function(v){ return v.toFixed(1)+' m/s'; }, fmtS:function(s){ return s.toFixed(1)+' g중'; },
  randX:function(){ return 4+Math.floor(Math.random()*25)*0.5; }, newTrue:function(){ CL_TRUE=+(0.5+Math.random()*0.5).toFixed(3); },
  cells:function(c,st,y){ return [c,st.x.toFixed(1),st.s.toFixed(1),y.toFixed(3),(y/qS(st.x)).toFixed(3)]; },
  readout:function(f,rs,last,st,set){ var L=CL_TRUE*qS(st.x); set('oX',qS(st.x).toFixed(3)+' N'); set('oM',last==null?'—':last.toFixed(3)+' N'); set('oF',f? f.a.toFixed(3):'— (2개 이상)'); set('oE',(L/(0.030*G)).toFixed(2)+' 배 (이론 양력/날개 무게)'); set('oN',rs.length+' 개'); },
  anim:function(ctx,w,h,t,st){ var cy=h*0.52, L=CL_TRUE*qS(st.x), g=L/G*1000; drawFan(ctx,34,cy,26,t,st.x); flowDots(ctx,t,st.x,66,w*0.9,cy-60,cy+60,50); drawFoil(ctx,w*0.45,cy,Math.min(170,w*0.3),6); var Lp=Math.min(h*0.34,g*0.6); cvArrow(ctx,w*0.45,cy,w*0.45,cy-Lp,COL.grav,3); cvText(ctx,'양력 '+L.toFixed(2)+' N',w*0.45+10,cy-Lp,COL.grav,'bold 12px system-ui,sans-serif');
    cvRect(ctx,w*0.78,cy-30,w*0.16,60,'#1e293b',COL.axis2,1.4); cvText(ctx,'−'+g.toFixed(0)+' g',w*0.86,cy,COL.ok,'bold 16px system-ui,sans-serif','center'); cvText(ctx,'저울 읽음 감소',w*0.86,cy+44,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'v = '+st.x.toFixed(1)+' m/s · 받음각 6° · 숨은 양력 계수 C_L',12,16,COL.text,'bold 12px system-ui,sans-serif'); } });
