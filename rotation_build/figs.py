# -*- coding: utf-8 -*-
"""교과서형 SVG 도해 생성기 — 회전운동과 토크. 색 규약 : 장치 #475569/#94a3b8 · 빔·입자 #7dd3fc/#fbbf24 ·
   정답 #34d399 · 경고 #fb7185 · 치수 #a78bfa · 눈금 #3d5480"""
import math
DEV='fill="#475569" stroke="#94a3b8" stroke-width="1.3"'

def T(x,y,s,c='#cfe0f5',sz=12,anc='middle',w=None):
    return '<text x="%g" y="%g" fill="%s" font-size="%g" text-anchor="%s"%s>%s</text>'%(x,y,c,sz,anc,(' font-weight="%s"'%w if w else ''),s)
def L(x1,y1,x2,y2,c='#94a3b8',w=1.2,dash=None):
    return '<path d="M%g %g L%g %g" stroke="%s" stroke-width="%g"%s/>'%(x1,y1,x2,y2,c,w,(' stroke-dasharray="%s"'%dash if dash else ''))
def P(d,c='#94a3b8',w=1.3,f='none',dash=None):
    return '<path d="%s" stroke="%s" stroke-width="%g" fill="%s"%s/>'%(d,c,w,f,(' stroke-dasharray="%s"'%dash if dash else ''))
def R(x,y,w,h,rx=4,f='#475569',s='#94a3b8',sw=1.3):
    return '<rect x="%g" y="%g" width="%g" height="%g" rx="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(x,y,w,h,rx,f,s,sw)
def C(cx,cy,r,f='none',s='#94a3b8',sw=1.3):
    return '<circle cx="%g" cy="%g" r="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(cx,cy,r,f,s,sw)
def E(cx,cy,rx,ry,f='none',s='#94a3b8',sw=1.3):
    return '<ellipse cx="%g" cy="%g" rx="%g" ry="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(cx,cy,rx,ry,f,s,sw)
def AR(x1,y1,x2,y2,c='#fbbf24',w=2):
    dx,dy=x2-x1,y2-y1; n=math.hypot(dx,dy) or 1; ux,uy=dx/n,dy/n
    return L(x1,y1,x2,y2,c,w)+'<path d="M%g %g L%g %g L%g %g Z" fill="%s"/>'%(x2,y2,x2-ux*9-uy*4.5,y2-uy*9+ux*4.5,x2-ux*9+uy*4.5,y2-uy*9-ux*4.5,c)
def panel(x,y,w,h,title):
    return R(x,y,w,h,9,'#0b1424','#3d5480',1.3)+T(x+w/2,y+20,title,'#cfe0f5',13,'middle','700')

def WATER(x,y,w,h,a=0.28):
    return R(x,y,w,h,0,'rgba(56,189,248,%g)'%a,'none',0)
def TANK(x,y,w,h,col='#94a3b8'):
    return P('M%g %g V%g H%g V%g'%(x,y,y+h,x+w,y),col,2.2)
def GAUGE(cx,cy,r=18,v=0.6):
    a=-2.4+3.4*v
    return C(cx,cy,r,'#0b1424','#94a3b8',1.6)+L(cx,cy,cx+r*0.8*math.cos(a),cy+r*0.8*math.sin(a),'#fb7185',2)

# 공용 부품
def ARC(cx,cy,r,a0,a1,c='#a78bfa',w=1.6,arrow=True):
    x0,y0=cx+r*math.cos(a0),cy-r*math.sin(a0); x1,y1=cx+r*math.cos(a1),cy-r*math.sin(a1)
    large=1 if abs(a1-a0)>math.pi else 0; sw=0 if a1>a0 else 1
    d='M%g %g A%g %g 0 %d %d %g %g'%(x0,y0,r,r,large,0 if a1>a0 else 1,x1,y1)
    return P(d,c,w)
