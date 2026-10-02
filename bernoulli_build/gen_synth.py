# -*- coding: utf-8 -*-
def tab(n, title, badge, goal, org_t, org, bridge, poe, ctrls, kv, note, hints, cap1, cap2, formula, steps, rec_title, easy):
    pre='k%d'%n
    ctr=''.join('''        <div class="ctrl">
          <div class="ctrl-top"><span class="nm">%s</span><span class="vl" id="%s-%sV">—</span></div>
          <input type="range" id="%s-%s" min="%s" max="%s" step="%s" value="%s" aria-label="%s">
        </div>
'''%(c[1],pre,c[0],pre,c[0],c[2],c[3],c[4],c[5],c[1]) for c in ctrls)
    kvh=''.join('<div class="cell %s"><span class="k">%s</span><span class="v" id="%s-%s">—</span></div>'%(k[2],k[1],pre,k[0]) for k in kv)
    st=''.join('<div class="step">%s</div>'%s for s in steps for s in [s])
    return '''<section class="panel" id="tab%d" role="tabpanel" aria-labelledby="tabbtn%d" tabindex="0">
  <div class="card">
    <div class="h3"><span class="badge b-high">고등/수능</span><span class="badge b-exp">실험</span><span class="badge b-poe">POE</span>%s</div>
    <div class="goal">%s</div>
    <div class="organizer">
      <div class="ot">%s</div>
      %s
      <div class="bridge">%s</div>
    </div>
    %s
    <div id="%s-misc"></div>
  </div>
  <div class="grid2">
    <div>
      <div class="card">
        <div class="h3">🎛 가상 실험실 — 조건을 정하고 [측정 기록]</div>
%s        <div class="row">
          <button type="button" class="btn sm" id="%s-new">🎲 새 조건(숨은 값 다시 뽑기)</button>
          <button type="button" class="btn sm pri" id="%s-rec">📏 측정 기록</button>
          <button type="button" class="btn sm" id="%s-rec10">📏×5 연속 기록</button>
          <button type="button" class="btn sm rd" id="%s-clr">🧹 측정 초기화</button>
        </div>
        <div class="kv">%s</div>
        <p class="tiny">%s</p>
      </div>
      <div class="card">
        <div class="h4">📋 %s <span class="tiny" id="%s-cnt">0개</span></div>
        <div class="tblscroll"><table id="%s-tbl"><thead></thead><tbody></tbody></table></div>
        <p class="tiny">기록한 값은 <b>실험보고서(19번 탭)</b>의 표 · 그래프 · 결과로 자동으로 이어집니다. 5개 이상 모으세요.</p>
      </div>
      <div class="hintbox" data-hints="%s"></div>
    </div>
    <div>
      <div class="card tight">
        <div class="cv-wrap">
          <div class="cv-tools"><button type="button" class="btn sm fsb" data-fsx="%s" title="전체화면으로 보기 (수업용)">⛶ 전체화면</button><button type="button" class="btn sm" data-png="%s-cv" data-pngname="bernoulli-synth-%d">🖼 PNG</button></div>
          <canvas id="%s-cv" role="img" aria-label="가상 실험 장면" style="height:300px"></canvas>
          <div class="cv-cap">%s</div>
        </div>
        <div id="%s-time"></div>
        <div class="cv-wrap" style="margin-top:9px">
          <canvas id="%s-cv2" role="img" aria-label="측정 결과 그래프" style="height:320px"></canvas>
          <div class="cv-cap">%s</div>
        </div>
      </div>
      <div class="card lv-high">
        <div class="h4">📐 식으로 정리하기 <span class="badge b-high">고등</span></div>
        %s
      </div>
    </div>
  </div>
  <div class="card">
    <div class="h4">🧪 이 실험을 진짜로 하려면</div>
    <div class="steps">%s</div>
    %s
  </div>
</section>
'''%(n,n,title,goal,org_t,org,bridge,poe,pre,ctr,pre,pre,pre,pre,kvh,note,rec_title,pre,pre,hints,pre,pre,n,pre,cap1,pre,pre,cap2,formula,st,easy)

