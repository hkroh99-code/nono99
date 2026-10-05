/* 실험 B — 사이펀 유량 : 높이차 h 대 유량 Q (학생이 직접 재어 적는다)
   x = 높이차 h(cm) · y = 유량 Q(mL/s) · d = √h → 점 (√h, Q) → 기울기 k = Q/√h → 이론 기울기(K = 5 기준 15.5)와 비교(aux 칸) */
var REPORT_MANUAL = { colX:'높이차 h (cm)', colD:'√h (cm^½)', colY:'유량 Q (mL/s)', gx:'√h (cm^½)', gy:'유량 Q (mL/s)', seeds:['10','25','40','55','70'], placeholderX:'40', placeholderY:'100',
  derived:function(x,y){ return Math.sqrt(x); },
  point:function(x,y,d){ return [d,y]; },
  aux:{ label:'이론 기울기 (K = 5, D = 10 mm) =', unit:'mL/s per cm^½', value:'15.5' }, compareWith:null, zero:true,
  interpret:function(fit){
    var k=fit.a, T=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(T)||T<=0) T=15.5;
    return {slopeText:'기울기 k = '+k.toFixed(2)+' (mL/s per cm^½) → K ≈ '+(5*(T/k)*(T/k)).toFixed(1), label:'측정/이론 기울기 비', value:k/T, unit:'', digits:2}; } };
