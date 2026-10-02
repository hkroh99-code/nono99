/* ═══════════════════════════════════════════════════════════════════════════
   ⚠ 구역 B — 검증된 엔진 (상수·유틸 / Canvas 그래프 엔진 / 탭 시스템 / POE·힌트)
      건드리지 마세요. 클래스 이름과 함수 시그니처가 CSS·마크업과 짝을 이룹니다.
      제공 함수 :
        sci fmtLen fmtEnergy wavelengthToRGB rgbCss Store $ $$ setTxt clamp
        setupCanvas saveCanvasPNG niceStep makePlot plotPoints plotLine legend
        ols gauss  showTab typeset buildPOE buildHints setLevel
        TabInit[n] / TabDraw[n] 등록소, POE_LOG
   ═══════════════════════════════════════════════════════════════════════════ */

/* =====================================================================
   0. 공통 상수 · 유틸리티
   ===================================================================== */
window.APP_TITLE = '14. 클라드니 무늬';

var PC = {
  e   : 1.602176634e-19,      // C
  me  : 9.1093837015e-31,     // kg
  h   : 6.62607015e-34,       // J·s
  hbar: 1.054571817e-34,
  c   : 2.99792458e8,         // m/s
  k   : 8.9875517923e9,       // N·m²/C²
  a0  : 5.29177210903e-11,    // m
  RH  : 1.0967758e7,          // 1/m
  EM  : 1.75882001076e11,     // C/kg  (e/m 참값)
  eVnm: 1239.841984           // eV·nm  (hc)
};

/* =====================================================================
   0.3  테마 색 (5종) — 이 블록은 그대로 두고 쓴다
        · HTML 은 CSS 변수(body[data-theme])가 바꾼다
        · 캔버스(3D·그래프)는 여기 정의한 COL 을 읽어 그린다
        · 밝은 테마(종이·양피지·하늘)는 인쇄를 위해 채도를 낮추고 어둡게 잡았다
   ===================================================================== */
var THEMES = [
  { id:'deep', name:'심우주', dark:true, cv:{
      cvbg:'#070c18', plotbg:'#0b1424',
      gridln:'rgba(120,150,190,.14)', gridln2:'rgba(120,150,190,.06)',
      axis:'#3d5480', axis2:'#5b7099', tick:'#9db0cc', text:'#cfe0f5',
      title:'#8fd2ff', dim:'#7288ab', white:'#e6edf7',
      labelbg:'rgba(7,12,24,.72)', legbg:'rgba(7,12,24,.78)', legbd:'rgba(120,150,190,.28)',
      ptEdge:'rgba(255,255,255,.55)', hint:'rgba(114,136,171,.85)', zoneFill:'rgba(148,163,184,.13)',
      histFill:'rgba(56,189,248,.55)', okLine:'rgba(52,211,153,.85)',
      sunFill:'rgba(251,191,36,.30)', sunEdge:'rgba(251,191,36,.65)',
      grav:'#fb7185', iner:'#a78bfa', norm:'#38bdf8', acc:'#f472b6', light:'#fde047',
      grid:'#4d7fbf', hor:'#fb7185', near:'#fbbf24', far:'#7dd3fc', ok:'#34d399',
      dev:'#94a3b8', glass:'#3d5480', amber:'#fbbf24', blue:'#38bdf8',
      sun:'#fbbf24', sunlt:'#fff3b0', earth:'#2f6fbf', frame:'#8fb4e0', frame2:'#9fe8b6',
      floor:'#233250', metal:'#dfe7f5', skin:'#ffd9b0', suit:'#6fd3ff', ground:'#2b4a35',
      rock:'#c47a4a', moon:'#9aa5b5', okpale:'#9ff0c8', warm:'#ffb98a', star:'#ffffff',
      pink2:'#f9a8d4' } },

  { id:'board', name:'칠판', dark:true, cv:{
      cvbg:'#04100d', plotbg:'#071b16',
      gridln:'rgba(140,200,180,.16)', gridln2:'rgba(140,200,180,.07)',
      axis:'#3a7565', axis2:'#5aa08c', tick:'#a9cfc2', text:'#dff5ec',
      title:'#7ff0d4', dim:'#7fae9e', white:'#eaf7f1',
      labelbg:'rgba(4,16,13,.75)', legbg:'rgba(4,16,13,.8)', legbd:'rgba(140,200,180,.3)',
      ptEdge:'rgba(255,255,255,.6)', hint:'rgba(127,174,158,.85)', zoneFill:'rgba(160,200,190,.14)',
      histFill:'rgba(103,232,249,.5)', okLine:'rgba(110,231,183,.9)',
      sunFill:'rgba(252,211,77,.3)', sunEdge:'rgba(252,211,77,.7)',
      grav:'#fca5a5', iner:'#c4b5fd', norm:'#67e8f9', acc:'#f9a8d4', light:'#fde68a',
      grid:'#5aa08c', hor:'#fca5a5', near:'#fcd34d', far:'#7dd3fc', ok:'#6ee7b7',
      dev:'#b6c9c2', glass:'#3a7565', amber:'#fcd34d', blue:'#67e8f9',
      sun:'#fcd34d', sunlt:'#fff7d6', earth:'#3b82f6', frame:'#a7e8d5', frame2:'#c9f5c0',
      floor:'#123028', metal:'#e6f2ee', skin:'#f0c9a0', suit:'#67e8f9', ground:'#1d4a34',
      rock:'#d09060', moon:'#c3d3cd', okpale:'#b7f5da', warm:'#ffd0a8', star:'#ffffff',
      pink2:'#f9a8d4' } },

  { id:'paper', name:'종이', dark:false, cv:{
      cvbg:'#ffffff', plotbg:'#f7fafd',
      gridln:'rgba(30,60,100,.16)', gridln2:'rgba(30,60,100,.07)',
      axis:'#8aa0bb', axis2:'#4a6785', tick:'#41556e', text:'#16283f',
      title:'#0b5f8c', dim:'#5b7089', white:'#0f1b2d',
      labelbg:'rgba(255,255,255,.86)', legbg:'rgba(255,255,255,.9)', legbd:'rgba(60,90,130,.32)',
      ptEdge:'rgba(15,27,45,.45)', hint:'rgba(90,110,135,.85)', zoneFill:'rgba(80,110,150,.10)',
      histFill:'rgba(3,105,161,.38)', okLine:'rgba(4,120,87,.9)',
      sunFill:'rgba(217,142,10,.28)', sunEdge:'rgba(180,83,9,.75)',
      grav:'#d11a3a', iner:'#6d28d9', norm:'#0369a1', acc:'#be185d', light:'#b45309',
      grid:'#5b8cc4', hor:'#b3123c', near:'#a05a00', far:'#0369a1', ok:'#047857',
      dev:'#64748b', glass:'#94a3b8', amber:'#b45309', blue:'#0369a1',
      sun:'#e8a010', sunlt:'#8a5a00', earth:'#2563eb', frame:'#334e70', frame2:'#166534',
      floor:'#cbd5e1', metal:'#64748b', skin:'#c68642', suit:'#0ea5e9', ground:'#86a878',
      rock:'#a0522d', moon:'#94a3b8', okpale:'#065f46', warm:'#b45309', star:'#111827',
      pink2:'#9d174d' } },

  { id:'sepia', name:'양피지', dark:false, cv:{
      cvbg:'#fbf6ec', plotbg:'#f5eddc',
      gridln:'rgba(120,95,60,.20)', gridln2:'rgba(120,95,60,.09)',
      axis:'#b9a175', axis2:'#8a7350', tick:'#5a4a34', text:'#2b2116',
      title:'#8a4b12', dim:'#7b6a52', white:'#2b2116',
      labelbg:'rgba(251,246,236,.88)', legbg:'rgba(251,246,236,.92)', legbd:'rgba(120,95,60,.35)',
      ptEdge:'rgba(43,33,22,.45)', hint:'rgba(123,106,82,.9)', zoneFill:'rgba(140,115,75,.14)',
      histFill:'rgba(14,111,142,.35)', okLine:'rgba(63,125,82,.9)',
      sunFill:'rgba(196,124,0,.28)', sunEdge:'rgba(160,90,0,.75)',
      grav:'#a52a2a', iner:'#6b4fa8', norm:'#0e6f8e', acc:'#9d3f6a', light:'#a05a00',
      grid:'#8a7350', hor:'#a52a2a', near:'#a05a00', far:'#0e6f8e', ok:'#3f7d52',
      dev:'#8b7c62', glass:'#b9a175', amber:'#a05a00', blue:'#0e6f8e',
      sun:'#d08a12', sunlt:'#7a4a00', earth:'#1d6fa5', frame:'#6b563a', frame2:'#3f7d52',
      floor:'#e0d3ba', metal:'#7b6a52', skin:'#b07a48', suit:'#2f89ad', ground:'#9aa87a',
      rock:'#9c5a2c', moon:'#a99b84', okpale:'#2f6b45', warm:'#a05a00', star:'#2b2116',
      pink2:'#8d3a63' } },

  { id:'sky', name:'하늘', dark:false, cv:{
      cvbg:'#f4f9ff', plotbg:'#e9f2fc',
      gridln:'rgba(40,80,130,.18)', gridln2:'rgba(40,80,130,.08)',
      axis:'#8fb0d0', axis2:'#43678c', tick:'#3c5a78', text:'#10243a',
      title:'#0b6fa8', dim:'#5f7d99', white:'#10243a',
      labelbg:'rgba(244,249,255,.88)', legbg:'rgba(244,249,255,.92)', legbd:'rgba(40,80,130,.32)',
      ptEdge:'rgba(16,36,58,.45)', hint:'rgba(95,125,153,.9)', zoneFill:'rgba(70,110,160,.12)',
      histFill:'rgba(11,111,168,.38)', okLine:'rgba(15,118,110,.9)',
      sunFill:'rgba(217,142,10,.28)', sunEdge:'rgba(161,98,7,.75)',
      grav:'#b91c1c', iner:'#5b3fc4', norm:'#0b6fa8', acc:'#a21caf', light:'#a16207',
      grid:'#5b8cc4', hor:'#b91c1c', near:'#a16207', far:'#0b6fa8', ok:'#0f766e',
      dev:'#5f7d99', glass:'#8fb0d0', amber:'#a16207', blue:'#0b6fa8',
      sun:'#e0a51b', sunlt:'#8a5a00', earth:'#1d4ed8', frame:'#2c4a6e', frame2:'#0f766e',
      floor:'#d3e2f2', metal:'#5f7d99', skin:'#c08552', suit:'#0891b2', ground:'#8fb082',
      rock:'#a0522d', moon:'#8fa3b8', okpale:'#0f5132', warm:'#a16207', star:'#10243a',
      pink2:'#9d174d' } }
];

/** 캔버스가 읽는 색 — applyTheme() 이 내용만 갈아 끼운다(참조는 그대로 유지) */
var COL = {};
(function(){ var c=THEMES[0].cv, k; for(k in c) COL[k]=c[k]; })();

