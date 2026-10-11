/* ═══════════════════════════════════════════════════════════════════════════
   ★ 사이펀 단원 공용 도구 (구역 C) — 높이차 유속 · 정점 압력 · 마찰(층류/난류) · 배수 시간 · 통계 · 그리기 도우미
   · 모든 모형은 「교육용 어림」(비압축성 · 일정한 온도 · 매끈한 관)이며 화면의 note 에 가정을 밝혀 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
var G=9.8, PI=Math.PI, PATM=101.3, RHO=1000;   // PATM : kPa

/* ── 사이펀 물리 (교육용 어림) ───────────────────────────────────────── */
/** 물의 점성 μ (Pa·s), 수온 T(°C) — 간이식(0~100 °C) */
function muW(T){ return 2.414e-5*Math.pow(10,247.8/(T+133.15)); }
/** 물의 증기압 (kPa) — Magnus 식, T(°C) */
function pvap(T){ return 0.6112*Math.exp(17.62*T/(243.12+T)); }
/** 설탕물 점성 (Pa·s) : 농도 c(%) 선형 보간(20 °C 대략값) */
var SUG=[[0,1.0],[10,1.35],[20,1.95],[30,3.19],[40,6.2],[50,15.4]];
function muSugar(c){ var i; c=Math.max(0,Math.min(50,c)); for(i=0;i<SUG.length-1;i++){ if(c<=SUG[i+1][0]){ var f=(c-SUG[i][0])/(SUG[i+1][0]-SUG[i][0]); return (SUG[i][1]+(SUG[i+1][1]-SUG[i][1])*f)*1e-3; } } return 15.4e-3; }
/** 마찰 계수 f : 층류 64/Re · 전이 보간 · 난류 Blasius */
function fric(Re){ if(Re<1) return 64; if(Re<2300) return 64/Re; if(Re<4000){ var f1=64/2300, f2=0.316*Math.pow(4000,-0.25), u=(Re-2300)/1700; return f1+(f2-f1)*u; } return 0.316*Math.pow(Re,-0.25); }
/** 사이펀 흐름 : 높이차 h(m) · 관 지름 D(m) · 길이 L(m) · 점성 μ · 입구 등 손실 Km  →  {v, Q, Re, f, K, reg}
    에너지 식 g h = (1 + Km + f L/D) v²/2  (f 는 Re 에 따라 반복해서 구한다) */
function siphon(h,D,L,mu,Km,rho){ rho=rho||RHO; mu=mu||1.0e-3; if(Km==null) Km=1.0; if(h<=0||D<=0) return {v:0,Q:0,Re:0,f:0,K:Km,reg:'정지',ideal:0};
  var v=Math.sqrt(2*G*h), i, Re, f, K; for(i=0;i<80;i++){ Re=rho*v*D/mu; f=fric(Re); K=1+Km+f*L/D; var vn=Math.sqrt(2*G*h/K); v=0.5*v+0.5*vn; }
  Re=rho*v*D/mu; f=fric(Re); K=1+Km+f*L/D; var A=PI*D*D/4;
  return {v:v,Q:A*v,Re:Re,f:f,K:K,reg:Re<2300?'층류':(Re<4000?'전이':'난류'),ideal:Math.sqrt(2*G*h)}; }
/** 정점 압력(게이지 아님, 절대 kPa) : p = p_atm − ρ g H_c − ½ρv² − (정점까지 손실, 무시) */
function pCrest(Hc,v){ return PATM-RHO*G*Hc/1000-0.5*RHO*v*v/1000; }
/** 정점 최대 높이(이상) : p ≥ p_v 이어야 한다 → H_max = (p_atm − p_v)/(ρ g) − v²/(2g)  [m] */
function HcMax(T,v){ return (PATM-pvap(T))*1000/(RHO*G)-v*v/(2*G); }
/** 배수 시간 : 단면적 A_t(m²) 통의 수위차 h0(m)가 K 로 사이펀을 통해 0 이 될 때까지 T=(A_t/a)√(2(K)h0/g)   (K=총 손실 계수, 난류 가정) */
function tDrain(At,a,K,h0){ return (At/a)*Math.sqrt(2*K*h0/G); }
/** 수위 h(t) (난류 가정) : √h = √h0 − (a/A_t)√(g/(2K)) t */
function hOf(t,At,a,K,h0){ var r=Math.sqrt(h0)-(a/At)*Math.sqrt(G/(2*K))*t; return r>0? r*r : 0; }
/** 가는 관 층류 유량 Hagen–Poiseuille : Q = π ρ g h D⁴ /(128 μ L) */
function qLam(h,D,L,mu){ return PI*RHO*G*h*Math.pow(D,4)/(128*mu*L); }

