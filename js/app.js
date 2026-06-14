/* =========================================================================
 *  app.js — 流程控制：问诊 → 断诊（计分判定）→ 出诊（建议）
 * ========================================================================= */

const PAGE_SIZE = 6;                 // 每页题数
let answers = new Array(QUESTIONS.length).fill(0);
let currentPage = 0;
let lastResult = null;               // 缓存断诊结果，供出诊使用

/* ---------- 视图切换 ---------- */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 启动 ---------- */
function startConsult() {
  answers = new Array(QUESTIONS.length).fill(0);
  currentPage = 0;
  showView('view-consult');
  renderPage();
}

/* ====================== 问诊：分页渲染问卷 ====================== */
function renderPage() {
  const totalPages = Math.ceil(QUESTIONS.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, QUESTIONS.length);

  const box = document.getElementById('question-box');
  let html = '';
  for (let i = start; i < end; i++) {
    const q = QUESTIONS[i];
    const cName = CONSTITUTIONS.find(c => c.key === q.c).name;
    html += `<div class="question" data-idx="${i}">
      <div class="q-text"><span class="q-num">${i + 1}</span>${q.text}
        <span class="q-tag">${cName}</span></div>
      <div class="q-options">`;
    SCALE_OPTIONS.forEach(opt => {
      const sel = answers[i] === opt.value ? ' selected' : '';
      html += `<button class="opt${sel}" onclick="pick(${i},${opt.value})">
        <span class="opt-v">${opt.value}</span><span class="opt-l">${opt.label}</span></button>`;
    });
    html += `</div></div>`;
  }
  box.innerHTML = html;

  // 进度
  const answered = answers.filter(a => a > 0).length;
  document.getElementById('progress-fill').style.width =
    (answered / QUESTIONS.length * 100) + '%';
  document.getElementById('progress-text').textContent =
    `已答 ${answered} / ${QUESTIONS.length} 题　·　第 ${currentPage + 1} / ${totalPages} 页`;

  document.getElementById('btn-prev').disabled = currentPage === 0;
  const isLast = currentPage === totalPages - 1;
  document.getElementById('btn-next').textContent = isLast ? '提交问卷 · 开始断诊' : '下一页 ›';
  document.getElementById('btn-next').classList.toggle('primary-strong', isLast);
}

function pick(idx, val) {
  answers[idx] = val;
  const qEl = document.querySelector(`.question[data-idx="${idx}"]`);
  qEl.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
  qEl.querySelectorAll('.opt')[val - 1].classList.add('selected');
  const answered = answers.filter(a => a > 0).length;
  document.getElementById('progress-fill').style.width =
    (answered / QUESTIONS.length * 100) + '%';
  document.getElementById('progress-text').textContent =
    `已答 ${answered} / ${QUESTIONS.length} 题　·　第 ${currentPage + 1} / ${Math.ceil(QUESTIONS.length / PAGE_SIZE)} 页`;
}

function nextPage() {
  const totalPages = Math.ceil(QUESTIONS.length / PAGE_SIZE);
  // 校验本页是否答完
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, QUESTIONS.length);
  for (let i = start; i < end; i++) {
    if (answers[i] === 0) {
      const el = document.querySelector(`.question[data-idx="${i}"]`);
      el.classList.add('unanswered');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.classList.remove('unanswered'), 1600);
      return;
    }
  }
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderPage();
  } else {
    diagnose();
  }
}

function prevPage() {
  if (currentPage > 0) { currentPage--; renderPage(); }
}

/* ====================== 断诊：标准转化分算法 ====================== */
// 转化分 = [(原始分 - 条目数) / (条目数 × 4)] × 100
function computeScores() {
  const sums = {}, counts = {};
  CONSTITUTIONS.forEach(c => { sums[c.key] = 0; counts[c.key] = 0; });

  QUESTIONS.forEach((q, i) => {
    let a = answers[i];
    if (q.reverse) a = 6 - a;        // 平和质反向条目
    sums[q.c] += a;
    counts[q.c] += 1;
  });

  const scores = {};
  CONSTITUTIONS.forEach(c => {
    const raw = sums[c.key], n = counts[c.key];
    scores[c.key] = Math.round(((raw - n) / (n * 4)) * 100);
  });
  return scores;
}