/** 테마 적용 : CSS 변수 전환 + 캔버스 팔레트 교체 + 다시 그리기 */
function applyTheme(id){
  var i, T=THEMES[0];
  for(i=0;i<THEMES.length;i++) if(THEMES[i].id===id) T=THEMES[i];
  var k; for(k in T.cv) COL[k]=T.cv[k];
  document.body.setAttribute('data-theme', T.id);
  var pills=document.querySelectorAll('.th-pill');
  for(i=0;i<pills.length;i++)
    pills[i].setAttribute('aria-pressed', pills[i].getAttribute('data-th')===T.id ? 'true':'false');
  try{ Store.set('theme', T.id); }catch(e){}
  var cvs=document.querySelectorAll('canvas'), j;
  for(j=0;j<cvs.length;j++) cvs[j]._ctx=null;
  if(typeof TabDraw!=='undefined' && TabDraw[curTab]){ try{ TabDraw[curTab](); }catch(e){} }
}

var SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺'};
function supStr(n){ return String(n).split('').map(function(c){ return SUP[c]||c; }).join(''); }

/** 지수 표기 (MathJax 미사용 — 실시간 수치용) */
function sci(x, digits){
  digits = (digits===undefined)?3:digits;
  if(!isFinite(x)) return '—';
  if(x===0) return '0';
  var ex = Math.floor(Math.log10(Math.abs(x)));
  if(ex>=-2 && ex<=3) return (+x.toFixed(Math.max(0,digits-1-ex))).toString();
  var m = x/Math.pow(10,ex);
  return m.toFixed(digits-1)+'×10'+supStr(ex);
}
/** 길이 자동 단위 변환 */
function fmtLen(m){
  var a = Math.abs(m);
  if(a>=1e3) return (m/1e3).toFixed(2)+' km';
  if(a>=1)   return m.toFixed(3)+' m';
  if(a>=1e-2)return (m*1e2).toFixed(2)+' cm';
  if(a>=1e-3)return (m*1e3).toFixed(3)+' mm';
  if(a>=1e-6)return (m*1e6).toFixed(3)+' µm';
  if(a>=1e-9)return (m*1e9).toFixed(3)+' nm';
  if(a>=1e-12)return (m*1e12).toFixed(3)+' pm';
  return (m*1e15).toFixed(2)+' fm';
}
/** 에너지(eV 입력) 자동 단위 */
function fmtEnergy(eV){
  var a=Math.abs(eV);
  if(a>=1e6) return (eV/1e6).toFixed(3)+' MeV';
  if(a>=1e3) return (eV/1e3).toFixed(3)+' keV';
  if(a>=1e-3)return eV.toFixed(3)+' eV';
  return (eV*1e3).toFixed(3)+' meV';
}
/** 가시광선 파장(nm) → RGB (Bruton 근사 + 시감도 감쇠) */
function wavelengthToRGB(nm){
  var R=0,G=0,B=0,f=1,gamma=0.8;
  if(nm>=380&&nm<440){ R=-(nm-440)/60; G=0; B=1; }
  else if(nm>=440&&nm<490){ R=0; G=(nm-440)/50; B=1; }
  else if(nm>=490&&nm<510){ R=0; G=1; B=-(nm-510)/20; }
  else if(nm>=510&&nm<580){ R=(nm-510)/70; G=1; B=0; }
  else if(nm>=580&&nm<645){ R=1; G=-(nm-645)/65; B=0; }
  else if(nm>=645&&nm<=780){ R=1; G=0; B=0; }
  else { return [110,116,130]; }               // 비가시광 → 회색
  if(nm>=380&&nm<420) f=0.3+0.7*(nm-380)/40;
  else if(nm>700&&nm<=780) f=0.3+0.7*(780-nm)/80;
  var g=function(v){ return Math.round(255*Math.pow(Math.max(0,v)*f,gamma)); };
  return [g(R),g(G),g(B)];
}
function rgbCss(a,alpha){ return 'rgba('+a[0]+','+a[1]+','+a[2]+','+(alpha===undefined?1:alpha)+')'; }

/** localStorage 안전 래퍼 */
var Store = {
  get:function(k,d){ try{ var v=localStorage.getItem('atomapp:'+k); return v===null?d:JSON.parse(v); }catch(e){ return d; } },
  set:function(k,v){ try{ localStorage.setItem('atomapp:'+k, JSON.stringify(v)); }catch(e){} },
  clear:function(){ try{ Object.keys(localStorage).filter(function(k){return k.indexOf('atomapp:')===0;}).forEach(function(k){localStorage.removeItem(k);}); }catch(e){} }
};

function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function setTxt(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

/** 프리셋 버튼 묶음의 「지금 고른 것」 표시.
    슬라이더에 딸린 「a = g」 · 「(나) 가속」 · 「GPS 고도」 같은 버튼은
    누른 뒤에도 어느 값을 고른 상태인지 화면에 남아야 한다.

      pairs : [[버튼 id, 그 버튼이 뜻하는 값], …]
      eps   : 같다고 볼 오차 (모드 번호처럼 정수면 0, 슬라이더 값이면 step 의 절반)

    돌려주는 함수에 현재 값을 넣으면 일치하는 버튼에만 aria-pressed="true" 가 붙는다.
    슬라이더를 손으로 끌어 프리셋에서 벗어나면 저절로 모두 해제된다.
    색이 아니라 aria-pressed 를 쓰므로 스크린 리더에도 「선택됨」으로 읽힌다.

      var syncA = presetGroup([['t2-0',0], ['t2-eq',9.80665], ['t2-2g',19.6133]], 0.005);
      slider.addEventListener('input', function(){ A=+this.value; syncA(A); draw(); });
      function setA(v){ A=v; slider.value=v; syncA(A); draw(); }
      syncA(A);                                    // 처음 상태도 반드시 한 번 */
/** 값을 몰라도 되는 프리셋 표시 (여러 값을 한꺼번에 바꾸는 복합 프리셋용).
    묶음 안의 버튼을 누르면 그 버튼만 켜지고, 함께 넘긴 슬라이더를 움직이면 모두 꺼진다.
      ids   : 한 묶음인 버튼 id 들
      clear : 이 슬라이더들이 움직이면 표시를 해제한다 (없으면 계속 켜져 있는 「모드」)
    값을 정확히 아는 단일 수치 프리셋은 presetGroup() 이 더 낫다(처음 상태도 켤 수 있음). */
function presetButtons(ids, clear){
  var els=[], i, el;
  for(i=0;i<ids.length;i++){ el=document.getElementById(ids[i]); if(el) els.push(el); }
  if(els.length<2) return function(){};
  function off(){ for(var k=0;k<els.length;k++) els[k].setAttribute('aria-pressed','false'); }
  off();
  els.forEach(function(b){
    b.addEventListener('click', function(){ off(); b.setAttribute('aria-pressed','true'); });
  });
  (clear||[]).forEach(function(sid){
    var s=document.getElementById(sid);
    if(s) s.addEventListener('input', off);
  });
  return off;
}
function presetGroup(pairs, eps){
  if(eps===undefined) eps = 1e-6;
  var els=[], i;
  for(i=0;i<pairs.length;i++){
    var el=document.getElementById(pairs[i][0]);
    if(el && !el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed','false');
    els.push(el);
  }
  return function(cur){
    for(var j=0;j<els.length;j++){
      if(!els[j]) continue;
      els[j].setAttribute('aria-pressed', Math.abs(cur-pairs[j][1])<=eps ? 'true' : 'false');
    }
  };
}

/* ---------- 캔버스 (dpr 대응, 크기 변경 시에만 재설정) ---------- */
function setupCanvas(cv){
  /* _pres : 전체화면 발표 배율. 논리 좌표계를 1/K 로 줄여 그리므로
     글자·화살표·눈금이 그대로 K 배 커진다 (해상도는 그대로 유지) */
  var K = cv._pres || 1;
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var r = cv.getBoundingClientRect();
  /* 탭이 숨겨져 있으면(display:none) 크기가 0 으로 잡힌다. 이때 최소크기(240×120)로 다시
     잡아 버리면 캔버스 백킹스토어가 줄어들며 그려 둔 내용이 지워지고(다음에 다시 그려야 함),
     크기에 의존하는 캐시(예: makeBeamField)까지 헛돌게 된다.
     → 마지막으로 성공한 크기를 그대로 돌려주고 캔버스는 건드리지 않는다. */
  if(r.width < 1 || r.height < 1){
    if(cv._ctx) return {ctx:cv._ctx, w:cv._w, h:cv._h};
    return {ctx:cv.getContext('2d'), w:240, h:120};
  }
  var w = Math.max(240, Math.round(r.width /K));
  var h = Math.max(120, Math.round(r.height/K));
  if(cv._w===w && cv._h===h && cv._dpr===dpr && cv._k===K && cv._ctx){ return {ctx:cv._ctx, w:w, h:h}; }
  cv.width = Math.round(w*dpr*K); cv.height = Math.round(h*dpr*K);
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr*K,0,0,dpr*K,0,0);
  cv._w=w; cv._h=h; cv._dpr=dpr; cv._k=K; cv._ctx=ctx;
  return {ctx:ctx, w:w, h:h};
}
/** 캔버스 PNG 저장 (배경 + 캡션 합성) */
function saveCanvasPNG(canvases, filename){
  try{
    var list = canvases.filter(Boolean);
    if(!list.length) return;
    var w = list[0].width, h = list[0].height;
    var tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h + 34;
    var c = tmp.getContext('2d');
    c.fillStyle = COL.cvbg; c.fillRect(0,0,tmp.width,tmp.height);
    list.forEach(function(cv){ try{ c.drawImage(cv,0,0,w,h); }catch(e){} });
    c.fillStyle = COL.dim;
    c.font = Math.round(h*0.032)+'px sans-serif';
    c.fillText((window.APP_TITLE||'원자모형 인터랙티브')+' · '+filename, 12, h+22);
    var a = document.createElement('a');
    a.download = filename + '.png';
    a.href = tmp.toDataURL('image/png');
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }catch(e){ console.warn('PNG 저장 실패', e); }
}

/* =====================================================================
   1. 순수 Canvas 2D 그래프 엔진 (외부 라이브러리 금지)
   ===================================================================== */
function niceStep(range, target){
  var raw = range/Math.max(1,target);
  var p = Math.pow(10, Math.floor(Math.log10(raw)));
  var n = raw/p;
  var s = n<1.5?1:(n<3?2:(n<7?5:10));
  return s*p;
}
/**
 * 좌표축 프레임을 그리고 데이터→픽셀 매퍼를 반환
 * o: {xmin,xmax,ymin,ymax,xlabel,ylabel,title,ylog,xfmt,yfmt,pad}
 */
function makePlot(ctx, W, H, o){
  var L = o.left||64, R = o.right||16, T = o.top||30, B = o.bottom||46;
  var x0=L, x1=W-R, y0=H-B, y1=T;
  var ylog = !!o.ylog;
  var ymin = ylog ? Math.log10(Math.max(o.ymin,1e-12)) : o.ymin;
  var ymax = ylog ? Math.log10(Math.max(o.ymax,1e-11)) : o.ymax;
  if(ymax<=ymin) ymax = ymin+1;
  var xmin=o.xmin, xmax=o.xmax; if(xmax<=xmin) xmax=xmin+1;
  function X(v){ return x0 + (v-xmin)/(xmax-xmin)*(x1-x0); }
  function Y(v){ var t = ylog ? Math.log10(Math.max(v,1e-12)) : v; return y0 + (t-ymin)/(ymax-ymin)*(y1-y0); }

  // 배경
  ctx.fillStyle = COL.cvbg; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = COL.plotbg; ctx.fillRect(x0,y1,x1-x0,y0-y1);

  var xfmt = o.xfmt || function(v){ return sci(v,3); };
  var yfmt = o.yfmt || function(v){ return sci(v,3); };

  // 세로 격자 + x 눈금
  ctx.font = '11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
  var xs = niceStep(xmax-xmin, Math.max(3, Math.floor((x1-x0)/78)));
  var startX = Math.ceil(xmin/xs)*xs;
  for(var v=startX; v<=xmax+1e-12; v+=xs){
    var px = X(v);
    ctx.strokeStyle=COL.gridln; ctx.beginPath(); ctx.moveTo(px,y1); ctx.lineTo(px,y0); ctx.stroke();
    ctx.strokeStyle=COL.axis; ctx.beginPath(); ctx.moveTo(px,y0); ctx.lineTo(px,y0+4); ctx.stroke();
    ctx.fillStyle=COL.tick; ctx.fillText(xfmt(v), px, y0+7);
  }
  // 가로 격자 + y 눈금
  ctx.textAlign='right'; ctx.textBaseline='middle';
  if(ylog){
    var e0=Math.floor(ymin), e1=Math.ceil(ymax);
    for(var e=e0; e<=e1; e++){
      var yv=Math.pow(10,e), py=Y(yv);
      if(py>y0+1||py<y1-1) continue;
      ctx.strokeStyle=COL.gridln; ctx.beginPath(); ctx.moveTo(x0,py); ctx.lineTo(x1,py); ctx.stroke();
      ctx.fillStyle=COL.tick; ctx.fillText('10'+supStr(e), x0-7, py);
      for(var m=2;m<10;m++){ var pm=Y(yv*m); if(pm<y0&&pm>y1){ ctx.strokeStyle=COL.gridln2; ctx.beginPath(); ctx.moveTo(x0,pm); ctx.lineTo(x1,pm); ctx.stroke(); } }
    }
  } else {
    var ys = niceStep(ymax-ymin, Math.max(3, Math.floor((y0-y1)/46)));
    var startY = Math.ceil(ymin/ys)*ys;
    for(var w2=startY; w2<=ymax+1e-12; w2+=ys){
      var py2=Y(w2);
      ctx.strokeStyle=COL.gridln; ctx.beginPath(); ctx.moveTo(x0,py2); ctx.lineTo(x1,py2); ctx.stroke();
      ctx.strokeStyle=COL.axis; ctx.beginPath(); ctx.moveTo(x0-4,py2); ctx.lineTo(x0,py2); ctx.stroke();
      ctx.fillStyle=COL.tick; ctx.fillText(yfmt(w2), x0-7, py2);
    }
  }
  // 축선
  ctx.strokeStyle=COL.axis2; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(x0,y1); ctx.lineTo(x0,y0); ctx.lineTo(x1,y0); ctx.stroke();
  // 라벨
  ctx.fillStyle=COL.text; ctx.font='12px system-ui,sans-serif';
  if(o.xlabel){ ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(o.xlabel,(x0+x1)/2,H-6); }
  if(o.ylabel){ ctx.save(); ctx.translate(13,(y0+y1)/2); ctx.rotate(-Math.PI/2); ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(o.ylabel,0,0); ctx.restore(); }
  if(o.title){ ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillStyle=COL.title; ctx.font='bold 12.5px system-ui,sans-serif'; ctx.fillText(o.title, x0, 8, Math.max(60, x1-x0-72)); }
  return {X:X, Y:Y, x0:x0, x1:x1, y0:y0, y1:y1, xmin:xmin, xmax:xmax};
}
function plotPoints(ctx, P, pts, color, r){
  ctx.fillStyle = color; r = r||3.6;
  pts.forEach(function(p){
    var px=P.X(p[0]), py=P.Y(p[1]);
    if(px<P.x0-2||px>P.x1+2||py<P.y1-2||py>P.y0+2) return;
    ctx.beginPath(); ctx.arc(px,py,r,0,6.2832); ctx.fill();
    ctx.strokeStyle=COL.ptEdge; ctx.lineWidth=1; ctx.stroke();
  });
}
function plotLine(ctx, P, pts, color, width, dash){
  if(pts.length<2) return;
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=width||2;
  if(dash) ctx.setLineDash(dash);
  ctx.beginPath(); var started=false;
  for(var i=0;i<pts.length;i++){
    var px=P.X(pts[i][0]), py=P.Y(pts[i][1]);
    if(!isFinite(px)||!isFinite(py)){ started=false; continue; }
    if(!started){ ctx.moveTo(px,py); started=true; } else ctx.lineTo(px,py);
  }
  ctx.stroke(); ctx.restore();
}
function legend(ctx, x, y, items){
  ctx.save(); ctx.font='11px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
  var wmax=0; items.forEach(function(it){ wmax=Math.max(wmax, ctx.measureText(it[0]).width); });
  ctx.fillStyle=COL.legbg;
  ctx.fillRect(x-6, y-12, wmax+30, items.length*16+8);
  ctx.strokeStyle=COL.legbd; ctx.lineWidth=1;
  ctx.strokeRect(x-6, y-12, wmax+30, items.length*16+8);
  items.forEach(function(it,i){
    var yy=y+i*16;
    ctx.fillStyle=it[1]; ctx.fillRect(x,yy-4,12,8);
    ctx.fillStyle=COL.text; ctx.fillText(it[0], x+17, yy);
  });
  ctx.restore();
}
/** 최소제곱 선형회귀 y = a x + b */
function ols(data, throughOrigin){
  var n=data.length; if(n<2) return null;
  var a,b;
  if(throughOrigin){
    var sxy=0,sxx=0;
    data.forEach(function(p){ sxy+=p[0]*p[1]; sxx+=p[0]*p[0]; });
    a = sxx===0?0:sxy/sxx; b=0;
  } else {
    var sx=0,sy=0,sxx2=0,sxy2=0;
    data.forEach(function(p){ sx+=p[0]; sy+=p[1]; sxx2+=p[0]*p[0]; sxy2+=p[0]*p[1]; });
    var den = n*sxx2-sx*sx;
    a = den===0?0:(n*sxy2-sx*sy)/den;
    b = (sy-a*sx)/n;
  }
  var my=0; data.forEach(function(p){ my+=p[1]; }); my/=n;
  var sst=0, sse=0;
  data.forEach(function(p){ var f=a*p[0]+b; sst+=(p[1]-my)*(p[1]-my); sse+=(p[1]-f)*(p[1]-f); });
  return {a:a, b:b, r2: sst===0?1:Math.max(0,1-sse/sst), n:n};
}
/** 가우시안 잡음 (Box-Muller) */
function gauss(){ var u=1-Math.random(), v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.283185*v); }