/* ── 통계 · 난수 도우미 ─────────────────────────────────────────────── */
function mean(a){ var s=0,i; for(i=0;i<a.length;i++) s+=a[i]; return a.length? s/a.length : 0; }
function stdev(a){ var m=mean(a), s=0,i; for(i=0;i<a.length;i++) s+=(a[i]-m)*(a[i]-m); return a.length>1? Math.sqrt(s/(a.length-1)) : 0; }
function quantile(a, q){ var b=a.slice().sort(function(p,r){ return p-r; }); if(!b.length) return 0; var k=(b.length-1)*q, f=Math.floor(k), c=Math.min(b.length-1,f+1); return b[f]+(b[c]-b[f])*(k-f); }
function rmse(a,b){ var s=0,i; for(i=0;i<a.length;i++){ var d=a[i]-b[i]; s+=d*d; } return Math.sqrt(s/a.length); }
/** 포아송 계수(평균 lam) — 큰 값은 정규 근사, 작은 값은 직접 */
function poisN(lam, r){ if(lam<=0) return 0; if(lam>40){ var v=lam+Math.sqrt(lam)*gaussR(r); return v<0?0:Math.round(v); } var L=Math.exp(-lam), k=0, p=1; do{ k++; p*=r(); }while(p>L); return k-1; }

/* ── 그리기 · 표시 도우미 ──────────────────────────────────────────── */
function fmtM(m){ return m>=1000? (m/1000).toFixed(2)+' km' : (m>=10? m.toFixed(0) : m.toFixed(1))+' m'; }
function fmt1(v){ return v.toFixed(1); }
/** 막대 그림용 둥근 알약 라벨 */
function pill(ctx, s, x, y, fg, bg){
  ctx.font='11px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
  var tw=ctx.measureText(s).width; ctx.fillStyle=bg||COL.labelbg; ctx.fillRect(x-4,y-8,tw+8,16);
  ctx.fillStyle=fg||COL.text; ctx.fillText(s,x,y);
}
/** 사각형에 맞는 정사각 영역 크기 */
function sqFit(w,h,pad){ return Math.max(40,Math.min(w,h)-(pad||0)); }
/** 물(액체) 영역 그리기 : 위쪽 수면에서 아래로 갈수록 진해진다 */
function waterFill(ctx,x,y,w,h,a){
  var g=ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'rgba(56,189,248,'+(a||0.22)+')'); g.addColorStop(1,'rgba(30,64,175,'+((a||0.22)+0.30)+')');
  ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
}
/** 그릇(U자 · 직사각 테두리) : 위가 열려 있다 */
function vessel(ctx,x,y,w,h,col){
  ctx.strokeStyle=col||COL.axis2; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+h); ctx.lineTo(x+w,y+h); ctx.lineTo(x+w,y); ctx.stroke(); ctx.lineWidth=1;
}
/** 화살표 */
function cvArrow(ctx,x1,y1,x2,y2,col,lw){
  var dx=x2-x1, dy=y2-y1, n=Math.hypot(dx,dy)||1, ux=dx/n, uy=dy/n;
  ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=lw||2; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-ux*8-uy*4,y2-uy*8+ux*4); ctx.lineTo(x2-ux*8+uy*4,y2-uy*8-ux*4); ctx.closePath(); ctx.fill(); ctx.lineWidth=1;
}

/* ── 원리 탭 공용 틀 : 상태 S 의 각 값은 슬라이더 'tN-키' 와 이어진다 ────────────────────────────────
   o = {state, dur, unit:{키:'단위'}, fmt:{키:fn(v,S)}, readout(S), anim(ctx,w,h,t,S), graph(ctx,w,h,S), init(S), bind(S,redraw)} */