// 判定每种体质：偏颇 ≥40 是 / 30~39 倾向是 / <30 否；平和质特殊
function judge(scores) {
  const result = {};
  const others = CONSTITUTIONS.filter(c => c.key !== 'pinghe').map(c => c.key);
  const allOthersBelow = (t) => others.every(k => scores[k] < t);

  // 平和质
  let ph;
  if (scores.pinghe >= 60 && allOthersBelow(30)) ph = '是';
  else if (scores.pinghe >= 60 && allOthersBelow(40)) ph = '基本是';
  else ph = '否';
  result.pinghe = ph;

  // 偏颇体质
  others.forEach(k => {
    const s = scores[k];
    result[k] = s >= 40 ? '是' : (s >= 30 ? '倾向是' : '否');
  });
  return result;
}

function diagnose() {
  const scores = computeScores();
  const verdict = judge(scores);

  // 主体质：偏颇中“是/倾向是”按分数排序；若无则平和
  const biased = CONSTITUTIONS
    .filter(c => c.key !== 'pinghe' && (verdict[c.key] === '是' || verdict[c.key] === '倾向是'))
    .map(c => ({ ...c, score: scores[c.key], verdict: verdict[c.key] }))
    .sort((a, b) => b.score - a.score);

  lastResult = { scores, verdict, biased };
  renderDiagnosis(lastResult);
  showView('view-diagnose');
}

/* ---------- 断诊结果渲染 ---------- */
function renderDiagnosis(res) {
  const { scores, verdict, biased } = res;

  // 主结论
  let mainHtml = '';
  if (biased.length === 0) {
    mainHtml = `<div class="verdict-main pinghe">
      <div class="vm-title">平和质</div>
      <div class="vm-sub">${verdict.pinghe === '否' ? '体质总体平和，未见明显偏颇' : '体质平和 · ' + verdict.pinghe}</div>
      <p class="vm-desc">阴阳气血调和，是最理想的体质状态。重在守护——顺时养生、起居有常即可。</p></div>`;
  } else {
    const top = biased[0];
    const tagText = biased.slice(1).length
      ? '；兼夹 ' + biased.slice(1).map(b => `${b.name}(${b.verdict})`).join('、')
      : '';
    mainHtml = `<div class="verdict-main" style="--vc:${top.color}">
      <div class="vm-title">${top.name}<span class="vm-badge">${top.verdict}</span></div>
      <div class="vm-sub">${top.tag}${tagText}</div>
      <p class="vm-desc">${ADVICE[top.key].summary}</p></div>`;
  }
  document.getElementById('verdict-box').innerHTML = mainHtml;

  // 雷达图
  drawRadar(scores);

  // 各体质得分条
  let bars = '';
  CONSTITUTIONS.forEach(c => {
    const s = scores[c.key];
    const v = verdict[c.key];
    const vc = v === '是' ? 'v-yes' : (v === '倾向是' || v === '基本是' ? 'v-mid' : 'v-no');
    bars += `<div class="score-row">
      <div class="sr-name">${c.name}</div>
      <div class="sr-bar"><div class="sr-fill" style="width:${Math.max(s,2)}%;background:${c.color}"></div></div>
      <div class="sr-val">${s}</div>
      <div class="sr-verdict ${vc}">${v}</div></div>`;
  });
  document.getElementById('score-bars').innerHTML = bars;
}

