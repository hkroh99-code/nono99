/* 실험 B — OHP 필름 장수 N 대 조도 E (학생이 직접 재어 적는다)
   x = 필름 장수 N · y = 조도 E(lux) · d = ln(E₀/E) (E₀ 는 보조 상수 칸) → 점 (N, d) → 기울기 k(장당 감약 지수) → HVL = ln2/k (장) */
var REPORT_MANUAL = { colX:'필름 장수 N', colD:'ln(E₀/E)', colY:'조도 E (lux)', gx:'필름 장수 N (장)', gy:'ln(E₀/E)', seeds:['1','2','3','4','5'], placeholderX:'1', placeholderY:'600',
  derived:function(x,y){ var E0=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(E0)||E0<=0) E0=800; return (y>0)? Math.log(E0/y) : NaN; },
  point:function(x,y,d){ return [x,d]; },
  aux:{ label:'필름 없을 때 조도 E₀ =', unit:'lux', value:'800' }, compareWith:null, zero:true,
  interpret:function(fit){
    var k=fit.a;
    return {slopeText:'기울기 k = '+k.toFixed(3)+' (장당 감약 지수)', label:'반가층 HVL', value:(k>0? Math.LN2/k : NaN), unit:'장', digits:2}; } };