function mkTab(n,o){
  var S=o.state, tb=null, DUR=o.dur||10, pre='t'+n+'-', fr=null;
  function ro(){ var k; for(k in S){ if(!S.hasOwnProperty(k)) continue; setTxt(pre+k+'V', o.fmt&&o.fmt[k]? o.fmt[k](S[k],S) : S[k]+((o.unit&&o.unit[k])||'')); } o.readout(S); }
  function canvas(id,fn,t){ var cv=document.getElementById(id); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,s0.w,s0.h); fn(ctx,s0.w,s0.h,t,S); }
  function drawA(t){ canvas(pre+'cv',function(ctx,w,h,tt){ o.anim(ctx,w,h,tt,S); },t); }
  function drawG(){ canvas(pre+'cv2',function(ctx,w,h){ o.graph(ctx,w,h,S); },0); }
  function setup(){ ro(); if(!tb){ tb=buildTimeBar(pre+'time',n,{dur:DUR,unit:'s',digits:1}); Anim.register(n,{dur:DUR,loop:true,autoplay:true,draw:function(t){ drawA(t); },onTick:function(t,p){ if(tb) tb.sync(t,p); }}); } drawA(Anim.time(n)); drawG(); }
  var started=false;
  TabInit[n]=function(){
    if(!started){ started=true;
      Object.keys(S).forEach(function(k){ var el=document.getElementById(pre+k); if(el) el.addEventListener('input',function(){ S[k]=+this.value; if(o.onChange) o.onChange(k,S); setup(); }); });
      if(o.bind) o.bind(S,setup); if(o.init) o.init(S); }
    setup(); Anim.play(n); };
  TabDraw[n]=function(){ drawG(); Anim.kick(n); };
  return {redraw:setup};
}

/* ── 사이펀 장면 그리기 (모든 모의실험이 재사용) ────────────────────────────
   o = {hU:위 수면의 높이(출구 기준 cm), Hc:정점이 위 수면보다 높은 cm, hL:아래 통 수면 높이(cm, null 이면 자유 출구),
        v:관 속 유속 m/s, on:흐르는가, prime:0~1 관을 채운 정도, tankH:위 통 깊이 cm, bubbles:[{s:0~1}], pTop:정점 압력 kPa 표시, labels:true}
   반환 {sc, yz(z)→y, path} */