/* =====================================================================
   1.5  3D 렌더 엔진 — 순수 Canvas 2D 소프트웨어 렌더러
        · 외부 라이브러리 없음(three.js·WebGL 미사용) → 오프라인 실행 보장
        · 원근 투영 + 화가 알고리즘(painter's algorithm) 깊이 정렬
        · 드래그 회전 / 휠·핀치 확대 / 더블클릭 시점 초기화
   ===================================================================== */
function vAdd(a,b){ return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function vSub(a,b){ return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function vMul(a,s){ return [a[0]*s, a[1]*s, a[2]*s]; }
function vDot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
function vCross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
function vLen(a){ return Math.sqrt(vDot(a,a)); }
function vNorm(a){ var l=vLen(a)||1; return [a[0]/l, a[1]/l, a[2]/l]; }
function vLerp(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; }
/** 주어진 축에 수직인 정규직교 기저 2개 (원·원기둥 작도용) */
function vBasis(n){
  n = vNorm(n);
  var t = Math.abs(n[1])<0.9 ? [0,1,0] : [1,0,0];
  var u = vNorm(vCross(n,t));
  return [u, vCross(n,u)];
}
function hex2rgb(h){
  h = String(h).replace('#','');
  if(h.length===3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var v = parseInt(h,16);
  if(!isFinite(v)) return [200,200,200];
  return [(v>>16)&255, (v>>8)&255, v&255];
}
/** 색 × 밝기 → rgba 문자열 (면 음영용) */
function shadeCss(hex, k, alpha){
  var c = hex2rgb(hex);
  return 'rgba('+clamp(Math.round(c[0]*k),0,255)+','+clamp(Math.round(c[1]*k),0,255)+','
       + clamp(Math.round(c[2]*k),0,255)+','+(alpha===undefined?1:alpha)+')';
}

/** 장면 등록소 — cv-tools 의 「시점」 버튼이 여기서 장면을 찾는다 */
var SC3 = {};

function Scene3(cvId, o){
  o = o||{};
  this.cvId   = cvId;
  this.yaw    = (o.yaw   !==undefined)? o.yaw   : -0.62;   // 수평 회전(rad)
  this.pitch  = (o.pitch !==undefined)? o.pitch : 0.30;    // 상하 회전(rad)
  this.zoom   = 1;
  this.fov    = (o.fov||42)*Math.PI/180;
  this.target = o.target? o.target.slice() : [0,0,0];
  this.radius = o.radius||10;                               // 담아야 할 구의 반지름
  this.margin = o.margin||1.04;                             // 가장자리 여백 배수
  this.autofit= (o.autofit!==false);                        // 내용물에 맞춰 거리 자동 조정
  this.light  = vNorm(o.light||[0.45,0.8,0.55]);
  this.items  = [];
  this.vp     = null;        // {x,y,w,h} 부분 화면(탭4처럼 반쪽만 3D일 때)
  this.bound  = false;
  this.redraw = null;        // 조작 시 호출할 다시 그리기 함수
  this._home  = {yaw:this.yaw, pitch:this.pitch};
  SC3[cvId] = this;
}
Scene3.prototype.setHome = function(yaw,pitch){ this._home={yaw:yaw,pitch:pitch}; this.yaw=yaw; this.pitch=pitch; return this; };
Scene3.prototype.reset = function(){
  this.yaw=this._home.yaw; this.pitch=this._home.pitch; this.zoom=1;
  this._rd();
};
/** 다시 그리기 — 장면이 redraw 를 배선하지 않았으면 현재 탭의 그리기 함수를 쓴다
    (배선을 빠뜨려도 회전이 멈춰 보이지 않도록 하는 안전망) */
Scene3.prototype._rd = function(){
  if(typeof this.redraw==='function'){ this.redraw(); return; }
  if(typeof TabDraw!=='undefined' && typeof curTab!=='undefined' && TabDraw[curTab]){
    try{ TabDraw[curTab](); }catch(e){}
  }
};
Scene3.prototype.clear = function(){ this.items.length=0; return this; };

/* ---------- 카메라 ---------- */
/** 장면에 들어 있는 모든 좌표를 모아 (right, up, fwd) 방향 반지름을 잰다 */
Scene3.prototype._extent = function(right, up, fwd){
  var t=this.target, W=0, H=0, D=0, i, j, it, P, p, dx, dy, dz;
  function take(p){
    dx=p[0]-t[0]; dy=p[1]-t[1]; dz=p[2]-t[2];
    var a=Math.abs(dx*right[0]+dy*right[1]+dz*right[2]); if(a>W) W=a;
    var b=Math.abs(dx*up[0]   +dy*up[1]   +dz*up[2]);    if(b>H) H=b;
    var c=Math.abs(dx*fwd[0]  +dy*fwd[1]  +dz*fwd[2]);   if(c>D) D=c;
  }
  for(i=0;i<this.items.length;i++){
    it=this.items[i];
    if(it.k==='pt'||it.k==='ball'||it.k==='txt'){ take(it.p); }
    else if(it.k==='seg'||it.k==='arw'){ take(it.a); take(it.b); }
    else { P=it.pts; for(j=0;j<P.length;j++) take(P[j]); }
  }
  return {W:W, H:H, D:D};
};
Scene3.prototype.camera = function(w,h){
  var V = this.vp || {x:0,y:0,w:w,h:h};
  var tanf = Math.tan(this.fov/2);
  var asp  = V.w/Math.max(1,V.h);
  /* 기본값 : 반지름 radius 인 구가 가로·세로 모두 들어오는 거리 (가이드 4-6 가시범위 공식) */
  var need = this.radius/(tanf*Math.min(1,asp));
  if(this.autofit && this.items.length){
    /* 회전 방향만 먼저 구해 실제 내용물의 화면 반너비·반높이를 재고 거리를 맞춘다 */
    var cp0=Math.cos(this.pitch), sp0=Math.sin(this.pitch);
    var d0=[cp0*Math.cos(this.yaw), sp0, cp0*Math.sin(this.yaw)];
    var f0=vNorm([-d0[0],-d0[1],-d0[2]]);
    var u0=(Math.abs(f0[1])>0.995)? [0,0,1] : [0,1,0];
    var r0=vNorm(vCross(f0,u0));
    var E=this._extent(r0, vCross(r0,f0), f0);
    if(E.W>0 || E.H>0){
      var mg = this.margin*(1 + 52/Math.max(120,Math.min(V.w,V.h)));   // 이름표용 가장자리 여백
      need = Math.max(E.H/tanf, E.W/(tanf*asp))*mg + E.D*0.5;
    }
  }
  if(!isFinite(need) || need<=0) need = this.radius/(tanf*Math.min(1,asp));
  var dist = need / Math.max(0.2,this.zoom);
  var cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
  var eye = [ this.target[0] + dist*cp*Math.cos(this.yaw),
              this.target[1] + dist*sp,
              this.target[2] + dist*cp*Math.sin(this.yaw) ];
  var fwd = vNorm(vSub(this.target, eye));
  var up0 = (Math.abs(fwd[1])>0.995)? [0,0,1] : [0,1,0];
  var right = vNorm(vCross(fwd,up0));
  var up = vCross(right,fwd);
  return { eye:eye, fwd:fwd, right:right, up:up, f:(V.h/2)/tanf,
           cx:V.x+V.w/2, cy:V.y+V.h/2, V:V, dist:dist };
};
function camZ(C,p){ return (p[0]-C.eye[0])*C.fwd[0]+(p[1]-C.eye[1])*C.fwd[1]+(p[2]-C.eye[2])*C.fwd[2]; }
function proj3(C,p){
  var dx=p[0]-C.eye[0], dy=p[1]-C.eye[1], dz=p[2]-C.eye[2];
  var z = dx*C.fwd[0]+dy*C.fwd[1]+dz*C.fwd[2];
  if(z<1e-4) return null;
  var k = C.f/z;
  return [ C.cx + (dx*C.right[0]+dy*C.right[1]+dz*C.right[2])*k,
           C.cy - (dx*C.up[0]   +dy*C.up[1]   +dz*C.up[2]   )*k, z ];
}
/** 근평면 클리핑 후 투영한 선분 */
function projSeg(C,a,b){
  var NEAR=1e-3, za=camZ(C,a), zb=camZ(C,b);
  if(za<NEAR && zb<NEAR) return null;
  var A=a, B=b;
  if(za<NEAR) A=vLerp(a,b,(NEAR-za)/(zb-za));
  if(zb<NEAR) B=vLerp(b,a,(NEAR-zb)/(za-zb));
  var pa=proj3(C,A), pb=proj3(C,B);
  return (pa&&pb)? [pa,pb] : null;
}

/* ---------- 도형 추가 ---------- */
/** 점(스플랫). rw 를 주면 원근에 따라 크기가 변한다 */
Scene3.prototype.pt = function(p,c,r,o){
  o=o||{}; this.items.push({k:'pt',p:p,c:c,r:r||2,rw:o.rw,a:(o.alpha===undefined?1:o.alpha)}); return this; };
/** 공(구) — 반지름은 월드 단위 */
Scene3.prototype.ball = function(p,r,c,o){
  o=o||{}; this.items.push({k:'ball',p:p,r:r,c:c,glow:o.glow,alpha:(o.alpha===undefined?1:o.alpha),minR:o.minR||2}); return this; };
Scene3.prototype.seg = function(a,b,c,w,o){
  o=o||{}; this.items.push({k:'seg',a:a,b:b,c:c,w:w||1,dash:o.dash,alpha:o.alpha,glow:o.glow,bias:o.bias||0}); return this; };
/** 꺾은선. split:true 면 선분마다 따로 깊이 정렬 */
Scene3.prototype.path = function(pts,c,w,o){
  o=o||{};
  if(!pts || pts.length<2) return this;
  if(o.split){ for(var i=1;i<pts.length;i++) this.seg(pts[i-1],pts[i],c,w,o); return this; }
  this.items.push({k:'path',pts:pts,c:c,w:w||1,dash:o.dash,alpha:o.alpha,glow:o.glow,close:o.close,bias:o.bias||0});
  return this;
};
/** 다각형 면. lit:true 면 법선 기준 음영 */
Scene3.prototype.face = function(pts,c,o){
  o=o||{};
  this.items.push({k:'face',pts:pts,c:c,alpha:(o.alpha===undefined?1:o.alpha),
                   stroke:o.stroke,sw:o.sw||1,lit:(o.lit!==false),bias:o.bias||0});
  return this;
};
/** 3D 화살표 (머리는 화면 픽셀 크기) */
Scene3.prototype.arrow = function(a,b,c,w,o){
  o=o||{}; this.items.push({k:'arw',a:a,b:b,c:c,w:w||2,head:o.head||8,alpha:o.alpha,
                            lab:o.lab,labc:o.labc,dash:o.dash}); return this; };
/** 3D 글자 (기본적으로 항상 맨 위에 그린다 — 가이드 4-6) */
Scene3.prototype.label = function(p,s,c,o){
  o=o||{};
  this.items.push({k:'txt',p:p,s:s,c:c||COL.white,font:o.font||'11px system-ui,sans-serif',
                   dx:o.dx||0,dy:o.dy||0,align:o.align||'center',base:o.base||'middle',
                   bg:o.bg,top:(o.top!==false)});
  return this;
};
/** 중심·반지름·법선으로 만든 3D 원 */
Scene3.prototype.ring = function(ctr,r,nrm,c,w,o){
  o=o||{};
  var B=vBasis(nrm), N=o.segs||72, pts=[], i;
  for(i=0;i<=N;i++){
    var t=6.283185*i/N;
    pts.push([ ctr[0]+ (B[0][0]*Math.cos(t)+B[1][0]*Math.sin(t))*r,
               ctr[1]+ (B[0][1]*Math.cos(t)+B[1][1]*Math.sin(t))*r,
               ctr[2]+ (B[0][2]*Math.cos(t)+B[1][2]*Math.sin(t))*r ]);
  }
  return this.path(pts,c,w,{dash:o.dash,alpha:o.alpha,glow:o.glow,split:(o.split!==false),bias:o.bias});
};
/** 원기둥 옆면 (반투명 유리관 등) */
Scene3.prototype.cyl = function(a,b,r,c,o){
  o=o||{};
  var segs=o.segs||22, alpha=(o.alpha===undefined?0.16:o.alpha);
  var B=vBasis(vSub(b,a)), i;
  for(i=0;i<segs;i++){
    var t0=6.283185*i/segs, t1=6.283185*(i+1)/segs;
    var d0=[ (B[0][0]*Math.cos(t0)+B[1][0]*Math.sin(t0))*r, (B[0][1]*Math.cos(t0)+B[1][1]*Math.sin(t0))*r, (B[0][2]*Math.cos(t0)+B[1][2]*Math.sin(t0))*r ];
    var d1=[ (B[0][0]*Math.cos(t1)+B[1][0]*Math.sin(t1))*r, (B[0][1]*Math.cos(t1)+B[1][1]*Math.sin(t1))*r, (B[0][2]*Math.cos(t1)+B[1][2]*Math.sin(t1))*r ];
    this.face([vAdd(a,d0),vAdd(b,d0),vAdd(b,d1),vAdd(a,d1)], c, {alpha:alpha, lit:true});
  }
  if(o.rings!==false){
    this.ring(a,r,vSub(b,a),o.ringC||c,1,{alpha:0.5,segs:segs});
    this.ring(b,r,vSub(b,a),o.ringC||c,1,{alpha:0.5,segs:segs});
  }
  return this;
};
/** 직육면체 판(얇은 상자) — 8정점 6면 */
Scene3.prototype.box = function(c0,c1,col,o){
  o=o||{};
  var x0=Math.min(c0[0],c1[0]), x1=Math.max(c0[0],c1[0]);
  var y0=Math.min(c0[1],c1[1]), y1=Math.max(c0[1],c1[1]);
  var z0=Math.min(c0[2],c1[2]), z1=Math.max(c0[2],c1[2]);
  var V=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  var F=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]];
  for(var i=0;i<6;i++) this.face([V[F[i][0]],V[F[i][1]],V[F[i][2]],V[F[i][3]]], col,
      {alpha:(o.alpha===undefined?0.5:o.alpha), stroke:o.stroke, sw:o.sw, lit:(o.lit!==false)});
  return this;
};

/* ---------- 렌더 ---------- */
Scene3.prototype._one = function(ctx,C,it){
  var p,q,i,pts,ok;
  switch(it.k){
    case 'pt':
      p = proj3(C,it.p); if(!p) return;
      ctx.globalAlpha = it.a;
      ctx.fillStyle = it.c;
      var rr = it.rw? Math.max(0.6, it.rw*C.f/p[2]) : it.r;
      ctx.beginPath(); ctx.arc(p[0],p[1],rr,0,6.2832); ctx.fill();
      ctx.globalAlpha = 1; return;
    case 'ball':
      p = proj3(C,it.p); if(!p) return;
      var R = Math.max(it.minR, it.r*C.f/p[2]);
      ctx.globalAlpha = it.alpha;
      if(it.glow){ ctx.shadowColor=it.glow; ctx.shadowBlur=Math.min(26,R*2.2+8); }
      var g = ctx.createRadialGradient(p[0]-R*0.32,p[1]-R*0.34,R*0.12, p[0],p[1],R);
      g.addColorStop(0, shadeCss(it.c,1.45,1));
      g.addColorStop(0.55, shadeCss(it.c,1.0,1));
      g.addColorStop(1, shadeCss(it.c,0.42,1));
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p[0],p[1],R,0,6.2832); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1; return;
    case 'seg':
      q = projSeg(C,it.a,it.b); if(!q) return;
      ctx.globalAlpha = (it.alpha===undefined?1:it.alpha);
      ctx.strokeStyle = it.c; ctx.lineWidth = it.w;
      if(it.dash) ctx.setLineDash(it.dash);
      if(it.glow){ ctx.shadowColor=it.glow; ctx.shadowBlur=9; }
      ctx.beginPath(); ctx.moveTo(q[0][0],q[0][1]); ctx.lineTo(q[1][0],q[1][1]); ctx.stroke();
      ctx.shadowBlur=0; ctx.setLineDash([]); ctx.globalAlpha=1; return;
    case 'path':
      ctx.globalAlpha = (it.alpha===undefined?1:it.alpha);
      ctx.strokeStyle = it.c; ctx.lineWidth = it.w;
      if(it.dash) ctx.setLineDash(it.dash);
      if(it.glow){ ctx.shadowColor=it.glow; ctx.shadowBlur=9; }
      ctx.beginPath(); ok=false;
      for(i=0;i<it.pts.length;i++){
        p = proj3(C,it.pts[i]);
        if(!p){ ok=false; continue; }
        if(!ok){ ctx.moveTo(p[0],p[1]); ok=true; } else ctx.lineTo(p[0],p[1]);
      }
      if(it.close && ok) ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur=0; ctx.setLineDash([]); ctx.globalAlpha=1; return;
    case 'face':
      pts=[];
      for(i=0;i<it.pts.length;i++){ p=proj3(C,it.pts[i]); if(!p) return; pts.push(p); }
      var k=1;
      if(it.lit){
        var n = vNorm(vCross(vSub(it.pts[1],it.pts[0]), vSub(it.pts[2],it.pts[0])));
        k = 0.46 + 0.62*Math.abs(vDot(n,this.light));
      }
      ctx.fillStyle = shadeCss(it.c, k, it.alpha);
      ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
      for(i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
      ctx.closePath(); ctx.fill();
      if(it.stroke){ ctx.strokeStyle=it.stroke; ctx.lineWidth=it.sw; ctx.stroke(); }
      return;
    case 'arw':
      q = projSeg(C,it.a,it.b); if(!q) return;
      var a2=q[0], b2=q[1], dx=b2[0]-a2[0], dy=b2[1]-a2[1], L=Math.hypot(dx,dy);
      ctx.globalAlpha=(it.alpha===undefined?1:it.alpha);
      ctx.strokeStyle=it.c; ctx.fillStyle=it.c; ctx.lineWidth=it.w;
      if(it.dash) ctx.setLineDash(it.dash);
      ctx.beginPath(); ctx.moveTo(a2[0],a2[1]); ctx.lineTo(b2[0],b2[1]); ctx.stroke();
      ctx.setLineDash([]);
      if(L>3){
        var ux=dx/L, uy=dy/L, hd=Math.min(it.head, L*0.55);
        ctx.beginPath();
        ctx.moveTo(b2[0],b2[1]);
        ctx.lineTo(b2[0]-ux*hd - uy*hd*0.45, b2[1]-uy*hd + ux*hd*0.45);
        ctx.lineTo(b2[0]-ux*hd + uy*hd*0.45, b2[1]-uy*hd - ux*hd*0.45);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha=1; return;
    case 'txt':
      p = proj3(C,it.p); if(!p) return;
      var X=p[0]+it.dx, Y=p[1]+it.dy;
      ctx.font=it.font; ctx.textAlign=it.align; ctx.textBaseline=it.base;
      if(it.bg){
        var tw=ctx.measureText(it.s).width, th=13;
        var bx = it.align==='center'? X-tw/2-4 : (it.align==='right'? X-tw-4 : X-4);
        var by = it.base==='top'? Y-2 : (it.base==='bottom'? Y-th-1 : Y-th/2-2);
        ctx.fillStyle=it.bg;
        if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(bx,by,tw+8,th+4,4); ctx.fill(); }
        else ctx.fillRect(bx,by,tw+8,th+4);
      }
      ctx.fillStyle=it.c; ctx.fillText(it.s, X, Y); return;
  }
};
Scene3.prototype.render = function(ctx,w,h){
  var C=this.camera(w,h), V=C.V, list=[], tops=[], i, it, z, pp, s;
  for(i=0;i<this.items.length;i++){
    it=this.items[i];
    if(it.k==='pt'||it.k==='ball'||it.k==='txt') z=camZ(C,it.p);
    else if(it.k==='seg'||it.k==='arw') z=(camZ(C,it.a)+camZ(C,it.b))*0.5;
    else { pp=it.pts; s=0; for(var j=0;j<pp.length;j++) s+=camZ(C,pp[j]); z=s/pp.length; }
    if(z<=0 && (it.k==='pt'||it.k==='ball'||it.k==='txt'||it.k==='face')) continue;
    it._z = z - (it.bias||0);
    (it.top? tops : list).push(it);
  }
  list.sort(function(A,B){ return B._z-A._z; });
  tops.sort(function(A,B){ return B._z-A._z; });
  ctx.save();
  ctx.beginPath(); ctx.rect(V.x,V.y,V.w,V.h); ctx.clip();
  for(i=0;i<list.length;i++) this._one(ctx,C,list[i]);
  for(i=0;i<tops.length;i++) this._one(ctx,C,tops[i]);
  ctx.restore();
  this._C = C;
  return C;
};

/* ---------- 마우스·터치 조작 ---------- */
Scene3.prototype.attach = function(){
  var self=this, cv=document.getElementById(this.cvId);
  if(!cv || this.bound) return this;
  this.bound = true;
  cv.style.touchAction='pan-y';   // 세로 스와이프 = 페이지 스크롤, 가로 스와이프 = 회전
  cv.style.cursor='grab';
  var pts={}, n=0, lastD=0;
  function inVp(ev){
    if(!self.vp) return true;
    var r=cv.getBoundingClientRect();
    /* vp 는 논리 좌표 — 전체화면 발표 배율(_pres)만큼 나눠서 맞춘다 */
    var k=cv._pres||1;
    var x=(ev.clientX-r.left)/k, y=(ev.clientY-r.top)/k;
    return x>=self.vp.x-2 && x<=self.vp.x+self.vp.w+2 && y>=self.vp.y-2 && y<=self.vp.y+self.vp.h+2;
  }
  cv.addEventListener('pointerdown', function(ev){
    if(!inVp(ev)) return;
    pts[ev.pointerId]={x:ev.clientX,y:ev.clientY}; n++;
    try{ cv.setPointerCapture(ev.pointerId); }catch(e){}
    cv.style.cursor='grabbing';
    if(ev.pointerType!=='touch') ev.preventDefault();
  });
  cv.addEventListener('pointermove', function(ev){
    var P=pts[ev.pointerId]; if(!P) return;
    var dx=ev.clientX-P.x, dy=ev.clientY-P.y;
    P.x=ev.clientX; P.y=ev.clientY;
    var ids=Object.keys(pts);
    if(ids.length>=2){                       // 두 손가락 → 확대/축소
      var A=pts[ids[0]], B=pts[ids[1]];
      var d=Math.hypot(A.x-B.x, A.y-B.y);
      if(lastD>0 && d>0) self.zoom = clamp(self.zoom*(d/lastD), 0.35, 8);
      lastD=d;
    } else {
      self.yaw   += dx*0.0085;
      self.pitch  = clamp(self.pitch + dy*0.0065, -1.45, 1.45);
    }
    self._rd();
    if(ev.pointerType!=='touch') ev.preventDefault();
  });
  function up(ev){
    if(pts[ev.pointerId]){ delete pts[ev.pointerId]; n=Math.max(0,n-1); }
    if(Object.keys(pts).length<2) lastD=0;
    if(!Object.keys(pts).length) cv.style.cursor='grab';
    try{ cv.releasePointerCapture(ev.pointerId); }catch(e){}
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', up);
  /* 두 손가락(핀치)일 때만 브라우저 기본 동작을 막는다.
     한 손가락은 그대로 두어야 휴대전화에서 페이지를 세로로 넘길 수 있다(touch-action:pan-y).
     touch-action 은 손가락을 대는 순간 정해지므로 제스처 도중 바꿔도 소용이 없다.
     여기서 직접 막아야 「페이지가 통째로 확대」되는 일이 안 생긴다. */
  cv.addEventListener('touchmove', function(ev){
    if(ev.touches && ev.touches.length>=2 && ev.cancelable) ev.preventDefault();
  }, {passive:false});
  cv.addEventListener('gesturestart', function(ev){ ev.preventDefault(); });   // iOS Safari
  cv.addEventListener('wheel', function(ev){
    if(!inVp(ev)) return;
    ev.preventDefault();
    self.zoom = clamp(self.zoom*(ev.deltaY<0?1.12:1/1.12), 0.35, 8);
    self._rd();
  }, {passive:false});
  cv.addEventListener('dblclick', function(ev){ if(inVp(ev)) self.reset(); });
  return this;
};

/** 캔버스가 좁으면(휴대폰) 보조 이름표를 줄여 겹침을 막는다 */
function narrow3(w){ return w < 560; }

/** 3D 장면 좌상단 안내 문구 + 조작 힌트 */
function hud3(ctx, w, h, lines, vp){
  var x=(vp? vp.x:0)+12, y=(vp? vp.y:0)+11;
  var H=(vp? vp.h : h);
  /* 캔버스가 낮으면 안내문이 그림을 덮는다 → 앞쪽 줄만 남긴다 */
  var maxLines = H<170 ? 1 : (H<250 ? 2 : (H<330 ? 3 : lines.length));
  if(lines.length>maxLines) lines = lines.slice(0, maxLines);
  ctx.textAlign='left'; ctx.textBaseline='top';
  for(var i=0;i<lines.length;i++){
    var L=lines[i];
    ctx.font = L.b? 'bold 12.5px system-ui,sans-serif' : '11px system-ui,sans-serif';
    ctx.fillStyle = L.c||COL.tick;
    ctx.fillText(L.t, x, y, Math.max(60,(vp?vp.w:w)-100));
    y += L.b? 18 : 15;
  }
  return y;
}
function hint3(ctx, w, h, vp){
  var V = vp||{x:0,y:0,w:w,h:h};
  ctx.font='10px system-ui,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='bottom';
  ctx.fillStyle=COL.hint;
  ctx.fillText('🖱 드래그 = 회전 · 휠 = 확대 · 더블클릭 = 시점 초기화', V.x+V.w-10, V.y+V.h-7);
}

/* =====================================================================
   2. 탭 시스템 (SPA · 해시 동기화 · 키보드 · MathJax 지연 조판)
   ===================================================================== */
var TABS = TOPIC.tabs;   // ★ 탭 이름은 파일 위쪽 TOPIC 에서 정의합니다
var typeset = {};          // 조판 완료 패널
var inited  = {};          // init 완료 탭
var TabInit = {};          // 탭별 초기화 함수 등록소
var TabDraw = {};          // 탭별 리사이즈 재그리기 등록소
var curTab = 1;

function buildTabbar(){
  var bar = document.getElementById('tabbar');
  TABS.forEach(function(t){
    var b = document.createElement('button');
    b.type='button'; b.className='tabbtn'; b.id='tabbtn'+t.id;
    b.setAttribute('role','tab'); b.setAttribute('aria-controls','tab'+t.id);
    b.setAttribute('aria-selected','false'); b.tabIndex=-1;
    b.innerHTML = t.icon+' <span>'+t.id+'. '+t.name+'</span>';
    b.addEventListener('click', function(){ showTab(t.id); });
    bar.appendChild(b);
  });
  bar.addEventListener('keydown', function(ev){
    var k=ev.key, n=null;
    if(k==='ArrowRight') n = curTab%TABS.length+1;
    else if(k==='ArrowLeft') n = (curTab-2+TABS.length)%TABS.length+1;
    else if(k==='Home') n=1; else if(k==='End') n=TABS.length;
    if(n){ ev.preventDefault(); showTab(n); document.getElementById('tabbtn'+n).focus(); }
  });
}
function buildStepNavs(){
  TABS.forEach(function(t){
    var panel = document.getElementById('tab'+t.id); if(!panel) return;
    var prev = TABS[t.id-2], next = TABS[t.id];
    var d = document.createElement('div'); d.className='stepnav';
    var pb = document.createElement('button');
    pb.type='button'; pb.className='btn sm'+(prev?'':' invis');
    pb.textContent = '← '+(prev? prev.id+'. '+prev.name : '');
    if(prev) pb.addEventListener('click', function(){ showTab(prev.id); });
    var ct = document.createElement('span'); ct.className='ct'; ct.textContent = t.id+' / '+TABS.length;
    var nb = document.createElement('button');
    nb.type='button'; nb.className='btn sm pri'+(next?'':' invis');
    nb.textContent = (next? next.id+'. '+next.name : '')+' →';
    if(next) nb.addEventListener('click', function(){ showTab(next.id); });
    d.appendChild(pb); d.appendChild(ct); d.appendChild(nb);
    panel.appendChild(d);
  });
}
function typesetPanel(el){
  if(!el || typeset[el.id]) return;
  if(window.MathJax && window.MathJax.typesetPromise){
    typeset[el.id]=true;
    window.MathJax.typesetPromise([el]).catch(function(e){ console.warn('MathJax',e); });
  }
}
/** MathJax 로드가 늦을 경우 300ms 간격 최대 15초 폴링 */
(function mjPoll(){
  var tries=0;
  var t = setInterval(function(){
    tries++;
    if(window.MathJax && window.MathJax.typesetPromise){
      clearInterval(t);
      var el=document.getElementById('tab'+curTab);
      if(el && !typeset[el.id]) typesetPanel(el);
    }
    if(tries>50) clearInterval(t);
  }, 300);
})();

function showTab(id){
  id = clamp(id|0, 1, TABS.length);
  curTab = id;
  TABS.forEach(function(t){
    var p = document.getElementById('tab'+t.id);
    var b = document.getElementById('tabbtn'+t.id);
    var on = (t.id===id);
    if(p) p.classList.toggle('on', on);
    if(b){ b.setAttribute('aria-selected', on?'true':'false'); b.tabIndex = on?0:-1; }
  });
  var btn=document.getElementById('tabbtn'+id);
  if(btn && btn.scrollIntoView) btn.scrollIntoView({block:'nearest', inline:'nearest'});
  var panel = document.getElementById('tab'+id);
  typesetPanel(panel);
  if(!inited[id] && TabInit[id]){ inited[id]=true; try{ TabInit[id](); }catch(e){ console.error('탭'+id+' 초기화 오류',e); } }
  if(TabDraw[id]){ try{ TabDraw[id](); }catch(e){ console.error('탭'+id+' 그리기 오류',e); } }
  Store.set('lastTab', id);
  try{ history.replaceState(null,'','#tab'+id); }catch(e){}
  window.scrollTo({top:0, behavior:'auto'});
}
window.addEventListener('hashchange', function(){
  var m=/^#tab(\d+)$/.exec(location.hash||'');
  if(m && (+m[1])!==curTab) showTab(+m[1]);
});

/* ---------- 리사이즈 : 보이는 탭만 다시 그림 ---------- */
var resizeTimer=null;
function onResize(){
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    if(TabDraw[curTab]){ try{ TabDraw[curTab](); }catch(e){} }
  }, 120);
}
window.addEventListener('resize', onResize);
if(window.ResizeObserver){
  var ro = new ResizeObserver(onResize);
  window.addEventListener('load', function(){ $$('.cv-wrap').forEach(function(w){ ro.observe(w); }); });
}