def PIV(x,y,r=5): return C(x,y,r,'#fbbf24','#e2e8f0',1.2)
def ROD(x1,y1,x2,y2,w=7,c='#94a3b8'): return L(x1,y1,x2,y2,c,w)
def WHEEL(cx,cy,r,spokes=6,c='#94a3b8'): return C(cx,cy,r,'none',c,3)+''.join(L(cx,cy,cx+r*math.cos(k*2*math.pi/spokes),cy+r*math.sin(k*2*math.pi/spokes),c,1.6) for k in range(spokes))+C(cx,cy,3,c,'none',0)
def DISK(cx,cy,r,c='rgba(148,163,184,.55)'): return C(cx,cy,r,c,'#e2e8f0',1.6)+C(cx,cy,3,'#e2e8f0','none',0)
def PERSON(x,y,arms=22): return C(x,y-34,6,'#e2e8f0','none',0)+L(x,y-28,x,y-4,'#e2e8f0',3)+L(x,y-24,x-arms,y-24,'#e2e8f0',2.4)+L(x,y-24,x+arms,y-24,'#e2e8f0',2.4)+C(x-arms,y-24,3.4,'#fbbf24','none',0)+C(x+arms,y-24,3.4,'#fbbf24','none',0)+L(x,y-4,x-6,y+12,'#e2e8f0',2.4)+L(x,y-4,x+6,y+12,'#e2e8f0',2.4)
def BALLR(x,y,r=10): return C(x,y,r,'rgba(148,163,184,.55)','#e2e8f0',1.5)+L(x,y,x+r*0.7,y-r*0.7,'#fb7185',1.4)
def RAMP(x1,y1,x2,y2): return P('M%g %g L%g %g L%g %g Z'%(x1,y1,x2,y2,x1,y2),'#94a3b8',1.6,'rgba(148,163,184,.18)')

# ── 그림 1-1 : 세 가지 장면 ────────────────────────────────────────────
def flow():
    o=[panel(10,40,250,222,'① 렌치 — 손잡이가 길면 토크 ↑')]
    o.append(ROD(40,150,215,150,9,'#94a3b8')+C(40,150,16,'#475569','#e2e8f0',1.6)+PIV(40,150,4)+AR(205,150,205,108,'#fbbf24',2.6)+T(215,102,'F','#fbbf24',12,'start','700')+L(40,172,205,172,'#a78bfa',1.2)+T(122,188,'거리 r','#a78bfa',11)+T(135,232,'토크 τ = r · F','#cfe0f5',11.5))
    o.append(panel(270,40,250,222,'② 시소 — 토크가 같으면 평형'))
    o.append(P('M395 182 L379 206 L411 206 Z','#94a3b8',1.6,'rgba(148,163,184,.4)')+ROD(290,182,500,182,8,'#94a3b8')+R(300,152,30,30,2,'#fb7185','#e2e8f0',1.2)+R(455,162,30,20,2,'#38bdf8','#e2e8f0',1.2)+T(315,146,'m₁','#cfe0f5',11)+T(470,156,'m₂','#cfe0f5',11)+L(315,214,395,214,'#a78bfa',1.2)+T(355,230,'d₁','#a78bfa',11)+L(395,214,470,214,'#a78bfa',1.2)+T(432,230,'d₂','#a78bfa',11)+T(395,88,'m₁ d₁ = m₂ d₂','#fbbf24',12,'middle','700'))
    o.append(panel(530,40,240,222,'③ 피겨 스케이터 — 팔을 오므리면 빨라진다'))
    o.append(PERSON(600,200,34)+ARC(600,140,40,0.4,2.7,'#a78bfa',1.6)+PERSON(700,200,10)+ARC(700,140,24,0.4,5.6,'#34d399',2.6)+T(600,236,'느림 (I 큼)','#9db0cc',10.5)+T(700,236,'빠름 (I 작음)','#34d399',10.5)+T(650,86,'L = Iω 일정','#fbbf24',12,'middle','700'))
    return ''.join(o)

