# -*- coding: utf-8 -*-
"""교과서형 SVG 도해 생성기 — 색 규약(공통 템플릿 부록 1)을 지킨다.
   장치·구조물 #475569/#94a3b8 · 유리·챔버 rgba(56,189,248,.05)/#5b7099 · 빔·입자 #7dd3fc/#fbbf24
   검출·정답 #34d399 · 경고·오류 #fb7185 · 치수 #a78bfa · 눈금 #3d5480"""

DEV='fill="#475569" stroke="#94a3b8" stroke-width="1.3"'

def can(x, y, w=16, h=28):
    """캔위성(옆모습). (x,y) = 왼쪽 위."""
    return ('<rect x="%g" y="%g" width="%g" height="%g" rx="3" %s/>'
            '<rect x="%g" y="%g" width="%g" height="%g" fill="#fbbf24" opacity=".8"/>')%(x,y,w,h,DEV,x,y+h*0.36,w,h*0.14)

def chute(cx, cy, r, col='#fb7185'):
    """낙하산 돔 : (cx, cy)=돔 아래 가운데, 반지름 r"""
    return ('<path d="M%g %g Q%g %g %g %g Z" fill="rgba(251,113,133,.30)" stroke="%s" stroke-width="1.5"/>')%(cx-r,cy,cx,cy-r*1.25,cx+r,cy,col)

def lines(pts, col='#94a3b8', w=1, dash=None):
    d=' '.join('M%g %g L%g %g'%p for p in pts)
    return '<path d="%s" stroke="%s" stroke-width="%g" fill="none"%s/>'%(d,col,w,(' stroke-dasharray="%s"'%dash if dash else ''))

def arcs(cx, cy, n=3, r0=8, dr=7, a=0.9, col='#7dd3fc', flip=False):
    """오른쪽(왼쪽)으로 퍼지는 전파 호"""
    out=[]
    for i in range(n):
        r=r0+dr*i
        if flip: out.append('<path d="M%g %g A%g %g 0 0 0 %g %g" stroke="%s" stroke-width="1.5" fill="none" opacity="%g"/>'%(cx-r*0.7,cy-r*0.7,r,r,cx-r*0.7,cy+r*0.7,col,max(.25,a-i*0.2)))
        else: out.append('<path d="M%g %g A%g %g 0 0 1 %g %g" stroke="%s" stroke-width="1.5" fill="none" opacity="%g"/>'%(cx+r*0.7,cy-r*0.7,r,r,cx+r*0.7,cy+r*0.7,col,max(.25,a-i*0.2)))
    return ''.join(out)

def cell_frame(n, titles):
    """6칸 흐름도 틀 : 칸 너비 116, 간격 12, 시작 x=12. 제목 위(y=108), 설명 아래(y=226)."""
    out=[]
    for i,(t,c) in enumerate(titles):
        ox=12+128*i
        out.append('<rect x="%d" y="86" width="116" height="152" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>'%ox)
        out.append('<text x="%d" y="106" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">%s</text>'%(ox+58,t))
        out.append('<text x="%d" y="228" fill="#9db0cc" font-size="11" text-anchor="middle">%s</text>'%(ox+58,c))
        if i<len(titles)-1:
            x=ox+116
            out.append('<path d="M%d 160 H%d" stroke="#fbbf24" stroke-width="1.6"/><path d="M%d 156 L%d 160 L%d 164 Z" fill="#fbbf24"/>'%(x+1,x+10,x+7,x+11,x+7))
    return ''.join(out)