/* =====================================================================
   2.5 수업용 전체화면(프로젝터) 모드
       · cv-tools 의 ⛶ 버튼 → 화면 전체를 채우는 팝업으로 띄운다
       · 캔버스와 조작판을 **원래 DOM 노드째 옮겼다가 되돌린다**
         (복제하면 이벤트·상태가 끊기므로)
       · 화면 배정 : 왼쪽 = 캔버스(가변) / 오른쪽 = 조작판·수치표(고정 폭)
   ===================================================================== */
var FSX = (function(){
  'use strict';
  /* ★ 키 → {제목, 탭, 함께 띄울 캔버스들}. 여기 나열된 것은 이 템플릿의 예시(단진자·도플러·원뿔진자
     ·중력가속도 회귀·오차분포·감쇠 반로그) 기준이다. 새 단원을 만들 때는 탭 내용에 맞게 제목과
     canvas id 를 갈아 끼워라(캔버스 id 자체는 그대로 두고 싶다면 title 문구만 바꿔도 된다).
     여러 캔버스를 한 키에 묶으면(cv 배열 길이 2) 전체화면에서 세로로 함께 쌓여 뜬다. */
  var MAP = {
    't1': {t:'3D 클라드니 판 — 모래와 공명', tab:1, cv:['t1-cv','t1-cv2']},
    't2': {t:'줄에서 판으로 — 정상파의 마디', tab:2, cv:['t2-cv','t2-cv2']},
    't3': {t:'클라드니 무늬 만들기 — 모드 겹침', tab:3, cv:['t3-cv','t3-cv2']},
    't4': {t:'모래는 왜 마디로 갈까', tab:4, cv:['t4-cv','t4-cv2']},
    't5': {t:'원형 판 · 막 · 악기', tab:5, cv:['t5-cv','t5-cv2']},
    't6': {t:'리사주 · 비접촉 측정과 잇기', tab:6, cv:['t6-cv','t6-cv2']},
    't7': {t:'클라드니 활용 현황', tab:7, cv:['t7-cv','t7-cv2']},
    't8': {t:'공방 ① R&E · 프로젝트 1~5', tab:8, cv:['t8-cv','t8-cv2']},
    't9': {t:'공방 ② R&E · 프로젝트 6~10', tab:9, cv:['t9-cv','t9-cv2']},
    'k10': {t:'공방 ③ 창의 프로젝트 1~5', tab:10, cv:['k10-cv','k10-cv2']},
    'k11': {t:'공방 ④ 창의 프로젝트 6~10', tab:11, cv:['k11-cv','k11-cv2']},
    'k12': {t:'공방 ⑤ 발명품 5선', tab:12, cv:['k12-cv','k12-cv2']},
    'k13': {t:'연구 도구함 — 발상기 · 무늬 판독 훈련', tab:13, cv:['k13-cv','k13-cv2']},
    'k14': {t:'[종합1] 모래 무늬로 재는 탄성률', tab:14, cv:['k14-cv','k14-cv2']},
    'k15': {t:'[종합2] 공명 곡선 — f₀ 와 Q', tab:15, cv:['k15-cv','k15-cv2']},
    'k16': {t:'[종합3] 모래 문턱으로 재는 g', tab:16, cv:['k16-cv','k16-cv2']}
  };
  var open=null, moved=[], K=1.4, rootFont='';

  function elBox(){ return document.getElementById('fsx'); }
  /** 노드를 자리표시자를 남기고 옮긴다 */
  function take(el, dest){
    if(!el || !el.parentNode) return null;
    var ph=document.createElement('span');
    ph.style.display='none';
    el.parentNode.insertBefore(ph, el);
    dest.appendChild(el);
    return {el:el, ph:ph};
  }
  function give(rec){
    if(rec && rec.ph && rec.ph.parentNode) rec.ph.parentNode.replaceChild(rec.el, rec.ph);
  }
  function canvases(){
    return Array.prototype.slice.call(document.querySelectorAll('#fsx-stage canvas'));
  }
  function applyScale(){
    /* 배율은 캔버스가 넉넉히 클 때만 의미가 있다.
       작은 화면에서 그대로 키우면 안내문이 화면을 다 덮어 버린다 */
    canvases().forEach(function(cv){
      var w=cv.getBoundingClientRect().width;
      cv._pres = (w>=900)? K : Math.max(1, K*w/900);
      cv._ctx=null;
    });
    /* 조작판 글자도 같이 키운다 (rem 기준이라 root 글꼴만 바꾸면 전부 따라온다) */
    document.documentElement.style.fontSize =
      (window.innerWidth>=900)? Math.round(15*(0.55+0.45*K))+'px' : '';
    var kv=document.getElementById('fsx-kv'); if(kv) kv.textContent=Math.round(K*100)+'%';
    redraw();
  }
  function redraw(){
    canvases().forEach(function(cv){
      var w=cv.getBoundingClientRect().width;
      cv._pres = (w>=900)? K : Math.max(1, K*w/900);
      cv._ctx=null;
    });
    if(TabDraw[curTab]){ try{ TabDraw[curTab](); }catch(e){ console.error('전체화면 그리기',e); } }
  }
  function show(key){
    if(open===key){ hide(); return; }
    if(open) hide();
    var m=MAP[key]; if(!m) return;
    if(curTab!==m.tab) showTab(m.tab);
    var box=elBox(), stage=document.getElementById('fsx-stage'), side=document.getElementById('fsx-side');
    document.getElementById('fsx-title').textContent=m.t;
    moved=[];
    m.cv.forEach(function(id){
      var cv=document.getElementById(id); if(!cv) return;
      var wrap=cv.parentNode;
      if(!wrap || wrap.className.indexOf('cv-wrap')<0) return;
      var r=take(wrap, stage); if(r) moved.push(r);
    });
    /* 왼쪽 첫 카드 = 그 탭의 조작판(슬라이더·버튼·수치표·기록표) */
    var card=document.querySelector('#tab'+m.tab+' .grid2 > div:first-child > .card');
    var rc=take(card, side); if(rc) moved.push(rc);
    /* 시간 막대(재생 · 스크럽 · 배속)도 조작판으로 — 캔버스 카드 안에 있어 따라오지 않던 결함(2026-09-29) */
    Array.prototype.slice.call(document.querySelectorAll('#tab'+m.tab+' .timebar')).forEach(function(tb){
      if(!side.contains(tb)){ var rt=take(tb, side); if(rt) moved.push(rt); }
    });
    stage.classList.toggle('two', m.cv.length>1);
    box.hidden=false;
    document.body.style.overflow='hidden';
    rootFont=document.documentElement.style.fontSize||'';
    open=key;
    /* 브라우저 전체화면은 「보너스」다. 사용자 제스처가 아니면 거부되지만
       오버레이 자체가 화면을 덮으므로 그대로 쓸 수 있다 — 거부는 조용히 삼킨다 */
    if(box.requestFullscreen){
      try{ var pr=box.requestFullscreen(); if(pr && pr.catch) pr.catch(function(){}); }catch(e){}
    }
    applyScale();
    setTimeout(redraw, 90);
    setTimeout(redraw, 320);
  }
  function hide(){
    if(!open) return;
    var box=elBox();
    open=null;
    for(var i=moved.length-1;i>=0;i--) give(moved[i]);
    moved=[];
    box.hidden=true;
    document.body.style.overflow='';
    document.documentElement.style.fontSize=rootFont;
    var all=document.querySelectorAll('canvas');
    for(var q=0;q<all.length;q++){ all[q]._pres=1; all[q]._ctx=null; }
    if(document.fullscreenElement && document.exitFullscreen){
      try{ var pe2=document.exitFullscreen(); if(pe2 && pe2.catch) pe2.catch(function(){}); }catch(e){}
    }
    setTimeout(function(){ if(TabDraw[curTab]) try{ TabDraw[curTab](); }catch(e){} }, 60);
  }
  function bind(){
    document.addEventListener('click', function(ev){
      var t=ev.target.closest ? ev.target.closest('[data-fsx]') : null;
      if(!t) return;
      show(t.getAttribute('data-fsx'));
    });
    document.getElementById('fsx-close').addEventListener('click', hide);
    document.getElementById('fsx-plus').addEventListener('click', function(){ K=clamp(K+0.2,1,2.6); applyScale(); });
    document.getElementById('fsx-minus').addEventListener('click', function(){ K=clamp(K-0.2,1,2.6); applyScale(); });
    document.getElementById('fsx-side-t').addEventListener('click', function(){
      var on=!elBox().classList.toggle('noside');
      this.setAttribute('aria-pressed', on?'true':'false');
      setTimeout(redraw, 60);
    });
    document.addEventListener('keydown', function(ev){
      if(!open) return;
      if(ev.key==='Escape'){ ev.preventDefault(); hide(); }
      else if(ev.key==='+'||ev.key==='='){ K=clamp(K+0.2,1,2.6); applyScale(); }
      else if(ev.key==='-'||ev.key==='_'){ K=clamp(K-0.2,1,2.6); applyScale(); }
    });
    /* 브라우저 전체화면을 사용자가 직접 빠져나갔을 때 같이 닫는다 */
    document.addEventListener('fullscreenchange', function(){
      if(open && !document.fullscreenElement) hide();
    });
    window.addEventListener('resize', function(){ if(open) setTimeout(redraw, 140); });
  }
  return { show:show, hide:hide, bind:bind, map:MAP, isOpen:function(){ return open; } };
})();

