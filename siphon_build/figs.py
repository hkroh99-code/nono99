# -*- coding: utf-8 -*-
"""교과서형 SVG 도해 생성기 — 사이펀. 색 규약 : 장치 #475569/#94a3b8 · 빔·입자 #7dd3fc/#fbbf24 ·
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

# ── 사이펀 전용 부품 ──
def SIPHON(x,y,hw=1.0,flow=True,bub=False,lowtank=True):
    """x,y : 왼쪽 위 · 폭 180 · 높이 130 짜리 사이펀 작은 그림"""
    o=[]
    o.append(WATER(x+2,y+44,66,70,.32)+TANK(x,y+34,70,80)+L(x+2,y+44,x+68,y+44,'#7dd3fc',1.6))
    if lowtank: o.append(WATER(x+100,y+96,66,18,.32)+TANK(x+98,y+84,70,30)+L(x+100,y+96,x+166,y+96,'#7dd3fc',1.6))
    d='M%g %g V%g Q%g %g %g %g H%g Q%g %g %g %g V%g'%(x+50,y+88,y+16,x+50,y+4,x+62,y+4,x+106,x+118,y+4,x+118,y+16,y+100 if lowtank else y+112)
    o.append(P(d,'#cbd5e1',7)+P(d,'#0b1424',4)+P(d,'#38bdf8' if flow else '#475569',3))
    if bub: o.append(R(x+82,y-1,10,10,3,'#e2e8f0','none',0))
    if flow: o.append(AR(x+118,y+60,x+118,y+84,'#fbbf24',2))
    return ''.join(o)

# ── 그림 1-1 : 세 가지 장면 ────────────────────────────────────────────
def flow():
    o=[panel(10,40,250,222,'① 어항 물갈이 — 높이차 h')]
    o.append(SIPHON(36,92)+L(30,100,30,222,'#a78bfa',1.1,'3 3')+T(22,170,'h','#a78bfa',12,'end','700')+T(135,246,'위 수면이 출구보다 높아야 흐른다','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 피타고라스 컵 — 넘치면 모두 빠짐'))
    o.append(P('M330 220 V120 H450 V220 Z','#94a3b8',2.2,'rgba(148,163,184,.08)')+WATER(332,168,116,50,.32)+R(384,140,12,80,2,'#64748b','#e2e8f0',1.2)+L(300,140,470,140,'#fb7185',1.1,'4 4')+T(488,144,'정점','#fb7185',10.5,'start')+T(395,246,'정점을 넘기면 한꺼번에 비워진다','#cfe0f5',10.5)+T(395,88,'공평하게 따르세요!','#fbbf24',12,'middle','700'))
    o.append(panel(530,40,240,222,'③ 정점의 한계 — 약 10 m'))
    o.append(L(590,220,590,92,'#94a3b8',2)+P('M590 92 q0 -14 14 -14 h40 q14 0 14 14 V220','#94a3b8',2)+T(715,100,'대기압','#34d399',10.5,'middle')+AR(715,108,715,150,'#34d399',2)+T(650,246,'정점 압력 > 증기압 이어야 한다','#cfe0f5',10.5)+T(650,70+0,'','#fff',1))
    return ''.join(o)

# ── 그림 2-1 : 높이차와 유속 ─────────────────────────────────────────────
def hydro():
    o=[panel(10,40,250,222,'① 위치 에너지 → 운동 에너지')]
    o.append(WATER(30,100,70,90,.32)+TANK(28,86,74,104)+L(30,100,98,100,'#7dd3fc',1.6)+L(102,190,235,190,'#5b7099',1.2)+L(30,100,235,100,'#a78bfa',1,'3 3')+AR(215,100,215,186,'#a78bfa',1.6)+T(226,148,'h','#a78bfa',12,'start','700')+P('M100 176 Q150 176 190 190','#38bdf8',3)+AR(180,192,224,200,'#34d399',2.4)+T(135,232,'mgh = ½mv²','#cfe0f5',11.5))
    o.append(panel(270,40,250,222,'② v = √(2gh) — 토리첼리 정리와 같다'))
    o.append(L(300,86,300,222,'#5b7099',1.2)+L(300,222,500,222,'#5b7099',1.2)+P('M300 222 Q360 140 490 100','#34d399',2.6)+T(400,246,'높이차 h →','#cfe0f5',10.5)+T(285,150,'v','#cfe0f5',11)+T(420,110,'√h 곡선','#34d399',11)+T(395,70,'4 배 높이 → 2 배 속력','#fbbf24',11.5,'middle','700'))
    o.append(panel(530,40,240,222,'③ 손실 K — 실제는 더 느리다'))
    o.append(R(560,100,16,100,1,'#38bdf8','none',0)+T(568,216,'이상','#cfe0f5',10)+R(600,128,16,72,1,'#34d399','none',0)+T(608,216,'실제','#cfe0f5',10)+T(690,134,'v = √(2gh/K)','#fbbf24',11.5,'middle','700')+T(690,160,'K = 1 + K_m + fL/D','#cfe0f5',10.5)+T(690,186,'관이 길고 가늘수록 K ↑','#fb7185',10.5))
    return ''.join(o)

# ── 그림 3-1 : 정점 압력과 시동 ─────────────────────────────────────────
def pascal():
    o=[panel(10,40,250,222,'① 정점의 압력이 가장 낮다')]
    o.append(SIPHON(36,92,lowtank=True)+T(80,102,'p꜀ 최저','#fb7185',10.5)+T(135,246,'p꜀ = p₀ − ρgH꜀ − ½ρv²','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 증기압 아래면 기포가 생겨 끊긴다'))
    o.append(P('M310 200 L360 200 L400 110 L440 110 L480 200','#34d399',2.4)+L(300,170,500,170,'#fb7185',1.4,'5 4')+T(486,166,'p_v','#fb7185',10.5,'start')+C(420,110,5,'#e2e8f0','none',0)+C(432,100,3,'#e2e8f0','none',0)+T(395,246,'p_c < p_v → 증기 기포 (캐비테이션)','#cfe0f5',10.5))
    o.append(panel(530,40,240,222,'③ 시동(프라이밍) — 공기를 물로'))
    o.append(R(560,100,30,30,4,'#475569','#94a3b8',1.3)+L(590,115,650,115,'#cbd5e1',6)+AR(650,115,690,150,'#38bdf8',2.2)+T(575,150,'주사기·펌프','#cfe0f5',10)+T(650,200,'입으로 빨지 않는다','#fb7185',11.5,'middle','700')+T(650,226,'(연료 · 약품은 특히 위험)','#cfe0f5',10))
    return ''.join(o)

# ── 그림 4-1 : 마찰과 점성 ──────────────────────────────────────────────
def archi():
    o=[panel(10,40,250,222,'① 층류 — 포물선 속도 분포')]
    o.append(R(30,110,200,60,0,'rgba(56,189,248,.14)','#94a3b8',2)+''.join(AR(60,140+k*8,60+54*(1-(k/3.4)**2),140+k*8,'#38bdf8',1.8) for k in range(-3,4))+T(135,232,'Re < 2300 · f = 64/Re · Q ∝ D⁴','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 난류 — 납작한 분포 · 소용돌이'))
    o.append(R(290,110,210,60,0,'rgba(56,189,248,.14)','#94a3b8',2)+''.join(AR(320,140+k*8,372,140+k*8,'#fb923c',1.8) for k in range(-3,4))+P('M420 124 q10 -10 14 4 q-8 14 -14 -4','#e2e8f0',1.2)+P('M455 150 q10 -10 14 4 q-8 14 -14 -4','#e2e8f0',1.2)+T(395,232,'Re > 4000 · f ≈ 0.316 Re⁻¹ᐟ⁴','#cfe0f5',10.5))
    o.append(panel(530,40,240,222,'③ 길고 가는 관은 느리다'))
    o.append(L(560,110,740,110,'#cbd5e1',10)+L(560,150,740,150,'#cbd5e1',3)+T(650,100,'굵고 짧은 관 — 빠름','#34d399',10.5)+T(650,176,'가늘고 긴 관 — 느림','#fb7185',10.5)+T(650,214,'Re = ρvD/μ','#fbbf24',12,'middle','700')+T(650,238,'점성 μ ↑ → 유량 ↓','#cfe0f5',10.5))
    return ''.join(o)

# ── 그림 5-1 : 배수 시간과 두 통의 평형 ─────────────────────────────────
def ship():
    o=[panel(10,40,250,222,'① 수위가 내려가면 느려진다')]
    o.append(L(40,90,40,210,'#5b7099',1.2)+L(40,210,230,210,'#5b7099',1.2)+P('M40 110 Q110 130 220 210','#38bdf8',2.6)+T(135,232,'시간 →','#cfe0f5',10.5)+T(55,100,'수위','#cfe0f5',10.5,'start')+T(150,146,'√h 감소 → 포물선','#fbbf24',11,'middle','700'))
    o.append(panel(270,40,250,222,'② 두 통 — 수위가 같아지면 멈춘다'))
    o.append(WATER(300,100,60,100,.32)+TANK(298,86,64,114)+WATER(430,170,60,30,.32)+TANK(428,86,64,114)+L(300,100,360,100,'#7dd3fc',1.6)+L(430,170,490,170,'#7dd3fc',1.6)+P('M345 140 V66 H460 V150','#cbd5e1',6)+T(395,246,'h_f = (A₁h₁ + A₂h₂)/(A₁ + A₂)','#cfe0f5',10.5))
    o.append(panel(530,40,240,222,'③ 배수 시간 T'))
    o.append(T(650,104,'T = (A/a)√(2K h₀/g)','#fbbf24',12.5,'middle','700')+T(650,138,'통이 넓을수록 ↑','#cfe0f5',11)+T(650,162,'관이 굵을수록 ↓','#cfe0f5',11)+T(650,186,'처음 높이차 ↑ → √ 로 ↑','#cfe0f5',11)+T(650,224,'(난류 · K 일정 가정)','#9db0cc',10.5))
    return ''.join(o)

# ── 그림 6-1 : 응용과 안전 ──────────────────────────────────────────────
def measure():
    o=[panel(10,40,250,222,'① 마리오트 병 — 일정한 유량')]
    o.append(R(60,90,70,120,4,'rgba(56,189,248,.14)','#94a3b8',1.6)+WATER(62,140,66,68,.32)+L(95,60,95,170,'#e2e8f0',2.4)+C(95,170,3,'#fbbf24','none',0)+P('M130 205 H200','#cbd5e1',5)+AR(200,205,226,222,'#38bdf8',2)+T(100,60,'공기관','#fbbf24',10.5,'start')+T(135,246,'공기관 끝 높이가 압력을 정한다','#cfe0f5',10))
    o.append(panel(270,40,250,222,'② 간헐 샘 — 차올랐다 쏟아낸다'))
    o.append(WATER(330,150,110,60,.32)+TANK(328,96,114,114)+P('M360 190 V104 H410 V240','#cbd5e1',6)+AR(355,70,355,96,'#38bdf8',2)+T(395,246,'수위가 정점에 닿으면 시동','#cfe0f5',10.5)+T(395,76,'주기적으로 반복','#fbbf24',11,'middle','700'))
    o.append(panel(530,40,240,222,'③ 안전 수칙'))
    o.append(T(650,98,'입으로 빨지 않는다','#fb7185',11.5,'middle','700')+T(650,126,'주사기 · 손펌프로 시동','#cfe0f5',11)+T(650,154,'물 · 상온만 사용','#34d399',11)+T(650,182,'연료 · 약품 · 가열 금지','#fb7185',11)+T(650,224,'바닥 물기 닦기 · 보안경','#cfe0f5',10.5))
    return ''.join(o)

# ── 그림 7-1 : 활용 현황 ───────────────────────────────────────────────
def eco():
    o=[]
    cards=[('한국','수도 · 농업 · 위생 설비','논 관개 사이펀 · 사이펀식 변기 · 수로 사이펀','공공 수자원 · 농업 기관 자료'),
           ('미국','댐 · 하수 · 수자원 시설','사이펀 여수로 · 하수 도로 아래 사이펀','국가 · 대학 수리학 연구'),
           ('일본','관개 · 하수 · 위생도기','농업용수 역사이펀(伏越) · 사이펀식 변기','수리 · 위생 설비 연구')]
    for i,(c,a,b,d) in enumerate(cards):
        ox=12+256*i
        o.append(R(ox,40,244,206,9,'#0b1424','#3d5480',1.3)); o.append(T(ox+122,66,c,'#cfe0f5',15,'middle','700'))
        o.append(T(ox+122,100,'💧 분야','#fbbf24',11.5)); o.append(T(ox+122,120,a,'#cfe0f5',10.5))
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