def flow():
    """그림 1-1 : 캔위성 임무 6단계"""
    cells=[('① 방출','풍선 · 드론 · 로켓'),('② 전개','낙하산이 펼쳐짐'),('③ 측정','센서가 기록'),
           ('④ 통신','무선으로 전송'),('⑤ 착륙','충격을 견딤'),('⑥ 분석','지상국 그래프')]
    o=[cell_frame(6,cells)]
    cx=lambda i:12+128*i+58
    # ① 방출 : 풍선 + 캔
    c=cx(0)
    o.append('<ellipse cx="%d" cy="136" rx="20" ry="24" fill="rgba(251,191,36,.22)" stroke="#fbbf24" stroke-width="1.5"/>'%c)
    o.append(lines([(c,160,c,184)],'#94a3b8',1.2)); o.append(can(c-8,184))
    # ② 전개 : 낙하산
    c=cx(1)
    o.append(chute(c,150,32)); o.append(lines([(c-32,150,c,186),(c+32,150,c,186),(c-14,142,c,186),(c+14,142,c,186)],'#94a3b8',1)); o.append(can(c-8,186))
    # ③ 측정 : 캔 + 온도계 + 고도 눈금
    c=cx(2)
    o.append(can(c-8,150))
    o.append(lines([(c+22,128,c+22,196)],'#5b7099',1.2)+''.join('<path d="M%d %d H%d" stroke="#5b7099"/>'%(c+22,y,c+28) for y in range(134,196,12)))
    o.append('<circle cx="%d" cy="168" r="3" fill="#34d399"/><circle cx="%d" cy="146" r="3" fill="#34d399"/>'%(c+22,c+22))
    o.append(arcs(c+8,164,2,9,7,0.9,'#34d399'))
    # ④ 통신 : 캔 → 지상 안테나
    c=cx(3)
    o.append(can(c-40,150)); o.append(arcs(c-22,164,3,8,7))
    o.append(lines([(c+34,214,c+34,170),(c+26,214,c+34,170),(c+42,214,c+34,170)],'#94a3b8',1.4)); o.append('<circle cx="%d" cy="166" r="3" fill="#34d399"/>'%(c+34))
    # ⑤ 착륙 : 땅 + 충격
    c=cx(4)
    o.append('<path d="M%d 214 H%d" stroke="#94a3b8" stroke-width="2"/>'%(c-46,c+46))
    o.append(can(c-8,184))
    o.append('<path d="M%d 168 V%d" stroke="#fb7185" stroke-width="1.6"/><path d="M%d 178 L%d 184 L%d 178 Z" fill="#fb7185"/>'%(c,180,c-4,c,c+4))
    o.append(lines([(c-26,212,c-34,206),(c+26,212,c+34,206),(c-20,208,c-26,200),(c+20,208,c+26,200)],'#fb7185',1.3))
    # ⑥ 분석 : 노트북 + 그래프
    c=cx(5)
    o.append('<rect x="%d" y="132" width="76" height="52" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="1.3"/>'%(c-38))
    o.append('<path d="M%d 174 L%d 160 L%d 164 L%d 146 L%d 150" stroke="#38bdf8" stroke-width="1.8" fill="none"/>'%(c-30,c-14,c,c+14,c+26))
    o.append('<path d="M%d 190 H%d" stroke="#94a3b8" stroke-width="4"/>'%(c-46,c+46))
    return ''.join(o)

# ─────────────────────────────────────────────────────────────────────────────
PLACE={'flow':flow}

def fbd():
    """그림 2-1 : 낙하산이 달린 캔위성의 자유물체도 3장면 (중력 mg ↓ · 공기 저항 ↑). viewBox 780×304"""
    cols=[('① 방출 직후 · v ≈ 0','저항 거의 0 → mg 가 훨씬 커서 가속','',38,6),
          ('② 가속하는 중 · v 증가','저항이 자란다 → 알짜힘 ↓ → 가속도 ↓','',38,24),
          ('③ 종단속도 · v = v_t','두 힘이 같다 → 합력 0','가속도 0 → 등속으로 낙하',38,38)]
    o=[]
    for i,(t,c1,c2,fg,fd) in enumerate(cols):
        ox=10+257*i; cx=ox+125
        o.append('<rect x="%d" y="56" width="250" height="200" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>'%ox)
        o.append('<text x="%d" y="78" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">%s</text>'%(cx,t))
        o.append(chute(cx,140,34)); o.append(lines([(cx-34,140,cx,170),(cx+34,140,cx,170),(cx-15,132,cx,170),(cx+15,132,cx,170)],'#94a3b8',1))
        o.append(can(cx-9,170,18,30))
        y0=200
        o.append('<path d="M%d %d V%d" stroke="#fb7185" stroke-width="2.4"/><path d="M%d %d L%d %d L%d %d Z" fill="#fb7185"/>'%(cx,y0,y0+fg,cx-5,y0+fg-1,cx,y0+fg+8,cx+5,y0+fg-1))
        o.append('<text x="%d" y="%d" fill="#fb7185" font-size="12" font-weight="700">mg</text>'%(cx+9,y0+fg-2))
        xa=cx+54; yb=152
        o.append('<path d="M%d %d V%d" stroke="#38bdf8" stroke-width="2.4"/><path d="M%d %d L%d %d L%d %d Z" fill="#38bdf8"/>'%(xa,yb,yb-fd,xa-5,yb-fd+1,xa,yb-fd-8,xa+5,yb-fd+1))
        o.append('<text x="%d" y="%d" fill="#38bdf8" font-size="12" font-weight="700">F공기</text>'%(xa+8,yb-fd+4))
        o.append('<text x="%d" y="276" fill="#9db0cc" font-size="11" text-anchor="middle">%s</text>'%(cx,c1))
        if c2: o.append('<text x="%d" y="292" fill="#9db0cc" font-size="11" text-anchor="middle">%s</text>'%(cx,c2))
    return ''.join(o)

