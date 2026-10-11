/* 실험 B — 커피 필터 장수 N 대 v² (학생이 직접 재어 적는다)
   x = N(장) · y = 낙하 시간 t(s) · d = v² = (L/t)² (L 은 보조 상수 칸) → 점 (N, v²) → 기울기 k → Cd = 2 g m₁ /(ρ A k) */
var REPORT_MANUAL = { colX:'필터 장수 N', colD:'v² (m²/s²)', colY:'낙하 시간 t (s)', gx:'필터 장수 N (장)', gy:'v² (m²/s²)', seeds:['1','2','3','4','5'], placeholderX:'1', placeholderY:'1.5',
  derived:function(x,y){ var L=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(L)||L<=0) L=2; return (y>0)? Math.pow(L/y,2) : NaN; },
  point:function(x,y,d){ return [x,d]; },
  aux:{ label:'낙하 측정 구간 L =', unit:'m', value:'2.0' }, compareWith:'A', zero:true,
  interpret:function(fit){
    var k=fit.a, m1=parseFloat((document.getElementById('t11-m1')||{}).value), A=parseFloat((document.getElementById('t11-AA')||{}).value);
    if(!isFinite(m1)||m1<=0) m1=1.0; if(!isFinite(A)||A<=0) A=110;
    var Cd=2*SUBJ.g*(m1/1000)/(SUBJ.rho0*(A/10000)*k);
    return {slopeText:'기울기 k = '+k.toFixed(2)+' (m/s)²/장 (m₁ '+m1+' g · A '+A+' cm² 가정)', label:'Cd', value:Cd, unit:'', digits:2}; } };
