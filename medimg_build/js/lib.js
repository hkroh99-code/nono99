/* ═══════════════════════════════════════════════════════════════════════════
   ★ 의료영상 단원 공용 도구 (구역 C) — 감약 · CT 재구성 · 초음파 · MRI · 통계 · 그리기 도우미
   · 모든 모형은 「교육용 어림」 이며 화면의 note 에 가정을 밝혀 둔다(실제 장비 · 진단에 쓰지 않는다).
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 물질의 X선 감약(선감약계수 μ, cm⁻¹) : μ(E)=μ60·[pe·(60/E)³ + (1−pe)·(60/E)^0.3] ─────────────────
   pe = 60 keV 에서 광전효과가 차지하는 몫(어림). 물 · 알루미늄 · 뼈에서 30 ~ 100 keV 구간을 ±10 % 안으로 맞춘다. */
var MAT = {
  air   :{n:'공기',    mu:0.0008, pe:0.05, hu:-1000},
  lung  :{n:'폐',      mu:0.050,  pe:0.08, hu:-760},
  fat   :{n:'지방',    mu:0.185,  pe:0.06, hu:-100},
  water :{n:'물',      mu:0.206,  pe:0.08, hu:0},
  muscle:{n:'근육',    mu:0.212,  pe:0.09, hu:30},
  bone  :{n:'뼈',      mu:0.570,  pe:0.45, hu:1770},
  Al    :{n:'알루미늄', mu:0.750,  pe:0.35, hu:null}
};
function muE(mat, E){ var m=MAT[mat], r=60/E; return m.mu*(m.pe*r*r*r+(1-m.pe)*Math.pow(r,0.3)); }
var MU_W = 0.206;
function huOf(mu){ return 1000*(mu-MU_W)/MU_W; }
function muOfHU(hu){ return MU_W*(1+hu/1000); }

/* ── 통계 · 난수 도우미 ─────────────────────────────────────────────── */
function mean(a){ var s=0,i; for(i=0;i<a.length;i++) s+=a[i]; return a.length? s/a.length : 0; }
function stdev(a){ var m=mean(a), s=0,i; for(i=0;i<a.length;i++) s+=(a[i]-m)*(a[i]-m); return a.length>1? Math.sqrt(s/(a.length-1)) : 0; }
function quantile(a, q){ var b=a.slice().sort(function(p,r){ return p-r; }); if(!b.length) return 0; var k=(b.length-1)*q, f=Math.floor(k), c=Math.min(b.length-1,f+1); return b[f]+(b[c]-b[f])*(k-f); }
/** 포아송 계수(평균 lam) — 큰 값은 정규 근사, 작은 값은 직접 */
function poisN(lam, r){ if(lam<=0) return 0; if(lam>40){ var v=lam+Math.sqrt(lam)*gaussR(r); return v<0?0:Math.round(v); } var L=Math.exp(-lam), k=0, p=1; do{ k++; p*=r(); }while(p>L); return k-1; }