/* ---------- 雷达图（纯 SVG 手绘，无外部依赖）---------- */
function drawRadar(scores) {
  const n = CONSTITUTIONS.length;
  const cx = 200, cy = 195, R = 140;
  const ang = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / n);
  const pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];

  let svg = `<svg viewBox="0 0 400 400" class="radar">`;
  // 同心网格
  [0.25, 0.5, 0.75, 1].forEach(f => {
    let p = '';
    for (let i = 0; i < n; i++) { const [x, y] = pt(i, R * f); p += `${x.toFixed(1)},${y.toFixed(1)} `; }
    svg += `<polygon points="${p}" class="radar-grid"/>`;
  });
  // 轴线 + 标签
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, R);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-axis"/>`;
    const [lx, ly] = pt(i, R + 24);
    const anchor = Math.abs(lx - cx) < 10 ? 'middle' : (lx > cx ? 'start' : 'end');
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" class="radar-label">${CONSTITUTIONS[i].name}</text>`;
  }
  // 数据多边形（分数封顶 100）
  let dp = '';
  for (let i = 0; i < n; i++) {
    const f = Math.min(Math.max(scores[CONSTITUTIONS[i].key], 0), 100) / 100;
    const [x, y] = pt(i, R * f); dp += `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  svg += `<polygon points="${dp}" class="radar-data"/>`;
  for (let i = 0; i < n; i++) {
    const f = Math.min(Math.max(scores[CONSTITUTIONS[i].key], 0), 100) / 100;
    const [x, y] = pt(i, R * f);
    svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" class="radar-dot"/>`;
  }
  svg += `</svg>`;
  document.getElementById('radar-box').innerHTML = svg;
}

/* ====================== 出诊：建议渲染 ====================== */
function prescribe() {
  if (!lastResult) return;
  const { biased, verdict } = lastResult;
  const keys = biased.length ? biased.map(b => b.key) : ['pinghe'];

  const tabsEl = document.getElementById('rx-tabs');
  const bodyEl = document.getElementById('rx-body');

  // 体质标签页
  tabsEl.innerHTML = keys.map((k, i) => {
    const c = CONSTITUTIONS.find(x => x.key === k);
    return `<button class="rx-tab${i === 0 ? ' active' : ''}" style="--vc:${c.color}"
      onclick="switchRx('${k}',this)">${c.name}</button>`;
  }).join('');

  renderRx(keys[0]);
  showView('view-prescribe');
}

