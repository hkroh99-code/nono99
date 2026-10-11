/* ───────────────────────────────────────────────────────────────────────────
   TAB 5 — 원리④ 수위 변화와 배수 시간 · 두 통의 평형 : T=(A/a)√(2K h₀/g) · √h(t)=√h₀−(a/A)√(g/2K)·t · A_eff=A₁A₂/(A₁+A₂) · h_f=(A₁h₁+A₂h₂)/(A₁+A₂)
   검증(손계산) : A=300 cm² · D=10 mm(a=0.785 cm²) · h₀=30 cm · K≈5 → T=(300/0.785)√(2·5·0.3/9.8)=382×0.553=211 s
   ─────────────────────────────────────────────────────────────────────────── */
function t5calc(S){ var a=PI*Math.pow(S.D/1000,2)/4, K=siphon(S.h0/100,S.D/1000,1,1e-3,1).K, A1=S.A1/1e4, A2=S.A2/1e4, eq=S.A2>0, Ae=eq? A1*A2/(A1+A2) : A1, T=tDrain(Ae,a,K,S.h0/100);
  var h1=eq?0.10+S.h0/100:S.h0/100, h2=0.10, hf=eq? (A1*h1+A2*h2)/(A1+A2):0; return {a:a,K:K,eq:eq,A1:A1,A2:A2,Ae:Ae,T:T,h1:h1,h2:h2,hf:hf}; }
function t5state(S,c,t){ var dH=hOf(t,c.Ae,c.a,c.K,S.h0/100); if(c.eq){ return {up:c.hf+dH*c.A2/(c.A1+c.A2), lo:c.hf-dH*c.A1/(c.A1+c.A2), dH:dH}; } return {up:dH,lo:null,dH:dH}; }
var T5=mkTab(5,{ state:{A1:300,A2:0,D:10,h0:30}, unit:{A1:' cm²',D:' mm',h0:' cm'}, fmt:{A2:function(v){ return v===0? '0 (밖으로 배수)' : v+' cm²'; }}, dur:12,
  readout:function(S){ var c=t5calc(S), q0=c.a*Math.sqrt(2*G*S.h0/100/c.K);
    setTxt('t5-oT',c.T.toFixed(0)+' s ('+(c.T/60).toFixed(1)+' 분)'); setTxt('t5-oQ',(q0*1e6).toFixed(1)+' mL/s'); setTxt('t5-oH',c.eq? (c.hf*100).toFixed(1)+' cm (두 통 같은 수위)' : '0 (모두 배수)'); setTxt('t5-oM',(hOf(c.T*0.5,c.Ae,c.a,c.K,S.h0/100)*100).toFixed(1)+' cm (절반 시간)'); setTxt('t5-oK',c.K.toFixed(2)); },
  anim:function(ctx,w,h,t,S){ var c=t5calc(S), tr=Math.min(1,t/10)*c.T, st=t5state(S,c,tr);
    siphonDraw(ctx,0,10,w,h-24,{hU:st.up*100,Hc:20,hL:c.eq? st.lo*100:null,v:st.dH>0.001?1.2:0,on:st.dH>0.001,tankH:35},t);
    cvText(ctx,'실제 시간 '+tr.toFixed(0)+' s / 총 '+c.T.toFixed(0)+' s · 수위차 '+(st.dH*100).toFixed(1)+' cm',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var c=t5calc(S), pts=[], k, N=60, p2=[], pl=[]; for(k=0;k<=N;k++){ var tt=c.T*k/N, st=t5state(S,c,tt); pts.push([tt,st.up*100]); if(c.eq) pl.push([tt,st.lo*100]); }
    var ymax=Math.max(10,c.eq? c.h1*100:S.h0)*1.1; var P=makePlot(ctx,w,h,{xmin:0,xmax:c.T,ymin:0,ymax:ymax,xlabel:'시간 (s)',ylabel:'수위 (cm)',title:c.eq? '두 통의 수위 — 같아지면 멈춘다(위 통 ↓ · 아래 통 ↑)' : '위 통 수위 대 시간 — 포물선 모양으로 줄어든다',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    plotLine(ctx,P,pts,COL.blue,2.4); if(c.eq){ plotLine(ctx,P,pl,COL.ok,2.4); plotLine(ctx,P,[[0,c.hf*100],[c.T,c.hf*100]],COL.white,1.2,[5,4]); } var tn=Math.min(1,Anim.time(5)/10)*c.T, sn=t5state(S,c,tn); plotPoints(ctx,P,[[tn,sn.up*100]],COL.amber,7);
    legend(ctx,P.x1-170,P.y1+14,c.eq? [['위 통',COL.blue],['아래 통',COL.ok],['최종 수위',COL.white]] : [['위 통 수위',COL.blue],['지금',COL.amber]]); }
});
