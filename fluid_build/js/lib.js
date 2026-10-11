/* ═══════════════════════════════════════════════════════════════════════════
   ★ 유체 단원 공용 도구 (구역 C) — 압력 · 유압 · 부력 · 선박 안정 · 통계 · 그리기 도우미
   · 모든 모형은 「교육용 어림」이며 화면의 note 에 가정을 밝혀 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
var G=9.8, P0=101325, RHO_W=1000;

/* ── 물성 ───────────────────────────────────────────────────────────── */
/** 순수한 물의 밀도(kg/m³) — 온도 T(℃), 0 ~ 100 ℃ (Tanaka 식 어림) */
function rhoWater(T){ return 999.97495*(1-(T-3.983035)*(T-3.983035)*(T+301.797)/(522528.9*(T+69.34881))); }
/** 해수 밀도(kg/m³) 어림 — 염분 S(psu) */
function rhoSea(T,S){ return rhoWater(T)+0.77*S; }
/** 정지 액체 속 절대 압력(Pa) */
function pAbs(h,rho,p0){ return (p0==null?P0:p0)+rho*G*h; }
/** 압력 단위 환산 */
function toAtm(p){ return p/P0; }
function toKPa(p){ return p/1000; }

/* ── 유압(파스칼) : 입력 힘 F1(N) · 입력 면적 A1 · 출력 면적 A2(m²) · 효율 eta ──────────────────────── */
function hydr(F1,A1,A2,eta,d1){
  var p=F1/A1, F2=p*A2*eta, d2=d1*A1/A2;
  return {p:p, F2:F2, gain:F2/F1, d2:d2, Win:F1*d1, Wout:F2*d2};
}

/* ── 부력(아르키메데스) : 물체 밀도 ro · 부피 V(m³) · 유체 밀도 rf ──────────────────────────────── */
function buoy(ro,V,rf){
  var W=ro*V*G, floats=ro<rf, frac=floats? ro/rf : 1, B=rf*V*frac*G, app=W-B;
  return {W:W, B:B, floats:floats, frac:frac, app:Math.max(0,app), sink:W-B};
}

/* ── 직육면체 배(상자형 선체) : 질량 m · 길이 L · 폭 B · 높이 H · 유체 rf · 무게중심 높이 KG ─────────── */
function ship(m,L,Bw,H,rf,KG){
  var d=m/(rf*L*Bw), KB=d/2, BM=Bw*Bw/(12*d), GM=KB+BM-KG;
  return {d:d, free:H-d, KB:KB, BM:BM, GM:GM, ok:(d<H), stable:(GM>0)};
}

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
