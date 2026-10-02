/* ═══════════════════════════════════════════════════════════════════════════
   프로젝트 공방 — 공용 도우미 (30개 카드 · 미니 모의실험이 함께 쓴다)
   FIGS[id] = {fig, tg} 는 빌드가 projfigs.py 에서 만들어 앞쪽에 넣어 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
/** 1차원 낙하 (제곱 저항, 정지에서 출발) : 떨어진 거리 d(t) = (v_t²/g) ln cosh(g t / v_t) */
function fall1D(vt, t){ var x=SUBJ.g*t/vt; if(x>40) return vt*vt/SUBJ.g*(x-Math.LN2); return vt*vt/SUBJ.g*Math.log(Math.cosh(x)); }
function fallV(vt, t){ return vt*Math.tanh(SUBJ.g*t/vt); }
/** log–log 최소제곱 : pts=[[x,y],…] (양수) → {p(기울기), c(절편), r2} */
function llFit(pts){ var d=pts.map(function(q){ return [Math.log10(q[0]),Math.log10(q[1])]; }), f=ols(d,false); return f? {p:f.a, c:f.b, r2:f.r2} : {p:0,c:0,r2:0}; }
/** 시드 난수 가우시안 잡음 : 상대 오차 rel */
function nz(r, x, rel){ return x*(1+rel*gaussR(r)); }
/** 선형 눈금 제목 · 점 · 선을 쓴 간단한 그래프 틀 (공방 graph 에서 공통으로 쓴다) */
function projPlot(ctx,w,h,o){ o.left=o.left||56; return makePlot(ctx,w,h,o); }
/** 둥근 모서리 글자 상자(캔버스 안 설명) */
function note2(ctx, s, x, y, col){ pill(ctx, s, x, y, col||COL.text); }
/** 캔 + 낙하산 한 세트(옆) : (cx, top) = 낙하산 돔 윗점 y, r 반지름 */
function dropIcon(ctx, cx, yCan, canH, r, sway){
  ctx.save(); ctx.translate(cx, yCan); if(sway) ctx.rotate(sway);
  if(r>1) drawChute(ctx, 0, 0, 0.9*canH+14, r, 1);
  drawCan(ctx, 0, 0, canH); ctx.restore();
}
/** 표에 쓰는 숫자 : 소수 자리 고정 */
function fx(v,d){ return (+v).toFixed(d==null?1:d); }
/** 슬라이더 이름이 숫자 대신 이름인 항목용 */
function pick(names){ return function(v){ return names[Math.round(v)-1]; }; }