# ── 그림 2-1 : 각운동학 ─────────────────────────────────────────────────
def hydro():
    o=[panel(10,40,250,222,'① 각도 θ = 호의 길이 ÷ 반지름')]
    o.append(L(70,196,200,196,'#94a3b8',1.4)+P('M70 196 L170 114','#94a3b8',1.6)+P('M70 196 m55 0 a55 55 0 0 0 -22 -44','#a78bfa',2)+T(106,178,'θ','#a78bfa',13)+P('M70 196 m100 0 a100 100 0 0 0 -30 -72','#38bdf8',2.2)+T(190,150,'s = rθ','#38bdf8',11.5,'middle','700')+T(135,232,'1 rad ≈ 57.3°','#cfe0f5',11))
    o.append(panel(270,40,250,222,'② 각속도 ω 와 선속도 v = rω'))
    o.append(C(395,150,60,'none','#94a3b8',1.5)+PIV(395,150,4)+L(395,150,455,150,'#a78bfa',1.4)+AR(455,150,455,106,'#fbbf24',2.4)+T(470,120,'v','#fbbf24',12,'start','700')+ARC(395,150,24,0.2,1.8,'#34d399',2)+T(395,132,'ω','#34d399',13)+C(395,150,30,'none','#5b7099',1,)+AR(425,150,425,128,'#fbbf24',1.6)+T(335,232,'바깥일수록 빠르다','#cfe0f5',11,'start'))
    o.append(panel(530,40,240,222,'③ 원운동의 가속도'))
    o.append(C(650,150,56,'none','#94a3b8',1.5)+PIV(650,150,3)+C(706,150,6,'#fbbf24','none',0)+AR(706,150,672,150,'#fb7185',2.2)+T(664,138,'a_c','#fb7185',11.5,'middle','700')+AR(706,150,706,116,'#34d399',2.2)+T(722,128,'a_t','#34d399',11.5,'start','700')+T(650,232,'a_c = rω² · a_t = rα','#cfe0f5',11.5))
    return ''.join(o)

# ── 그림 3-1 : 토크와 평형 ───────────────────────────────────────────────
def pascal():
    o=[panel(10,40,250,222,'① τ = r F sinθ')]
    o.append(PIV(60,170,6)+ROD(60,170,210,170,8,'#94a3b8')+AR(190,170,160,120,'#fbbf24',2.6)+T(160,112,'F','#fbbf24',12,'end','700')+L(190,170,190,120,'#34d399',1.2,'4 3')+T(198,140,'F sinθ','#34d399',11,'start')+ARC(190,170,26,1.57,2.2,'#a78bfa',1.6)+T(160,160,'θ','#a78bfa',12)+L(60,196,190,196,'#a78bfa',1.2)+T(125,212,'r','#a78bfa',12)+T(135,236,'수직 성분만 돌린다','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 지렛대 평형 F₁d₁ = F₂d₂'))
    o.append(P('M395 176 L381 202 L409 202 Z','#94a3b8',1.6,'rgba(148,163,184,.4)')+ROD(290,176,500,176,7,'#94a3b8')+AR(320,176,320,124,'#fb7185',2.4)+T(330,118,'F₁','#fb7185',12,'start','700')+AR(468,126,468,170,'#38bdf8',2.4)+T(476,118,'F₂','#38bdf8',12,'start','700')+L(320,214,395,214,'#a78bfa',1.2)+T(358,230,'d₁ 큼','#a78bfa',10.5)+L(395,214,468,214,'#a78bfa',1.2)+T(432,230,'d₂ 작음','#a78bfa',10.5))
    o.append(panel(530,40,240,222,'③ 우력 — 알짜 힘 0, 토크 ≠ 0'))
    o.append(PIV(650,160,5)+ROD(590,160,710,160,7,'#94a3b8')+AR(600,160,600,120,'#fbbf24',2.4)+AR(700,160,700,200,'#fbbf24',2.4)+ARC(650,160,30,2.6,0.5,'#34d399',2.4)+T(650,96,'평형이 아니다','#fb7185',12,'middle','700')+T(650,236,'알짜 힘 0 + 알짜 토크 0 이어야 평형','#cfe0f5',10))
    return ''.join(o)

# ── 그림 4-1 : 관성 모멘트 ──────────────────────────────────────────────
def archi():
    o=[panel(10,40,250,222,'① 같은 질량 · 다른 분포')]
    o.append(WHEEL(70,150,40,8)+T(70,210,'고리 I = mR²','#fb7185',10.5)+DISK(200,150,40)+T(200,210,'원판 I = ½mR²','#34d399',10.5)+T(135,238,'질량이 멀수록 돌리기 어렵다','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② I = Σ m r²'))
    o.append(PIV(330,150,4)+L(330,150,480,150,'#94a3b8',1.4)+C(380,150,7,'#38bdf8','none',0)+C(440,150,7,'#fb7185','none',0)+L(330,172,380,172,'#a78bfa',1.2)+T(355,188,'r₁','#a78bfa',11)+L(330,196,440,196,'#a78bfa',1.2)+T(385,212,'r₂ → 4배 기여','#a78bfa',10.5)+T(395,88,'기여 = m r² (거리의 제곱)','#fbbf24',11.5,'middle','700'))
    o.append(panel(530,40,240,222,'③ 막대 : 가운데 축 vs 끝 축'))
    o.append(ROD(560,120,740,120,8,'#94a3b8')+PIV(650,120,5)+T(650,106,'I = mL²/12','#34d399',11)+ROD(560,184,740,184,8,'#94a3b8')+PIV(560,184,5)+T(650,172,'I = mL²/3 (4배)','#fb7185',11)+T(650,236,'평행축 : I = I_cm + m d²','#cfe0f5',11))
    return ''.join(o)