PLACE.update({'fbd':fbd})

def atmo():
    """그림 3-1 : 고도에 따른 기압·기온 — 공기 기둥과 센서. viewBox 780×300"""
    o=[]
    # 왼쪽 : 높이 눈금과 공기 기둥(점 밀도)
    o.append('<rect x="30" y="40" width="200" height="226" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="130" y="60" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">① 공기 기둥의 무게</text>')
    import random
    r=random.Random(7)
    for k in range(190):
        y=76+r.random()*170
        dens=0.10+0.90*((y-76)/170)**2       # 아래쪽일수록 촘촘
        if r.random()<dens: o.append('<circle cx="%.1f" cy="%.1f" r="1.5" fill="#7dd3fc" opacity=".75"/>'%(46+r.random()*168,y))
    o.append('<path d="M46 250 H214" stroke="#94a3b8" stroke-width="2"/>')
    o.append('<text x="130" y="262" fill="#9db0cc" font-size="10.5" text-anchor="middle">지표 · 위의 공기가 많다 = 기압 큼</text>')
    # 가운데 : P(h) 곡선
    o.append('<rect x="250" y="40" width="250" height="226" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="375" y="60" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">② 기압은 지수로 줄어든다</text>')
    o.append('<path d="M290 242 H480 M290 242 V80" stroke="#5b7099" stroke-width="1.2"/>')
    o.append('<path d="M292 96 C330 130 370 176 410 204 C440 222 462 232 478 237" stroke="#38bdf8" stroke-width="2.2" fill="none"/>')
    o.append('<path d="M290 150 H340 V242 M290 190 H398 V242" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 3" fill="none"/>')
    o.append('<text x="298" y="144" fill="#a78bfa" font-size="10.5">½</text><text x="298" y="184" fill="#a78bfa" font-size="10.5">¼</text>')
    o.append('<text x="340" y="256" fill="#a78bfa" font-size="10.5" text-anchor="middle">5.5 km</text><text x="402" y="256" fill="#a78bfa" font-size="10.5" text-anchor="middle">약 11 km</text>')
    o.append('<text x="482" y="256" fill="#9db0cc" font-size="10.5" text-anchor="end">높이 h →</text>')
    o.append('<text x="276" y="92" fill="#9db0cc" font-size="10.5" text-anchor="end">P</text>')
    # 오른쪽 : 센서 · 기압 고도계
    o.append('<rect x="520" y="40" width="240" height="226" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="640" y="60" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">③ 센서로 높이를 잰다</text>')
    o.append('<rect x="560" y="96" width="60" height="44" rx="5" fill="#475569" stroke="#94a3b8" stroke-width="1.3"/><circle cx="590" cy="118" r="8" fill="#0f172a" stroke="#34d399" stroke-width="1.4"/>')
    o.append('<text x="590" y="156" fill="#9db0cc" font-size="10.5" text-anchor="middle">기압 센서</text>')
    o.append('<path d="M620 118 H660" stroke="#94a3b8" stroke-width="1.4"/><rect x="660" y="100" width="84" height="36" rx="5" fill="#0f172a" stroke="#94a3b8"/>')
    o.append('<text x="702" y="123" fill="#fbbf24" font-size="13" text-anchor="middle" font-family="monospace">h = 312 m</text>')
    o.append('<text x="640" y="196" fill="#9db0cc" font-size="11" text-anchor="middle">h = 44330 ·</text>')
    o.append('<text x="640" y="214" fill="#9db0cc" font-size="11" text-anchor="middle">[1 − (P/P₀)^0.19]</text>')
    o.append('<text x="640" y="244" fill="#fb7185" font-size="10.5" text-anchor="middle">P₀ = 방출 직전 지상 기압!</text>')
    return ''.join(o)