def poe(q,opts,ans,exp): return '<div class="poe" data-q="%s"\n         data-opts="%s"\n         data-ans="%d"\n         data-exp="%s"></div>'%(q,'||'.join(opts),ans,exp)
def br(items): return '<span class="ar">→</span>'.join('<span class="st%s">%s</span>'%(' new' if i==len(items)-1 else '',t) for i,t in enumerate(items))

out={}
# ───── 15 : 동압 대 속력² (피토관)
out[15]=tab(15,'📊 [종합1] 동압 대 속력 — 피토관으로 재는 풍속과 공기 밀도','',
 '🎯 이 실험에서 하는 것 — 선풍기 바람 속 피토관의 압력 차이 $\\Delta p$ (U자관 · 센서)를 풍속 $v$ (기준 풍속계)별로 재어 $\\Delta p$ 대 $v^2$ 그래프를 그립니다. 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $\\rho/2$</b> 입니다. 기울기에서 <b>숨은 공기 밀도 $\\rho$</b> (온도 · 고도에 따라 다름)를 구하세요. 결과는 <b>실험보고서의 실험 A</b>가 됩니다. (저속 바람 · 저압만 쓰는 안전한 실험)',
 '🧭 선행조직자 — 속력의 제곱에 비례하는 압력','흐름을 마주 보는 구멍(전압)과 옆 구멍(정압)의 차이는 동압 $\\Delta p=\\tfrac12\\rho v^2$ 입니다. 그래서 $\\Delta p$ 를 세로로, $v^2$ 를 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기 하나가 공기 밀도의 절반입니다. 속력이 2 배면 압력 차이는 4 배 — 낮은 풍속일수록 압력 변화가 작아 측정이 어렵습니다.',
 br(['$\\Delta p=\\tfrac12\\rho v^2$','$\\Delta p$ 대 $v^2$ 직선','기울기 = $\\rho/2$','$\\rho=2\\times$기울기']),
 poe('풍속이 6 m/s 에서 18 m/s 로 3 배가 되었다. 피토관의 압력 차이는 몇 배가 될까?',['3 배','6 배','9 배','27 배'],2,'$\\Delta p\\propto v^2$ 이므로 $3^2=9$ 배입니다. 6 m/s 에서 약 22 Pa 이던 압력 차이가 18 m/s 에서 약 195 Pa 가 됩니다. 오른쪽 직선 그래프로 확인하세요.'),
 [('x','풍속 v',2,40,1,12),('S','압력 측정 잡음 σ',0,10,0.5,2)],
 [('oP','이론 동압','a'),('oM','측정 Δp','g'),('oF','추정 공기 밀도','v2'),('oE','표준 밀도(1.204) 대비','r'),('oN','기록 개수','')],
 '모형 : $\\Delta p=\\tfrac12\\rho v^2+\\varepsilon$ (압력 잡음 σ Pa). 숨은 공기 밀도 $\\rho$ 는 [새 조건]마다 0.90 ~ 1.25 kg/m³ 에서 뽑힙니다(온도 · 고도 · 습도). 피토관 정렬 · 점성 · 압축성은 무시한 교육용 모형입니다.',
 '① 풍속을 2 ~ 40 m/s 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 $v^2$ 입니다).||② 압력 잡음 σ 를 크게 하면 낮은 풍속 점이 얼마나 흩어지나요? 왜 그럴까요?||③ 기울기에서 밀도를 직접 구해 오른쪽 결과와 맞춰 보세요.||④ 공기 밀도가 낮은 고지대에서는 같은 풍속에서 압력 차이가 어떻게 달라질까요?',
 '선풍기 바람(왼쪽)이 피토관(가운데)에 들어가 U자관 수주(오른쪽)의 높이차가 생깁니다(10 초 반복).',
 '📊 가로 풍속의 제곱 $v^2$ · 세로 압력 차이 $\\Delta p$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $\\rho/2$.',
 '<p>$\\Delta p=\\tfrac12\\rho v^2$ → 기울기 $s=\\rho/2$, $\\rho=2s$. 예 : $s=0.60$ Pa·s²/m² → $\\rho=1.20$ kg/m³. 오차 : $\\delta s\\approx\\sigma/\\sqrt{\\sum v_i^4}$ — 풍속이 큰 점이 기울기를 정확하게 정합니다.</p><p class="lv-uni">교과서 밖 : 항공기 속도계는 같은 동압에서 해수면 밀도로 환산한 지시 속도(IAS)를 쓰고 실제 속도(TAS)는 $v_{TAS}=v_{IAS}\\sqrt{\\rho_0/\\rho}$ 입니다. 마하 0.3 이상에서는 압축성 보정 $q_c\\approx\\tfrac12\\rho v^2(1+M^2/4)$ 가 필요합니다.</p>',
 ['<b>준비</b> : 저속 선풍기, 빨대 피토관, 투명 호스 U자관(물 + 색소), 풍속계 앱(R01 참고).','<b>측정</b> : 풍속 단계 6 가지에서 U자관 수주 높이차 Δh(mm)를 3 회씩 읽고 $\\Delta p=\\rho_wg\\Delta h$ 로 환산한다.','<b>그래프</b> : $\\Delta p$ 대 $v^2$ 를 그려 원점 통과 직선의 기울기를 구한다(14번 탭 코드).','<b>해석</b> : 밀도 $\\rho=2\\times$기울기를 구해 온도 · 고도로 예상한 값과 비교한다.','<b>결론</b> : 정렬 · 눈금 읽기 · 풍속계 오차를 서술하고 낮은 풍속의 한계를 말한다.'],
 '측정 기록표','')