# ── 그림 5-1 : 각운동량 ─────────────────────────────────────────────────
def ship():
    o=[panel(10,40,250,222,'① 팔을 벌리면 느리고 오므리면 빠르다')]
    o.append(PERSON(75,200,36)+PERSON(195,200,10)+ARC(75,128,36,0.4,2.4,'#a78bfa',2)+ARC(195,128,22,0.4,5.4,'#34d399',2.6)+T(135,238,'I₁ω₁ = I₂ω₂','#fbbf24',12,'middle','700'))
    o.append(panel(270,40,250,222,'② 회전 의자 + 자전거 바퀴'))
    o.append(WHEEL(340,140,32,8)+ARC(340,140,40,0.4,5.4,'#38bdf8',2.2)+T(340,196,'바퀴 L ↑','#38bdf8',10.5)+L(400,140,440,140,'#94a3b8',1.2)+PERSON(470,200,6)+ARC(470,120,22,5.4,0.4,'#fb7185',2.4)+T(470,236,'의자는 반대 방향','#fb7185',10.5)+T(395,90,'총 L = 0 보존','#fbbf24',11.5,'middle','700'))
    o.append(panel(530,40,240,222,'③ 위성의 반작용 휠'))
    o.append(R(590,120,60,50,3,'#475569','#94a3b8',1.4)+C(620,145,14,'rgba(56,189,248,.3)','#38bdf8',1.6)+ARC(620,145,22,0.4,5.4,'#38bdf8',2)+ARC(620,145,40,5.4,0.4,'#fb7185',2)+T(620,214,'휠 정방향 → 위성 역방향','#cfe0f5',10.5)+R(670,134,6,22,1,'#fbbf24','#e2e8f0',1)+R(690,134,6,22,1,'#fbbf24','#e2e8f0',1))
    return ''.join(o)

# ── 그림 6-1 : 에너지 · 구르기 · 측정 ───────────────────────────────────
def measure():
    o=[panel(10,40,250,222,'① 경사면을 굴러 내려온다')]
    o.append(RAMP(40,110,230,210)+BALLR(70,106,10)+DISK(160,170,12)+T(70,92,'구','#34d399',10.5)+T(160,152,'고리 · 원통','#cfe0f5',10)+L(30,214,240,214,'#5b7099',1.2)+T(135,236,'a = g sinθ/(1+k) · 질량 무관','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 에너지 : mgh = ½mv² + ½Iω²'))
    o.append(R(310,90,40,100,1,'#fbbf24','none',0)+T(330,206,'mgh','#cfe0f5',10.5)+R(400,130,40,60,1,'#38bdf8','none',0)+R(400,90,40,40,1,'#fb923c','none',0)+T(420,206,'병진 + 회전','#cfe0f5',10.5)+T(395,76,'회전 몫 = k/(1+k)','#fbbf24',11.5,'middle','700'))
    o.append(panel(530,40,240,222,'③ 측정 · 안전'))
    o.append(T(650,98,'영상 프레임으로 ω 재기','#cfe0f5',11)+T(650,126,'토크 렌치 · 스프링 저울','#cfe0f5',11)+T(650,154,'저속 회전 · 손 보호','#34d399',11.5,'middle','700')+T(650,182,'고속 플라이휠 · 큰 질량 금지','#fb7185',11)+T(650,224,'τ = F r · 단위 N·m','#fbbf24',11.5,'middle','700'))
    return ''.join(o)

