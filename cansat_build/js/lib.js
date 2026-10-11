/* ═══════════════════════════════════════════════════════════════════════════
   ★ 캔위성 단원 공용 도구 (구역 C) — 여러 탭이 함께 쓰는 물리 모형 · 그리기 도우미
   · ISA 표준대기 · 2D 낙하(상대속도 항력) · 유도 낙하(GPS 조향) · 경로 손실 · 충격
   · 모든 모형은 「교육용 어림」 이며, 화면의 note 에 가정을 밝혀 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
var CAN = {
  A : Math.PI*0.033*0.033,    // 캔 단면적 (지름 66 mm)  ≈ 0.00342 m²
  CdCan : 1.0,                // 원통(머리 방향) 항력계수 어림
  CdChute : 1.5               // 반구형 낙하산 항력계수 어림
};

/* ── 표준대기(ISA, 0 ~ 20 km) ─────────────────────────────────────────── */
var ISA = {
  T:function(h){ return SUBJ.T0 - SUBJ.lapse*Math.min(Math.max(h,0),11000); },
  P:function(h){ h=Math.max(h,0);
    return h<=11000 ? SUBJ.P0*Math.pow(1-SUBJ.lapse*h/SUBJ.T0, 5.25588) : 22632*Math.exp(-(h-11000)/6341.6); },
  rho:function(h){ return ISA.P(h)/(287.053*ISA.T(h)); }
};
/** 기압(Pa) → 고도(m) : 기준 기압 P0 에서 잰 상대 고도 (기압 고도계 공식) */
function baroAlt(P, P0){ return 44330.77*(1-Math.pow(P/P0, 0.190263)); }

/* ── 낙하산 · 종단속도 ───────────────────────────────────────────────── */
/** 낙하산 지름 D(m) 와 캔 → 전체 「항력 면적」 CdA (m²) */
function dragArea(D){ return CAN.CdCan*CAN.A + CAN.CdChute*Math.PI*D*D/4; }
/** 종단속도 v_t = √(2 m g /(ρ CdA)) */
function vTerm(m, CdA, rho){ return Math.sqrt(2*m*SUBJ.g/((rho||SUBJ.rho0)*CdA)); }
/** 고도 h 의 공기 밀도에서의 종단속도 */
function vTermAt(m, CdA, h){ return vTerm(m, CdA, ISA.rho(h)); }

/**
 * 2D 낙하(공기에 대한 상대속도 u 의 제곱 항력). 바람 w(m/s, +x). 낙하산은 t0 에 펼쳐지기 시작해 tOpen 초 만에 완전히 펼쳐진다.
 * o = {h0, m, D, wind, t0=1, tOpen=1.2, dt=0.02, vx0=wind}
 * 반환 {t[], x[], h[], vx[], vy[], a[], T, dx, vland}  (배열은 dt 간격)
 */
function descend(o){
  var dt=o.dt||0.02, t0=(o.t0==null?1:o.t0), tO=(o.tOpen==null?1.2:o.tOpen), w=o.wind||0, m=o.m;
  var CdA1=dragArea(0), CdA2=dragArea(o.D||0);
  var t=0, x=0, h=o.h0, vx=(o.vx0==null? w : o.vx0), vy=0, out={t:[],x:[],h:[],vx:[],vy:[],a:[]}, n=0;
  while(h>0 && n<60000){
    var s=t<t0?0:Math.min(1,(t-t0)/tO), CdA=CdA1+(CdA2-CdA1)*(s*s*(3-2*s));
    var ux=vx-w, uy=vy, u=Math.hypot(ux,uy), rho=ISA.rho(h), k=0.5*rho*CdA*u/m;
    var ax=-k*ux, ay=-SUBJ.g-k*uy;
    out.t.push(t); out.x.push(x); out.h.push(h); out.vx.push(vx); out.vy.push(vy); out.a.push(Math.hypot(ax,ay+SUBJ.g)/SUBJ.g);
    vx+=ax*dt; vy+=ay*dt; x+=vx*dt; h+=vy*dt; t+=dt; n++;
  }
  out.T=t; out.dx=x; out.vland=Math.hypot(vx,vy); out.vyland=-vy; return out;
}
/** 시각 t 에서 descend 결과를 보간해 {x,h,v} 를 얻는다 */
function descAt(D, t){
  var i=Math.min(D.t.length-1, Math.max(0, Math.floor(t/(D.t[1]-D.t[0]))));
  return {x:D.x[i], h:D.h[i], vx:D.vx[i], vy:D.vy[i], v:Math.hypot(D.vx[i],D.vy[i]), i:i};
}

/* ── 유도 낙하(GPS 조향 파라포일) — 위에서 본 2D ─────────────────────────
   o = {h0, vs(침하속도), LD(활공비), wind:[wx,wy], p0:[x,y], target:[0,0], gps(σ m), gpsHz=1, turn(rad/s)=1, dt=0.05, rng}
   수평 대기속도 Vg = LD·vs.  지상속도 = Vg·(cosθ,sinθ) + wind.  θ 는 추정 위치(GPS 잡음 포함)로 목표를 향해 돈다.
   반환 {t[],x[],y[],T,miss, reach:{cx,cy,r}} */