# ───── 16 : 벤투리 압력 강하 (r²−1)
out[16]=tab(16,'📊 [종합2] 벤투리 압력 강하 — 면적비와 손실 계수','',
 '🎯 이 실험에서 하는 것 — 벤투리 관의 면적비 $r=A_1/A_2$ 를 바꾸며 입구와 목의 압력 강하 $\\Delta p$ 를 재서 $\\Delta p$ 대 $(r^2-1)$ 그래프를 그립니다. 입구 속력 $v_1=0.3$ m/s 로 고정하면 이론 기울기는 $\\tfrac12\\rho v_1^2=45$ Pa 입니다. 실제 기울기는 <b>손실 계수 $C^2$</b> 만큼 작습니다. 이 손실 계수를 구하세요. 결과는 <b>보고서의 실험 C</b>가 됩니다. (물 · 낮은 속도의 안전한 실험)',
 '🧭 선행조직자 — 연속 방정식 + 베르누이','목에서 속력이 $v_2=rv_1$ 이므로 $\\Delta p=\\tfrac12\\rho(v_2^2-v_1^2)=\\tfrac12\\rho v_1^2(r^2-1)$. 그래서 $\\Delta p$ 를 $(r^2-1)$ 에 대해 그리면 <b>원점을 지나는 직선</b>이고 기울기가 $\\tfrac12\\rho v_1^2\\times C^2$ (손실 포함) 입니다.',
 br(['$v_2=rv_1$','$\\Delta p=\\tfrac12\\rho v_1^2(r^2-1)$','$\\Delta p$ 대 $(r^2-1)$','기울기 = $45\\,C^2$']),
 poe('면적비가 2 에서 4 로 커지면 압력 강하는 몇 배가 될까? (입구 속력 같음)',['2 배','4 배','5 배','16 배'],2,'$\\Delta p\\propto r^2-1$ 이므로 $(16-1)/(4-1)=5$ 배입니다. 면적비 자체는 2 배인데 압력 강하는 5 배 — 속력의 제곱이 작용하기 때문입니다. 오른쪽 직선으로 확인하세요.'),
 [('r','면적비 r = A₁/A₂',1.5,6,0.5,3),('S','압력 측정 잡음 σ',0,15,0.5,3)],
 [('oT','이론 Δp(손실 없음)','a'),('oM','측정 Δp','g'),('oF','추정 기울기','v2'),('oE','추정 손실 계수 C²','r'),('oN','기록 개수','')],
 '모형 : $\\Delta p=C^2\\cdot45\\,(r^2-1)+\\varepsilon$ (Pa, 입구 속력 0.3 m/s · 물 1000 kg/m³). 숨은 손실 계수 $C^2$ 는 [새 조건]마다 0.85 ~ 0.99 에서 뽑힙니다. 점성 · 기포 · 입구 효과는 단순화한 교육용 모형입니다.',
 '① 면적비를 1.5 ~ 6 으로 넓게 바꾸며 [측정 기록] 하세요.||② 기울기가 45 보다 얼마나 작은가요? 그 비율이 손실 계수 $C^2$ 입니다.||③ 입구 속력이 2 배(0.6 m/s)면 기울기는 몇 배가 될까요?||④ 압력 강하가 너무 커 목의 압력이 0 에 가까워지면 어떤 일이 생길까요(캐비테이션)?',
 '물이 벤투리 관(가운데)을 지나며 목에서 빨라지고 입구 · 목의 압력 관 수위가 달라집니다(10 초 반복).',
 '📊 가로 $r^2-1$ · 세로 압력 강하 $\\Delta p$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 $=45C^2$.',
 '<p>$\\Delta p=\\tfrac12\\rho v_1^2(r^2-1)\\,C^2$ → 기울기 $s=45C^2$ Pa, $C^2=s/45$. 예 : $s=42$ → $C^2=0.93$ (손실 약 7 %).</p><p class="lv-uni">교과서 밖 : 벤투리 유량계의 유출 계수 $C_d=0.95\\sim0.99$ 는 레이놀즈 수 · 목 지름비 $\\beta$ 에 따라 달라지며 ISO 5167 이 설계 규격을 정합니다. 영구 압력 손실은 확산부 각도(약 7°)가 작을수록 줄어듭니다.</p>',
 ['<b>준비</b> : 투명 호스(2 cm), 면적비가 다른 목 부품, 투명 빨대 압력 관, 물통 · 메스실린더 · 스톱워치(R02 참고).','<b>측정</b> : 유량을 일정(입구 속력 약 0.3 m/s)하게 하고 면적비별로 입구 · 목 수위 차 Δh(cm)를 3 회씩 읽는다.','<b>그래프</b> : $\\Delta p=\\rho g\\Delta h$ 를 $(r^2-1)$ 에 대해 그려 기울기를 구한다.','<b>해석</b> : 이론 기울기 $\\tfrac12\\rho v_1^2$ 와 비교해 손실 계수를 구한다.','<b>결론</b> : 기포 · 점성 · 입구 모서리 효과와 안전(물 · 바닥)을 서술한다.'],
 '측정 기록표','')