/* ── 머리 단면 팬텀(라벨 지도) : 0 공기 · 1 두개골 · 2 두피 · 3 회색질 · 4 백색질 · 5 뇌척수액 · 6 병변 · 7 석회화 ─────────── */
var LAB = {AIR:0, SKULL:1, SCALP:2, GM:3, WM:4, CSF:5, LES:6, CAL:7};
function makeHead(N, lesion){
  var lab=new Uint8Array(N*N), i, j, les=(lesion==null)?1:lesion;
  for(j=0;j<N;j++) for(i=0;i<N;i++){
    var x=(i+0.5)/N*2-1, y=1-(j+0.5)/N*2, rho=Math.sqrt((x/0.80)*(x/0.80)+(y/0.95)*(y/0.95)), L=0;
    if(rho<=1.0){ L=LAB.SCALP; if(rho<=0.93){ L=LAB.SKULL; if(rho<=0.85){ L=(rho>0.64)?LAB.GM:LAB.WM;
        var v1=Math.pow((x-0.11)/0.07,2)+Math.pow((y-0.08)/0.24,2), v2=Math.pow((x+0.11)/0.07,2)+Math.pow((y-0.08)/0.24,2);
        if(v1<=1||v2<=1) L=LAB.CSF;
        if(les && Math.pow(x-0.34,2)+Math.pow(y+0.18,2)<=0.011) L=LAB.LES;
        if(Math.pow(x+0.30,2)+Math.pow(y-0.34,2)<=0.0007) L=LAB.CAL; } } }
    lab[j*N+i]=L; }
  return lab;
}
var HU_OF_LAB=[-1000,700,25,40,30,5,65,320];
function huMap(lab){ var o=new Float32Array(lab.length), i; for(i=0;i<lab.length;i++) o[i]=HU_OF_LAB[lab[i]]; return o; }
/* MRI 조직값(1.5 T 어림) : [양성자밀도 PD, T1 ms, T2 ms] */
var MRI_T=[[0,1,1],[0.05,300,5],[0.9,260,85],[0.8,920,100],[0.7,600,80],[1.0,4000,2000],[0.9,1200,150],[0.05,300,5]];
function mriSignal(t, TR, TE, kind){ var p=MRI_T[t]; if(kind==='ir') return Math.abs(p[0]*(1-2*Math.exp(-(TR*0.4)/p[1])+Math.exp(-TR/p[1])))*Math.exp(-TE/p[2]); return p[0]*(1-Math.exp(-TR/p[1]))*Math.exp(-TE/p[2]); }

/* ── Radon 변환 · 역투영(화소 구동, 선형 보간) ──────────────────────────────
   영상 f (N×N, 단위 = 화소당 μ) · 각도 nth 개(0 ~ π) · 검출기 nd 칸. 투영 p[k*nd+j] = Σ f·가중치(= 선적분, 화소 단위) */
function radonFwd(f, N, nth, nd, ds){
  ds=ds||1; var p=new Float32Array(nth*nd), c=(N-1)/2, k, i, j, hd=(nd-1)/2;
  for(k=0;k<nth;k++){ var th=Math.PI*k/nth, co=Math.cos(th), si=Math.sin(th), base=k*nd;
    for(j=0;j<N;j++) for(i=0;i<N;i++){ var v=f[j*N+i]; if(v===0) continue; v*=ds;
      var s=((i-c)*co-(j-c)*si)*ds+hd, b=Math.floor(s), w=s-b;
      if(b>=0&&b<nd) p[base+b]+=v*(1-w); if(b+1>=0&&b+1<nd) p[base+b+1]+=v*w; } }
  return p;
}
/** 필터(램–락 · 쉐프–로건) 를 투영마다 합성곱 → q  (검출기 간격 1/ds 화소) */
function rampFilter(p, nth, nd, kind, ds){
  ds=ds||1; var q=new Float32Array(nth*nd), K=nd, h=new Float32Array(2*K+1), n, k, j, m;
  for(n=-K;n<=K;n++){ var a=Math.abs(n);
    if(kind==='sl') h[n+K]=-2/(Math.PI*Math.PI*(4*n*n-1));
    else h[n+K]= (n===0)? 0.25 : (a%2===1? -1/(Math.PI*Math.PI*n*n) : 0); }
  for(k=0;k<nth;k++){ var base=k*nd;
    for(j=0;j<nd;j++){ var s=0, m0=Math.max(0,j-K), m1=Math.min(nd-1,j+K); for(m=m0;m<=m1;m++) s+=p[base+m]*h[j-m+K]; q[base+j]=s*ds; } }
  return q;
}
/** 역투영 : kmax = 앞의 몇 개 각도까지 합할지(애니메이션) */
function backProj(q, N, nth, nd, kmax, ds){
  ds=ds||1; var out=new Float32Array(N*N), c=(N-1)/2, hd=(nd-1)/2, k, i, j, K=Math.min(nth,kmax==null?nth:kmax);
  for(k=0;k<K;k++){ var th=Math.PI*k/nth, co=Math.cos(th), si=Math.sin(th), base=k*nd;
    for(j=0;j<N;j++) for(i=0;i<N;i++){ var s=((i-c)*co-(j-c)*si)*ds+hd, b=Math.floor(s), w=s-b; if(b<0||b+1>=nd) continue; out[j*N+i]+=q[base+b]*(1-w)+q[base+b+1]*w; } }
  var sc=Math.PI/nth; for(i=0;i<out.length;i++) out[i]*=sc;
  return out;
}
/** 투영에 광자 잡음을 넣는다 : 검출기 한 칸의 입사 광자 수 N0, 화소 크기 pix(cm) */
function noisyProj(p, N0, pix, r){
  var q=new Float32Array(p.length), i;
  for(i=0;i<p.length;i++){ var pp=p[i]*pix, lam=N0*Math.exp(-pp), n=Math.max(1,poisN(lam,r)); q[i]=-Math.log(n/N0)/pix; }
  return q;
}
/** 한 번에 : 팬텀 HU → 투영 → (잡음) → 재구성 → HU. opt={nth, nd, N0(0 이면 잡음 없음), pix, filt:'rl'|'sl'|'none', kmax, seed} */
function ctRecon(huImg, N, opt){
  var ds=opt.ds||1, f=new Float32Array(N*N), i, nd=opt.nd||Math.ceil(N*1.45*ds);
  for(i=0;i<f.length;i++) f[i]=muOfHU(huImg[i])*(huImg[i]<=-999?0.0:1);       // μ (cm⁻¹)
  var pr=radonFwd(f,N,opt.nth,nd,ds), pix=opt.pix||0.3;
  var ps=opt.N0? noisyProj(pr,opt.N0/ds,pix,rng32(opt.seed||7)) : pr;
  var q=(opt.filt==='none')? ps : rampFilter(ps,opt.nth,nd,opt.filt==='sl'?'sl':'rl',ds);
  var rec=backProj(q,N,opt.nth,nd,opt.kmax,ds), out=new Float32Array(N*N);
  for(i=0;i<out.length;i++) out[i]=huOf(rec[i]);
  return {hu:out, sino:ps, nd:nd};
}

