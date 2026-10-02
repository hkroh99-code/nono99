/* ═══════════════════════════════════════════════════════════════════════════
   프로젝트 공방 — 공용 도우미 (30개 카드 · 미니 모의실험이 함께 쓴다)
   FIGS[id] = {fig, tg} 는 빌드가 projfigs.py 에서 만들어 앞쪽에 넣어 둔다.
   ═══════════════════════════════════════════════════════════════════════════ */
/** log–log 최소제곱 : pts=[[x,y],…] (양수) → {p(기울기), c(절편), r2} */
function llFit(pts){ var d=pts.map(function(q){ return [Math.log10(q[0]),Math.log10(q[1])]; }), f=ols(d,false); return f? {p:f.a, c:f.b, r2:f.r2} : {p:0,c:0,r2:0}; }
/** 시드 난수 가우시안 잡음 : 상대 오차 rel */
function nz(r, x, rel){ return x*(1+rel*gaussR(r)); }
/** 표에 쓰는 숫자 : 소수 자리 고정 */
function fx(v,d){ return (+v).toFixed(d==null?1:d); }
/** 슬라이더 이름이 숫자 대신 이름인 항목용 */
function pick(names){ return function(v){ return names[Math.round(v)-1]; }; }
/** 팬텀 영상 한 장을 칸 안에 그리는 도우미 : arr(HU) → 창 [lo,hi] */
function drawHU(ctx, arr, N, x, y, s, lo, hi){ grayImage(ctx, arr, N, x, y, s, s, lo, hi, false); ctx.strokeStyle=COL.dim; ctx.lineWidth=1; ctx.strokeRect(x,y,s,s); }
/** 캔버스 안 둥근 모서리 글자 상자 */
function note2(ctx, s, x, y, col){ pill(ctx, s, x, y, col||COL.text); }
/** 모의실험 캔버스 바탕 (예전 이름 skyBg 유지) */
function skyBg(ctx, w, h){ ctx.fillStyle = COL.panel || COL.bg || '#0b1424'; ctx.fillRect(0,0,w,h); }
function groundBg(ctx, w, h, y){ skyBg(ctx,w,h); }
