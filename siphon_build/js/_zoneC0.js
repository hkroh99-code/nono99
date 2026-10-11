/* ═══════════════════════════════════════════════════════════════════════════
   ★★★ 구역 C — 탭별 시뮬레이션 : 여기를 주제에 맞게 갈아 끼웁니다 ★★★
   규칙 3가지
     ① TabInit[n] = function(){…}  — 그 탭을 처음 열 때 1회 (이벤트 연결 + 첫 그리기)
     ② TabDraw[n] = function(){…}  — 탭 전환·창 크기 변경마다 (다시 그리기만)
     ③ 캔버스는 반드시 setupCanvas(cv) 로 ctx 를 얻고, 매 프레임 호출하지 말 것
   ═══════════════════════════════════════════════════════════════════════════ */

/** 아직 만들지 않은 탭의 캔버스에 안내를 그린다 (완성 후 삭제) */
function drawPlaceholder(id, msg){
  var cv = document.getElementById(id); if(!cv) return;
  var s = setupCanvas(cv), ctx = s.ctx, w = s.w, h = s.h;
  ctx.fillStyle = COL.cvbg; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = COL.axis; ctx.setLineDash([7,6]); ctx.lineWidth = 1.6;
  ctx.strokeRect(14, 14, w-28, h-28); ctx.setLineDash([]);
  ctx.fillStyle = COL.axis2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 15px system-ui,sans-serif';
  ctx.fillText('★ ' + msg, w/2, h/2 - 12, w-40);
  ctx.font = '12px system-ui,sans-serif'; ctx.fillStyle = COL.axis;
  ctx.fillText('TabInit / TabDraw 에 그리기 코드를 작성하세요', w/2, h/2 + 14, w-40);
}


/* ═══════════════════════════════════════════════════════════════════════════
   ★ makeBeamField() — 「파원에서 스크린까지 파동이 지나가는 길」 렌더러   [선택 도구]
   슬릿·회절·간섭처럼 한 점(또는 몇 점)에서 나온 파동이 퍼져 스크린에 무늬를 만드는 주제에서
   쓴다. 쓰지 않는 주제라면 그냥 두면 된다(호출하지 않으면 아무 일도 하지 않는다).
   ───────────────────────────────────────────────────────────────────────────
   원리 : 화면의 한 점 (x,y) 를 파원에서 이은 방향으로 스크린까지 늘였을 때 닿는 자리의
   세기를 그 점의 밝기로 칠한다. 그래서 <b>밝은 띠를 따라가면 반드시 스크린의 밝은 무늬에
   닿는다</b> — 파동장과 스크린 무늬가 항상 정확히 일치한다. 세기는 시간과 무관한 시간평균
   값이므로 무늬가 제자리에서 흔들리지 않고, 그 위를 원형 파면(호, wavefronts)만 지나간다.
   파원 가까이에서는 한 칸이 스크린의 넓은 구간에 대응하므로 평균이 되어 고르게 빛나고
   (근접장), 멀어질수록 띠가 갈라진다 — 실제 빛다발이 퍼지는 모습과 같다.
   비용 : 스크린 한 줄의 세기표와 그 누적합(prefix sum)만 만들어 두면 각 칸의 평균 세기를
   O(1) 로 얻는다(= 앤티에일리어싱). 결과는 오프스크린 캔버스에 1회만 그려 두고 재사용한다.
   ═══════════════════════════════════════════════════════════════════════════ */
