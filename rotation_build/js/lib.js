/* ═══════════════════════════════════════════════════════════════════════════
   ★ 회전운동 단원 공용 도구 (구역 C) — 토크 · 관성 모멘트 · 각운동량 · 구르기 · 통계 · 그리기 도우미
   · 모든 모형은 「교육용 어림」이며 화면의 note 에 가정을 밝혀 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
var G=9.8, PI=Math.PI;

/* ── 회전 물리 (교육용 어림) ─────────────────────────────────────────── */
/** 토크 τ = r F sinθ  (θ : 도) */
function torque(r,F,thDeg){ return r*F*Math.sin((thDeg==null?90:thDeg)*PI/180); }
/** 모양 계수 k = I/(m R²) */
var SHAPES=[null,{n:'속 빈 고리(바퀴 테두리)',k:1},{n:'속이 찬 원판(원통)',k:0.5},{n:'속이 찬 구',k:0.4},{n:'속 빈 구(공)',k:2/3},{n:'속 빈 원통(파이프, 두께 얇음)',k:1}];
/** 경사면 구르기 가속도 a = g sinθ /(1+k)  (미끄러짐 없음) */
function rollA(k,thDeg){ return G*Math.sin(thDeg*PI/180)/(1+k); }
/** 막대 관성 모멘트 : 중심축 mL²/12, 끝축 mL²/3 */
function IrodC(m,L){ return m*L*L/12; }
function IrodE(m,L){ return m*L*L/3; }
/** 구심 가속도 / 구심력 */
function acent(w,r){ return w*w*r; }
function rpm2w(rpm){ return rpm*TAU/60; }
function w2rpm(w){ return w*60/TAU; }
/** 회전 운동 에너지 */
function Krot(I,w){ return 0.5*I*w*w; }
/** 물리 진자(강체) 주기 : I_p = I_cm + m d², T = 2π√(I_p/(m g d)) */
function Tphys(Icm,m,d){ return TAU*Math.sqrt((Icm+m*d*d)/(m*G*d)); }

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
