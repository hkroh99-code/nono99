/* 실험 B — 지렛대 평형(자 · 동전) : 왼쪽 질량 m₁ 대 평형 거리 d₂ (학생이 직접 재어 적는다)
   x = 왼쪽 질량 m₁(g) · y = 평형 거리 d₂(cm) · d = m₁ → 점 (m₁, d₂) → 기울기 k = d₁/m₂ (d₁ = 10 cm) → 이론 기울기 0.100 cm/g 와 비교(aux 칸) */
var REPORT_MANUAL = { colX:'왼쪽 질량 m₁ (g)', colD:'m₁ (g)', colY:'평형 거리 d₂ (cm)', gx:'왼쪽 질량 m₁ (g)', gy:'평형 거리 d₂ (cm)', seeds:['30','60','90','120','150'], placeholderX:'100', placeholderY:'10',
  derived:function(x,y){ return x; },
  point:function(x,y,d){ return [d,y]; },
  aux:{ label:'이론 기울기 d₁/m₂ =', unit:'cm/g', value:'0.100' }, compareWith:null, zero:true,
  interpret:function(fit){
    var k=fit.a, T=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(T)||T<=0) T=0.1;
    return {slopeText:'기울기 k = '+k.toFixed(4)+' (cm/g) → m₂ = d₁/k ≈ '+(10/k).toFixed(0)+' g', label:'측정/이론 기울기 비', value:k/T, unit:'', digits:2}; } };
