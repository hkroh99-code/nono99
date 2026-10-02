/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I06 ~ I10 : 선량 누적 기록 · 초음파 가이드 · 영상 압축 · 베이즈 PPV · 저선량 잡음 제거
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I06 : 선량 누적 기록 앱 ───────────────────────────────────────── */
var I06 = { NM:['치과 파노라마 0.02','흉부 X선 0.1','유방 촬영 0.4','두부 CT 2','흉부 CT 7','복부 CT 8'], D:[0.02,0.1,0.4,2,7,8] };
function i06(k,n){ var d=I06.D[k-1], tot=d*n, yr=tot, bg=2.4*10; return {d:d,per:tot,dec:tot*10,bg:bg,ratio:tot*10/bg*100,risk:tot*10*0.05/1000*100}; }
(function(){ var a=i06(2,1), b=i06(2,4), c=i06(5,1), d=i06(6,2);
  mkP({ id:'I06', t:'선량 누적 기록 앱 — 내 검사 이력을 한눈에', icon:'📲', type:'발명 · 소프트웨어', lv:2, dur:'2 주', cost:'무료(코딩)',
    one:'검사 종류와 횟수를 입력하면 누적 유효선량(mSv)과 자연방사선 대비 비율을 보여 주는 간단한 웹 · 앱을 만든다. 5 %/Sv 위험 계수는 「집단 평균 어림」임을 명시해 불안을 부추기지 않도록 설계한다.',
    q:'검사 이력을 누적해서 보여 주면 도움이 될까, 불안만 키울까? 무엇을 함께 보여 줘야 균형 잡힌 정보가 될까?',
    why:'환자의 알 권리와 기록 체계는 실제로 논의되는 주제입니다. 선량을 다루는 앱은 <b>정확한 단위 · 출처 · 이익과 위험의 맥락</b>이 필수입니다. 데이터 입력-계산-표시의 완전한 소프트웨어 프로젝트이기도 합니다.',
    link:'원리⑥(6번 탭) · C06 · 7번 탭 · 데이터 · 프로그래밍 · 정보 윤리.',
    cap:'검사 이력 입력(왼쪽) → 누적 · 일 환산(가운데) → 확률 위험 어림(오른쪽). 이력 입력(왼쪽 아래) · 누적 mSv와 일 환산(가운데 아래) · 5 %/Sv 어림 위험(오른쪽 아래)',
    parts:[['입력 화면','검사 종류 · 날짜 · 횟수','선택형','목록에서 고르게 해 입력 오류를 줄인다.'],
           ['선량표','검사별 대표 유효선량','공신력 있는 출처','범위와 출처 연도를 같이 저장한다(C06).'],
           ['누적 계산','Σ(선량 × 횟수)','mSv','기간별(1 년 · 10 년) 합계를 낸다.'],
           ['비교','자연방사선 연 2.4 mSv','비율 · 일 환산','이해를 돕는 비교 기준.'],
           ['위험 어림','5 %/Sv','집단 평균 어림','개인 예측이 아님을 명시하고 이익 문구를 함께 표시.'],
           ['개인정보','로컬 저장 · 암호화','외부 전송 없음','실제 의료 기록 입력 금지(교육용), 가상 데이터로 시험.']],
    budget:[['컴퓨터/스마트폰','1','보유','—'],['웹 도구/파이썬','1','무료','—'],['선량 자료','—','무료','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['검사 6 종의 선량 · 범위 · 출처를 표(JSON)로 만든다.','검사와 횟수를 입력받아 합계를 계산하는 함수를 만든다.','10 년 누적과 자연방사선 10 년(24 mSv) 대비 비율을 표시한다.','위험 어림 문구 · 이익 문구 · 한계 문구를 설계해 사용자 5 명에게 보여 주고 이해도 · 불안감을 점검한다.','피드백으로 표현을 고친 최종 앱과 사용 설명서를 만든다.'],
    vars:['검사 종류 · 횟수','누적 mSv · 비율 · 사용자 이해도/불안','표현 문구 · 기준값'],
    predict:[['흉부 X선 1 회/년','10 년 '+fx(a.dec,1)+' mSv = 자연의 '+fx(a.ratio,0)+' %','매우 작다'],
             ['흉부 X선 4 회/년','10 년 '+fx(b.dec,1)+' mSv = 자연의 '+fx(b.ratio,0)+' %','여전히 자연방사선 안쪽'],
             ['흉부 CT 1 회/년','10 년 '+fx(c.dec,0)+' mSv = 자연의 '+fx(c.ratio,0)+' %','CT 는 누적에 크게 기여'],
             ['복부 CT 2 회/년','10 년 '+fx(d.dec,0)+' mSv = 자연의 '+fx(d.ratio,0)+' % · 위험 어림 '+fx(d.risk,1)+' %','필요성 · 대안 검토가 중요']],
    data:{cols:['검사','횟수/년','10 년 누적(mSv)','자연방사선 대비(%)','위험 어림(%)'],
          rows:[[2,1],[2,4],[3,1],[4,1],[5,1],[6,2]].map(function(q){ var s=i06(q[0],q[1]); return [I06.NM[q[0]-1],q[1],fx(s.dec,1),fx(s.ratio,0),fx(s.risk,2)]; })},
    analysis:'사용자 설문 결과(이해도 · 불안 점수)를 표현 방식별로 비교하고, 가장 균형 잡힌 문구를 선택한 근거를 제시한다. 선량 자료의 범위 · 출처 차이가 결과에 미치는 영향도 분석한다.',
    special:['🔧 발명 설명서',[['발명 이름','「내 검사 선량 노트」'],['핵심 아이디어','이력 → 누적 → 비교 → 맥락 문구'],['기존 방법과 차이','불안을 줄이는 표현 · 이익 문구 포함'],['한계','대표값 어림 · 개인 위험 예측 아님 · 의료 상담 대체 불가']]],
    fails:[['숫자가 불안을 준다','자연방사선 비교 · 이익 문구 · 범위 표시'],['자료가 서로 다르다','출처 연도 · 범위를 함께 표기'],['개인정보 우려','로컬 저장 · 가상 데이터 사용']],
    up:['<b>C06</b> — 선량 인포그래픽.','<b>I01</b> — 선량 자동 조절.','<b>I09</b> — 확률 해석.'],
    next:['품질 · 선량 · 안전',6],
    eval:[['정확성','선량 · 단위 · 출처'],['소프트웨어','입력 · 계산 · 표시'],['윤리','과장 없는 문구 · 개인정보'],['검증','사용자 이해도']] });
})();
SIMS.I06={ q:'검사 종류와 연간 횟수를 바꾸면 10 년 누적 선량은 자연방사선의 몇 % 일까?',
  a:{nm:'검사 종류',min:1,max:6,step:1,val:5,unit:'',d:0,fmt:pick(I06.NM)}, b:{nm:'연간 횟수',min:1,max:12,step:1,val:1,unit:'회',d:0},
  cap1:'10 년 동안 누적되는 선량(막대)과 자연방사선 24 mSv(점선). 검사 선량이 자연방사선 안쪽인지 한눈에 비교합니다.',
  cap2:'📊 해마다 누적되는 선량 — 파랑(검사) vs 초록(자연방사선). 기울기는 연간 선량입니다.',
  note:'모형 : 누적 = 대표 유효선량 × 횟수 × 10 년 · 자연방사선 2.4 mSv/년 · 위험 어림 5 %/Sv (집단 평균 · 개인 예측 아님). 실제 선량은 장비 · 환자에 따라 범위가 크다.',
  anim:function(ctx,w,h,t,k,n,S){ var s=i06(k,n), mx=Math.max(30,s.dec*1.1,s.bg*1.3), fr=Math.min(1,t/2), y0=h-44, top=40, bw=Math.min(90,w/5), x1=w*0.25-bw/2, x2=w*0.65-bw/2;
    cvText(ctx,I06.NM[k-1]+' × '+n+' 회/년 · 10 년',12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    [[x1,s.dec,COL.blue,'검사 누적'],[x2,s.bg,COL.ok,'자연방사선']].forEach(function(q){ var hh=(y0-top)*q[1]/mx*fr; ctx.fillStyle=q[2]; ctx.fillRect(q[0],y0-hh,bw,hh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(q[0],top,bw,y0-top); cvText(ctx,q[3],q[0]+bw/2,y0+16,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,(q[1]*fr).toFixed(1)+' mSv',q[0]+bw/2,y0-hh-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); }); },
  graph:function(ctx,w,h,k,n,S){ var s=i06(k,n), P=makePlot(ctx,w,h,{xmin:0,xmax:10,ymin:0,ymax:Math.max(30,s.dec*1.1),xlabel:'경과 연수',ylabel:'누적 선량 (mSv)',title:'누적 선량 : 검사 vs 자연방사선',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)});
    plotLine(ctx,P,[[0,0],[10,s.dec]],COL.blue,2.4); plotLine(ctx,P,[[0,0],[10,24]],COL.ok,2,[6,4]); legend(ctx,P.x1-130,P.y1+14,[['검사 누적',COL.blue],['자연방사선',COL.ok]]); },
  kv:function(k,n,S){ var s=i06(k,n); return [['연간 선량',s.per.toFixed(2)+' mSv','a'],['10 년 누적',s.dec.toFixed(1)+' mSv','g'],['자연방사선 대비',s.ratio.toFixed(0)+' %','v2'],['위험 어림(5 %/Sv)',s.risk.toFixed(2)+' %'],['해석','집단 평균 · 개인 예측 아님','r']]; } };

/* ── I07 : 초음파 압력 · 각도 가이드 ────────────────────────────────── */
function i07(p,ang){ var coup=1-Math.exp(-p/3), defp=1-0.03*Math.max(0,p-9), an=Math.pow(Math.cos(ang*Math.PI/180),4), Q=coup*defp*an; return {coup:coup,defp:defp,an:an,Q:Math.max(0,Q)}; }
(function(){ var a=i07(2,0), b=i07(8,0), c=i07(8,25), d=i07(16,0);
  mkP({ id:'I07', t:'초음파 압력 · 각도 가이드 — 탐촉자를 잘 대도록 알려 주기', icon:'🩺', type:'발명 · 센서', lv:3, dur:'3 주', cost:'약 3 ~ 6만 원',
    one:'힘 센서(FSR)와 기울기 센서로 탐촉자를 누르는 힘과 각도를 측정하고, 영상 품질(신호) 점수가 가장 높은 구간으로 안내하는 LED/소리 가이드를 만든다. 실제 환자 대신 젤 패드 · 수조 모형에서 시험한다.',
    q:'너무 약하게 대면 신호가 약하고 너무 세게 누르면 조직이 눌려 불편하다. 가장 좋은 압력과 각도 범위는 어디일까?',
    why:'초음파 영상의 품질은 <b>검사자의 손</b>에 크게 좌우됩니다. 압력과 각도를 센서로 정량화하면 초보자 교육과 재현성에 도움이 됩니다. 센서-점수-피드백의 설계 사이클을 경험하는 발명입니다.',
    link:'원리③ 초음파(4번 탭) · I02 · R05 · 센서 · 피드백 제어 · 인간공학.',
    cap:'탐촉자 + 힘 센서(왼쪽) → 접촉면에서 압력 · 각도 변화(가운데) → 점수 곡선과 안내(오른쪽). 압력 센서(왼쪽 아래) · 각도 IMU(가운데 아래) · 품질 점수 안내(오른쪽 아래)',
    parts:[['힘 센서','FSR · 로드셀','압력 p (N)','탐촉자와 손 사이에 설치해 누르는 힘을 측정한다.'],
           ['기울기 센서','MPU6050','각도 θ','탐촉자 축과 표면 법선의 사이각. 수직이 최선.'],
           ['접촉 모형','젤 패드 · 수조 바닥','반사체 설치','일정 깊이 반사체(철사)로 신호 크기를 비교한다.'],
           ['점수 모형','Q = 접촉 × 눌림 × cos⁴θ','0 ~ 1','접촉 · 변형 · 각도 요소를 곱해 단순한 품질 점수로.'],
           ['안내 출력','LED · 부저 · 진동','구간 알림','「더 누르세요」 「기울기 줄이세요」처럼 음성/색으로 안내.'],
           ['안전','실제 사람에게 시험 금지','교육용 모형','실제 환자 대신 모형 · 젤 패드 · 수조 사용.']],
    budget:[['FSR/로드셀 + 증폭','1','약 1만 원','저울 센서'],['MPU6050','1','약 5천 원','스마트폰'],['Arduino · LED','1 세트','약 1.5만 원','—'],['젤 패드 · 초음파 센서','1','약 1만 원','—'],['—','—','—','—']],
    steps:['압력 p 를 0 ~ 20 N 으로 바꾸며 반사 신호 크기를 측정해 접촉 곡선을 그린다.','각도 θ 를 0 ~ 40° 로 바꾸며 반사 신호를 측정하고 cos⁴θ 와 비교한다.','두 요인을 곱해 품질 점수 Q 의 맵(압력 × 각도)을 만든다.','점수 > 0.8 구간을 「초록」으로 안내하는 코드를 만든다.','초보자 3 명 시험 : 안내 있음/없음의 평균 점수를 비교해 효과를 평가한다.'],
    vars:['압력 p · 각도 θ','신호 · 품질 점수 Q','센서 위치 · 젤 양 · 반사체 깊이'],
    predict:[['p 2 N · θ 0°','접촉 '+fx(a.coup,2)+' · 점수 '+fx(a.Q,2),'약한 접촉은 신호가 약하다'],
             ['p 8 N · θ 0°','점수 '+fx(b.Q,2)+' (최적)','적당한 압력과 수직이 최선'],
             ['p 8 N · θ 25°','점수 '+fx(c.Q,2),'기울기는 신호 급감(cos⁴θ)'],
             ['p 16 N · θ 0°','점수 '+fx(d.Q,2),'과도한 압력은 변형 · 불편']],
    data:{cols:['p(N)','θ(°)','접촉','각도 요소','점수 Q'],
          rows:[[2,0],[5,0],[8,0],[8,15],[8,25],[16,0]].map(function(q){ var s=i07(q[0],q[1]); return [q[0],q[1],fx(s.coup,2),fx(s.an,2),fx(s.Q,2)]; })},
    analysis:'압력 · 각도 맵에서 점수가 높은 영역의 크기를 구하고, 안내를 받은 그룹과 받지 않은 그룹의 점수 평균 차이를 비교한다. 센서 오차와 점수 모형의 단순화가 결과에 미친 영향을 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「탐촉자 길잡이」'],['핵심 아이디어','압력 · 각도 센서 → 품질 점수 → 즉시 안내'],['기존 방법과 차이','숙련도 차이를 센서로 정량화하고 교육'],['한계','점수는 단순 모형 · 해부 · 개인차 무시 · 실제 환자 시험 금지']]],
    fails:[['센서 값이 튄다','이동 평균 · 보정'],['점수가 신호와 안 맞는다','접촉 곡선을 직접 측정해 모델 보정'],['안내가 늦다','지연 줄이기 · 임계 완화']],
    up:['<b>I02</b> — 정합층 · 젤.','<b>R07</b> — B 모드 스캐너.','<b>I04</b> — 번짐 경보.'],
    next:['초음파 원리',4],
    eval:[['발명성','점수 · 안내 설계'],['정량 평가','맵 · 학습 효과'],['안전','모형 시험 · 윤리'],['한계 서술','단순 점수 모형']] });
})();
SIMS.I07={ q:'탐촉자 압력과 기울기 각도를 바꾸면 영상 품질 점수는 어떻게 달라질까?',
  a:{nm:'누르는 힘 p',min:0,max:20,step:0.5,val:6,unit:'N',d:1}, b:{nm:'기울기 θ',min:0,max:45,step:1,val:10,unit:'°',d:0},
  cap1:'탐촉자(위)와 접촉면. 압력이 약하면 틈이 생기고, 각도가 크면 반사된 소리가 탐촉자로 돌아오지 못합니다. 점수 막대가 초록이면 좋은 영역입니다.',
  cap2:'📊 압력 → 접촉 · 변형 · 합산 점수 (현재 각도). 점선 = 0.8(좋음) 기준.',
  note:'모형 : 접촉 = 1 − e^{−p/3} · 변형 요소 = 1 − 0.03·max(0, p − 9) · 각도 요소 = cos⁴θ · 점수 Q = 곱. 교육용 단순 점수이며 실제 영상 품질과 다를 수 있다.',
  anim:function(ctx,w,h,t,p,ang,S){ var s=i07(p,ang), cx=w*0.35, sy=h*0.55, fr=Math.min(1,t/1.5), ph=(t*2)%6.283, col=s.Q>=0.8?COL.ok:s.Q>=0.5?COL.amber:COL.grav;
    cvText(ctx,'압력 '+p+' N · 각도 '+ang+'° → 점수 '+s.Q.toFixed(2),12,16,col,'bold 12.5px system-ui,sans-serif');
    ctx.fillStyle='rgba(251,113,133,.25)'; ctx.fillRect(cx-90,sy,180,h-sy-20); ctx.strokeStyle=COL.axis2; ctx.strokeRect(cx-90,sy,180,h-sy-20);
    ctx.save(); ctx.translate(cx,sy-Math.min(14,p*0.4)); ctx.rotate(ang*Math.PI/180); ctx.fillStyle='#64748b'; ctx.fillRect(-18,-60,36,60); ctx.fillStyle=COL.white; ctx.fillRect(-18,-4,36,4); ctx.strokeStyle='rgba(125,211,252,.8)'; for(var i=1;i<4;i++){ ctx.beginPath(); ctx.arc(0,0,i*14+((ph*4)%14),0.35*Math.PI,0.65*Math.PI); ctx.stroke(); } ctx.restore();
    var bx=w*0.7, bh=(h-90)*s.Q*fr; ctx.fillStyle=col; ctx.fillRect(bx,h-40-bh,34,bh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bx,50,34,h-90); cvText(ctx,'점수',bx+17,h-24,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,(s.Q*fr).toFixed(2),bx+17,h-40-bh-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,p,ang,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:20,ymin:0,ymax:1.05,xlabel:'누르는 힘 (N)',ylabel:'요소 / 점수',title:'압력 → 접촉(초록) · 변형(주황) · 점수(파랑)',left:50,xfmt:axisFmt(0),yfmt:axisFmt(1)}), a=[],b=[],c=[],x; for(x=0;x<=20;x+=0.5){ var s=i07(x,ang); a.push([x,s.coup]); b.push([x,s.defp]); c.push([x,s.Q]); } plotLine(ctx,P,[[0,0.8],[20,0.8]],COL.dim,1.4,[6,4]); plotLine(ctx,P,a,COL.ok,1.4,[4,3]); plotLine(ctx,P,b,COL.amber,1.4,[4,3]); plotLine(ctx,P,c,COL.blue,2.4); plotPoints(ctx,P,[[p,i07(p,ang).Q]],COL.blue,7); },
  kv:function(p,ang,S){ var s=i07(p,ang); return [['접촉 요소',s.coup.toFixed(2),'a'],['각도 요소',s.an.toFixed(2),'g'],['품질 점수',s.Q.toFixed(2),'v2'],['판정',s.Q>=0.8?'좋음':s.Q>=0.5?'보통':'나쁨'],['안내',s.coup<0.8?'더 누르세요':s.an<0.8?'수직으로 세우세요':s.defp<0.95?'조금 덜 누르세요':'좋은 자세','r']]; } };