PLACE.update({'atmo':atmo})

def guide():
    """그림 4-1 : ① 활공비 삼각형 ② 속도 합성(위에서) ③ GPS 조향 루프. viewBox 780×300"""
    o=[]
    # ① 활공비 삼각형
    o.append('<rect x="10" y="44" width="250" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="135" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">① 활공비 L/D</text>')
    o.append('<path d="M50 100 L50 230 L210 230 Z" fill="rgba(56,189,248,.05)" stroke="#5b7099" stroke-width="1.3"/>')
    o.append('<path d="M50 100 L210 230" stroke="#fbbf24" stroke-width="2.2" stroke-dasharray="5 3"/>')
    o.append(can(42,92,16,0) if False else '<circle cx="50" cy="100" r="5" fill="#fbbf24"/>')
    o.append('<text x="40" y="170" fill="#a78bfa" font-size="12" font-weight="700" text-anchor="end">h</text>')
    o.append('<text x="130" y="248" fill="#a78bfa" font-size="12" font-weight="700" text-anchor="middle">수평 거리 = (L/D)·h</text>')
    o.append('<text x="150" y="150" fill="#fbbf24" font-size="11.5" transform="rotate(39 150 150)" text-anchor="middle">활공 경로</text>')
    o.append('<text x="135" y="268" fill="#9db0cc" font-size="11" text-anchor="middle">L/D = 3 이면 100 m 에서 300 m 까지</text>')
    # ② 속도 합성
    o.append('<rect x="270" y="44" width="250" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="395" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">② 속도의 합성 (위에서 본 그림)</text>')
    ox,oy=310,220
    def arrow(x1,y1,x2,y2,col,w=2.4):
        import math
        dx,dy=x2-x1,y2-y1; L=math.hypot(dx,dy); ux,uy=dx/L,dy/L
        return '<path d="M%g %g L%g %g" stroke="%s" stroke-width="%g"/><path d="M%g %g L%g %g L%g %g Z" fill="%s"/>'%(x1,y1,x2,y2,col,w,x2,y2,x2-ux*9-uy*4.5,y2-uy*9+ux*4.5,x2-ux*9+uy*4.5,y2-uy*9-ux*4.5,col)
    o.append(arrow(ox,oy,ox+80,oy-70,'#38bdf8'))          # u : 공기에 대한 속도
    o.append(arrow(ox+80,oy-70,ox+80+90,oy-70,'#fbbf24'))   # 바람
    o.append(arrow(ox,oy,ox+170,oy-70,'#34d399',3))         # 지상속도
    o.append('<path d="M%d %d L%d %d" stroke="#5b7099" stroke-dasharray="3 3"/>'%(ox,oy,ox+90,oy))
    o.append('<text x="%d" y="%d" fill="#38bdf8" font-size="11.5" font-weight="700" text-anchor="end">u : 내가 조향하는 속도</text>'%(ox+66,oy-84))
    o.append('<text x="%d" y="%d" fill="#fbbf24" font-size="11.5" font-weight="700" text-anchor="middle">w (바람)</text>'%(ox+126,oy-80))
    o.append('<text x="%d" y="%d" fill="#34d399" font-size="11.5" font-weight="700" text-anchor="middle">v = u + w (땅에 대한 속도)</text>'%(ox+95,oy+22))
    o.append('<text x="395" y="268" fill="#9db0cc" font-size="11" text-anchor="middle">바람이 u 보다 세면 맞바람 쪽으로는 못 간다</text>')
    # ③ 조향 루프
    o.append('<rect x="530" y="44" width="240" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="650" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">③ GPS 조향 루프</text>')
    labs=['GPS 위치 수신 (1 Hz)','목표 방위 θ목표 계산','오차 = θ목표 − θ현재','서보로 줄 당김 → 선회']
    for i,t in enumerate(labs):
        y=82+i*46
        o.append('<rect x="550" y="%d" width="200" height="30" rx="6" %s/>'%(y,DEV))
        o.append('<text x="650" y="%d" fill="#e6edf7" font-size="12" text-anchor="middle">%s</text>'%(y+19,t))
        if i<3: o.append('<path d="M650 %d V%d" stroke="#fbbf24" stroke-width="1.6"/><path d="M646 %d L650 %d L654 %d Z" fill="#fbbf24"/>'%(y+30,y+46,y+40,y+46,y+40))
    o.append('<text x="650" y="268" fill="#9db0cc" font-size="11" text-anchor="middle">1 초마다 되풀이 (피드백 제어)</text>')
    return ''.join(o)