/* ── 영상 그리기 도우미 ────────────────────────────────────────────── */
var _gcv=null;
/** arr(N×N 실수) 를 [lo,hi] 창으로 회색조로 (x,y,w,h) 칸에 그린다. 화소 구분을 위해 smooth=false 가 기본 */
function grayImage(ctx, arr, N, x, y, w, h, lo, hi, smooth){ grayImage2(ctx, arr, N, N, x, y, w, h, lo, hi, smooth); }
/** 가로 iw × 세로 ih 배열을 그린다 */
function grayImage2(ctx, arr, iw, ih, x, y, w, h, lo, hi, smooth){
  if(!_gcv) _gcv=document.createElement('canvas');
  if(_gcv.width!==iw||_gcv.height!==ih){ _gcv.width=iw; _gcv.height=ih; }
  var g=_gcv.getContext('2d'), id=g.createImageData(iw,ih), i, d=id.data, sp=1/Math.max(1e-9,hi-lo);
  for(i=0;i<iw*ih;i++){ var v=Math.max(0,Math.min(1,(arr[i]-lo)*sp))*255; d[4*i]=v; d[4*i+1]=v; d[4*i+2]=v; d[4*i+3]=255; }
  g.putImageData(id,0,0); ctx.save(); ctx.imageSmoothingEnabled=!!smooth; ctx.drawImage(_gcv,x,y,w,h); ctx.restore();
}
function rmse(a,b){ var s=0,i; for(i=0;i<a.length;i++){ var d=a[i]-b[i]; s+=d*d; } return Math.sqrt(s/a.length); }
/** 영역(라벨 L 인 화소) 통계 */
function roiStat(arr, lab, L){ var v=[], i; for(i=0;i<arr.length;i++) if(lab[i]===L) v.push(arr[i]); return {m:mean(v), s:stdev(v), n:v.length}; }