/* ── I08 : 영상 압축 · 전송 ─────────────────────────────────────────── */
function i08(bits,f,roi){ var N=C09.N, hu=C09.hu, key=bits+'|'+f+'|'+roi; var L=Math.pow(2,bits), i,j, img=new Float32Array(N*N), q=new Float32Array(N*N), sse=0, n=0, ci=N/2, cj=N/2, r=N*0.2;
  for(i=0;i<N*N;i++) img[i]=Math.max(0,Math.min(1,(hu[i]+100)/400));
  for(j=0;j<N;j++) for(i=0;i<N;i++){ var bi=Math.floor(i/f)*f, bj=Math.floor(j/f)*f, s=0,c=0,u,v; for(v=0;v<f&&bj+v<N;v++) for(u=0;u<f&&bi+u<N;u++){ s+=img[(bj+v)*N+bi+u]; c++; } var val=s/c; val=Math.round(val*(L-1))/(L-1); var inR=roi&&Math.hypot(i-ci,j-cj)<r; q[j*N+i]=inR?img[j*N+i]:val; var d=q[j*N+i]-img[j*N+i]; sse+=d*d; n++; }
  var mse=sse/n, psnr=mse<1e-12?99:10*Math.log10(1/mse), roiA=roi? Math.PI*r*r/(N*N):0, size=(roiA*8+(1-roiA)*bits/(f*f))/8; return {psnr:psnr,size:size,img:q,orig:img}; }