PLACE.update({'guide':guide})

def link():
    """그림 5-1 : 통신 링크 — 캔위성 → 지상국, 링크 버짓 막대. viewBox 780×290"""
    o=[]
    o.append('<rect x="10" y="44" width="760" height="150" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    # 캔위성 + 안테나
    o.append(can(60,92,20,38))
    o.append('<path d="M70 92 V72" stroke="#94a3b8" stroke-width="2"/><circle cx="70" cy="70" r="3" fill="#fbbf24"/>')
    o.append('<text x="70" y="156" fill="#cfe0f5" font-size="12" font-weight="700" text-anchor="middle">① 송신 (TX)</text><text x="70" y="172" fill="#9db0cc" font-size="10.5" text-anchor="middle">14 dBm · 안테나</text>')
    # 전파
    for i,(r,a) in enumerate([(24,.9),(46,.7),(68,.5),(90,.35),(112,.25)]):
        x=110+i*70
        o.append('<path d="M%d %d A%d %d 0 0 1 %d %d" stroke="#7dd3fc" stroke-width="1.6" fill="none" opacity="%g"/>'%(x,110-r*0.3-6,r*0.3+14,r*0.3+14,x,110+r*0.3+6,a))
    o.append('<path d="M104 110 H640" stroke="#5b7099" stroke-width="1" stroke-dasharray="3 4"/>')
    o.append('<text x="372" y="66" fill="#a78bfa" font-size="12" font-weight="700" text-anchor="middle">② 경로 손실 PL(d) = PL(1 m) + 10·n·log₁₀ d</text>')
    o.append('<text x="372" y="168" fill="#9db0cc" font-size="10.5" text-anchor="middle">거리가 2 배면 −6 dB(세기 ¼) · 숲 · 건물이 있으면 n 이 커진다</text>')
    # 지상국
    o.append('<path d="M700 160 V104" stroke="#94a3b8" stroke-width="2.4"/><path d="M684 104 H716 M690 96 H710 M696 88 H704" stroke="#94a3b8" stroke-width="2"/>')
    o.append('<rect x="684" y="160" width="32" height="14" rx="3" %s/>'%DEV)
    o.append('<text x="700" y="188" fill="#cfe0f5" font-size="12" font-weight="700" text-anchor="middle">③ 수신 (RX)</text>')
    o.append('<text x="632" y="122" fill="#34d399" font-size="11" text-anchor="middle">−71 dBm</text>')
    # 링크 버짓 막대(아래)
    o.append('<rect x="10" y="204" width="760" height="76" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="26" y="224" fill="#cfe0f5" font-size="12.5" font-weight="700">링크 버짓(dB 로 더하고 빼기) :</text>')
    segs=[('송신 +14',90,'#38bdf8'),('− 경로 손실 −85',170,'#fb7185'),('= 수신 −71 dBm',140,'#fbbf24'),('수신 감도 −100 → 여유 29 dB',250,'#34d399')]
    x=26
    for t,wd,c in segs:
        o.append('<rect x="%d" y="236" width="%d" height="30" rx="5" fill="%s" opacity=".22" stroke="%s" stroke-width="1.2"/>'%(x,wd,c,c))
        o.append('<text x="%d" y="256" fill="#e6edf7" font-size="11.5" text-anchor="middle">%s</text>'%(x+wd//2,t))
        x+=wd+8
    return ''.join(o)

PLACE.update({'link':link})

def power():
    """그림 6-1 : ① 충격 = 멈추는 거리 ② 전력 예산 ③ 안전. viewBox 780×300"""
    o=[]
    # ① 충격
    o.append('<rect x="10" y="44" width="250" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="135" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">① 충격 = 멈추는 거리</text>')
    o.append(can(118,92,34,56))
    o.append('<path d="M135 150 V176" stroke="#38bdf8" stroke-width="2.4"/><path d="M130 170 L135 180 L140 170 Z" fill="#38bdf8"/><text x="148" y="170" fill="#38bdf8" font-size="12" font-weight="700">v</text>')
    o.append('<path d="M60 238 H210" stroke="#94a3b8" stroke-width="2.4"/>')
    o.append('<rect x="80" y="192" width="110" height="46" rx="4" fill="rgba(251,191,36,.20)" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="4 3"/>')
    o.append('<text x="135" y="220" fill="#fbbf24" font-size="11" text-anchor="middle">완충재(스펀지)</text>')
    o.append('<path d="M70 192 V238 M66 194 L70 188 L74 194 M66 236 L70 242 L74 236" stroke="#a78bfa" stroke-width="1.2" fill="none"/><text x="62" y="219" fill="#a78bfa" font-size="12" font-weight="700" text-anchor="end">d</text>')
    o.append('<text x="135" y="262" fill="#9db0cc" font-size="11" text-anchor="middle">a = v² / (2d) → d 가 2 배면 a 는 ½</text>')
    # ② 전력 예산
    o.append('<rect x="270" y="44" width="250" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="395" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">② 전력 예산 (평균 전류)</text>')
    loads=[('카메라',150,'#a78bfa'),('컨트롤러',80,'#38bdf8'),('서보',60,'#fb7185'),('LoRa',25,'#fbbf24'),('GPS',25,'#34d399'),('센서',5,'#7dd3fc')]
    for i,(nm,ma,c) in enumerate(loads):
        y=82+i*26
        o.append('<text x="288" y="%d" fill="#cfe0f5" font-size="11.5">%s</text>'%(y+13,nm))
        o.append('<rect x="352" y="%d" width="%.1f" height="16" rx="3" fill="%s" opacity=".55"/>'%(y,ma*0.7,c))
        o.append('<text x="%.1f" y="%d" fill="#e6edf7" font-size="11">%d mA</text>'%(352+ma*0.7+4,y+12,ma))
    o.append('<text x="395" y="252" fill="#9db0cc" font-size="11" text-anchor="middle">합 345 mA → 1000 mAh 로 약 2.3 시간</text>')
    o.append('<text x="395" y="268" fill="#9db0cc" font-size="11" text-anchor="middle">(0.8 × 용량 ÷ 평균 전류)</text>')
    # ③ 안전
    o.append('<rect x="530" y="44" width="240" height="236" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>')
    o.append('<text x="650" y="66" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">③ 안전 수칙</text>')
    rules=['리튬 전지: 보호회로 · 단락 금지','충격받은 · 부푼 전지는 폐기','낙하 시험은 사람 · 차량 없는 곳','로켓 · 풍선 · 드론은 규정 · 허가','전파 출력 · 주파수는 법 안에서']
    for i,t in enumerate(rules):
        y=92+i*34
        o.append('<circle cx="548" cy="%d" r="7" fill="rgba(52,211,153,.18)" stroke="#34d399"/><text x="548" y="%d" fill="#34d399" font-size="10" text-anchor="middle">✓</text>'%(y-4,y-1))
        o.append('<text x="564" y="%d" fill="#cfe0f5" font-size="11.5">%s</text>'%(y,t))
    return ''.join(o)

PLACE.update({'power':power})

def workflow(kind):
    """공방 안내 도해 : 6단계 흐름 (kind = RE · CR · IN). viewBox 780×262"""
    W={'RE':[('① 질문','🎯','측정할 수 있는 한 문장'),('② 선행 연구','📚','이미 아는 것 · 모르는 것'),('③ 예측','🔮','모의실험으로 먼저 예측'),
             ('④ 실험','🧪','3 회 이상 반복'),('⑤ 분석','📈','그래프 · 오차 · 통계'),('⑥ 발표','🎤','소논문 · 포스터')],
       'CR':[('① 영감','👀','관찰 · 자연 · 이야기'),('② 스케치','✏️','아이디어를 그림으로'),('③ 시제품','🛠','가장 작은 것부터'),
             ('④ 시험','🪂','떨어뜨려 보기'),('⑤ 전시','🖼','보여 주기 · 공연'),('⑥ 성찰','💬','무엇이 달랐나')],
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