function makeBeamField(){
  var cache=document.createElement('canvas'), key=null;
  /** o = {key, w, h, sx, cy, screenX, step, alpha, row(y)->[r,g,b,I]} → 오프스크린 캔버스 */
  return function(o){
    var k=o.key+'@'+o.w+'x'+o.h;
    if(k===key) return cache;
    key=k;
    var w=Math.round(o.w), h=Math.round(o.h), sx=o.sx, cy=o.cy, sX=o.screenX, step=o.step||3;
    cache.width=w; cache.height=h;
    var c=cache.getContext('2d');
    var PI=new Float64Array(h+1), PR=new Float64Array(h+1), PG=new Float64Array(h+1), PB=new Float64Array(h+1);
    for(var i=0;i<h;i++){
      var v=o.row(i), I=v[3]>0?v[3]:0;
      PI[i+1]=PI[i]+I; PR[i+1]=PR[i]+v[0]*I; PG[i+1]=PG[i]+v[1]*I; PB[i+1]=PB[i]+v[2]*I;
    }
    function at(P,x){                       // 누적합을 실수 위치에서 선형보간
      if(x<=0) return P[0];
      if(x>=h) return P[h];
      var f=Math.floor(x); return P[f]+(P[f+1]-P[f])*(x-f);
    }
    var span=sX-sx;
    for(var x=sx+2; x<sX; x+=step){
      var u=(x-sx)/span; if(u<=0.012) continue;
      var K=1/u;                            // 이 점의 방향을 스크린까지 늘리는 배율
      var fade=clamp((u-0.012)/0.13,0,1)*(0.34+0.66*(1-0.5*u));
      for(var y=0;y<h;y+=step){
        var a0=cy+(y-cy)*K, a1=cy+(y+step-cy)*K, len=a1-a0;
        if(a1<0 || a0>h || len<=0) continue;
        var si=at(PI,a1)-at(PI,a0); if(si<=1e-7) continue;
        var al=(si/len)*(o.alpha||0.6)*fade;
        if(al<0.008) continue;
        c.fillStyle='rgba('+Math.round((at(PR,a1)-at(PR,a0))/si)+','
                          +Math.round((at(PG,a1)-at(PG,a0))/si)+','
                          +Math.round((at(PB,a1)-at(PB,a0))/si)+','+(al>1?1:al).toFixed(3)+')';
        c.fillRect(x,y,step,step);
      }
    }
    return cache;
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ★ 탭 수는 자유 — 진단·보고서 탭은 「번호」가 아니라 TOPIC.tabs 의 role 로 찾는다.
     role:'quiz' = 오개념 진단,  role:'report' = 실험보고서  (없으면 옛 방식대로 10 · 11)
   탭을 12·13개로 늘려도 두 탭 <section> 의 id·aria 는 아래 placeRolePanels 가 맞춘다.
   (본문 칸의 t10-* · t11-* 이름은 「위치」가 아니라 「역할」 이름이다 — 탭 번호가 바뀌어도 그대로 둔다)
   ═══════════════════════════════════════════════════════════════════════════ */
function tabOfRole(role, dflt){
  for(var i=0;i<TOPIC.tabs.length;i++){ if(TOPIC.tabs[i].role===role) return TOPIC.tabs[i].id; }
  return dflt;
}
var QUIZ_TAB   = tabOfRole('quiz',   10);
var REPORT_TAB = tabOfRole('report', 11);
(function placeRolePanels(){
  [['quiz',QUIZ_TAB],['report',REPORT_TAB]].forEach(function(r){
    var p=document.querySelector('section.panel[data-role="'+r[0]+'"]'); if(!p) return;
    p.id='tab'+r[1]; p.setAttribute('aria-labelledby','tabbtn'+r[1]);
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   ★11 실험보고서 데이터 그릇 — [종합] 탭이 측정할 때마다 여기에 담아 두면
   보고서 탭이 그대로 가져다 표·그래프·결론을 채운다. 이 객체들이
   탭과 보고서를 잇는 유일한 연결고리다(직접 DOM 을 건드리지 않는다).

   ▶ 실험 A (종합1) — REPORT_DATA
     reportSetMeta({title,tabName,xLabel,yLabel,cols,interpret,zero})  ― 탭 IIFE 맨 앞에서 1회
     reportPush(cells, x, y)                                          ― 측정 1건마다
     reportClear()                                                    ― [측정 초기화] 시
   interpret(fit, rows) 는 회귀결과 {a,b,r2} 를 받아 {label,value,unit,trueValue,formula,digits} 를
   돌려주는 함수(선택) — 물리량을 어떻게 구하는지는 주제마다 다르므로 여기서 정의한다.
   (digits = 결과 소수 자릿수, 기본 1 · zero:false = 그래프가 원점을 억지로 넣지 않음)
   ═══════════════════════════════════════════════════════════════════════════ */
var REPORT_DATA = {
  title:'⟪대표 실험 이름⟫', tabName:'[종합1] ⟪탭 이름⟫',
  xLabel:'⟪가로축(단위)⟫', yLabel:'⟪세로축(단위)⟫',
  cols:['#','⟪열1⟫','⟪열2⟫'], rows:[], interpret:null
};
function reportSetMeta(m){ for(var k in m){ if(m.hasOwnProperty(k)) REPORT_DATA[k]=m[k]; } }

/* ▶ 실험 C·D·E·F (종합2·종합3…) — REPORT_EXTRA
     종합실험은 되도록 <b>모두 보고서와 이어지게</b> 한다. 부르면 보고서에 그 실험의
     「한 부분(새 장)」이 저절로 생긴다 — 방법·측정 표·그래프·결과·「알게 된 것」 칸.
     reportDefine('C', {title, tabName, xLabel, yLabel, cols, interpret,
                        mode, zero, hint, method, question})     ― 종합 탭 IIFE 맨 앞에서 1회
       · 키 'C'~'F' (A = 종합1 자동, B = 학생 직접 측정). 보고서는 최대 8부분 → 추가 실험은 4개까지
       · mode : 'line'(기본 · 산점도+회귀직선 → interpret(fit,rows))
                'points'(점만 · interpret(null,rows) 로 평균·비율 등을 계산 — 분포·비교형 실험)
       · hint : 보고서에 띄울 안내문(없으면 「[tabName] 탭에서 … [측정 기록]」 기본 문장)
       · method : 「실험 방법」 칸의 처음 글(①②③… 틀) · question : 결과 아래 질문
     reportPush(cells, x, y, 'C') / reportClear('C')   ― 키를 빼면 실험 A */
var REPORT_EXTRA = [];
function reportExtra(key){
  for(var i=0;i<REPORT_EXTRA.length;i++){ if(REPORT_EXTRA[i].key===key) return REPORT_EXTRA[i]; }
  return null;
}
function reportDefine(key, meta){
  if(!/^[C-F]$/.test(key)){ console.warn('reportDefine : 키는 C·D·E·F 중 하나여야 합니다 →', key); return null; }
  var E=reportExtra(key);
  if(!E){
    E={key:key, title:'', tabName:'', xLabel:'', yLabel:'', cols:['#'], rows:[], interpret:null, mode:'line'};
    REPORT_EXTRA.push(E);
    REPORT_EXTRA.sort(function(a,b){ return a.key<b.key ? -1 : 1; });
  }
  for(var k in meta){ if(meta.hasOwnProperty(k) && k!=='rows' && k!=='key') E[k]=meta[k]; }
  return E;
}
function reportPush(cells,x,y,key){
  if(key && key!=='A'){
    var E=reportExtra(key);
    if(E) E.rows.push({cells:cells,x:x,y:y});
    else console.warn('reportPush : 먼저 reportDefine(\''+key+'\', …) 을 부르세요');
    return;
  }
  REPORT_DATA.rows.push({cells:cells,x:x,y:y});
}
function reportClear(key){
  if(key && key!=='A'){ var E=reportExtra(key); if(E) E.rows.length=0; return; }
  REPORT_DATA.rows.length = 0;
}


/* ═══════════════════════════════════════════════════════════════════════════
   ★ 공용 3D · 그리기 도구 (04열기관 단원에서 가져옴 — 구역 C)
   · 분자 위치는 「처음 자리 + 속도 × 시각」을 상자 안으로 삼각파로 접어 계산 → 스크럽해도 같은 그림
   · 에너지 색 규약 : 받은 열 Q₁ = COL.amber · 일 W = COL.far · 버린 열 Q₂ = COL.blue (모든 탭 공통)
   · 3D 첫 화면은 fitScene3()+viewP() 로 맞춘다(_공통 템플릿 구역 C 도구) — 처음 · 크기 변경 · 시점 초기화 때만
   ═══════════════════════════════════════════════════════════════════════════ */
window.APP_TITLE = '14. 클라드니 무늬';

/** 한 축을 [-half, half] 안으로 접어 넣는다(벽에서 튕김) */
function foldBox(u, half){
  var L = 2*half, m = (u + half) % (2*L);
  if(m < 0) m += 2*L;
  return (m < L ? m : 2*L - m) - half;
}
/** 결정론적 분자 무리 : 속도 성분이 정규분포 */
function makeGas(N, seed){
  var i, s = (seed||1)|0, list = [];
  function rnd(){ s = (s*1103515245 + 12345) & 0x7fffffff; return s/0x7fffffff; }
  function grnd(){ var u=1-rnd(), v=rnd(); return Math.sqrt(-2*Math.log(u+1e-12))*Math.cos(6.283185*v); }
  for(i=0;i<N;i++){
    var vx=grnd(), vy=grnd(), vz=grnd();
    list.push({ p:[rnd()*2-1, rnd()*2-1, rnd()*2-1], v:[vx,vy,vz], ph:rnd()*6.2832, r:rnd() });
  }
  return list;
}
/** 시각 t 에서 분자 m 의 자리 (상자 중심 c, 반너비 h[3], 속도 배율 k) */
function gasPos(m, t, k, c, h){
  return [ c[0] + foldBox(m.p[0]*h[0] + m.v[0]*k*t, h[0]),
           c[1] + foldBox(m.p[1]*h[1] + m.v[1]*k*t, h[1]),
           c[2] + foldBox(m.p[2]*h[2] + m.v[2]*k*t, h[2]) ];
}
/** 0~1 → 색 (파랑 차가움 → 노랑 → 빨강 뜨거움) */
function spColor(u, alpha){
  u = clamp(isFinite(u)?u:0, 0, 1);
  var c0=[56,189,248], c1=[251,191,36], c2=[251,113,133], r,g,b,s;
  if(u<0.5){ s=u/0.5; r=c0[0]+(c1[0]-c0[0])*s; g=c0[1]+(c1[1]-c0[1])*s; b=c0[2]+(c1[2]-c0[2])*s; }
  else     { s=(u-0.5)/0.5; r=c1[0]+(c2[0]-c1[0])*s; g=c1[1]+(c2[1]-c1[1])*s; b=c1[2]+(c2[2]-c1[2])*s; }
  return 'rgba('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+','+(alpha===undefined?1:alpha)+')';
}
function tColor(T, lo, hi, a){ return spColor((T-lo)/(hi-lo), a); }
function smooth01(x){ x=clamp(x,0,1); return x*x*(3-2*x); }
function frac(x){ return x-Math.floor(x); }
/** 직육면체 12모서리 */
function boxWire(sc, ctx, P, c, h, col, w){
  var V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(function(s){
    return [c[0]+s[0]*h[0], c[1]+s[1]*h[1], c[2]+s[2]*h[2]];
  });
  var E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]], i;
  for(i=0;i<E.length;i++) sc.line3(ctx,P,V[E[i][0]],V[E[i][1]],col,w||1.4);
}
/** 3D 다각형 채우기 */
function poly3(ctx, P, pts, fill, stroke, lw){
  ctx.beginPath();
  pts.forEach(function(v,i){ var p=P(v[0],v[1],v[2]); if(i) ctx.lineTo(p.x,p.y); else ctx.moveTo(p.x,p.y); });
  ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1; ctx.stroke(); }
}
/** 받침·수조 : 윗면을 칠하고 뼈대를 그린다 */
function slab(sc, ctx, P, c, h, fill, edge, w){
  var y=c[1]+h[1];
  poly3(ctx,P,[[c[0]-h[0],y,c[2]-h[2]],[c[0]+h[0],y,c[2]-h[2]],[c[0]+h[0],y,c[2]+h[2]],[c[0]-h[0],y,c[2]+h[2]]], fill);
  var yf=c[1];
  poly3(ctx,P,[[c[0]-h[0],yf-h[1],c[2]+h[2]],[c[0]+h[0],yf-h[1],c[2]+h[2]],[c[0]+h[0],yf+h[1],c[2]+h[2]],[c[0]-h[0],yf+h[1],c[2]+h[2]]], fill);
  boxWire(sc,ctx,P,c,h,edge,w||1.5);
}
/** 원기둥 뼈대 — o = 축이 지나는 점, ax = 'x'(수평) | 'y'(수직), 축 좌표 a → b */
function cylW(sc, ctx, P, o, a, b, r, ax, col, w){
  var i, k, seg=36;
  function pt(q, th){ return ax==='x' ? [q, o[1]+r*Math.cos(th), o[2]+r*Math.sin(th)]
                                     : [o[0]+r*Math.cos(th), q, o[2]+r*Math.sin(th)]; }
  for(k=0;k<2;k++){
    var q=k?b:a, ring=[];
    for(i=0;i<=seg;i++) ring.push(pt(q, i/seg*6.2832));
    sc.path3(ctx,P,ring,col,w||1.4);
  }
  for(i=0;i<4;i++){ var th=i/4*6.2832+0.4; sc.path3(ctx,P,[pt(a,th),pt(b,th)],col,(w||1.4)*0.8); }
}
/** 원판(피스톤 면·벽) — fill 을 주면 면을 칠한다 */
function diskW(sc, ctx, P, o, q, r, ax, col, w, fill){
  var i, ring=[], seg=36;
  for(i=0;i<=seg;i++){
    var th=i/seg*6.2832;
    ring.push(ax==='x' ? [q, o[1]+r*Math.cos(th), o[2]+r*Math.sin(th)] : [o[0]+r*Math.cos(th), q, o[2]+r*Math.sin(th)]);
  }
  if(fill) poly3(ctx,P,ring,fill);
  sc.path3(ctx,P,ring,col,w||2);
}
/** 배경 알약이 있는 글자 (기준선 middle) */
function lbl(ctx, s, x, y, col, o){
  o=o||{};
  ctx.font=o.font||'11px system-ui,sans-serif';
  ctx.textAlign=o.align||'center'; ctx.textBaseline='middle';
  if(o.bg!==false){
    var tw=ctx.measureText(s).width;
    var bx=(ctx.textAlign==='center')? x-tw/2-4 : (ctx.textAlign==='right'? x-tw-4 : x-4);
    ctx.fillStyle=COL.labelbg; ctx.fillRect(bx, y-8, tw+8, 16);
  }
  ctx.fillStyle=col; ctx.fillText(s, x, y);
}
function arrow2(ctx, x1, y1, x2, y2, col, w){
  var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy); if(L<2) return;
  ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=w||2;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  var ux=dx/L, uy=dy/L, hd=Math.min(9, L*0.5);
  ctx.beginPath(); ctx.moveTo(x2,y2);
  ctx.lineTo(x2-ux*hd-uy*hd*0.5, y2-uy*hd+ux*hd*0.5);
  ctx.lineTo(x2-ux*hd+uy*hd*0.5, y2-uy*hd-ux*hd*0.5);
  ctx.closePath(); ctx.fill();
}
/** 3D 화살표 (두 점 사이) */
function arrow3(ctx, P, a, b, col, w){ var p=P(a[0],a[1],a[2]), q=P(b[0],b[1],b[2]); arrow2(ctx,p.x,p.y,q.x,q.y,col,w); return q; }
/** 부호 붙은 에너지 문자열 */
function fmtJ(v, d, unit){
  if(!isFinite(v)) return '—';
  var s = Math.abs(v) < 0.5*Math.pow(10,-(d||0)) ? 0 : v;
  return (s>0?'+':(s<0?'−':''))+Math.abs(s).toFixed(d==null?0:d)+' '+(unit||'J');
}
/** 장부 막대 — items = [[이름, 값, 색], …], vmax = 막대 반높이의 값(슬라이더 최댓값으로 고정 → 들썩임 없음) */
function bars(ctx, x, y, w, h, items, vmax, title, unit){
  ctx.fillStyle=COL.labelbg; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=COL.axis; ctx.lineWidth=1; ctx.strokeRect(x,y,w,h);
  var top=y+(title?24:10), bot=y+h-30, mid=(top+bot)/2, half=(bot-top)/2;
  if(title){ ctx.fillStyle=COL.tick; ctx.font='bold 11px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText(title, x+8, y+6, w-16); }
  ctx.strokeStyle=COL.axis2; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+6,mid); ctx.lineTo(x+w-6,mid); ctx.stroke();
  var n=items.length, gap=(w-12)/n, bw=Math.min(30, gap*0.55);
  items.forEach(function(it,i){
    var cx=x+6+gap*(i+0.5), val=isFinite(it[1])?it[1]:0, hh=clamp(val/vmax,-1,1)*half;
    ctx.globalAlpha=0.85; ctx.fillStyle=it[2];
    ctx.fillRect(cx-bw/2, hh>=0? mid-hh : mid, bw, Math.max(1,Math.abs(hh)));
    ctx.globalAlpha=1;
    ctx.fillStyle=COL.text; ctx.font='bold 10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(it[0], cx, bot+4, gap-2);
    var ty = hh>=0 ? Math.max(top+7, mid-hh-9) : Math.min(bot-7, mid-hh+9);
    ctx.font='10px system-ui,sans-serif'; ctx.fillStyle=it[2]; ctx.textBaseline='middle';
    ctx.fillText(Math.round(val)+' '+(unit||'J'), cx, ty, gap-2);
  });
}
/** 학생이 쓰는 칸을 Store 에 저장·복원 (보고서 엔진의 FIELDS 밖에 둔 칸용) */
function persistFields(ids, key){
  var saved=Store.get(key,null);
  var ok = saved && typeof saved==='object' && !(saved instanceof Array);
  ids.forEach(function(id){
    var el=document.getElementById(id); if(!el) return;
    if(ok && typeof saved[id]==='string') el.value=saved[id];
    el.addEventListener('input', function(){
      var s={}; ids.forEach(function(j){ var e=document.getElementById(j); if(e) s[j]=e.value; });
      Store.set(key, s);
    });
  });
}

/* ── 3D 첫 화면 맞춤 [_공통 템플릿 구역 C 선택 도구 그대로] ─────────────────
   장면 전체 범위(box — 슬라이더 최댓값까지 포함)가 화면의 fw × fh 만큼 차도록 크기·위치를 정한다.
   ★ 처음 그릴 때 · 캔버스 크기가 바뀔 때 · [시점 초기화] 때만 부른다(§7-2). */
var VIEW_DIST = 5.2, VIEW_FOV = 1.7;
function fitScene3(sc, w, h, box, o){
  o = o || {};
  var fw=o.fw||0.80, fh=o.fh||0.76, bx=o.bx||0, by=o.by||0;
  sc.dist = o.dist || VIEW_DIST;
  sc.fov  = o.fov  || VIEW_FOV;
  var c=[(box[0][0]+box[1][0])/2, (box[0][1]+box[1][1])/2, (box[0][2]+box[1][2])/2];
  var q=[], i, j, k, it, s=1, x0, x1, y0, y1;
  for(i=0;i<2;i++) for(j=0;j<2;j++) for(k=0;k<2;k++)
    q.push([box[i][0]-c[0], box[j][1]-c[1], box[k][2]-c[2]]);
  function measure(){
    var P=sc.begin(w,h), n, p;
    x0=1e9; x1=-1e9; y0=1e9; y1=-1e9;
    for(n=0;n<q.length;n++){
      p=P(q[n][0]*s, q[n][1]*s, q[n][2]*s);
      if(p.x<x0) x0=p.x; if(p.x>x1) x1=p.x; if(p.y<y0) y0=p.y; if(p.y>y1) y1=p.y;
    }
  }
  for(it=0; it<12; it++){
    measure();
    var r=Math.max((x1-x0)/(fw*w), (y1-y0)/(fh*h));
    if(!(r>0) || !isFinite(r)) break;
    s /= r;
    if(Math.abs(r-1) < 0.004) break;
  }
  measure();
  return { c:c, s:s, rs:s*sc.fov, dx:w/2-(x0+x1)/2+bx, dy:h/2-(y0+y1)/2+by, w:w, h:h };
}
/** fitScene3 결과로 투영 함수를 감싼다(중심 옮김 · 크기 · 화면 위치) */
function viewP(P, V){
  return function(x,y,z){
    var p=P((x-V.c[0])*V.s, (y-V.c[1])*V.s, (z-V.c[2])*V.s);
    return { x:p.x+V.dx, y:p.y+V.dy, z:p.z, s:p.s };
  };
}
/** makeScene3 + 비스듬한 처음 구도 + 세로 스크롤 허용 + 더블클릭 초기화 */
function mk3(cv, redraw, home){
  var sc=makeScene3(cv, redraw);
  cv.style.touchAction='pan-y';        // 한 손가락 세로 스와이프 = 페이지 스크롤 (누적 사전 §2-C)
  sc.home=home; sc.yaw=home.yaw; sc.pitch=home.pitch;
  cv.addEventListener('dblclick', function(){ reset3(sc, redraw); });
  return sc;
}
/** 크기가 바뀌었을 때만 다시 맞추고, 맞춘 투영 함수를 돌려준다 */
function fitP(sc, w, h, box, o){
  if(!sc._fit || sc._fit.w!==w || sc._fit.h!==h) sc._fit=fitScene3(sc, w, h, box, o);
  return viewP(sc.begin(w,h), sc._fit);
}
function reset3(sc, redraw){
  if(!sc || !sc.home) return;
  sc.yaw=sc.home.yaw; sc.pitch=sc.home.pitch; sc._fit=null;
  if(redraw) redraw();
}
/** 공 — 반지름에 FIT.rs 를 곱한다(sphere3 은 렌즈 배율을 모른다) */
function ball(sc, ctx, P, x, y, z, r, c, g){ return sc.sphere3(ctx,P,x,y,z,r*(sc._fit?sc._fit.rs:1),c,g); }
/** 안내문(HUD)을 오른쪽 위 ⛶·PNG 버튼 줄 아래에서 시작한다 */
function hudT(ctx, w, h, lines){ return hud3(ctx, w, h, lines, {x:0, y:30, w:w, h:h}); }
/** 캔버스 오른쪽 부분에 두 번째 그래프를 그릴 때 — makePlot 을 옮겨 쓴다 */
function subPlot(ctx, x, y, w, h, o, fn){
  ctx.save(); ctx.translate(x,y);
  var P=makePlot(ctx, w, h, o);
  try{ fn(P); } finally { ctx.restore(); }
}


/* ═══════════════════════════════════════════════════════════════════════════
   ★ 소립자 물리 단원 공용 도구 (구역 C) — 여러 탭이 함께 쓴다
   · 씨앗 난수(mulberry32) : 같은 시각 · 같은 조건이면 같은 장면 → 시간바로 되감아도 그림이 같다
   · 입자 색 규약 : e⁻ = COL.blue · e⁺ = COL.grav · μ = COL.iner · α = COL.amber · p = COL.warm
                    γ = COL.light · 강입자 = COL.far · ν(소실) = COL.pink2 · 쿼크 R/G/B = COL.grav/COL.ok/COL.blue
   ═══════════════════════════════════════════════════════════════════════════ */
function rng32(seed){
  var a=(seed>>>0)||1;
  return function(){ a=(a+0x6D2B79F5)>>>0; var t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
}
function hash2(a,b){ var h=(Math.imul(a|0,2654435761)^Math.imul((b|0)+0x9e3779b9,1597334677))>>>0; return h||7; }
function gaussR(r){ var u=1-r(), v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.283185*v); }
function poissonR(r, lam){
  if(lam<=0) return 0;
  if(lam>40) return Math.max(0, Math.round(lam+Math.sqrt(lam)*gaussR(r)));
  var L=Math.exp(-lam), k=0, p=1; do{ k++; p*=r(); }while(p>L); return k-1;
}
function isoR(r, up){ var c=up? r() : r()*2-1, s=Math.sqrt(Math.max(0,1-c*c)), f=6.283185*r(); return [s*Math.cos(f), c, s*Math.sin(f)]; }
/** 3D 원(고리) — 중심 o, 반지름 R, 평면 'xy'|'xz'|'yz' */
function ring3(sc, ctx, P, o, R, plane, col, w, dash){
  var pts=[], i, n=48;
  for(i=0;i<=n;i++){ var a=i/n*6.2832, c=R*Math.cos(a), s=R*Math.sin(a);
    pts.push(plane==='xy'?[o[0]+c,o[1]+s,o[2]] : plane==='xz'?[o[0]+c,o[1],o[2]+s] : [o[0],o[1]+c,o[2]+s]); }
  if(dash) ctx.setLineDash(dash);
  sc.path3(ctx,P,pts,col,w||1.2);
  if(dash) ctx.setLineDash([]);
}
/** 투명 구 — 세 방향 고리 */
function wireSphere(sc, ctx, P, o, R, col, w){ ring3(sc,ctx,P,o,R,'xy',col,w); ring3(sc,ctx,P,o,R,'xz',col,w); ring3(sc,ctx,P,o,R,'yz',col,w); }
/** 물결선(글루온·광자) — a → b, 진폭 amp, 물결 수 k, 위상 ph */
function wavy3(sc, ctx, P, a, b, amp, k, ph, col, w){
  var d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]], L=Math.hypot(d[0],d[1],d[2])||1;
  var n1=vNorm(vCross(d, Math.abs(d[1])/L<0.9?[0,1,0]:[1,0,0])), pts=[], i, N=Math.max(16, Math.round(k*10));
  for(i=0;i<=N;i++){ var u=i/N, o=amp*Math.sin(6.2832*k*u+ph)*Math.sin(Math.PI*u);
    pts.push([a[0]+d[0]*u+n1[0]*o, a[1]+d[1]*u+n1[1]*o, a[2]+d[2]*u+n1[2]*o]); }
  sc.path3(ctx,P,pts,col,w||1.6);
}
function pxDot(ctx, p, r, col, a){ if(!p) return; ctx.globalAlpha=(a==null?1:a); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,6.2832); ctx.fill(); ctx.globalAlpha=1; }
function sci2(x, d){ if(!isFinite(x)) return '—'; if(x===0) return '0'; var e=Math.floor(Math.log10(Math.abs(x))), m=x/Math.pow(10,e); if(m>=9.995){ m/=10; e++; } return m.toFixed(d==null?2:d)+'×10'+supStr(e); }
function qColor(i){ return [COL.grav, COL.ok, COL.blue][((i%3)+3)%3]; }
function qAnti(i){ return ['#22d3ee','#f472b6','#fbbf24'][((i%3)+3)%3]; }   /* 반색(청록 · 자홍 · 노랑) — 설명용 고정색 */
