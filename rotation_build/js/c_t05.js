/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ 각운동량 보존 : I₁ω₁ = I₂ω₂ (회전 의자 + 양손의 추). I = I_몸 + 2 m r²
   검증(손계산) : I_몸 1.5 kg·m² · m=2 kg · r_out=0.8 m → I₁=1.5+2·2·0.64=4.06 · r_in=0.2 → I₂=1.5+0.16=1.66 · ω₁=2 → ω₂=2·4.06/1.66=4.89 rad/s · 운동 에너지 4.06→9.95 J (팔이 일을 함)
   ─────────────────────────────────────────────────────────────────────────── */
var IB=1.5;
function i5(S){ var I1=IB+2*S.m*Math.pow(S.ro/100,2), I2=IB+2*S.m*Math.pow(S.ri/100,2), w2=S.w1*I1/I2; return {I1:I1,I2:I2,w2:w2,L:I1*S.w1,K1:Krot(I1,S.w1),K2:Krot(I2,w2)}; }
var T5=mkTab(5,{ state:{m:2,ro:80,ri:20,w1:2}, unit:{m:' kg',ro:' cm',ri:' cm',w1:' rad/s'},
  readout:function(S){ var o=i5(S); setTxt('t5-oI',o.I1.toFixed(2)+' → '+o.I2.toFixed(2)+' kg·m²'); setTxt('t5-oL',o.L.toFixed(2)+' kg·m²/s'); setTxt('t5-oW',o.w2.toFixed(2)+' rad/s ('+(o.w2/S.w1).toFixed(1)+' 배)'); setTxt('t5-oK',o.K1.toFixed(1)+' → '+o.K2.toFixed(1)+' J'); setTxt('t5-oS',(w2rpm(o.w2)).toFixed(0)+' rpm'); },
  anim:function(ctx,w,h,t,S){ var o=i5(S), cx=w*0.3, cy=h*0.56, ph=(t%8)/8, mix=ph<0.4?0:(ph<0.6?(ph-0.4)/0.2:(ph<0.9?1:1-(ph-0.9)/0.1)), r=(S.ro*(1-mix)+S.ri*mix)/100, wnow=o.L/(IB+2*S.m*r*r), th=this.th||0;
    this.th=(this.th||0)+wnow*0.03; th=this.th; var sc=Math.min(w*0.2,h*0.34)/0.9, hr=r*sc;
    ctx.strokeStyle='rgba(148,163,184,.4)'; ctx.setLineDash([3,4]); ctx.beginPath(); ctx.arc(cx,cy,S.ro/100*sc,0,TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,S.ri/100*sc,0,TAU); ctx.stroke(); ctx.setLineDash([]);
    cvCirc(ctx,cx,cy,16,'#e2e8f0',COL.axis2,1.4); [0,Math.PI].forEach(function(a){ var px=cx+hr*Math.cos(a+th), py=cy+hr*Math.sin(a+th); cvLine(ctx,[[cx,cy],[px,py]],COL.white,4); var rr=5+S.m*2.2; cvCirc(ctx,px,py,rr,COL.amber,COL.white,1.4); });
    cvText(ctx,mix<0.3?'팔 벌림':(mix>0.7?'팔 오므림':'오므리는 중'),cx,cy+S.ro/100*sc+22,mix>0.7?COL.ok:COL.tick,'bold 12px system-ui,sans-serif','center');
    var bx=w*0.62, bw=w*0.34; cvText(ctx,'지금 I',bx,h*0.2,COL.tick,'11px system-ui,sans-serif'); var Inow=IB+2*S.m*r*r; cvRect(ctx,bx,h*0.2+8,bw,14,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,h*0.2+8,bw*Inow/(o.I1*1.05),14,COL.blue,null); cvText(ctx,Inow.toFixed(2)+' kg·m²',bx,h*0.2+36,COL.text,'11.5px system-ui,sans-serif');
    cvText(ctx,'지금 ω',bx,h*0.46,COL.tick,'11px system-ui,sans-serif'); cvRect(ctx,bx,h*0.46+8,bw,14,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,h*0.46+8,bw*Math.min(1,wnow/(o.w2*1.05)),14,COL.ok,null); cvText(ctx,wnow.toFixed(2)+' rad/s',bx,h*0.46+36,COL.text,'11.5px system-ui,sans-serif');
    cvText(ctx,'각운동량 L = Iω = '+(Inow*wnow).toFixed(2)+' kg·m²/s (항상 같다)',bx,h*0.72,COL.amber,'bold 11.5px system-ui,sans-serif'); cvText(ctx,'I₁ω₁ = I₂ω₂ · ω₂/ω₁ = I₁/I₂ = '+(o.I1/o.I2).toFixed(2),12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var o=i5(S), hh=Math.floor(h*0.5), pI=[], pw=[], k;
    for(k=5;k<=95;k+=2){ var I=IB+2*S.m*Math.pow(k/100,2); pI.push([k,I]); pw.push([k,o.L/I]); }
    subPlot(ctx,0,0,w,hh,{xmin:5,xmax:95,ymin:0,ymax:IB+2*S.m*0.9*0.9*1.1,ylabel:'I (kg·m²)',title:'추의 반지름 대 관성 모멘트 I (r² 에 비례)',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pI,COL.blue,2.4); plotPoints(ctx,P,[[S.ro,o.I1],[S.ri,o.I2]],COL.amber,6); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:5,xmax:95,ymin:0,ymax:o.L/(IB+2*S.m*0.0025)*1.05,xlabel:'추의 반지름 r (cm)',ylabel:'ω = L/I (rad/s)',title:'반지름 대 각속도 — 오므릴수록 빨라진다 (L 일정)',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pw,COL.ok,2.4); plotPoints(ctx,P,[[S.ro,S.w1],[S.ri,o.w2]],COL.amber,6); }); }
});
