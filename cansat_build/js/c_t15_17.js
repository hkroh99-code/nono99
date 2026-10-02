/* ───────────────────────────────────────────────────────────────────────────
   TAB 15 ~ 17 — 종합 실험 3개 (보고서 실험 A · C · D 로 자동 이어진다)
   종합1 : v² = (2g/ρCd)(m/A) 직선       종합2 : ln(P0/P) = h/H 직선       종합3 : 착륙 오차 분포(점 · 분포형)
   ─────────────────────────────────────────────────────────────────────────── */
function synthTable(tblId, cntId, cols, rows){
  var th=document.querySelector('#'+tblId+' thead'), tb=document.querySelector('#'+tblId+' tbody'); if(!th||!tb) return;
  th.innerHTML='<tr>'+cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr>'; tb.innerHTML='';
  rows.slice(-12).forEach(function(r,i,a){ var tr=document.createElement('tr'); if(i===a.length-1) tr.className='cur'; tr.innerHTML=r.cells.map(function(c){ return '<td>'+c+'</td>'; }).join(''); tb.appendChild(tr); });
  setTxt(cntId, rows.length+'개'+(rows.length>12?' (최근 12개 표시)':''));
}
function synthLine(ctx, P, pts, col, lw, dash){ plotLine(ctx,P,pts,col,lw,dash); }
function synthSetup(n, drawAnim, drawGraph, readout){
  var tb=buildTimeBar('k'+n+'-time', n, {dur:10, unit:'s', digits:1});
  Anim.register(n,{dur:10, loop:true, autoplay:true, draw:function(t){ drawAnim(t); drawGraph(); }, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
  Anim.reset(n); Anim.play(n); readout(); drawAnim(0); drawGraph();
}

/* ══ 종합 1 : 항력계수 ═════════════════════════════════════════════════ */
var CD_TRUE=1.3;
TabInit[15] = function(){ T15.init(); };
TabDraw[15] = function(){ T15.graph(); };
var T15 = (function(){
  var m=100, D=40, cnt=0, started=false, WIN=3, H0=8;
  function A(){ return Math.PI*Math.pow(D/100/2,2); }
  function xval(){ return (m/1000)/A(); }
  function vth(mm,dd){ return Math.sqrt(2*(mm/1000)*SUBJ.g/(SUBJ.rho0*CD_TRUE*Math.PI*Math.pow(dd/200,2))); }
  function rows(){ return REPORT_DATA.rows; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  reportSetMeta({ title:'낙하산으로 재는 항력계수', tabName:'[종합1] 낙하산으로 재는 항력계수',
    xLabel:'m/A (kg/m²)', yLabel:'v² (m²/s²)', cols:['#','m (g)','D (cm)','m/A (kg/m²)','v (m/s)','v² (m²/s²)'], zero:true,
    interpret:function(f){ var Cd=2*SUBJ.g/(SUBJ.rho0*f.a); return {label:'항력계수 Cd', value:Cd, unit:'', trueValue:CD_TRUE, formula:'v² = (2g/ρCd)·(m/A) → Cd = 2g / (ρ × 기울기)', digits:2}; } });
  function record(){
    var r=rng32(cnt*977+Math.round(m)*31+D*7+13), v=vth(m,D), t=WIN/v, tm=Math.max(0.05, t+0.03*gaussR(r)), vm=WIN/tm, x=xval();
    cnt++; reportPush([cnt, m, D, x.toFixed(3), vm.toFixed(2), (vm*vm).toFixed(2)], x, vm*vm);
    synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); graph();
  }
  function readout(){
    var v=vth(m,D), f=fit();
    setTxt('k15-mV',m+' g'); setTxt('k15-DV',D+' cm'); setTxt('k15-oX',xval().toFixed(3)); setTxt('k15-oV',v.toFixed(2)+' m/s');
    setTxt('k15-oM',(WIN/(WIN/v)).toFixed(2)+' ± '+(v*v*0.03/WIN).toFixed(2)+' m/s'); setTxt('k15-oF', f? (2*SUBJ.g/(SUBJ.rho0*f.a)).toFixed(2) : '— (2개 이상)'); setTxt('k15-oS', f? f.a.toFixed(2) : '—');
  }
  function anim(t){
    var cv=document.getElementById('k15-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, Hh=s0.h, gy=Hh-30, v=vth(m,D), tt=t*0.45, d=Math.min(H0,fall1D(v,tt)), sc=(gy-60)/H0, y=40+d*sc+20, cx=W*0.4;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,Hh); skyBg(ctx,W,gy); groundBg(ctx,W,Hh,gy);
    var yA=40+(H0-WIN)*sc+20, yB=40+H0*sc+20-8; ctx.fillStyle='rgba(251,191,36,.18)'; ctx.fillRect(cx-90,yA,180,gy-8-yA); ctx.strokeStyle=COL.amber; ctx.setLineDash([5,4]); ctx.strokeRect(cx-90,yA,180,gy-8-yA); ctx.setLineDash([]);
    cvText(ctx,'측정 구간 3 m',cx+96,(yA+gy-8)/2,COL.amber,'11px system-ui,sans-serif');
    if(d<H0-0.01 || t<9){ dropIcon(ctx,cx,Math.min(y,gy-30),30,Math.max(10,D*0.6),0); }
    cvText(ctx,'v(이론) = '+v.toFixed(2)+' m/s · m/A = '+xval().toFixed(2)+' kg/m² · 낙하 '+d.toFixed(1)+' m',12,16,COL.text,'bold 12px system-ui,sans-serif');
  }
  function graph(){
    var cv=document.getElementById('k15-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, rs=rows(), f=fit(), xm=Math.max(2.2, Math.max.apply(null,rs.map(function(r){ return r.x; }).concat([xval()]))*1.1);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var strue=2*SUBJ.g/(SUBJ.rho0*CD_TRUE), ym=Math.max(strue*xm*1.1, 5);
    var P=makePlot(ctx,W,H,{xmin:0,xmax:xm,ymin:0,ymax:ym,xlabel:'m/A (kg/m²)',ylabel:'v² (m²/s²)',title:'v² 대 m/A — 기울기 = 2g/(ρCd)',left:56,xfmt:function(q){ return q.toFixed(1); },yfmt:function(q){ return q.toFixed(0); }});
    plotLine(ctx,P,[[0,0],[xm,strue*xm]],COL.white,1.2,[5,4]);
    if(f) plotLine(ctx,P,[[0,f.b],[xm,f.a*xm+f.b]],COL.grav,2.2);
    plotPoints(ctx,P,rs.map(function(r){ return [r.x,r.y]; }),COL.blue,5); plotPoints(ctx,P,[[xval(),Math.pow(vth(m,D),2)]],COL.amber,6.5);
    legend(ctx,P.x1-210,P.y1+14,[['숨은 참 직선(Cd '+CD_TRUE.toFixed(2)+')',COL.white],[f? '내 회귀 : Cd '+(2*SUBJ.g/(SUBJ.rho0*f.a)).toFixed(2)+' (R² '+f.r2.toFixed(3)+')':'내 회귀(2점 이상)',COL.grav],['내 측정',COL.blue],['지금 설정(이론)',COL.amber]]);
  }
  function init(){
    if(!started){ started=true;
      function bindS(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); readout(); anim(Anim.time(15)); graph(); }); }
      bindS('k15-m',function(v){ m=v; }); bindS('k15-D',function(v){ D=v; });
      document.getElementById('k15-rec').addEventListener('click', record);
      document.getElementById('k15-rec10').addEventListener('click', function(){ var i, m0=m, D0=D; for(i=0;i<5;i++){ m=Math.round(20+Math.random()*260); D=Math.round(20+Math.random()*45); record(); } m=m0; D=D0; readout(); });
      document.getElementById('k15-clr').addEventListener('click', function(){ reportClear(); cnt=0; synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); graph(); });
      document.getElementById('k15-new').addEventListener('click', function(){ CD_TRUE=+(1.1+Math.random()*0.4).toFixed(2); reportClear(); cnt=0; synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows()); readout(); anim(Anim.time(15)); graph(); });
      synthTable('k15-tbl','k15-cnt',REPORT_DATA.cols,rows());
      synthSetup(15, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();

/* ══ 종합 2 : 스케일 높이 ═════════════════════════════════════════════ */
var P16 = { T:288, P0:1013 };
TabInit[16] = function(){ T16.init(); };
TabDraw[16] = function(){ T16.graph(); };
var T16 = (function(){
  var h=500, cnt=0, started=false;
  function Hs(){ return SUBJ.Rgas*P16.T/(SUBJ.Mair*SUBJ.g); }
  function Pth(hh){ return P16.P0*Math.exp(-hh/Hs()); }
  reportDefine('C',{ title:'기압으로 재는 고도 — 스케일 높이와 평균 기온', tabName:'[종합2] 기압으로 재는 고도', xLabel:'높이 h (m)', yLabel:'ln(P₀/P)',
    cols:['#','h (m)','P (hPa)','P₀ (hPa)','ln(P₀/P)'], mode:'line', zero:true,
    interpret:function(f){ var H=1/f.a, T=H*SUBJ.Mair*SUBJ.g/SUBJ.Rgas-273.15; return {label:'평균 기온 T', value:T, unit:'℃', trueValue:+((P16.T-273.15)||0.01).toFixed(2), formula:'기울기 = 1/H → H = '+H.toFixed(0)+' m,  T = H·M·g / R', digits:1}; },
    method:'① 기준 높이(h=0)에서 기압 P₀ 를 재고, 높이를 바꿔 가며 기압 P 를 기록했다\n② ln(P₀/P) 를 계산해 높이 h 대 그래프를 그렸다\n③ 직선의 기울기 1/H 로 스케일 높이 H 와 평균 기온 T = HMg/R 을 구했다' });
  function rows(){ return reportExtra('C').rows; }
  function fit(){ var pts=rows().map(function(r){ return [r.x,r.y]; }); return pts.length>=2? ols(pts,false) : null; }
  function cols(){ return reportExtra('C').cols; }
  function record(){
    var r=rng32(cnt*613+h*3+29), P=Pth(h)+0.15*gaussR(r), Pg=P16.P0+0.15*gaussR(r), y=Math.log(Pg/P);
    cnt++; reportPush([cnt,h,P.toFixed(2),Pg.toFixed(2),y.toFixed(4)], h, y, 'C');
    synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); graph();
  }
  function readout(){
    var f=fit(); setTxt('k16-hV',h+' m'); setTxt('k16-oP',Pth(h).toFixed(1)); setTxt('k16-oY',Math.log(P16.P0/Pth(h)).toFixed(4));
    setTxt('k16-oH', f? (1/f.a/1000).toFixed(2)+' km' : '— (2개 이상)'); setTxt('k16-oT', f? (1/f.a*SUBJ.Mair*SUBJ.g/SUBJ.Rgas-273.15).toFixed(1)+' ℃' : '—'); setTxt('k16-oN', rows().length+' 개');
  }
  function anim(t){
    var cv=document.getElementById('k16-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, Hh=s0.h, gy=Hh-30, p=Math.min(1,t/9), hh=h*p, hmax=Math.max(h,100), sc=(gy-80)/hmax, y=gy-30-hh*sc, cx=W*0.35;
    skyBg(ctx,W,gy); groundBg(ctx,W,Hh,gy);
    cvText(ctx,'기압계 풍선',cx+34,y,COL.text,'11px system-ui,sans-serif'); cvCirc(ctx,cx,y,14,'rgba(251,191,36,.35)',COL.amber,1.6); cvLine(ctx,[[cx,y+14],[cx,y+34]],COL.dim,1); drawCan(ctx,cx,y+34,26);
    var gx=W*0.72, gyc=Hh*0.5, R=Math.min(W*0.2,Hh*0.3), P=Pth(hh), a0=-2.3, a1=0.7, ang=a0+(a1-a0)*(1-(P-850)/(P16.P0-850+30));
    cvCirc(ctx,gx,gyc,R,'#0b1424',COL.axis2,2); for(var k=0;k<=6;k++){ var aa=a0+(a1-a0)*k/6; cvLine(ctx,[[gx+Math.cos(aa)*R*0.82,gyc+Math.sin(aa)*R*0.82],[gx+Math.cos(aa)*R*0.95,gyc+Math.sin(aa)*R*0.95]],COL.tick,1.5); }
    cvLine(ctx,[[gx,gyc],[gx+Math.cos(ang)*R*0.8,gyc+Math.sin(ang)*R*0.8]],COL.grav,3); cvText(ctx,P.toFixed(1)+' hPa',gx,gyc+R+18,COL.amber,'bold 14px system-ui,sans-serif','center');
    cvText(ctx,'높이 '+hh.toFixed(0)+' m · 이론 기압 '+P.toFixed(1)+' hPa (지상 '+P16.P0+' hPa · 기온 '+(P16.T-273.15).toFixed(0)+' ℃ 숨은 값)',12,16,COL.text,'bold 12px system-ui,sans-serif');
  }
  function graph(){
    var cv=document.getElementById('k16-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, hh=Math.floor(H*0.5), rs=rows(), f=fit(), xm=1600, i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    subPlot(ctx,0,0,W,hh,{xmin:0,xmax:xm,ymin:820,ymax:1040,ylabel:'기압 (hPa)',title:'기압 대 높이',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var L=[]; for(i=0;i<=40;i++) L.push([xm*i/40,Pth(xm*i/40)]); plotLine(ctx,P,L,COL.white,1.4,[5,4]); plotPoints(ctx,P,rs.map(function(r){ return [r.x,P16.P0*Math.exp(-r.y)]; }),COL.blue,4.5); plotPoints(ctx,P,[[h,Pth(h)]],COL.amber,6); });
    subPlot(ctx,0,hh,W,H-hh,{xmin:0,xmax:xm,ymin:0,ymax:0.2,xlabel:'높이 h (m)',ylabel:'ln(P₀/P)',title:'직선으로 펴기 — 기울기 = 1/H',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(2); }}, function(P){
      plotLine(ctx,P,[[0,0],[xm,xm/Hs()]],COL.white,1.2,[5,4]); if(f) plotLine(ctx,P,[[0,f.b],[xm,f.a*xm+f.b]],COL.grav,2.2);
      plotPoints(ctx,P,rs.map(function(r){ return [r.x,r.y]; }),COL.blue,4.5); plotPoints(ctx,P,[[h,Math.log(P16.P0/Pth(h))]],COL.amber,6);
      legend(ctx,P.x1-190,P.y1+14,[['숨은 참 직선',COL.white],[f? '내 회귀 : T '+(1/f.a*SUBJ.Mair*SUBJ.g/SUBJ.Rgas-273.15).toFixed(1)+' ℃':'내 회귀(2점 이상)',COL.grav],['내 측정',COL.blue]]); });
  }
  function init(){
    if(!started){ started=true;
      document.getElementById('k16-h').addEventListener('input',function(){ h=+this.value; readout(); anim(Anim.time(16)); graph(); });
      document.getElementById('k16-rec').addEventListener('click', record);
      document.getElementById('k16-rec10').addEventListener('click', function(){ var h0=h, i, hs=[0,250,500,750,1000,1250,1500]; for(i=0;i<5;i++){ h=hs[1+Math.floor(Math.random()*6)]; record(); } h=h0; readout(); });
      document.getElementById('k16-clr').addEventListener('click', function(){ reportClear('C'); cnt=0; synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); graph(); });
      document.getElementById('k16-new').addEventListener('click', function(){ P16.T=Math.round(268+Math.random()*30); P16.P0=Math.round(1000+Math.random()*25); reportClear('C'); cnt=0; synthTable('k16-tbl','k16-cnt',cols(),rows()); readout(); anim(Anim.time(16)); graph(); });
      synthTable('k16-tbl','k16-cnt',cols(),rows());
      synthSetup(16, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();

/* ══ 종합 3 : 착륙 오차 분포 ══════════════════════════════════════════ */
TabInit[17] = function(){ T17.init(); };
TabDraw[17] = function(){ T17.graph(); };
var T17 = (function(){
  var LD=2, W=4, G=3, cnt=0, started=false, last=null, LAND=[], GOAL=20;
  reportDefine('D',{ title:'복귀 정밀도 — 착륙 오차의 분포', tabName:'[종합3] 복귀 정밀도', xLabel:'시도 번호', yLabel:'착륙 오차 d (m)',
    cols:['#','L/D','풍속 (m/s)','GPS σ (m)','오차 d (m)'], mode:'points', zero:true,
    hint:'<b>[종합3] 복귀 정밀도</b> 탭에서 조건을 정해 <b>[측정 기록]</b> 을 10 번 이상 누르면 오차 분포의 평균 · 중앙값 · 90 % 값 · 성공률이 아래에 채워집니다.',
    interpret:function(f,rows){ var d=rows.map(function(r){ return r.y; }); if(!d.length) return null; var md=quantile(d,0.5), p9=quantile(d,0.9), ok=d.filter(function(x){ return x<=GOAL; }).length/d.length*100;
      return {label:'CEP₅₀(중앙값)', value:md, unit:'m', formula:'시도 '+d.length+'회 · 평균 '+mean(d).toFixed(1)+' m · 표준편차 '+stdev(d).toFixed(1)+' m · 90 % 값 '+p9.toFixed(1)+' m · 성공률(≤'+GOAL+' m) '+ok.toFixed(0)+' %', digits:1}; },
    method:'① 조건(활공비 · 풍속 · GPS 잡음)을 정하고 같은 조건으로 복귀 비행을 반복했다\n② 매번 목표와의 착륙 거리 d 를 기록했다\n③ 히스토그램 · 누적 분포에서 평균 · 중앙값 · 90 % 값 · 성공률을 구했다' ,
    question:'결과를 보고 (조건이 같은데 오차가 매번 다른 까닭, 평균과 중앙값의 차이, 시도 횟수가 결론에 미치는 영향)을 쓰자.' });
  function rows(){ return reportExtra('D').rows; }
  function cols(){ return reportExtra('D').cols; }
  function errs(){ return rows().map(function(r){ return r.y; }); }
  function run(){
    var r=rng32(cnt*1013+Math.round(LD*10)*17+Math.round(W*10)*5+Math.round(G*10)+3), wx=W+0.8*gaussR(r), wy=0.4*W*gaussR(r);
    last=guideSim({h0:300,vs:5,LD:LD,wind:[wx,wy],p0:[120,80],target:[0,0],gps:G,dt:0.2,turn:1,rng:r});
    var x=last.x[last.x.length-1], y=last.y[last.y.length-1]; LAND.push([x,y]);
    cnt++; reportPush([cnt,LD.toFixed(2),W.toFixed(1),G.toFixed(1),last.miss.toFixed(1)], cnt, last.miss, 'D');
  }
  function record(){ run(); synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); anim(Anim.time(17)); graph(); }
  function readout(){
    var d=errs(); setTxt('k17-LDV',LD.toFixed(2)); setTxt('k17-WV',W.toFixed(1)+' m/s'); setTxt('k17-GV',G.toFixed(1)+' m');
    setTxt('k17-oN',d.length+' 회'); setTxt('k17-oMe',d.length? mean(d).toFixed(1)+' m':'—'); setTxt('k17-oMd',d.length? quantile(d,0.5).toFixed(1)+' m':'—'); setTxt('k17-oP9',d.length? quantile(d,0.9).toFixed(1)+' m':'—'); setTxt('k17-oOk',d.length? (d.filter(function(x){ return x<=GOAL; }).length/d.length*100).toFixed(0)+' %':'—');
  }
  function anim(t){
    var cv=document.getElementById('k17-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, Wd=s0.w, Hh=s0.h, cx=Wd/2, cy=Hh/2+6, R=Math.max(130,Math.hypot(120,80)*1.2), sc=Math.min(Wd/2,Hh/2-10)/R*0.95, i, d=errs();
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,Wd,Hh); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,Wd-16,Hh-16);
    cvCirc(ctx,cx,cy,GOAL*sc,'rgba(52,211,153,.15)',COL.ok,1.4); cvText(ctx,'목표 '+GOAL+' m',cx,cy+GOAL*sc+13,COL.ok,'11px system-ui,sans-serif','center');
    if(d.length>1) cvCirc(ctx,cx,cy,quantile(d,0.5)*sc,null,COL.white,1.2);
    if(last){ var n=Math.max(2,Math.floor(Math.min(1,t/8)*last.x.length)), pts=[]; for(i=0;i<n;i++) pts.push([cx+last.x[i]*sc,cy-last.y[i]*sc]); cvLine(ctx,pts,COL.blue,1.8); }
    cvCirc(ctx,cx+120*sc,cy-80*sc,4,COL.dim,null,0); cvText(ctx,'방출',cx+120*sc+7,cy-80*sc,COL.dim,'10px system-ui,sans-serif');
    LAND.forEach(function(p,k){ var px=cx+p[0]*sc, py=cy-p[1]*sc; if(px>10&&px<Wd-10&&py>10&&py<Hh-10) cvCirc(ctx,px,py,k===LAND.length-1?5.5:3.5,k===LAND.length-1?COL.amber:COL.grav,null,0); });
    cvText(ctx,LAND.length? '착륙 '+LAND.length+'회 · 흰 원 = 중앙값 반경(CEP₅₀)' : '[측정 기록]을 눌러 비행시키세요',12,16,COL.text,'bold 12px system-ui,sans-serif');
  }
  function graph(){
    var cv=document.getElementById('k17-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, Wd=s0.w, H=s0.h, hh=Math.floor(H*0.5), d=errs(), i, nb=10, xm=Math.max(60,Math.ceil((d.length? quantile(d,0.97):0)/20)*20+20);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,Wd,H);
    var bins=[]; for(i=0;i<nb;i++) bins.push(0); d.forEach(function(x){ bins[Math.min(nb-1,Math.floor(x/xm*nb))]++; });
    subPlot(ctx,0,0,Wd,hh,{xmin:0,xmax:xm,ymin:0,ymax:Math.max(4,Math.max.apply(null,bins)*1.3),ylabel:'횟수',title:'착륙 오차 히스토그램',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      ctx.fillStyle=COL.histFill; for(i=0;i<nb;i++){ var x0=P.X(i*xm/nb), x1=P.X((i+1)*xm/nb), y=P.Y(bins[i]); ctx.fillRect(x0+1,y,x1-x0-2,P.y0-y); }
      plotLine(ctx,P,[[GOAL,0],[GOAL,P.ymax||10]],COL.ok,1.4,[5,4]); });
    subPlot(ctx,0,hh,Wd,H-hh,{xmin:0,xmax:xm,ymin:0,ymax:100,xlabel:'착륙 오차 d (m)',ylabel:'누적 (%)',title:'누적 분포 — 50 % · 90 % 가 되는 d',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){
      var sd=d.slice().sort(function(a,b){ return a-b; }), L=[[0,0]]; sd.forEach(function(x,k){ L.push([x,k/sd.length*100]); L.push([x,(k+1)/sd.length*100]); }); L.push([xm,100]); if(sd.length) plotLine(ctx,P,L,COL.amber,2);
      plotLine(ctx,P,[[0,50],[xm,50]],COL.dim,1,[3,3]); plotLine(ctx,P,[[0,90],[xm,90]],COL.dim,1,[3,3]); plotLine(ctx,P,[[GOAL,0],[GOAL,100]],COL.ok,1.4,[5,4]);
      if(sd.length){ plotPoints(ctx,P,[[quantile(d,0.5),50],[quantile(d,0.9),90]],COL.grav,5); } });
  }
  function init(){
    if(!started){ started=true;
      function bindS(id,fn){ document.getElementById(id).addEventListener('input',function(){ fn(+this.value); readout(); }); }
      bindS('k17-LD',function(v){ LD=v; }); bindS('k17-W',function(v){ W=v; }); bindS('k17-G',function(v){ G=v; });
      document.getElementById('k17-rec').addEventListener('click', record);
      document.getElementById('k17-rec10').addEventListener('click', function(){ for(var i=0;i<5;i++) run(); synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); anim(Anim.time(17)); graph(); });
      document.getElementById('k17-clr').addEventListener('click', function(){ reportClear('D'); LAND=[]; last=null; cnt=0; synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); anim(0); graph(); });
      document.getElementById('k17-new').addEventListener('click', function(){ cnt+=1000; reportClear('D'); LAND=[]; last=null; synthTable('k17-tbl','k17-cnt',cols(),rows()); readout(); anim(0); graph(); });
      synthTable('k17-tbl','k17-cnt',cols(),rows());
      synthSetup(17, anim, graph, readout);
    } else { readout(); graph(); }
  }
  return { init:init, graph:graph };
})();