(function(){ var a=i08(8,1,false), b=i08(4,1,false), c=i08(8,3,false), d=i08(5,2,true);
  mkP({ id:'I08', t:'영상 압축 · 전송 — 용량을 줄이되 병변은 지킨다', icon:'🗜️', type:'발명 · 소프트웨어', lv:3, dur:'3 주', cost:'무료(코딩)',
    one:'의료 영상(공개 · 팬텀)을 양자화(비트 수 줄이기)와 다운샘플링(해상도 줄이기)으로 압축하고, 관심 영역(ROI)은 무손실로 유지하는 방법을 설계한다. PSNR 과 용량 비율의 거래를 정량화한다.',
    q:'용량을 몇 % 로 줄이면 화질이 눈에 띄게 나빠질까? 관심 영역만 지키면 용량을 얼마나 더 줄일 수 있을까?',
    why:'원격 의료 · 병원 간 전송에서 영상 용량은 실제 문제입니다. 「어디가 중요한지 아는 압축」은 AI 시대 의료 정보학의 핵심 아이디어입니다. PSNR 같은 객관적 지표 사용법도 익힙니다.',
    link:'7번 탭 · 정보 · 디지털 · 로그 · 비트 · 신호 처리 · 의료 정보학.',
    cap:'원본 영상(왼쪽) → 압축기(가운데: 비트 수 b · 다운샘플 f) → 복원 영상 · ROI 보존(오른쪽). 양자화 비트(왼쪽 아래) · 다운샘플(가운데 아래) · PSNR 과 용량(오른쪽 아래)',
    parts:[['원본 영상','8 비트 그레이 영상','기준','잡음이 없는 팬텀 영상에서 시작해 압축 효과를 본다.'],
           ['양자화','밝기를 2^b 단계로','b = 2 ~ 8','단계를 줄이면 용량이 줄지만 띠 모양 인공물이 생긴다.'],
           ['다운샘플','f × f 블록 평균','f = 1 ~ 4','해상도를 줄이면 용량이 f² 배 감소, 작은 구조는 사라진다.'],
           ['ROI 보존','병변 영역 무손실','관심 영역만 원본','중요한 부분만 지키면 효율적.'],
           ['PSNR','10 log₁₀(1/MSE)','dB','높을수록 원본과 비슷. 30 dB 이상이면 대체로 양호.'],
           ['용량 비율','원본 대비 %','저장 · 전송 비용','비트 × 해상도로 어림한다.']],
    budget:[['컴퓨터','1','보유','—'],['파이썬(NumPy)','1','무료','—'],['공개 영상/팬텀','—','무료','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['영상을 0 ~ 1 로 정규화하고 b 비트로 양자화하는 함수를 만든다.','f × f 블록 평균으로 해상도를 낮춰 복원(최근접)한다.','b, f 조합마다 PSNR 과 용량 비를 계산해 표를 만든다.','ROI(병변 위치) 안은 원본을 유지하고 PSNR · 용량 변화를 비교한다.','사람 5 명에게 「병변이 보이는가」 시각 평가를 받고 PSNR 과 비교한다.'],
    vars:['양자화 비트 b · 다운샘플 f · ROI 유무','PSNR · 용량 비 · 병변 가시성','영상 종류 · 병변 크기'],
    predict:[['b 8 · f 1(원본)','PSNR '+fx(a.psnr,0)+' dB · 용량 100 %','기준'],
             ['b 4 · f 1','PSNR '+fx(b.psnr,0)+' dB · 용량 50 %','4 비트도 대체로 양호 → 용량 절반'],
             ['b 8 · f 3','PSNR '+fx(c.psnr,0)+' dB · 용량 '+fx(c.size*100,0)+' %','해상도 저하로 작은 구조 손실'],
             ['b 5 · f 2 · ROI','PSNR '+fx(d.psnr,0)+' dB · 용량 '+fx(d.size*100,0)+' %','관심 영역은 원본 유지']],
    data:{cols:['b','f','ROI','PSNR(dB)','용량(%)'],
          rows:[[8,1,0],[6,1,0],[4,1,0],[8,2,0],[8,3,0],[5,2,1]].map(function(q){ var s=i08(q[0],q[1],!!q[2]); return [q[0],q[1],q[2]?'예':'아니오',fx(s.psnr,0),fx(s.size*100,0)]; })},
    analysis:'PSNR–용량 곡선(b · f 조합)을 그리고 같은 용량에서 어떤 방법이 PSNR 이 높은지 비교한다. 시각 평가와 PSNR 이 일치하지 않는 사례를 찾아 PSNR 의 한계를 논의한다.',
    special:['🔧 발명 설명서',[['발명 이름','「중요한 곳은 지키는 압축기」'],['핵심 아이디어','양자화 · 다운샘플 + ROI 무손실'],['기존 방법과 차이','병변 위치를 고려한 선택적 품질'],['한계','임상 승인된 압축이 아님 · 진단용 사용 금지']]],
    fails:[['PSNR 이 높은데 보기가 나쁘다','시각 평가와 병행'],['ROI 경계가 눈에 띈다','경계 부드럽게 · 마스크 번짐'],['실제 용량이 안 줄어든다','부호화(허프만 등) 추가']],
    up:['<b>C09</b> — 창으로 영상 보기.','<b>I10</b> — 잡음 제거.','<b>7번 탭</b> — 원격 진료 · 영상 정보.'],
    next:['활용 현황',7],
    eval:[['정량 평가','PSNR · 용량'],['발명성','ROI 보존 아이디어'],['검증','시각 평가'],['한계 서술','임상 비승인 명시']] });
})();
SIMS.I08={ q:'양자화 비트와 해상도 축소를 바꾸면 영상 화질(PSNR)과 용량은 어떻게 달라질까?',
  a:{nm:'양자화 비트 b',min:1,max:8,step:1,val:4,unit:'비트',d:0}, b:{nm:'다운샘플 배수 f',min:1,max:6,step:1,val:2,unit:'배',d:0},
  cap1:'원본(왼쪽)과 복원(오른쪽). 비트가 적으면 띠 모양, 다운샘플이 크면 블록 모양이 보이고 PSNR 이 줄어듭니다. 오른쪽 아래 PSNR · 용량.',
  cap2:'📊 비트 수에 따른 PSNR(실선, f 고정)과 용량(점선). 용량이 절반이 되는 것에 비해 화질 저하가 완만한 구간이 「좋은 압축」입니다.',
  note:'모형 : 영상 = 팬텀 머리(HU −100 ~ 300 을 0 ~ 1 로) · 양자화 2^b 단계 · f × f 블록 평균 후 복원 · PSNR = 10 log₁₀(1/MSE) · 용량 = b/(8f²) (원본 = 100 %). 부호화는 무시한 교육용 어림.',
  anim:function(ctx,w,h,t,bits,f,S){ var s=i08(bits,f,false), N=C09.N, sz=Math.min((w-60)/2,h-60), x0=14, y0=24; grayImage(ctx,s.orig,N,x0,y0,sz,sz,0,1,false); grayImage(ctx,s.img,N,x0+sz+14,y0,sz,sz,0,1,false); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,sz,sz); ctx.strokeRect(x0+sz+14,y0,sz,sz);
    cvText(ctx,'원본',x0+sz/2,y0-6,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,'복원 b'+bits+' f'+f,x0+sz*1.5+14,y0-6,COL.amber,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'PSNR '+s.psnr.toFixed(1)+' dB · 용량 '+(s.size*100).toFixed(0)+' %',12,h-8,COL.text,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,bits,f,S){ var P=makePlot(ctx,w,h,{xmin:1,xmax:8,ymin:0,ymax:60,xlabel:'양자화 비트 b',ylabel:'PSNR (dB) · 용량(%×0.5)',title:'비트 수 → PSNR(실선) · 용량(점선)',left:54,xfmt:axisFmt(1),yfmt:axisFmt(0)}), a=[],c=[],b; for(b=1;b<=8;b++){ var s=i08(b,f,false); a.push([b,Math.min(60,s.psnr)]); c.push([b,s.size*100*0.5]); } plotLine(ctx,P,[[1,30],[8,30]],COL.dim,1.2,[6,4]); plotLine(ctx,P,c,COL.ok,1.8,[5,4]); plotLine(ctx,P,a,COL.blue,2.4); plotPoints(ctx,P,[[bits,Math.min(60,i08(bits,f,false).psnr)]],COL.amber,7); },
  kv:function(bits,f,S){ var s=i08(bits,f,false), r=i08(bits,f,true); return [['PSNR',s.psnr.toFixed(1)+' dB','a'],['용량',(s.size*100).toFixed(0)+' %','g'],['ROI 보존 시 PSNR',r.psnr.toFixed(1)+' dB','v2'],['ROI 보존 시 용량',(r.size*100).toFixed(0)+' %'],['품질',s.psnr>=35?'우수':s.psnr>=28?'양호':'열화','r']]; } };

/* ── I09 : AI 불확실성 · PPV ─────────────────────────────────────────── */
function i09(p,spec){ var sens=0.95, pp=p/100, sp=spec/100, tp=sens*pp, fp=(1-sp)*(1-pp), ppv=tp/(tp+fp), npv=sp*(1-pp)/(sp*(1-pp)+(1-sens)*pp); return {ppv:ppv,npv:npv,tp:tp*1000,fp:fp*1000,fn:(1-sens)*pp*1000,tn:sp*(1-pp)*1000}; }
(function(){ var a=i09(1,95), b=i09(1,99), c=i09(10,95), d=i09(30,95);
  mkP({ id:'I09', t:'AI 판독 보조의 불확실성 — 양성이라고 하면 정말 병일까?', icon:'🎲', type:'발명 · 확률', lv:3, dur:'2 ~ 3주', cost:'무료(코딩)',
    one:'AI 판독 보조 도구가 「양성」이라고 할 때 실제로 병일 확률(양성예측도 PPV)이 유병률과 특이도에 따라 어떻게 달라지는지 베이즈 정리로 계산하고, 사람이 직관적으로 이해하도록 「1000 명 시각화」 도구로 만든다.',
    q:'민감도 95 % 인 검사가 양성이라면 병일 확률도 95 % 일까? 유병률이 낮은 선별 검사에서는 어떤 일이 일어날까?',
    why:'<b>PPV 는 유병률에 크게 의존</b>합니다. 이 직관 밖의 결과는 AI 판독 · 선별 검사의 결과를 정확히 해석하는 데 필수입니다. 의료 AI 시대의 시민 소양 교육 프로젝트입니다.',
    link:'7번 탭(AI) · R10 · 조건부확률 · 베이즈 정리 · 시각화 · 윤리.',
    cap:'1000 명 인구(왼쪽: 점) → 양성 판정(가운데) → 진짜 양성 vs 가짜 양성 비율(오른쪽). 유병률 p(왼쪽 아래) · 특이도 · 민감도(가운데 아래) · PPV = TP/(TP+FP)(오른쪽 아래)',
    parts:[['인구','1000 명 점 격자','유병률 p','병이 있는 사람(빨강)을 p % 로 배치한다.'],
           ['민감도','병 있는 사람을 양성','TP/(TP+FN)','95 % 로 고정(AI 보조 가정).'],
           ['특이도','병 없는 사람을 음성','TN/(TN+FP)','특이도가 낮으면 가짜 양성이 많다.'],
           ['PPV','양성 중 진짜 병','TP/(TP+FP)','유병률이 낮으면 크게 감소.'],
           ['시각화','1000 명 격자 + 색','TP · FP · FN · TN','네 가지를 색으로 표시해 직관적으로 이해.'],
           ['소통','「양성 = 병」이 아님','추가 검사 필요','AI 결과 설명 문구를 설계한다.']],
    budget:[['컴퓨터','1','보유','—'],['파이썬/자바스크립트','1','무료','—'],['—','—','—','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['베이즈 정리로 PPV = sens·p / (sens·p + (1−spec)(1−p)) 를 유도한다.','p = 0.1, 1, 10, 30 % · spec = 90, 95, 99 % 의 표를 만든다.','1000 명 격자 시각화(점)를 만들고 네 색으로 TP/FP/FN/TN 을 표시한다.','친구 10 명에게 「sens 95 %, spec 95 %, p 1 % 에서 양성이면 병일 확률은?」 을 묻고 직관과 계산을 비교한다.','결과 설명 문구 초안(AI 결과 안내문)을 설계해 이해도를 비교한다.'],
    vars:['유병률 p · 특이도','PPV · NPV · 가짜 양성 수','민감도(95 % 고정)'],
    predict:[['p 1 % · 특이도 95 %','PPV '+fx(a.ppv*100,0)+' % (진양성 '+fx(a.tp,0)+' · 가양성 '+fx(a.fp,0)+')','양성 중 병은 소수'],
             ['p 1 % · 특이도 99 %','PPV '+fx(b.ppv*100,0)+' %','특이도 향상으로 크게 개선'],
             ['p 10 % · 특이도 95 %','PPV '+fx(c.ppv*100,0)+' %','유병률 ↑ → PPV ↑'],
             ['p 30 % · 특이도 95 %','PPV '+fx(d.ppv*100,0)+' %','고위험군에서는 신뢰성 높다']],
    data:{cols:['유병률 p(%)','특이도(%)','PPV(%)','NPV(%)','가짜 양성(1000명)'],
          rows:[[0.1,95],[1,90],[1,95],[1,99],[10,95],[30,95]].map(function(q){ var s=i09(q[0],q[1]); return [q[0],q[1],fx(s.ppv*100,0),fx(s.npv*100,1),fx(s.fp,0)]; })},
    analysis:'친구 설문 결과(직관 대 계산)의 차이를 정리하고, 어떤 표현(확률 vs 자연 빈도)에서 이해도가 높은지 비교한다. 유병률이 다른 집단에서 같은 도구의 PPV 가 달라지는 이유를 설명한다.',
    special:['🔧 발명 설명서',[['발명 이름','「1000 명 시각화 PPV 계산기」'],['핵심 아이디어','자연 빈도(1000 명 중)로 PPV 이해를 돕는다'],['기존 방법과 차이','확률 대신 사람 수로 표현해 오해를 줄임'],['한계','민감도 고정 · 독립 가정 · 단순화']]],
    fails:[['PPV 가 너무 낮게 나온다','유병률 · 특이도 입력 확인'],['혼동(민감도 vs PPV)','도표 · 색으로 구분'],['의료 오해','「AI 결과는 의사 확인 필요」 문구']],
    up:['<b>R10</b> — 민감도 · 특이도 · ROC.','<b>I06</b> — 기록 앱.','<b>C05</b> — 진단 카드 게임.'],
    next:['활용 현황',7],
    eval:[['정확성','베이즈 계산'],['소통력','시각화 · 문구'],['검증','직관 vs 계산 설문'],['윤리','AI 한계 · 의사 확인']] });
})();
SIMS.I09={ q:'유병률과 특이도를 바꾸면 AI 가 「양성」이라고 했을 때 실제 병일 확률(PPV)은 어떻게 달라질까?',
  a:{nm:'유병률 p',min:0.1,max:40,step:0.1,val:1,unit:'%',d:1}, b:{nm:'특이도',min:80,max:99.9,step:0.1,val:95,unit:'%',d:1},
  cap1:'1000 명 인구를 점으로 표시. 빨강 = 진짜 양성(TP) · 주황 = 가짜 양성(FP) · 회색 = 병 있는데 놓침(FN) · 초록 = 정상(TN). 양성 중 빨강 비율이 PPV 입니다.',
  cap2:'📊 유병률에 따른 PPV(선) — 특이도 90 · 95 · 99 %. 파란 점이 지금 설정입니다.',
  note:'모형 : 민감도 95 % 고정 · PPV = sens·p / (sens·p + (1 − spec)(1 − p)) · NPV = spec(1−p)/(spec(1−p) + (1−sens)p). 독립 · 고정 민감도 가정의 교육용 모형.',
  anim:function(ctx,w,h,t,p,sp,S){ var s=i09(p,sp), nTP=Math.round(s.tp), nFP=Math.round(s.fp), nFN=Math.round(s.fn), cols=40, cs=Math.min((w-24)/cols,(h-60)/25), i, fr=Math.min(1,t/2), seq=[]; for(i=0;i<nTP;i++) seq.push(0); for(i=0;i<nFP;i++) seq.push(1); for(i=0;i<nFN;i++) seq.push(2); while(seq.length<1000) seq.push(3); var cc=[COL.grav,COL.amber,COL.dim,'#1f6f4a'];
    cvText(ctx,'양성 '+(nTP+nFP)+' 명 중 진짜 병 '+nTP+' 명 → PPV '+(s.ppv*100).toFixed(0)+' %',12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    for(i=0;i<1000;i++){ ctx.globalAlpha=(i/1000<=fr)?1:0.1; ctx.fillStyle=cc[seq[i]]; ctx.beginPath(); ctx.arc(14+(i%cols)*cs+cs/2,28+Math.floor(i/cols)*cs+cs/2,Math.max(1.2,cs*0.36),0,6.283); ctx.fill(); } ctx.globalAlpha=1;
    legend(ctx,w*0.7,40,[['진양성(TP)',COL.grav],['가양성(FP)',COL.amber],['놓침(FN)',COL.dim],['정상(TN)',cc[3]]]); },
  graph:function(ctx,w,h,p,sp,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:40,ymin:0,ymax:100,xlabel:'유병률 (%)',ylabel:'PPV (%)',title:'유병률 → PPV (특이도별)',left:50,xfmt:axisFmt(0),yfmt:axisFmt(0)}), x;
    [[90,COL.grav],[95,COL.amber],[99,COL.ok]].forEach(function(q){ var pts=[]; for(x=0.2;x<=40;x+=0.4) pts.push([x,i09(x,q[0]).ppv*100]); plotLine(ctx,P,pts,q[1],1.6); }); plotPoints(ctx,P,[[p,i09(p,sp).ppv*100]],COL.blue,8); legend(ctx,P.x1-130,P.y0-64,[['특이도 90',COL.grav],['95',COL.amber],['99',COL.ok]]); },
  kv:function(p,sp,S){ var s=i09(p,sp); return [['PPV',(s.ppv*100).toFixed(0)+' %','a'],['NPV',(s.npv*100).toFixed(1)+' %','g'],['진양성/가양성(1000명)',s.tp.toFixed(0)+' / '+s.fp.toFixed(0),'v2'],['놓침(FN)',s.fn.toFixed(1)+' 명'],['해석',s.ppv<0.3?'양성도 추가 검사 필수':s.ppv<0.7?'확인 검사 필요':'신뢰도 높음','r']]; } };

/* ── I10 : 저선량 영상 잡음 제거 ─────────────────────────────────────── */
var _i10c={k:null,v:null};
function i10(dose,r){ var N=C09.N, key='i10|'+dose+'|'+r; var cl=huMap(C09.lab).map(function(v){ return Math.max(-100,Math.min(200,v)); }), raw=huMap(C09.lab), nz=new Float32Array(N*N), rg=rng32(21), sig=18*Math.sqrt(100/dose), i,j,u,v; for(i=0;i<N*N;i++) nz[i]=cl[i]+(raw[i]>-900? sig*gaussR(rg):0);
  var out=new Float32Array(N*N); if(r<=0) out=nz; else for(j=0;j<N;j++) for(i=0;i<N;i++){ var s=0,c=0; for(v=-r;v<=r;v++) for(u=-r;u<=r;u++){ var x=i+u,y=j+v; if(x>=0&&y>=0&&x<N&&y<N){ s+=nz[y*N+x]; c++; } } out[j*N+i]=s/c; }
  var gm=[],wm=[]; for(i=0;i<N*N;i++){ if(C09.lab[i]===3) gm.push(out[i]); else if(C09.lab[i]===4) wm.push(out[i]); }
  var br=[],bo=[]; for(i=0;i<N*N;i++){ var L=C09.lab[i]; if(L>=3&&L<=6){ br.push(out[i]); bo.push(cl[i]); } } var cn=Math.abs(mean(gm)-mean(wm)), noise=(stdev(gm)+stdev(wm))/2, edge=0, ci=Math.floor(N*0.5), e1=out[ci*N+Math.round(N*0.1)]; return {nz:nz,out:out,cl:cl,rmse:rmse(br,bo),noise:noise,cnr:cn/Math.max(1e-6,noise),sig:sig}; }
(function(){ var a=i10(100,0), b=i10(25,0), c=i10(25,1), d=i10(25,3);
  mkP({ id:'I10', t:'저선량 영상 잡음 제거 필터 — 선량은 줄이고 화질은 지키고', icon:'🧹', type:'발명 · 소프트웨어', lv:3, dur:'3 주', cost:'무료(코딩)',
    one:'선량을 줄이면 영상 잡음이 √ 로 늘어난다. 평균 필터(반경 r)로 잡음을 줄이되 해상도 손실(번짐)을 최소화하는 필터를 설계하고, 선량 · 반경 · CNR · RMSE 의 거래를 정량화한다.',
    q:'선량을 1/4 로 줄인 영상에 필터를 적용하면 원래 화질을 회복할 수 있을까? 필터 반경이 너무 크면 무엇을 잃을까?',
    why:'저선량 CT 와 AI 잡음 제거는 의료영상 연구의 최전선입니다. 평균 필터는 가장 단순한 출발점으로, 「잡음 감소와 해상도 유지의 거래」를 직접 확인하게 해 줍니다. 더 발전한 필터 설계로 이어지는 입문입니다.',
    link:'원리⑥(6번 탭) · R09 · C08 · 평균 · 표준편차 · 합성곱(이미지 필터).',
    cap:'저선량 영상(왼쪽: 잡음 ↑) → 평균 필터 반경 r(가운데) → 개선 영상(오른쪽). 저선량 = 잡음 ↑(왼쪽 아래) · 잡음 ↔ 해상도(가운데 아래) · CNR 과 RMSE(오른쪽 아래)',
    parts:[['저선량 영상','선량 100 % → 25 % 등','잡음 ∝ 1/√선량','선량이 1/4 이면 잡음은 2 배(양자 잡음).'],
           ['평균 필터','반경 r 의 (2r+1)² 이웃 평균','잡음 1/(2r+1) 감소','독립 잡음의 평균은 √N 감소.'],
           ['번짐','경계가 흐려진다','r 이 클수록 심함','작은 병변 · 경계 정보를 잃는 대가.'],
           ['지표 RMSE','깨끗한 영상과 차이','HU','낮을수록 원본에 가깝다.'],
           ['지표 CNR','(회색질−백색질)/잡음','클수록 구별 쉬움','필터 후 CNR 이 올라가는지 확인.'],
           ['확장 아이디어','중앙값 · 가우시안 · 비국소 평균','경계 보존 필터','에지 보존 필터로 번짐을 줄이는 설계를 제안한다.']],
    budget:[['컴퓨터','1','보유','—'],['파이썬(NumPy/SciPy)','1','무료','—'],['공개 영상/팬텀','—','무료','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['팬텀에 선량에 따른 가우시안 잡음 σ = σ₀√(100/선량) 를 더해 저선량 영상을 만든다.','반경 r = 0, 1, 2, 3 의 평균 필터를 구현한다.','각 조합의 RMSE · 잡음 · CNR 을 표로 정리한다.','경계 번짐(가장자리 폭)을 측정해 해상도 손실을 정량화한다.','중앙값 · 에지 보존 필터를 추가해 평균 필터와 비교하고 최적 설정을 제안한다.'],
    vars:['선량 비율 · 필터 반경 r','RMSE · CNR · 잡음 · 가장자리 폭','필터 종류 · 병변 크기'],
    predict:[['선량 100 % · r 0','잡음 '+fx(a.noise,0)+' HU · CNR '+fx(a.cnr,1),'기준'],
             ['선량 25 % · r 0','잡음 '+fx(b.noise,0)+' HU · CNR '+fx(b.cnr,1),'선량 1/4 → 잡음 약 2 배'],
             ['선량 25 % · r 1','잡음 '+fx(c.noise,0)+' HU · CNR '+fx(c.cnr,1)+' · RMSE '+fx(c.rmse,0),'평균 3×3 으로 잡음 1/3'],
             ['선량 25 % · r 3','잡음 '+fx(d.noise,0)+' HU · CNR '+fx(d.cnr,1)+' · RMSE '+fx(d.rmse,0),'잡음은 줄지만 경계 손실 → RMSE 한계']],
    data:{cols:['선량(%)','r','잡음(HU)','CNR','RMSE(HU)'],
          rows:[[100,0],[50,0],[25,0],[25,1],[25,2],[25,3]].map(function(q){ var s=i10(q[0],q[1]); return [q[0],q[1],fx(s.noise,0),fx(s.cnr,1),fx(s.rmse,0)]; })},
    analysis:'RMSE 는 r 이 커질수록 처음엔 감소하다가 번짐 때문에 다시 증가하는 최적 r 이 존재한다. 선량별 최적 r 과 CNR 변화를 정리하고, 에지 보존 필터의 효과와 임상 적용 시 위험(병변 소실)을 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「저선량 영상 되살리기 필터」'],['핵심 아이디어','선량별 최적 반경 · 경계 보존 필터'],['기존 방법과 차이','선량 대비 화질 회복 곡선을 한 화면에서 제공'],['한계','가우시안 잡음 가정 · 팬텀 영상 · 실제 병변 소실 위험']]],
    fails:[['영상이 너무 뭉개진다','r 을 줄이고 에지 보존 필터 사용'],['잡음이 줄지 않는다','잡음이 상관된 경우(실제 CT) 다른 필터 필요'],['성능이 팬텀에서만 좋다','다른 영상에서 일반화 점검']],
    up:['<b>R09</b> — 평균과 SNR 이론.','<b>C08</b> — 두께와 잡음.','<b>I08</b> — 압축.'],
    next:['품질 · 선량 · 안전',6],
    eval:[['정량 평가','RMSE · CNR · 가장자리'],['발명성','필터 설계 · 비교'],['설명','잡음 · 해상도 거래'],['한계 서술','임상 적용 위험']] });
})();
SIMS.I10={ q:'선량과 평균 필터 반경을 바꾸면 잡음 · CNR · 영상 오차(RMSE)는 어떻게 달라질까?',
  a:{nm:'선량 비율',min:10,max:100,step:5,val:25,unit:'%',d:0}, b:{nm:'필터 반경 r',min:0,max:5,step:1,val:1,unit:'화소',d:0},
  cap1:'머리 팬텀의 저선량 영상(왼쪽)과 필터 후 영상(오른쪽). 필터가 잡음을 줄이지만 반경이 커지면 경계가 흐려집니다.',
  cap2:'📊 필터 반경에 따른 RMSE(실선)와 잡음(점선) — 최저점 근처가 현재 선량에서의 최적 반경입니다.',
  note:'모형 : σ = 18 √(100/선량) HU 가우시안 잡음 · (2r+1)² 평균 필터 · RMSE = 깨끗한 팬텀과의 오차 · CNR = (|회색질 − 백색질|)/잡음. 머리 팬텀 · 교육용 어림.',
  anim:function(ctx,w,h,t,dose,r,S){ var key=dose+'|'+r, s=(_i10c.k===key)?_i10c.v:(_i10c.v=i10(dose,r),_i10c.k=key,_i10c.v), N=C09.N, sz=Math.min((w-40)/2,h-60), x0=14, y0=24; grayImage(ctx,s.nz,N,x0,y0,sz,sz,-100,150,false); grayImage(ctx,s.out,N,x0+sz+14,y0,sz,sz,-100,150,false); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,sz,sz); ctx.strokeRect(x0+sz+14,y0,sz,sz);
    cvText(ctx,'저선량 '+dose+' %',x0+sz/2,y0-6,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,'필터 r='+r,x0+sz*1.5+14,y0-6,COL.amber,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'RMSE '+s.rmse.toFixed(0)+' HU · CNR '+s.cnr.toFixed(1),12,h-8,COL.text,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,dose,r,S){ var a=[],b=[],q,mx=0; for(q=0;q<=5;q++){ var s=i10(dose,q); a.push([q,s.rmse]); b.push([q,s.noise]); mx=Math.max(mx,s.rmse,s.noise); } var P=makePlot(ctx,w,h,{xmin:0,xmax:5,ymin:0,ymax:mx*1.1,xlabel:'필터 반경 r (화소)',ylabel:'HU',title:'반경 → RMSE(실선) · 잡음(점선)',left:50,xfmt:axisFmt(1),yfmt:axisFmt(0)}); plotLine(ctx,P,b,COL.ok,1.8,[5,4]); plotLine(ctx,P,a,COL.blue,2.4); plotPoints(ctx,P,[[r,i10(dose,r).rmse]],COL.amber,7); },
  kv:function(dose,r,S){ var s=i10(dose,r), z=i10(dose,0); return [['영상 잡음',s.noise.toFixed(0)+' HU','a'],['RMSE',s.rmse.toFixed(0)+' HU','g'],['CNR',s.cnr.toFixed(1),'v2'],['필터 없음 대비 RMSE',(s.rmse/z.rmse*100).toFixed(0)+' %'],['판단',s.rmse<=z.rmse*0.6?'효과적':s.rmse<z.rmse?'소폭 개선':'번짐이 더 큼','r']]; } };