# ───── 17 : 양력 대 동압×면적 (C_L)
out[17]=tab(17,'📊 [종합3] 양력 대 속력 — 날개의 양력 계수 C_L','',
 '🎯 이 실험에서 하는 것 — 날개 모형의 받음각을 고정(약 6°)하고 풍속 $v$ 를 바꾸며 양력 $L$ (저울 읽음 감소 × g)을 재서 $L$ 대 $\\tfrac12\\rho v^2S$ 그래프를 그립니다. 날개 면적 $S=0.03$ m² 를 알면 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = 양력 계수 $C_L$</b> 입니다. 숨은 $C_L$ 을 구하세요. 결과는 <b>보고서의 실험 D</b>가 됩니다. (저속 선풍기 · 저울만 쓰는 안전한 실험)',
 '🧭 선행조직자 — 양력 = 동압 × 면적 × 계수','양력은 $L=\\tfrac12\\rho v^2\\,S\\,C_L$ 입니다. 그래서 가로축을 <b>동압 × 면적</b>($=\\tfrac12\\rho v^2S$, 단위 N)으로 하면 기울기 하나가 날개의 양력 계수 $C_L$ 입니다. 같은 받음각이면 속력이 바뀌어도 기울기(= $C_L$)는 같아야 합니다.',
 br(['$L=\\tfrac12\\rho v^2SC_L$','$L$ 대 $\\tfrac12\\rho v^2S$','기울기 = $C_L$','받음각이 바뀌면 $C_L$ 이 바뀐다']),
 poe('같은 날개가 풍속 6 m/s 에서 양력 0.4 N 이었다. 풍속이 12 m/s 로 2 배가 되면 양력은? (받음각 같음)',['0.8 N','1.2 N','1.6 N','3.2 N'],2,'$L\\propto v^2$ 이므로 4 배, 즉 <b>1.6 N</b> 입니다. $C_L$ 은 받음각이 같으면 거의 일정하므로 속력이 2 배면 양력은 4 배가 됩니다. 오른쪽 직선으로 확인하세요.'),
 [('v','풍속 v',4,16,0.5,10),('S','저울 잡음 σ (g중)',0,2,0.1,0.3)],
 [('oX','동압 × 면적','a'),('oM','측정 양력 L','g'),('oF','추정 양력 계수 C_L','v2'),('oE','양력 / 무게 비교(날개 30 g)','r'),('oN','기록 개수','')],
 '모형 : $L=C_L\\cdot\\tfrac12\\rho v^2S+\\varepsilon$ ($S=0.03$ m², $\\rho=1.204$, 받음각 약 6° 고정, 저울 잡음 σ g중). 숨은 $C_L$ 은 [새 조건]마다 0.5 ~ 1.0 에서 뽑힙니다. 날개 끝 효과 · 표면 · 지지대 항력은 무시한 교육용 모형입니다.',
 '① 풍속을 4 ~ 16 m/s 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 동압 × 면적).||② 점이 원점을 지나는 직선인가요? 기울기는 얼마인가요?||③ 받음각을 크게 하면 기울기(C_L)는 어떻게 될까요? (R04 참고)||④ 저울 잡음이 크면 낮은 풍속의 점이 어떻게 흩어지나요?',
 '선풍기 바람(왼쪽)이 날개 모형(가운데)에 닿아 위로 향한 양력이 저울(오른쪽) 읽음을 줄입니다(10 초 반복).',
 '📊 가로 $\\tfrac12\\rho v^2S$ (N) · 세로 양력 $L$ (N). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $C_L$.',
 '<p>$L=C_L\\cdot\\tfrac12\\rho v^2S$ → 기울기 $s=C_L$. 예 : $s=0.78$ → 받음각 약 6° 의 $C_L\\approx0.78$. 이륙 속력 : $v=\\sqrt{2W/(\\rho SC_L)}$.</p><p class="lv-uni">교과서 밖 : 낮은 레이놀즈 수(작은 모형)에서는 $C_L$ 이 실제 항공기 날개와 다르며 레이놀즈 수 · 표면 거칠기에 의존합니다. 유한 날개의 유도 항력 $C_{D,i}=C_L^2/(\\pi eAR)$ 도 풍동 시험에서 함께 확인합니다.</p>',
 ['<b>준비</b> : 날개 모형(시위 15 cm · 폭 20 cm), 주방 저울(0.1 g), 지지대, 선풍기, 풍속계 앱(R04 참고).','<b>측정</b> : 받음각 6° 로 고정하고 풍속 6 가지에서 저울 읽음 감소(g)를 5 초 평균으로 기록한다.','<b>그래프</b> : $L=m g$ 대 $\\tfrac12\\rho v^2S$ 를 그려 기울기 $C_L$ 을 구한다.','<b>해석</b> : 받음각별 $C_L$ 곡선과 비교해 실속각을 추정한다.','<b>결론</b> : 지지대 항력 · 바람의 균일도 · 저울 영점 오차를 서술한다.'],
 '측정 기록표','')
for n in out:
    open('parts/t%d.html'%n,'w',encoding='utf-8').write(out[n])