/* =====================================================================
   3. POE 패널 · 힌트(비계) 자동 생성
   ===================================================================== */
var POE_LOG = [];
function buildPOE(){
  $$('.poe[data-q]').forEach(function(box, idx){
    var q = box.getAttribute('data-q');
    var opts = (box.getAttribute('data-opts')||'').split('||');
    var ans = parseInt(box.getAttribute('data-ans'),10);
    var exp = box.getAttribute('data-exp')||'';
    var marks = ['①','②','③','④','⑤'];
    var html = '<span class="badge b-poe">POE</span> <span class="tiny">Predict → Observe → Explain</span>'
             + '<div class="pq">🤔 [예측] '+q+'</div><div class="opts"></div>'
             + '<div class="poe-exp"><div class="et">🔬 [관찰 &amp; 설명]</div>'+exp+'</div>';
    box.innerHTML = html;
    var wrap = box.querySelector('.opts');
    opts.forEach(function(o,i){
      var b=document.createElement('button');
      b.type='button'; b.className='opt';
      b.innerHTML='<span class="mk">'+(marks[i]||(i+1))+'</span>'+o;
      b.addEventListener('click', function(){
        if(box.dataset.done==='1') return;
        box.dataset.done='1';
        $$('.opt', box).forEach(function(x,j){
          x.classList.remove('sel');
          if(j===ans) x.classList.add('ok');
          else if(j===i) x.classList.add('no');
        });
        box.querySelector('.poe-exp').classList.add('on');
        POE_LOG.push({q:q, correct:(i===ans)});
        Store.set('poe', POE_LOG);
      });
      wrap.appendChild(b);
    });
  });
}
function buildHints(){
  $$('.hintbox[data-hints]').forEach(function(box){
    var hints = (box.getAttribute('data-hints')||'').split('||');
    var n = 0;
    box.innerHTML = '<div class="hint-head"><span class="hint-title">🧗 도움닫기(비계) — 막히면 한 단계씩 여세요</span>'
      + '<button type="button" class="btn sm gr">💡 힌트 열기 (0/'+hints.length+')</button></div>'
      + '<div class="hint-list"></div>';
    var btn = box.querySelector('button'), list = box.querySelector('.hint-list');
    btn.addEventListener('click', function(){
      if(n>=hints.length){ list.innerHTML=''; n=0; btn.textContent='💡 힌트 열기 (0/'+hints.length+')'; return; }
      var d=document.createElement('div'); d.className='hint-item'; d.innerHTML=hints[n];
      list.appendChild(d); n++;
      btn.textContent = (n>=hints.length? '↺ 힌트 접기 ('+n+'/'+hints.length+')' : '💡 다음 힌트 ('+n+'/'+hints.length+')');
      if(window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([d]).catch(function(){});
    });
  });
}
/* ---------- PNG 버튼 위임 ---------- */
document.addEventListener('click', function(ev){
  var t = ev.target.closest ? ev.target.closest('[data-png]') : null;
  if(!t) return;
  var cv = document.getElementById(t.getAttribute('data-png'));
  saveCanvasPNG([cv], t.getAttribute('data-pngname')||'canvas');
});
/* ---------- 3D 「시점 초기화」 버튼 위임 ---------- */
document.addEventListener('click', function(ev){
  var t = ev.target.closest ? ev.target.closest('[data-view]') : null;
  if(!t) return;
  var sc = SC3[t.getAttribute('data-view')];
  if(sc) sc.reset();
});
/* ---------- 본문 안의 탭 점프 버튼 위임 ---------- */
document.addEventListener('click', function(ev){
  var t = ev.target.closest ? ev.target.closest('[data-goto]') : null;
  if(!t) return;
  var n = parseInt(t.getAttribute('data-goto'), 10);
  if(n) showTab(n);
});
/* ---------- 난이도 전환 ---------- */
function setLevel(lv){
  /* 저장값이 손상돼도 화면이 뒤섞이지 않도록 값을 검증한다 */
  if(lv!=='mid' && lv!=='high' && lv!=='uni') lv='high';
  document.body.setAttribute('data-level', lv);
  $$('.lv-pill').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lv')===lv ? 'true':'false'); });
  Store.set('level', lv);
  onResize();
}

/* ═══════════════════════════════════════════════════════════════════════════
   ⚠ 구역 B-2 — 시간 진화(애니메이션) · 3D 뷰 · 교육설계 엔진   [수정 금지]
   ───────────────────────────────────────────────────────────────────────────
   빛·물체·파동처럼 "시간에 따라 변해 가는 것"은 반드시 이 엔진으로 애니메이션한다.
     Anim        탭별 시간 진화 루프 (재생/일시정지/배속/되감기/스크럽)
     buildTimeBar 표준 재생 컨트롤 UI 생성
     makeTrail   궤적(꼬리) · 스트로보 잔상
     wavefronts  퍼져 나가는 파면(원) 그리기
     makeScene3  Canvas 2D 소프트웨어 3D (드래그 회전 · 휠 확대)
     renderMisc / buildQuizFromMisc / renderModels / auditPedagogy
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 1) 시간 진화 루프 : 활성 탭에서만 돈다 ───────────────────────────────── */
var Anim = (function(){
  var reg = {};
  function frame(id){
    var A = reg[id]; if(!A) return;
    A.raf = null;
    if(curTab !== id || !A.playing) return;
    var now = performance.now();
    var dt = Math.min(0.05, (now - A.last)/1000);
    A.last = now;
    A.t += dt * A.speed;
    if(A.dur > 0 && A.t > A.dur){ if(A.loop) A.t -= A.dur; else { A.t = A.dur; A.playing = false; } }
    try{ A.draw(A.t); if(A.onTick) A.onTick(A.t, A.playing); }catch(e){ console.warn('Anim draw', e); A.playing=false; }
    if(A.playing) A.raf = requestAnimationFrame(function(){ frame(id); });
  }
  function tick(id){ var A=reg[id]; if(A){ try{ A.draw(A.t); if(A.onTick) A.onTick(A.t, A.playing); }catch(e){} } }
  return {
    /** o = {draw:function(t){}, dur:주기(초, 0이면 무한), loop:true, autoplay:true, onTick:function(t,playing){}} */
    register:function(id,o){
      reg[id] = { draw:o.draw, onTick:o.onTick||null, t:0, speed:1,
                  dur:o.dur||0, loop:o.loop!==false, playing:o.autoplay!==false,
                  last:performance.now(), raf:null };
      return reg[id];
    },
    play:function(id){ var A=reg[id]; if(!A||A.playing) return; A.playing=true; A.last=performance.now(); frame(id); },
    pause:function(id){ var A=reg[id]; if(!A) return; A.playing=false; if(A.raf){ cancelAnimationFrame(A.raf); A.raf=null; } tick(id); },
    toggle:function(id){ var A=reg[id]; if(!A) return; if(A.playing) Anim.pause(id); else Anim.play(id); },
    reset:function(id){ var A=reg[id]; if(!A) return; A.t=0; A.last=performance.now(); tick(id); },
    seek:function(id,t){ var A=reg[id]; if(!A) return; A.t=Math.max(0,t); tick(id); },
    step:function(id,dt){ var A=reg[id]; if(!A) return; Anim.pause(id); A.t=Math.max(0,A.t+dt); tick(id); },
    setSpeed:function(id,s){ var A=reg[id]; if(A) A.speed=s; },
    time:function(id){ var A=reg[id]; return A? A.t : 0; },
    isPlaying:function(id){ var A=reg[id]; return !!(A && A.playing); },
    /** 탭이 다시 활성화될 때 호출 (TabDraw 안에서) */
    kick:function(id){ var A=reg[id]; if(!A) return; A.last=performance.now(); if(A.playing && !A.raf) frame(id); else tick(id); }
  };
})();

/** 표준 재생 컨트롤 UI 생성 : buildTimeBar('t3-time', 3, {dur:8, unit:'s'}) */
function buildTimeBar(hostId, tabId, opt){
  var host = document.getElementById(hostId); if(!host) return null;
  opt = opt || {};
  var dur = opt.dur || 10, unit = opt.unit || 's', digits = (opt.digits===undefined)?2:opt.digits;
  var speeds = opt.speeds || [0.25, 0.5, 1, 2, 4];
  host.className = 'timebar';
  host.innerHTML =
      '<button type="button" class="btn sm pri tb-play">⏸ 일시정지</button>'
    + '<button type="button" class="btn sm tb-back" title="0.1초 뒤로">⏪</button>'
    + '<button type="button" class="btn sm tb-fwd"  title="0.1초 앞으로">⏩</button>'
    + '<button type="button" class="btn sm tb-reset" title="처음으로">⏮ 처음</button>'
    + '<input type="range" class="tb-seek" min="0" max="'+dur+'" step="'+(dur/600)+'" value="0" aria-label="시간 이동">'
    + '<span class="tb-t">0.00 '+unit+'</span>'
    + '<span class="sp" role="group" aria-label="재생 속도">'
    + speeds.map(function(s){ return '<button type="button" data-sp="'+s+'" aria-pressed="'+(s===1?'true':'false')+'">×'+s+'</button>'; }).join('')
    + '</span>';
  var play = host.querySelector('.tb-play'), seek = host.querySelector('.tb-seek'), lab = host.querySelector('.tb-t');
  function sync(t, playing){
    if(document.activeElement !== seek) seek.value = Math.min(dur, t);
    lab.textContent = t.toFixed(digits) + ' ' + unit;
    play.textContent = playing ? '⏸ 일시정지' : '▶ 재생';
  }
  play.addEventListener('click', function(){ Anim.toggle(tabId); sync(Anim.time(tabId), Anim.isPlaying(tabId)); });
  host.querySelector('.tb-reset').addEventListener('click', function(){ Anim.reset(tabId); sync(0, Anim.isPlaying(tabId)); });
  host.querySelector('.tb-back').addEventListener('click', function(){ Anim.step(tabId,-0.1); sync(Anim.time(tabId), false); });
  host.querySelector('.tb-fwd').addEventListener('click',  function(){ Anim.step(tabId, 0.1); sync(Anim.time(tabId), false); });
  seek.addEventListener('input', function(){
    var val = +seek.value;              // pause 가 sync 를 부르며 슬라이더를 되돌리므로 먼저 읽어 둔다
    Anim.pause(tabId); Anim.seek(tabId, val); sync(val, false);
  });
  $$('[data-sp]', host).forEach(function(b){
    b.addEventListener('click', function(){
      Anim.setSpeed(tabId, parseFloat(b.getAttribute('data-sp')));
      $$('[data-sp]', host).forEach(function(x){ x.setAttribute('aria-pressed', x===b ? 'true':'false'); });
    });
  });
  return { sync:sync, dur:dur };
}

/* ── 2) 궤적(꼬리)과 스트로보 잔상 ───────────────────────────────────────── */
/** color 에는 알파 자리를 'ALPHA' 로 적는다 : 'rgba(56,189,248,ALPHA)' */
function makeTrail(n){
  var buf = [], N = n || 180;
  return {
    push:function(x,y){ buf.push([x,y]); if(buf.length>N) buf.shift(); },
    clear:function(){ buf.length = 0; },
    data:function(){ return buf; },
    stroke:function(ctx, color, width){
      for(var i=1;i<buf.length;i++){
        ctx.strokeStyle = color.replace('ALPHA', (0.05 + 0.8*i/buf.length).toFixed(3));
        ctx.lineWidth = width || 2;
        ctx.beginPath(); ctx.moveTo(buf[i-1][0], buf[i-1][1]); ctx.lineTo(buf[i][0], buf[i][1]); ctx.stroke();
      }
    },
    ghosts:function(ctx, color, r, every){
      every = every || 14;
      for(var i=0;i<buf.length;i+=every){
        ctx.fillStyle = color.replace('ALPHA', (0.08 + 0.45*i/buf.length).toFixed(3));
        ctx.beginPath(); ctx.arc(buf[i][0], buf[i][1], r||4, 0, 6.2832); ctx.fill();
      }
    }
  };
}

/* ── 3) 퍼져 나가는 파면 : 주기 T 마다 방출되어 속력 v 로 확대되는 원 ────── */
/** srcAt(te) : 방출 시각 te 에서의 파원 위치 [x,y] (픽셀). 정지 파원이면 상수 반환 */
function wavefronts(ctx, t, T, v, srcAt, opt){
  opt = opt || {};
  var rmax = opt.rmax || 2000, color = opt.color || 'rgba(56,189,248,ALPHA)';
  var n0 = Math.floor(t/T);
  for(var k=n0; k>=0; k--){
    var te = k*T, r = (t-te)*v;
    if(r > rmax) break;
    var c = srcAt(te);
    ctx.strokeStyle = color.replace('ALPHA', Math.max(0, 0.75*(1-r/rmax)).toFixed(3));
    ctx.lineWidth = opt.width || 1.5;
    ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, 6.2832); ctx.stroke();
  }
}

