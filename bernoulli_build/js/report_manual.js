/* 실험 B — 벤투리(물) : 입구 유량 Q 대 입구 · 목의 수주 높이차 Δh (학생이 직접 재어 적는다)
   x = 입구 속력 v₁(cm/s) · y = 수주 높이차 Δh(mm) · d = v₁² → 점 (v₁², Δh) → 기울기 k = (r²−1)/(2g)·C² → 손실 계수 C² = k ÷ 이론 기울기(aux 칸) */
var REPORT_MANUAL = { colX:'입구 속력 v₁ (cm/s)', colD:'v₁² (m²/s²)', colY:'수주 높이차 Δh (mm)', gx:'v₁² (m²/s²)', gy:'수주 높이차 Δh (mm)', seeds:['10','15','20','25','30'], placeholderX:'20', placeholderY:'30',
  derived:function(x,y){ var v=x/100; return v*v; },
  point:function(x,y,d){ return [d,y]; },
  aux:{ label:'이론 기울기 (r²−1)/(2g)×1000 =', unit:'mm·s²/m²', value:'765' }, compareWith:null, zero:true,
  interpret:function(fit){
    var k=fit.a, T=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(T)||T<=0) T=765;
    return {slopeText:'기울기 k = '+k.toFixed(1)+' (mm·s²/m²)', label:'손실 계수 C²', value:k/T, unit:'', digits:2}; } };