function switchRx(key, btn) {
  document.querySelectorAll('.rx-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRx(key);
}

function renderRx(key) {
  const c = CONSTITUTIONS.find(x => x.key === key);
  const a = ADVICE[key];
  const teaCards = a.tea.map(t => `
    <div class="rx-card">
      <div class="rxc-name">🍵 ${t.name}</div>
      <div class="rxc-items">${t.items}</div>
      <div class="rxc-effect"><b>功效：</b>${t.effect}</div>
      <div class="rxc-usage"><b>用法：</b>${t.usage}</div>
    </div>`).join('');
  const incCards = a.incense.map(t => `
    <div class="rx-card">
      <div class="rxc-name">🪔 ${t.name}</div>
      <div class="rxc-items">${t.items}</div>
      <div class="rxc-effect"><b>功效：</b>${t.effect}</div>
      <div class="rxc-usage"><b>用法：</b>${t.usage}</div>
    </div>`).join('');

  document.getElementById('rx-body').innerHTML = `
    <div class="rx-head" style="--vc:${c.color}">
      <div class="rxh-name">${c.name} · 调养方案</div>
      <div class="rxh-principle"><b>调养原则：</b>${a.principle}</div>
    </div>

    <div class="rx-section"><h3>一、中药茶饮 / 代茶饮</h3><div class="rx-cards">${teaCards}</div></div>
    <div class="rx-section"><h3>二、熏香 / 芳香理疗</h3><div class="rx-cards">${incCards}</div></div>

    <div class="rx-section"><h3>三、食疗 / 药膳</h3>
      <div class="rx-diet">
        <p><b class="good">宜食：</b>${a.diet.good}</p>
        <p><b class="avoid">忌食：</b>${a.diet.avoid}</p>
        <p><b>药膳示例：</b>${a.diet.recipe}</p>
      </div></div>

    <div class="rx-section"><h3>四、起居 / 经络 / 导引</h3>
      <div class="rx-regimen">
        <p><b>作息：</b>${a.regimen.sleep}</p>
        <p><b>经络穴位：</b>${a.regimen.meridian}
          <button class="inline-link no-print" onclick="gotoAcuForConstitution('${key}')">查看穴位图与揉捏手法 →</button></p>
        <p><b>运动导引：</b>${a.regimen.exercise}</p>
      </div></div>

    <div class="rx-disclaim">
      ⚠ 以上为养身调理参考，<b>非医疗诊断与治疗方案</b>。本草用药、艾灸熏香、穴位调理请在中医师等专业人士指导下进行；
      孕妇、慢性病患者、过敏体质及正在服药者使用前务必咨询专业人士；如有持续或加重的不适，请及时就医。
    </div>`;
}

/* ====================== 本草 · 香材库 ====================== */
function openHerbs() { renderHerbs('all', ''); showView('view-herbs'); }

const HERB_CATS = [
  { k: 'all', label: '全部' }, { k: '补益', label: '补益' }, { k: '滋阴', label: '滋阴润燥' },
  { k: '温阳', label: '温阳散寒' }, { k: '理气', label: '理气解郁' }, { k: '清热', label: '清热' },
  { k: '化湿', label: '化湿利水' }, { k: '活血', label: '活血化瘀' }, { k: '安神', label: '安神' },
  { k: '熏香', label: '熏香香材' }, { k: '茶饮', label: '代茶饮' }
];

function renderHerbs(cat, kw) {
  // 筛选条
  document.getElementById('herb-cats').innerHTML = HERB_CATS.map(c =>
    `<button class="hcat${c.k === cat ? ' active' : ''}" onclick="renderHerbs('${c.k}','${kw}')">${c.label}</button>`
  ).join('');

  let list = HERBS.filter(h => cat === 'all' || h.cat.includes(cat));
  if (kw) list = list.filter(h => (h.name + h.alias + h.effect).includes(kw));

  document.getElementById('herb-list').innerHTML = list.map(h => `
    <div class="herb-card">
      <div class="hc-top"><span class="hc-name">${h.name}</span>
        <span class="hc-alias">${h.alias !== '—' ? h.alias : ''}</span></div>
      <div class="hc-meta"><span class="hc-nature">${h.nature}</span><span class="hc-mer">归 ${h.meridian}</span></div>
      <div class="hc-row"><b>功效</b>${h.effect}</div>
      ${h.aroma !== '—' ? `<div class="hc-row"><b>熏香</b>${h.aroma}</div>` : ''}
      ${h.tea !== '—' ? `<div class="hc-row"><b>茶饮</b>${h.tea}</div>` : ''}
      <div class="hc-row caution"><b>宜忌</b>${h.caution}</div>
      <div class="hc-tags">${h.cat.map(t => `<span>${t}</span>`).join('')}</div>
    </div>`).join('') || '<p class="empty">未找到匹配的本草。</p>';
}

function herbSearch(v) {
  const cat = document.querySelector('.hcat.active')?.textContent === '全部' ? 'all'
    : (HERB_CATS.find(c => c.label === document.querySelector('.hcat.active')?.textContent)?.k || 'all');
  renderHerbs(cat, v.trim());
}

/* ====================== 经络穴位 · 对症取穴 ====================== */
let acuSymptom = null;     // 当前症状 key
let acuView = 'front';     // 当前人体图：front/back
let acuFocus = null;       // 单独聚焦的穴位 id（词典浏览）
let acuBones = false;      // 是否叠加骨骼参考层
let acuMode = 'symptom';   // 'symptom' 对症取穴 / 'poster' 全身总览

function openAcu(presetSymptom) {
  acuFocus = null; acuMode = 'symptom';
  renderAcuMode();
  renderSymptomTabs();
  showSymptomBlocks(true);
  selectSymptom(presetSymptom || SYMPTOM_GROUPS[0].key);
  showView('view-acu');
}

function renderAcuMode() {
  document.getElementById('acu-mode').innerHTML =
    `<button class="acu-modebtn ${acuMode === 'symptom' ? 'on' : ''}" onclick="setAcuMode('symptom')">🎯 对症取穴</button>
     <button class="acu-modebtn ${acuMode === 'poster' ? 'on' : ''}" onclick="setAcuMode('poster')">📋 全身总览 · 穴位大全</button>`;
}

function showSymptomBlocks(show) {
  document.getElementById('acu-symptoms').style.display = show ? '' : 'none';
  document.querySelector('.acu-layout').style.display = show ? '' : 'none';
  document.getElementById('acu-poster').style.display = show ? 'none' : 'block';
}

function setAcuMode(m) {
  acuMode = m; renderAcuMode();
  if (m === 'poster') {
    showSymptomBlocks(false);
    document.getElementById('acu-poster').innerHTML =
      `<p class="poster-hint">全身常用穴位一览，引线指向所在部位；点击穴名可查看定位与揉捏手法详解。</p>` +
      posterSVG() +
      `<div class="acu-disclaim">⚠ 穴位按摩为日常保健参考，<b>不替代医疗诊治</b>。孕妇及禁忌穴位请遵专业指导。</div>`;
  } else {
    showSymptomBlocks(true);
    if (acuSymptom) renderAcu(); else selectSymptom(SYMPTOM_GROUPS[0].key);
  }
}

function posterFocus(id) {
  acuMode = 'symptom'; renderAcuMode();
  showSymptomBlocks(true);
  focusPoint(id);
  document.querySelector('.acu-layout').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderSymptomTabs() {
  document.getElementById('acu-symptoms').innerHTML = SYMPTOM_GROUPS.map(g =>
    `<button class="acu-sym${g.key === acuSymptom ? ' active' : ''}"
      onclick="selectSymptom('${g.key}')">${g.name}</button>`).join('');
}

function selectSymptom(key) {
  acuSymptom = key; acuFocus = null;
  const g = SYMPTOM_GROUPS.find(s => s.key === key);
  // 默认显示包含较多穴位的那一面
  const cntFront = g.points.filter(p => apById(p).view === 'front').length;
  const cntBack = g.points.length - cntFront;
  acuView = cntBack > cntFront ? 'back' : 'front';
  renderSymptomTabs();
  renderAcu();
}

function apById(id) { return ACUPOINTS.find(a => a.id === id); }

function setAcuView(v) { acuView = v; renderAcu(); }

function toggleBones() { acuBones = !acuBones; renderAcu(); }

function focusPoint(id) {       // 词典中点击单穴
  acuFocus = id; acuSymptom = null;
  acuView = apById(id).view;
  renderSymptomTabs();
  renderAcu();
}

function renderAcu() {
  // 当前要绘制/讲解的穴位集合
  let ids, tipHtml = '';
  if (acuFocus) {
    ids = [acuFocus];
  } else {
    const g = SYMPTOM_GROUPS.find(s => s.key === acuSymptom);
    ids = g.points;
    tipHtml = `<div class="acu-tip"><b>${g.name}</b> · 调理思路：${g.tip}</div>`;
  }

  const pointsThisView = ids.filter(id => apById(id).view === acuView);
  const otherView = acuView === 'front' ? 'back' : 'front';
  const onOther = ids.filter(id => apById(id).view === otherView);

  // 人体图 + 标记
  let markers = '';
  pointsThisView.forEach(id => {
    const a = apById(id);
    a.pts.forEach(([x, y], i) => {
      markers += `<g class="marker" onclick="focusPoint('${id}')">
        <circle cx="${x}" cy="${y}" r="6.5" class="m-dot"/>
        <circle cx="${x}" cy="${y}" r="11" class="m-halo"/></g>`;
      if (i === a.pts.length - 1) {            // 仅在最后一个点旁标注名称
        if (x >= 142 && x <= 158) {            // 中线穴位：标签置于点正上方，避让两侧穴位
          markers += `<text class="m-label" x="${x}" y="${y - 11}" text-anchor="middle">${a.name}</text>`;
        } else {
          const lx = x > 150 ? x + 12 : x - 12;
          const anchor = x > 150 ? 'start' : 'end';
          markers += `<text class="m-label" x="${lx}" y="${y + 3}" text-anchor="${anchor}">${a.name}</text>`;
        }
      }
    });
  });

  document.getElementById('acu-figure').innerHTML =
    `<svg viewBox="0 0 300 648" class="body-svg">${bodyAnatomy(acuView, acuBones)}${markers}</svg>`;

  // 视图切换 + 骨骼层 + 另一面提示
  let switchHtml = `<div class="acu-viewbar">
    <button class="${acuView === 'front' ? 'on' : ''}" onclick="setAcuView('front')">正面</button>
    <button class="${acuView === 'back' ? 'on' : ''}" onclick="setAcuView('back')">背面</button>
    <button class="bone-btn ${acuBones ? 'on' : ''}" onclick="toggleBones()">🦴 骨骼参考</button></div>`;
  if (onOther.length) {
    switchHtml += `<div class="acu-other">该方案另有 ${onOther.map(id => apById(id).name).join('、')}
      在<a onclick="setAcuView('${otherView}')">${otherView === 'front' ? '正面' : '背面'}图</a>，点击切换查看。</div>`;
  }
  document.getElementById('acu-switch').innerHTML = switchHtml;

  // 穴位讲解卡片（症状下列出全部穴位，无论正背面）
  const cards = ids.map(id => {
    const a = apById(id);
    const viewTag = a.view === 'front' ? '正面' : '背面';
    const active = (a.view === acuView) ? ' active' : '';
    return `<div class="acu-card${active}" onclick="focusPoint('${id}')">
      <div class="ac-top"><span class="ac-name">${a.name}</span>
        <span class="ac-code">${a.code}</span><span class="ac-view">${viewTag}</span></div>
      <div class="ac-row"><b>定位</b>${a.loc}</div>
      <div class="ac-row"><b>简易取穴</b>${a.find}</div>
      <div class="ac-row"><b>主治</b>${a.treats}</div>
      <div class="ac-row"><b>手法</b>${a.method}</div>
      ${a.caution !== '—' ? `<div class="ac-row caution"><b>宜忌</b>${a.caution}</div>` : ''}
    </div>`;
  }).join('');

  document.getElementById('acu-detail').innerHTML = tipHtml +
    (acuFocus ? `<div class="acu-back" onclick="renderSymptomTabs();selectSymptom(SYMPTOM_GROUPS[0].key)">‹ 返回对症取穴</div>` : '') +
    `<div class="acu-cards">${cards}</div>
     <div class="acu-disclaim">⚠ 穴位按摩为日常保健参考，<b>不替代医疗诊治</b>。
      孕妇及标注禁忌的穴位请遵专业指导；按压以酸胀温和为度，皮肤破损、急重病症请就医。</div>`;
}

/* 出诊页跳转到对应体质的对症取穴 */
function gotoAcuForConstitution(key) {
  const list = CONST_ACU[key] || ['pifa'];
  openAcu(list[0]);
}

/* ---------- 打印 / 导出当前出诊方案 ---------- */
function printRx() {
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => document.body.classList.remove('printing'), 500);
}

/* ====================== 二十四节气养生 ====================== */
let jieqiSel = null;

function openJieqi(idx) {
  const i = (idx === undefined || idx === null) ? currentTermIndex(new Date()) : idx;
  selectTerm(i);
  showView('view-jieqi');
}

function renderJieqiGrid() {
  const cur = currentTermIndex(new Date());
  const seasons = ['春', '夏', '秋', '冬'];
  let html = '';
  seasons.forEach(s => {
    const items = SOLAR_TERMS
      .map((t, i) => ({ t, i }))
      .filter(o => o.t.season === s);
    html += `<div class="jq-season"><span class="jqs-label" style="--sc:${SEASON_COLOR[s]}">${s}</span>
      <div class="jqs-chips">` +
      items.map(o => `<button class="jq-chip${o.i === jieqiSel ? ' active' : ''}${o.i === cur ? ' now' : ''}"
        style="--sc:${SEASON_COLOR[s]}" onclick="selectTerm(${o.i})">${o.t.name}${o.i === cur ? '<span class="jq-nowtag">今</span>' : ''}</button>`).join('') +
      `</div></div>`;
  });
  document.getElementById('jieqi-grid').innerHTML = html;
}

function selectTerm(i) {
  jieqiSel = i;
  renderJieqiGrid();
  renderTermDetail(i);
}

function renderTermDetail(i) {
  const t = SOLAR_TERMS[i];
  const cur = currentTermIndex(new Date());
  const sc = SEASON_COLOR[t.season];
  const isNow = i === cur;
  document.getElementById('jieqi-detail').innerHTML = `
    <div class="jq-head" style="--sc:${sc}">
      <div class="jqh-top">
        <span class="jqh-name">${t.name}</span>
        <span class="jqh-date">${t.date[0]}月${t.date[1]}日 前后 · ${t.season}季</span>
        ${isNow ? '<span class="jqh-now">当令</span>' : ''}
      </div>
      <div class="jqh-phen">「${t.phen}」</div>
    </div>
    <div class="jq-focus" style="--sc:${sc}"><b>养生要点</b>${t.focus}</div>
    <div class="jq-rows">
      <div class="jq-row"><span class="jqr-ic">🍚</span><div><b>宜食</b>${t.eat}</div></div>
      <div class="jq-row"><span class="jqr-ic">🍵</span><div><b>代茶饮</b>${t.tea}
        <button class="inline-link" onclick="openHerbs()">查本草库</button></div></div>
      <div class="jq-row"><span class="jqr-ic">🌙</span><div><b>起居</b>${t.live}</div></div>
      <div class="jq-row avoid"><span class="jqr-ic">⛔</span><div><b>忌</b>${t.avoid}</div></div>
    </div>
    <div class="acu-disclaim">⚠ 节气养生为顺时调养参考，因人而异；体质偏颇者请结合自身辨识结果，特殊情况遵专业指导。</div>`;
}

/* 首页当令养生卡片 */
function renderHomeJieqi() {
  const now = new Date();
  const i = currentTermIndex(now);
  const t = SOLAR_TERMS[i];
  const days = daysToNextTerm(now);
  const next = SOLAR_TERMS[(i + 1) % SOLAR_TERMS.length];
  const sc = SEASON_COLOR[t.season];
  document.getElementById('home-jieqi').innerHTML = `
    <div class="home-jq" style="--sc:${sc}" onclick="openJieqi(${i})">
      <div class="hjq-left">
        <div class="hjq-tag">当 令 节 气</div>
        <div class="hjq-name">${t.name}</div>
        <div class="hjq-phen">${t.phen}</div>
      </div>
      <div class="hjq-right">
        <div class="hjq-focus">${t.focus}</div>
        <div class="hjq-next">距「${next.name}」约 ${days} 天　·　点击查看二十四节气养生 →</div>
      </div>
    </div>`;
}

/* ---------- 初始化 ---------- */
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('total-q').textContent = QUESTIONS.length;
  renderHomeJieqi();
});