/* ── 4) Canvas 2D 소프트웨어 3D (외부 3D 라이브러리 없이) ───────────────── */
/** var sc = makeScene3(cv, redraw);  →  draw 안에서 var P = sc.begin(w,h); var p = P(x,y,z); */
function makeScene3(cv, redraw){
  var S = { yaw:-0.62, pitch:0.40, dist:7.0, fov:1.0, autoRot:0 };
  var drag = null;
  cv.classList.add('grab');
  function pos(e){ var r=cv.getBoundingClientRect(); return [e.clientX-r.left, e.clientY-r.top]; }
  cv.addEventListener('pointerdown', function(e){ drag = pos(e); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', function(e){
    if(!drag) return;
    var p = pos(e);
    S.yaw   += (p[0]-drag[0]) * 0.010;
    S.pitch  = clamp(S.pitch + (p[1]-drag[1]) * 0.008, -1.45, 1.45);
    drag = p; if(redraw) redraw();
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
    cv.addEventListener(ev, function(){ drag = null; });
  });
  cv.addEventListener('wheel', function(e){
    e.preventDefault();
    S.dist = clamp(S.dist * (e.deltaY>0 ? 1.09 : 0.92), 2.2, 26);
    if(redraw) redraw();
  }, {passive:false});

  S.begin = function(w,h){
    var cy2 = Math.cos(S.yaw), sy2 = Math.sin(S.yaw);
    var cp = Math.cos(S.pitch), sp = Math.sin(S.pitch);
    var f = Math.min(w,h) * 0.62 * S.fov;
    return function(x,y,z){
      var X =  x*cy2 + z*sy2;
      var Z = -x*sy2 + z*cy2;
      var Y =  y*cp - Z*sp;
      var Zc = y*sp + Z*cp + S.dist;
      if(Zc < 0.12) Zc = 0.12;
      var s = f/Zc;
      return { x: w/2 + X*s, y: h/2 - Y*s, z: Zc, s: s/f };
    };
  };
  S.line3 = function(ctx,P,a,b,color,width){
    var p=P(a[0],a[1],a[2]), q=P(b[0],b[1],b[2]);
    ctx.strokeStyle=color; ctx.lineWidth=width||1.4;
    ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
  };
  S.path3 = function(ctx,P,pts,color,width){
    if(pts.length<2) return;
    ctx.strokeStyle=color; ctx.lineWidth=width||1.6; ctx.beginPath();
    pts.forEach(function(v,i){ var p=P(v[0],v[1],v[2]); i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y); });
    ctx.stroke();
  };
  S.sphere3 = function(ctx,P,x,y,z,r,color,glow){
    var p=P(x,y,z), rr=Math.max(1.5, r*p.s*Math.min(ctx.canvas.width,ctx.canvas.height)*0.62);
    if(glow){ ctx.shadowColor=color; ctx.shadowBlur=12; }
    ctx.fillStyle=color; ctx.beginPath(); ctx.arc(p.x,p.y,rr,0,6.2832); ctx.fill();
    ctx.shadowBlur=0;
    return p;
  };
  /** 바닥 격자 (y = y0 평면) */
  S.grid3 = function(ctx,P,half,step,y0,color){
    ctx.strokeStyle = color || 'rgba(120,150,190,.18)'; ctx.lineWidth=1;
    for(var i=-half;i<=half;i+=step){
      var a=P(i,y0,-half), b=P(i,y0,half);
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      var c=P(-half,y0,i), d=P(half,y0,i);
      ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(d.x,d.y); ctx.stroke();
    }
  };
  S.axes3 = function(ctx,P,len,labels){
    var O=P(0,0,0), ax=[[len,0,0,'#fb7185',labels&&labels[0]||'x'],
                        [0,len,0,'#34d399',labels&&labels[1]||'y'],
                        [0,0,len,'#38bdf8',labels&&labels[2]||'z']];
    ax.forEach(function(a){
      var p=P(a[0],a[1],a[2]);
      ctx.strokeStyle=a[3]; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(p.x,p.y); ctx.stroke();
      ctx.fillStyle=a[3]; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(a[4], p.x+7, p.y-7);
    });
  };
  return S;
}

