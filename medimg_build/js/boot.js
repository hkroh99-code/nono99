/* ═══════════════════════════════════════════════════════════════════════════
   ⚠ 구역 D — 부팅 (수정 금지)
   ═══════════════════════════════════════════════════════════════════════════ */
(function boot(){
  buildTabbar();
  buildStepNavs();
  buildPOE();
  buildHints();
  $$('.lv-pill').forEach(function(b){ b.addEventListener('click', function(){ setLevel(b.getAttribute('data-lv')); }); });
  $$('.th-pill').forEach(function(b){ b.addEventListener('click', function(){ applyTheme(b.getAttribute('data-th')); }); });
  applyTheme(Store.get('theme','deep'));
  FSX.bind();
  document.getElementById('btnReset').addEventListener('click', function(){
    Store.clear(); location.hash=''; location.reload();
  });
  // ★ 오개념 교정 박스 · 학습모형 카드 : 데이터에서 자동 생성
  renderModels('t1-models');
  renderMisc('t1-misc', [7]);
  renderMisc('t2-misc', [1,2]);
  renderMisc('t3-misc', [3,4]);
  renderMisc('t4-misc', [5,6]);
  renderMisc('t5-misc', [7,8]);
  renderMisc('t6-misc', [9]);
  renderMisc('t7-misc', [10]);
  renderMisc('t8-misc', [2]);
  renderMisc('t9-misc', [5]);
  renderMisc('k10-misc', [1]);
  renderMisc('k11-misc', [4]);
  renderMisc('k12-misc', [6]);
  renderMisc('k13-misc', [10]);
  renderMisc('k14-misc', [9]);
  renderMisc('k15-misc', [2]);
  renderMisc('k16-misc', [5]);
  renderMisc('k17-misc', [9]);
  setLevel(Store.get('level','high'));
  var m=/^#tab(\d+)$/.exec(location.hash||'');
  var start = m? +m[1] : Store.get('lastTab',1);
  showTab(clamp(start,1,TABS.length));
  setTimeout(function(){
    if(document.body.scrollWidth > window.innerWidth + 2){
      document.documentElement.style.overflowX='hidden';
      console.warn('가로 스크롤 감지 → 차단 적용');
    }
  }, 600);
  // 주소 끝에 #audit 를 붙여 열면 교육설계 자동 점검표가 콘솔에 출력됩니다
  if(/audit/.test(location.hash)) setTimeout(auditPedagogy, 900);
})();