# ── 그림 7-1 : 활용 현황 ───────────────────────────────────────────────
def eco():
    o=[]
    cards=[('한국','전기차 · 로봇 · 조선 · 우주','현대 아이오닉 · 협동로봇 · 누리호(자세 제어)','모터 · 감속기 · 반작용 휠 연구'),
           ('미국','우주 · 로봇 · 풍력 · 자동차','허블 · 케플러(반작용 휠) · 풍력 터빈','NASA · 대학 로봇 · 모터 연구'),
           ('일본','모터 · 로봇 · 탐사선 · 철도','니덱(소형 모터) · 하야부사(반작용 휠)','산업용 로봇 · 정밀 감속기')]
    for i,(c,a,b,d) in enumerate(cards):
        ox=12+256*i
        o.append(R(ox,40,244,206,9,'#0b1424','#3d5480',1.3)); o.append(T(ox+122,66,c,'#cfe0f5',15,'middle','700'))
        o.append(T(ox+122,100,'⚙ 분야','#fbbf24',11.5)); o.append(T(ox+122,120,a,'#cfe0f5',10.5))
        o.append(T(ox+122,152,'🏭 대표 사례','#7dd3fc',11.5)); o.append(T(ox+122,172,b,'#cfe0f5',9.5))
        o.append(T(ox+122,204,'🔬 시험 · 연구','#34d399',11.5)); o.append(T(ox+122,224,d,'#cfe0f5',9.5))
    return ''.join(o)

PLACE={'flow':flow,'hydro':hydro,'pascal':pascal,'archi':archi,'ship':ship,'measure':measure,'eco':eco}

def workflow(kind):
    """공방 안내 도해 : 6단계 흐름 (kind = RE · CR · IN). viewBox 780×262"""
    W={'RE':[('① 질문','🎯','측정할 수 있는 한 문장'),('② 선행 연구','📚','이미 아는 것 · 모르는 것'),('③ 예측','🔮','모의실험으로 먼저 예측'),
             ('④ 실험','🧪','3 회 이상 반복'),('⑤ 분석','📈','그래프 · 오차 · 통계'),('⑥ 발표','🎤','소논문 · 포스터')],
       'CR':[('① 영감','👀','관찰 · 자연 · 이야기'),('② 스케치','✏️','아이디어를 그림으로'),('③ 시제품','🛠','가장 작은 것부터'),
             ('④ 시험','🧪','시험해 보기'),('⑤ 전시','🖼','보여 주기 · 공연'),('⑥ 성찰','💬','무엇이 달랐나')],
       'IN':[('① 문제','❓','불편 · 실패 찾기'),('② 아이디어','💡','SCAMPER 로 바꿔 보기'),('③ 설계','📐','계산 · 시뮬레이션'),
             ('④ 시제품','🔧','작게 만들기'),('⑤ 성능 시험','📊','숫자로 증명'),('⑥ 명세서','📝','새로운 점 · 한계')]}[kind]
    o=[]
    for i,(t,ic,c) in enumerate(W):
        ox=12+128*i
        o.append('<rect x="%d" y="40" width="116" height="160" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>'%ox)
        o.append('<text x="%d" y="64" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">%s</text>'%(ox+58,t))
        o.append('<text x="%d" y="128" font-size="38" text-anchor="middle">%s</text>'%(ox+58,ic))
        o.append('<text x="%d" y="182" fill="#9db0cc" font-size="10.5" text-anchor="middle">%s</text>'%(ox+58,c))
        if i<5:
            x=ox+116
            o.append('<path d="M%d 120 H%d" stroke="#fbbf24" stroke-width="1.6"/><path d="M%d 116 L%d 120 L%d 124 Z" fill="#fbbf24"/>'%(x+1,x+10,x+7,x+11,x+7))
    o.append('<path d="M70 214 Q390 250 710 214" stroke="#34d399" stroke-width="1.4" fill="none" stroke-dasharray="4 4"/><path d="M66 218 L70 211 L76 217 Z" fill="#34d399"/>')
    o.append('<text x="390" y="246" fill="#7ee0a8" font-size="11.5" text-anchor="middle">되돌아가 고친다 — 실패한 데이터도 기록한다</text>')
    return ''.join(o)

PLACE.update({'wf_re':lambda: workflow('RE'),'wf_cr':lambda: workflow('CR'),'wf_in':lambda: workflow('IN')})