/* ── 5) 오개념 · 학습모형 : 데이터 한 곳에서 화면·퀴즈를 함께 생성 ───────── */
/** MISCONCEPTIONS 의 항목 하나를 .misc 박스로 렌더 : renderMisc('t2-misc', 1) */
function renderMisc(hostId, nos){
  var host = document.getElementById(hostId); if(!host) return;
  if(typeof MISCONCEPTIONS === 'undefined'){ host.innerHTML=''; return; }
  var list = (nos instanceof Array) ? nos : [nos];
  host.className = '';
  host.innerHTML = list.map(function(no){
    var M = MISCONCEPTIONS.filter(function(m){ return m.no===no; })[0];
    if(!M) return '';
    return '<div class="misc"><div class="mt">🧠 오개념 '+M.no+' '
         + (M.tag?('<span class="tiny">'+M.tag+'</span> '):'')
         + '&ldquo;'+M.wrong+'&rdquo;</div><span class="fix">교정 — '+M.fix+'</span></div>';
  }).join('');
  /* 교정 문구에는 수식($…$)이 들어간다. 패널 조판(typesetPanel)이 이미 끝난 뒤에 불릴 수도
     있으므로(예: 버튼 눌러 다시 그릴 때) 여기서 한 번 더 확실히 조판한다. */
  if(window.MathJax && window.MathJax.typesetPromise){
    window.MathJax.typesetPromise([host]).catch(function(){});
  }
}
/** MISCONCEPTIONS → 진단 탭(role:'quiz') QUIZ 배열 자동 생성 (문항이 따로 정의돼 있으면 그것을 우선) */
function buildQuizFromMisc(){
  if(typeof MISCONCEPTIONS === 'undefined') return [];
  return MISCONCEPTIONS.map(function(M){
    return { t:M.tag||'', go:M.tab||1, q:M.q, o:M.o, a:M.a, mis:M.wrong, e:M.fix };
  });
}
/** 학습모형 안내 카드 렌더 : renderModels('t1-models') */
function renderModels(hostId){
  var host = document.getElementById(hostId); if(!host || typeof LEARNING==='undefined') return;
  host.className = 'models';
  host.innerHTML = LEARNING.map(function(L){
    return '<div class="model"><b>'+L.name+'</b>'+L.what+' <i>→ '+L.where+'</i></div>';
  }).join('');
}
/** 교육설계 자동 점검 : 주소 끝에 #audit 를 붙여 열거나 콘솔에서 auditPedagogy() 실행 */
function auditPedagogy(){
  var rows = [];
  TABS.forEach(function(T){
    var p = document.getElementById('tab'+T.id); if(!p) return;
    rows.push({
      탭: T.id+'. '+T.name,
      선행조직자: p.querySelectorAll('.organizer').length,
      장치도해: p.querySelectorAll('svg.fig').length,
      기구카드: p.querySelectorAll('.part').length,
      실험절차: p.querySelectorAll('.step').length,
      POE: p.querySelectorAll('.poe').length,
      오개념: p.querySelectorAll('.misc').length,
      힌트: p.querySelectorAll('.hintbox').length,
      쉬운설명: p.querySelectorAll('.easy').length,
      캔버스: p.querySelectorAll('canvas').length,
      시간컨트롤: p.querySelectorAll('.timebar').length
    });
  });
  if(console.table) console.table(rows); else console.log(rows);
  var poe = document.querySelectorAll('.poe[data-q]').length;
  var misc = (typeof MISCONCEPTIONS!=='undefined') ? MISCONCEPTIONS.length : document.querySelectorAll('.misc').length;
  console.log('POE 총 '+poe+'개(권장 6+) · 오개념 '+misc+'개(권장 10) · 도해 '
              + document.querySelectorAll('svg.fig').length + '개 · 시간 컨트롤 '
              + document.querySelectorAll('.timebar').length + '개');
  return rows;
}