function guideSim(o){
  var dt=o.dt||0.05, T=o.h0/o.vs, Vg=(o.LD||0)*o.vs, wx=o.wind[0], wy=o.wind[1], tg=o.target||[0,0];
  var x=o.p0[0], y=o.p0[1], th=Math.atan2(tg[1]-y, tg[0]-x), turn=(o.turn==null?1:o.turn), rng=o.rng||Math.random;
  var g=o.gps||0, per=1/(o.gpsHz||1), est=[x,y], nextFix=0, t=0, out={t:[],x:[],y:[],th:[]};
  function gn(){ var u=1-rng(), v=rng(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.283185*v); }
  while(t<T){
    if(t>=nextFix){ est=[x+g*gn(), y+g*gn()]; nextFix+=per; }
    if(Vg>0){
      var want=Math.atan2(tg[1]-est[1], tg[0]-est[0]), d=want-th;
      while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
      th+=Math.max(-turn*dt, Math.min(turn*dt, d));
    }
    out.t.push(t); out.x.push(x); out.y.push(y); out.th.push(th);
    x+=(Vg*Math.cos(th)+wx)*dt; y+=(Vg*Math.sin(th)+wy)*dt; t+=dt;
  }
  out.t.push(t); out.x.push(x); out.y.push(y); out.th.push(th);
  out.T=T; out.miss=Math.hypot(x-tg[0], y-tg[1]);
  out.reach={cx:o.p0[0]+wx*T, cy:o.p0[1]+wy*T, r:Vg*T};      // 도달 가능 영역 = 바람에 밀린 원
  return out;
}

/* ── 전파 : 경로 손실 · 수신 신호 ───────────────────────────────────────── */
/** 1 m 기준 자유공간 손실 (dB) : 20log10(f_MHz) − 27.55 */
function pl1m(fMHz){ return 20*Math.log10(fMHz) - 27.55; }
/** 로그 거리 경로 손실 모형 PL(d) = PL(1m) + 10 n log10 d (d : m) */
function pathLoss(d, n, fMHz){ return pl1m(fMHz) + 10*n*Math.log10(Math.max(d,1)); }
/** 수신 세기(dBm) = 송신 − 손실 */
function rxPower(ptx, d, n, fMHz){ return ptx - pathLoss(d,n,fMHz); }
/** 패킷 수신 확률(시그모이드, 여유 margin dB) */
function pktOK(margin){ return 1/(1+Math.exp(-margin/1.5)); }

/* ── 충격 : 일정한 감속 모형 ─────────────────────────────────────────── */
/** 평균 충격 가속도(단위 g) = v²/(2 d g) */
function impactG(v, d){ return v*v/(2*d*SUBJ.g); }
/** 정지까지 시간(s) = 2d / v */
function impactT(v, d){ return 2*d/v; }

/* ── 통계 도우미 ───────────────────────────────────────────────────── */
function mean(a){ var s=0,i; for(i=0;i<a.length;i++) s+=a[i]; return a.length? s/a.length : 0; }
function stdev(a){ var m=mean(a), s=0,i; for(i=0;i<a.length;i++) s+=(a[i]-m)*(a[i]-m); return a.length>1? Math.sqrt(s/(a.length-1)) : 0; }
function quantile(a, q){ var b=a.slice().sort(function(p,r){ return p-r; }); if(!b.length) return 0; var k=(b.length-1)*q, f=Math.floor(k), c=Math.min(b.length-1,f+1); return b[f]+(b[c]-b[f])*(k-f); }

/* ── 그리기 도우미 ─────────────────────────────────────────────────── */
function skyBg(ctx, w, h, groundY){
  var g=ctx.createLinearGradient(0,0,0,groundY||h);
  var dark = (COL.cvbg==='#070c18' || COL.cvbg==='#04100d');
  g.addColorStop(0, dark? '#0a1530' : '#cfe6fb'); g.addColorStop(1, dark? '#1b3a5e' : '#eaf4fd');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,groundY||h);
}
function groundBg(ctx, w, h, y){
  ctx.fillStyle=COL.ground; ctx.fillRect(0,y,w,h-y);
  ctx.strokeStyle=COL.dim; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
}
/** 캔위성(옆모습) : (x,y) 가 위쪽 중심, 높이 hh 픽셀 */
function drawCan(ctx, x, y, hh, col){
  var ww=hh*0.57;
  ctx.fillStyle=col||COL.metal; ctx.strokeStyle=COL.dev; ctx.lineWidth=1.2;
  ctx.fillRect(x-ww/2, y, ww, hh); ctx.strokeRect(x-ww/2, y, ww, hh);
  ctx.fillStyle=COL.amber; ctx.fillRect(x-ww/2, y+hh*0.35, ww, hh*0.12);
}
/** 낙하산 (옆에서 본 반원) : 캔 윗점 (x,y) 에서 줄 길이 L 위로, 반지름 r */
function drawChute(ctx, x, y, L, r, openAmt){
  if(r<1) return;
  var o=(openAmt==null?1:openAmt), rr=Math.max(2,r*o), top=y-L;
  ctx.strokeStyle=COL.dim; ctx.lineWidth=0.9;
  [-1,-0.5,0.5,1].forEach(function(k){ ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+k*rr, top); ctx.stroke(); });
  ctx.fillStyle='rgba(251,113,133,.55)'; ctx.strokeStyle=COL.grav; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(x, top, rr, rr*0.55*(0.4+0.6*o), 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function fmtM(m){ return m>=1000? (m/1000).toFixed(2)+' km' : (m>=10? m.toFixed(0) : m.toFixed(1))+' m'; }
function fmt1(v){ return v.toFixed(1); }
/** 막대 그림용 둥근 알약 라벨 */
function pill(ctx, s, x, y, fg, bg){
  ctx.font='11px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
  var tw=ctx.measureText(s).width; ctx.fillStyle=bg||COL.labelbg; ctx.fillRect(x-4,y-8,tw+8,16);
  ctx.fillStyle=fg||COL.text; ctx.fillText(s,x,y);
}