/* ── 초음파 ─────────────────────────────────────────────────────────── */
var US_T = {   // 조직 : 음속 c(m/s) · 밀도(kg/m³) · 임피던스 Z(MRayl) · 감쇠 α(dB/cm/MHz)
  air   :{n:'공기',  c:343,  rho:1.2,  a:12},
  lung  :{n:'폐',    c:650,  rho:400,  a:40},
  fat   :{n:'지방',  c:1450, rho:920,  a:0.6},
  water :{n:'물',    c:1480, rho:1000, a:0.002},
  liver :{n:'간',    c:1550, rho:1060, a:0.5},
  muscle:{n:'근육',  c:1580, rho:1070, a:1.0},
  bone  :{n:'뼈',    c:3500, rho:1900, a:10},
  gel   :{n:'초음파 젤', c:1500, rho:1020, a:0.1}
};
function usZ(k){ var t=US_T[k]; return t.c*t.rho/1e6; }                               // MRayl
function usR(Z1,Z2){ var r=(Z2-Z1)/(Z2+Z1); return r*r; }                              // 수직 입사 세기 반사율
/** 영상 한 장(깊이 H cm, 폭 W cm, nx 줄 · nz 표본) : 조직 지도 → 줄별 에코 진폭 [0..1] */
function usImage(f, nx, nz, opt){
  var Hc=opt.H||12, Wc=opt.W||10, seed=opt.seed||3, r=rng32(seed), out=new Float32Array(nx*nz), ix, iz, dz=Hc/nz, k;
  var sig=Math.max(0.5, (opt.axial||0.3)/dz*0.6);           // 축 방향 펄스 폭(표본 수)
  var kern=[], ks=Math.ceil(sig*2.5); for(k=-ks;k<=ks;k++) kern.push(Math.exp(-k*k/(2*sig*sig)));
  var lat=Math.max(0.5,(opt.lateral||1)/ (Wc/nx));          // 가로 번짐(줄 수)
  var tgc=opt.tgc||0, spk=new Float32Array(nx*nz);
  for(ix=0;ix<nx;ix++){ var x=(ix+0.5)/nx*Wc, att=0, prevS=0;
    for(iz=0;iz<nz;iz++){ var z=(iz+0.5)*dz, t=tissueAt(x,z,Wc,Hc), T=t.t, S=t.s, al=t.a*f;      // 감쇠 dB/cm
      att+=al*dz*2;                                                                                    // 왕복 dB
      var amp=S*Math.sqrt(-2*Math.log(1-r()*0.9999))*Math.cos(6.2832*r());                            // 산란(스펙클)
      if(Math.abs(S-prevS)>0.15) amp+=Math.abs(S-prevS)*1.6;                                           // 경계면 반사
      prevS=S; var g=Math.pow(10,-(att-tgc*f*2*z)/20); spk[ix*nz+iz]=amp*g; } }
  for(ix=0;ix<nx;ix++) for(iz=0;iz<nz;iz++){ var s=0,w=0; for(k=-ks;k<=ks;k++){ var q=iz+k; if(q<0||q>=nz) continue; s+=spk[ix*nz+q]*kern[k+ks]; w+=kern[k+ks]; } out[ix*nz+iz]=Math.abs(s/w); }
  var tmp=new Float32Array(nx*nz), L=Math.round(lat);                                              // 가로 번짐(이동 평균)
  for(ix=0;ix<nx;ix++) for(iz=0;iz<nz;iz++){ var s2=0,c2=0; for(k=-L;k<=L;k++){ var q2=ix+k; if(q2<0||q2>=nx) continue; s2+=out[q2*nz+iz]; c2++; } tmp[ix*nz+iz]=s2/c2; }
  return tmp;
}
/** 복부 모사 단면 : 피부 · 지방 · 근육 · 간(낭종 · 혈관 · 갈비뼈 그림자) — s 산란 세기, a 감쇠 dB/cm/MHz */
function tissueAt(x,z,Wc,Hc){
  if(z<0.25) return {t:'skin', s:0.9, a:0.8};
  if(z<1.3)  return {t:'fat',  s:0.18, a:0.6};
  if(z<2.3)  return {t:'muscle', s:0.45, a:1.0};
  var cx=Wc*0.62, cz=6.0, d=Math.hypot(x-cx,z-cz);
  if(d<1.0) return {t:'cyst', s:0.02, a:0.02};
  var vx=Wc*0.25, vz=4.6; if(Math.hypot(x-vx,z-vz)<0.55) return {t:'vessel', s:0.03, a:0.02};
  if(z>2.3 && z<3.1 && Math.abs(x-Wc*0.85)<0.6) return {t:'rib', s:1.2, a:9};
  if(Math.abs(x-Wc*0.85)<0.6 && z>=3.1) return {t:'shadow', s:0.1, a:3};
  return {t:'liver', s:0.5, a:0.5};
}

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