function siphonDraw(ctx,bx,by,bw,bh,o,t){
  var hU=o.hU, Hc=Math.max(0,o.Hc==null?10:o.Hc), tankH=o.tankH||30, zc=hU+Hc, zmax=Math.max(zc,hU)+10, zmin=Math.min(0,hU-tankH,(o.hL==null?0:o.hL-20))-6;
  if(o.zrange){ zmin=o.zrange[0]; zmax=o.zrange[1]; }
  var sc=(bh-24)/(zmax-zmin), zoff=o.zoff||0, gy=function(z){ return by+bh-12-(z+zoff-zmin)*sc; };
  var xu0=bx+bw*0.04, xu1=bx+bw*0.33, xin=bx+bw*0.24, xout=bx+bw*0.58, xl0=bx+bw*0.45, xl1=bx+bw*0.96;
  /* 위 통 */
  var zb=hU-tankH; waterFill(ctx,xu0,gy(hU),xu1-xu0,gy(zb)-gy(hU),0.3); vessel(ctx,xu0,gy(hU+8),xu1-xu0,gy(zb)-gy(hU+8));
  cvLine(ctx,[[xu0,gy(hU)],[xu1,gy(hU)]],'#7dd3fc',2);
  /* 아래 통 또는 받이 */
  if(o.hL!=null){ var zlb=Math.min(0,o.hL)-14; waterFill(ctx,xl0,gy(o.hL),xl1-xl0,gy(zlb)-gy(o.hL),0.3); vessel(ctx,xl0,gy(Math.max(o.hL,0)+8),xl1-xl0,gy(zlb)-gy(Math.max(o.hL,0)+8)); cvLine(ctx,[[xl0,gy(o.hL)],[xl1,gy(o.hL)]],'#7dd3fc',2); }
  else { vessel(ctx,xl0+30,gy(10),xl1-xl0-60,gy(-12)-gy(10)); }
  /* 관 경로 : 입구(위 통 안) → 위로 → 정점 → 아래로 → 출구 */
  var yin=gy(hU-tankH*0.7), yc=gy(zc), yo=gy(0), r=Math.min(14,(xout-xin)*0.25), path=[[xin,yin],[xin,yc+r]];
  var k, ang; for(k=0;k<=8;k++){ ang=Math.PI+k*Math.PI/16; path.push([xin+r+r*Math.cos(ang),yc+r+r*Math.sin(ang)]); }
  path.push([xout-r,yc]); for(k=0;k<=8;k++){ ang=-Math.PI/2+k*Math.PI/16; path.push([xout-r+r*Math.cos(ang),yc+r+r*Math.sin(ang)]); } path.push([xout,yo]);
  var lens=[0], i, tot=0; for(i=1;i<path.length;i++){ tot+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]); lens.push(tot); }
  function at(f){ var d=f*tot, j=1; while(j<lens.length-1&&lens[j]<d) j++; var u=(d-lens[j-1])/Math.max(1e-6,lens[j]-lens[j-1]); return [path[j-1][0]+(path[j][0]-path[j-1][0])*u,path[j-1][1]+(path[j][1]-path[j-1][1])*u]; }
  ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#64748b'; ctx.lineWidth=11; ctx.beginPath(); path.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); ctx.stroke();
  ctx.strokeStyle='#0b1424'; ctx.lineWidth=7.5; ctx.stroke();
  var pr=o.prime==null?(o.on?1:0):o.prime; if(pr>0){ ctx.strokeStyle='rgba(56,189,248,.75)'; ctx.lineWidth=6.5; ctx.beginPath(); var m=Math.max(2,Math.round(path.length*pr)); for(i=0;i<m&&i<path.length;i++){ if(i) ctx.lineTo(path[i][0],path[i][1]); else ctx.moveTo(path[i][0],path[i][1]); } if(pr>=1){ ctx.lineTo(path[path.length-1][0],path[path.length-1][1]); } ctx.stroke(); }
  ctx.lineCap='butt';
  /* 흐름 점 + 기포 */
  if(o.on&&o.v>0){ var sp=Math.min(1.2,0.07+o.v*0.14), N=26; for(i=0;i<N;i++){ var f=((i/N)+t*sp)%1, p=at(f); cvCirc(ctx,p[0],p[1],2.2,'#e0f2fe',null); }
    if(o.hL==null){ for(i=0;i<8;i++){ var ff=((i/8)+t*1.3)%1; cvCirc(ctx,xout+(i%3-1)*1.2,yo+ff*(gy(-10)-yo),2,'#7dd3fc',null); } } }
  (o.bubbles||[]).forEach(function(b){ var p=at(Math.max(0.02,Math.min(0.98,b.s))), len=(b.len||1); cvRect(ctx,p[0]-3.5,p[1]-3.5*len,7,7*len,'rgba(226,232,240,.9)','#e2e8f0',1); });
  /* 치수 */
  if(o.labels!==false){ var yh=gy(hU), xd=bx+bw*0.38; cvLine(ctx,[[xout+8,yo],[xd+16,yo]],'#a78bfa',1,[3,3]); cvLine(ctx,[[xu1+2,yh],[xd+16,yh]],'#a78bfa',1,[3,3]); cvArrow(ctx,xd+10,yh+2,xd+10,yo-2,'#a78bfa',1.6); cvArrow(ctx,xd+10,yo-2,xd+10,yh+2,'#a78bfa',1.6);
    cvText(ctx,'h',xd+2,(yh+yo)/2,'#a78bfa','bold 13px system-ui,sans-serif','right');
    if(Hc>0){ cvLine(ctx,[[xu1+2,yh],[xu1+2,yc]],'#fbbf24',1,[3,3]); cvText(ctx,'H꜀ '+Hc.toFixed(0)+' cm',xin+4,yc-8,'#fbbf24','11px system-ui,sans-serif','left'); }
    if(o.pTop!=null) cvText(ctx,'정점 '+o.pTop.toFixed(1)+' kPa',(xin+xout)/2,yc-18,o.pTop<pvap(o.T==null?20:o.T)+1?'#fb7185':'#34d399','bold 11.5px system-ui,sans-serif','center'); }
  return {sc:sc,gy:gy,path:path,at:at,zmin:zmin,xin:xin,xout:xout,yc:yc,yo:yo};
}
