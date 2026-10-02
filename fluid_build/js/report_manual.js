/* 실험 B — 주사기 유압 : 작은 쪽에 올린 질량 m₁ 대 큰 쪽 저울 읽음 m₂ (학생이 직접 재어 적는다)
   x = m₁(g) · y = m₂(g) · d = F₁(N)=m₁g → 점 (m₁, m₂) → 기울기 k = m₂/m₁ = η·(A₂/A₁) → 효율 η = k ÷ 면적비 (aux 칸) */
var REPORT_MANUAL = { colX:'작은 쪽 질량 m₁ (g)', colD:'F₁ = m₁g (N)', colY:'큰 쪽 저울 m₂ (g)', gx:'작은 쪽 질량 m₁ (g)', gy:'큰 쪽 저울 m₂ (g)', seeds:['100','200','300','400','500'], placeholderX:'200', placeholderY:'1500',
  derived:function(x,y){ return x*9.81/1000; },
  point:function(x,y,d){ return [x,y]; },
  aux:{ label:'이론 면적비 (d₂/d₁)² =', unit:'', value:'9' }, compareWith:null, zero:true,
  interpret:function(fit){
    var k=fit.a, R=parseFloat((document.getElementById('t11-LB')||{}).value); if(!isFinite(R)||R<=0) R=9;
    return {slopeText:'기울기 k = '+k.toFixed(2)+' (m₂/m₁)', label:'유압 효율 η', value:k/R, unit:'', digits:2}; } };
