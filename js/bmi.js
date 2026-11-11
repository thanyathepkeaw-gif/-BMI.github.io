/**
 * BMI Calculator — bmi.js
 * Premium Glassmorphism · Mobile-First · iOS & Android Ready
 * Features: Radial Arc Gauge · Count-Up Animation · Slider Sync
 *           Gender Cards · Dark/Light Theme · Validation · Ripple
 *           Haptic Feedback · PWA · Safe Area · Touch Optimised
 */

'use strict';

/* ================================================================
   0.  iOS & ANDROID UTILITIES
================================================================ */

/**
 * Haptic feedback — Vibration API (Android) + iOS impact (via CSS trick)
 * Pattern: 'light' | 'medium' | 'heavy'
 */
function haptic(pattern = 'light') {
  // Android — Vibration API
  if (navigator.vibrate) {
    const ms = pattern === 'light' ? 10 : pattern === 'medium' ? 25 : 50;
    navigator.vibrate(ms);
  }
  // iOS — no Vibration API; visual micro-flash used instead (CSS handles it)
}

/** Detect if running as installed PWA (iOS Home Screen / Android TWA) */
const IS_STANDALONE =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

/** Detect touch device */
const IS_TOUCH = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* ================================================================
   1.  BMI CATEGORY DATA
================================================================ */
const CATEGORIES = [
  {
    id: 'thin',
    label: 'น้ำหนักน้อย / ผอม',
    min: 0, max: 18.5,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
    emoji: '😟',
    advice: {
      male:   'น้ำหนักของคุณน้อยกว่าเกณฑ์ ควรเพิ่มการรับประทานโปรตีนและแคลอรีให้เพียงพอ เสริมด้วยการออกกำลังกายสร้างกล้ามเนื้อ แนะนำปรึกษานักโภชนาการเพื่อวางแผนอาหาร',
      female: 'น้ำหนักของคุณน้อยกว่าเกณฑ์ ควรเพิ่มอาหารที่มีประโยชน์สูง โดยเฉพาะธาตุเหล็กและแคลเซียม เพื่อป้องกันโลหิตจางและกระดูกบางในอนาคต',
    },
  },
  {
    id: 'normal',
    label: 'ปกติ / สุขภาพดี',
    min: 18.5, max: 23,
    color: '#34d399',
    gradient: 'linear-gradient(135deg,#34d399,#059669)',
    emoji: '🎉',
    advice: {
      male:   'ยอดเยี่ยม! น้ำหนักของคุณอยู่ในเกณฑ์ดีมาก รักษาพฤติกรรมสุขภาพด้วยการออกกำลังกาย ≥ 150 นาที/สัปดาห์ รับประทานอาหารครบ 5 หมู่ และพักผ่อนให้เพียงพอ',
      female: 'ยอดเยี่ยม! น้ำหนักของคุณอยู่ในเกณฑ์ดีมาก รักษาด้วยการออกกำลังกายสม่ำเสมอ บริโภคผักผลไม้หลากสี ดูแลสุขภาพจิตและนอนหลับพักผ่อนให้ครบ 7-8 ชั่วโมง',
    },
  },
  {
    id: 'over',
    label: 'ท้วม / น้ำหนักเกิน',
    min: 23, max: 25,
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg,#fbbf24,#d97706)',
    emoji: '⚠️',
    advice: {
      male:   'น้ำหนักเริ่มเกินเกณฑ์เล็กน้อย ควรลดอาหารแป้ง น้ำตาล และอาหารมันสูง เพิ่มคาร์ดิโอเช่น วิ่ง ว่ายน้ำ อย่างน้อย 3 ครั้ง/สัปดาห์ เพื่อควบคุมน้ำหนักก่อนเพิ่มมากขึ้น',
      female: 'น้ำหนักเริ่มเกินเกณฑ์เล็กน้อย ควรควบคุมปริมาณแคลอรีและลดน้ำหนักด้วยการออกกำลังกายแบบแอโรบิก เช่น เต้น หรือโยคะ เพื่อช่วยลดไขมันสะสม',
    },
  },
  {
    id: 'obese',
    label: 'อ้วน',
    min: 25, max: 30,
    color: '#fb923c',
    gradient: 'linear-gradient(135deg,#fb923c,#ea580c)',
    emoji: '🩺',
    advice: {
      male:   'น้ำหนักเกินเกณฑ์ มีความเสี่ยงต่อโรคเบาหวาน ความดันสูง และโรคหัวใจ แนะนำพบแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย ปรับพฤติกรรมการกินและเพิ่มกิจกรรมทางกายสม่ำเสมอ',
      female: 'น้ำหนักเกินเกณฑ์ มีความเสี่ยงต่อโรคเรื้อรังหลายชนิด แนะนำพบแพทย์เพื่อตรวจสุขภาพและวางแผนลดน้ำหนักอย่างปลอดภัย เพิ่มการออกกำลังกายให้สม่ำเสมอ',
    },
  },
  {
    id: 'obese2',
    label: 'อ้วนมาก / อันตราย',
    min: 30, max: Infinity,
    color: '#f87171',
    gradient: 'linear-gradient(135deg,#f87171,#dc2626)',
    emoji: '🚨',
    advice: {
      male:   'ภาวะอ้วนอันตราย ความเสี่ยงต่อโรคร้ายแรงสูงมาก ควรปรึกษาแพทย์โดยเร็วเพื่อรับโปรแกรมลดน้ำหนักที่ได้รับการดูแลจากผู้เชี่ยวชาญโดยเฉพาะ',
      female: 'ภาวะอ้วนอันตราย ความเสี่ยงต่อโรคร้ายแรงสูงมาก ควรปรึกษาแพทย์โดยเร็วเพื่อรับโปรแกรมลดน้ำหนักที่ปลอดภัยและเหมาะกับสรีระสตรี',
    },
  },
];

/* Needle: BMI → rotation angle (deg)
   Arc spans -90° (left, BMI 10) → +90° (right, BMI 40) */
const NEEDLE_MIN_BMI = 10;
const NEEDLE_MAX_BMI = 40;
const NEEDLE_MIN_DEG = -90;
const NEEDLE_MAX_DEG =  90;

/* ================================================================
   2.  DOM REFS
================================================================ */
const themeToggle   = document.getElementById('themeToggle');
const gcardMale     = document.getElementById('gcard-male');
const gcardFemale   = document.getElementById('gcard-female');
const weightInput   = document.getElementById('weight');
const heightInput   = document.getElementById('height');
const weightSlider  = document.getElementById('weightSlider');
const heightSlider  = document.getElementById('heightSlider');
const weightBox     = document.getElementById('weight-box');
const heightBox     = document.getElementById('height-box');
const weightErr     = document.getElementById('weight-err');
const heightErr     = document.getElementById('height-err');
const btnCalc       = document.getElementById('btnCalc');
const btnReset      = document.getElementById('btnReset');
const inputCard     = document.getElementById('inputCard');
const resultCard    = document.getElementById('resultCard');
const arcNeedle     = document.getElementById('arcNeedle');
const arcBmiNum     = document.getElementById('arcBmiNum');
const resultBadge   = document.getElementById('resultBadge');
const resultCategory= document.getElementById('resultCategory');
const statWeight    = document.getElementById('statWeight');
const statHeight    = document.getElementById('statHeight');
const statBmi       = document.getElementById('statBmi');
const adviceIcon    = document.getElementById('adviceIcon');
const adviceText    = document.getElementById('adviceText');
const idealRange    = document.getElementById('idealRange');

/* ================================================================
   3.  THEME MANAGEMENT
================================================================ */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('bmi-theme', theme);

  // ── Update <meta name="theme-color"> dynamically ──
  // Android Chrome status bar & task switcher จะเปลี่ยนสีตาม
  const metaTheme = document.querySelector('meta[name="theme-color"]:not([media])') ||
    (() => {
      const m = document.createElement('meta');
      m.name = 'theme-color';
      document.head.appendChild(m);
      return m;
    })();
  metaTheme.content = theme === 'dark' ? '#1a1a2e' : '#c7cfe8';
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* Restore on load */
(function () {
  const saved = localStorage.getItem('bmi-theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
  // default is 'dark' from HTML attr
})();

/* ================================================================
   4.  GENDER SELECTION
================================================================ */
let selectedGender = 'male';

function activateGender(id) {
  gcardMale.classList.toggle('active', id === 'male');
  gcardFemale.classList.toggle('active', id === 'female');
  gcardMale.setAttribute('aria-checked', id === 'male' ? 'true' : 'false');
  gcardFemale.setAttribute('aria-checked', id === 'female' ? 'true' : 'false');
  gcardMale.querySelector('input').checked   = (id === 'male');
  gcardFemale.querySelector('input').checked = (id === 'female');
  selectedGender = id;
  haptic('light'); // ← feedback เมื่อสลับเพศ
}

gcardMale.addEventListener('click',   () => activateGender('male'));
gcardFemale.addEventListener('click', () => activateGender('female'));

/* Keyboard support for gender cards */
[gcardMale, gcardFemale].forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ================================================================
   5.  SLIDER ↔ INPUT SYNC
================================================================ */
function updateSliderFill(slider) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const val = Number(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background =
    `linear-gradient(to right, var(--accent-from) 0%, var(--accent-from) ${pct}%, rgba(255,255,255,.12) ${pct}%)`;
}

function syncInputFromSlider(slider, input) {
  input.value = slider.value;
  updateSliderFill(slider);
  clearFieldError(input.id === 'weight' ? weightBox : heightBox,
                  input.id === 'weight' ? weightErr  : heightErr);
}

function syncSliderFromInput(input, slider) {
  const val = parseFloat(input.value);
  if (!isNaN(val) && val >= Number(slider.min) && val <= Number(slider.max)) {
    slider.value = val;
    updateSliderFill(slider);
  }
}

weightSlider.addEventListener('input', () => syncInputFromSlider(weightSlider, weightInput));
heightSlider.addEventListener('input', () => syncInputFromSlider(heightSlider, heightInput));

weightInput.addEventListener('input', () => {
  syncSliderFromInput(weightInput, weightSlider);
  clearFieldError(weightBox, weightErr);
});
heightInput.addEventListener('input', () => {
  syncSliderFromInput(heightInput, heightSlider);
  clearFieldError(heightBox, heightErr);
});

/* Init slider fills */
updateSliderFill(weightSlider);
updateSliderFill(heightSlider);

/* ================================================================
   6.  STEPPER BUTTONS  (+ / -)
================================================================ */
document.querySelectorAll('.stepper-btn').forEach(btn => {
  /* Interval for long-press */
  let interval = null;
  let timeout  = null;

  function step() {
    const targetId = btn.dataset.target; // 'weight' | 'height'
    const dir      = Number(btn.dataset.dir); // 1 | -1
    const input    = document.getElementById(targetId);
    const slider   = document.getElementById(targetId + 'Slider');
    const val      = parseFloat(input.value) || 0;
    const inc      = 0.5;
    const min      = Number(input.min);
    const max      = Number(input.max);
    const next     = Math.min(max, Math.max(min, Math.round((val + dir * inc) * 10) / 10));
    input.value    = next;
    syncSliderFromInput(input, slider);
    clearFieldError(
      targetId === 'weight' ? weightBox : heightBox,
      targetId === 'weight' ? weightErr  : heightErr
    );
    haptic('light'); // ← feedback ทุกครั้งที่กด +/-
    // Visual pulse
    input.closest('.num-input-wrap').style.transform = 'scale(1.03)';
    setTimeout(() => { input.closest('.num-input-wrap').style.transform = ''; }, 100);
  }

  btn.addEventListener('mousedown', () => {
    step();
    timeout = setTimeout(() => { interval = setInterval(step, 80); }, 400);
  });
  btn.addEventListener('touchstart', e => { e.preventDefault(); step();
    timeout = setTimeout(() => { interval = setInterval(step, 80); }, 400);
  }, { passive: false });

  function stop() { clearTimeout(timeout); clearInterval(interval); }
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev => btn.addEventListener(ev, stop));
});

/* ================================================================
   7.  VALIDATION
================================================================ */
function validateField(inputEl, boxEl, errEl, label, min, max) {
  const raw = inputEl.value.trim();
  if (raw === '') {
    setFieldError(boxEl, errEl, `กรุณากรอก${label}`);
    return null;
  }
  const val = parseFloat(raw);
  if (isNaN(val)) {
    setFieldError(boxEl, errEl, `${label}ต้องเป็นตัวเลข`);
    return null;
  }
  if (val <= 0) {
    setFieldError(boxEl, errEl, `${label}ต้องมากกว่า 0`);
    return null;
  }
  if (val < min || val > max) {
    setFieldError(boxEl, errEl, `${label}ควรอยู่ระหว่าง ${min}–${max}`);
    return null;
  }
  clearFieldError(boxEl, errEl);
  return val;
}
function setFieldError(boxEl, errEl, msg) {
  errEl.textContent = msg;
  boxEl.classList.add('error');
}
function clearFieldError(boxEl, errEl) {
  errEl.textContent = '';
  boxEl.classList.remove('error');
}

/* ================================================================
   8.  BMI LOGIC
================================================================ */
function calcBMI(weight, heightCm) {
  const hm = heightCm / 100;
  return weight / (hm * hm);
}
function getCategory(bmi) {
  return CATEGORIES.find(c => bmi >= c.min && bmi < c.max);
}
/** Ideal weight range for BMI 18.5–22.9 */
function idealWeightRange(heightCm) {
  const hm = heightCm / 100;
  return {
    low:  Math.round(18.5 * hm * hm * 10) / 10,
    high: Math.round(22.9 * hm * hm * 10) / 10,
  };
}

/* ================================================================
   9.  ARC NEEDLE ROTATION
================================================================ */
function bmiToAngle(bmi) {
  const clamped = Math.min(Math.max(bmi, NEEDLE_MIN_BMI), NEEDLE_MAX_BMI);
  const pct = (clamped - NEEDLE_MIN_BMI) / (NEEDLE_MAX_BMI - NEEDLE_MIN_BMI);
  return NEEDLE_MIN_DEG + pct * (NEEDLE_MAX_DEG - NEEDLE_MIN_DEG);
}

/* ================================================================
   10. COUNT-UP ANIMATION
================================================================ */
function countUp(el, target, decimals = 2, duration = 900) {
  const start     = performance.now();
  const startVal  = parseFloat(el.textContent) || 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;
    el.textContent = current.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals);
  }
  requestAnimationFrame(tick);
}

/* ================================================================
   11. RENDER RESULTS
================================================================ */
function renderResults(weight, height, bmi, cat, gender) {
  /* ── Needle (delay so card is visible first) ── */
  const angle = bmiToAngle(bmi);
  arcNeedle.style.transform = `rotate(-90deg, 110, 110)`;  // reset
  setTimeout(() => {
    arcNeedle.style.transform = `rotate(${angle}deg, 110, 110)`;
  }, 50);

  /* ── BMI count-up number inside arc ── */
  arcBmiNum.style.fill = cat.color;
  arcBmiNum.textContent = '0';
  setTimeout(() => countUp(arcBmiNum, bmi, 2, 900), 80);

  /* ── Needle colour ── */
  arcNeedle.style.stroke = cat.color;
  arcNeedle.style.fill   = cat.color;

  /* ── Badge ── */
  resultBadge.style.background = cat.gradient;
  resultBadge.style.boxShadow  = `0 4px 20px ${cat.color}55`;
  resultCategory.textContent   = cat.label;

  /* ── Stats ── */
  statWeight.innerHTML = `${weight} <small>kg</small>`;
  statHeight.innerHTML = `${height} <small>cm</small>`;
  statBmi.textContent  = bmi.toFixed(2);
  statBmi.style.color  = cat.color;

  /* ── Advice ── */
  adviceIcon.textContent = cat.emoji;
  adviceText.textContent = cat.advice[gender];
  document.getElementById('adviceCard').style.borderColor = cat.color + '44';

  /* ── Ideal weight ── */
  const iw = idealWeightRange(height);
  idealRange.textContent = `${iw.low} – ${iw.high} kg`;

  /* ── Active arc zone label ── */
  document.querySelectorAll('.zone-lbl').forEach(lbl => lbl.classList.remove('active-label'));
  const activeLabel = document.querySelector(`.zone-lbl.${cat.id}`);
  if (activeLabel) activeLabel.classList.add('active-label');

  /* ── Dynamic background tint on result card ── */
  resultCard.style.background =
    `linear-gradient(160deg, ${cat.color}12, var(--glass-bg) 60%)`;
}

/* ================================================================
   12. RIPPLE EFFECT
================================================================ */
btnCalc.addEventListener('click', function (e) {
  const rect      = btnCalc.getBoundingClientRect();
  const x         = e.clientX - rect.left;
  const y         = e.clientY - rect.top;
  const ripple    = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.cssText = `left:${x}px;top:${y}px;width:50px;height:50px;margin-left:-25px;margin-top:-25px`;
  btnCalc.querySelector('.ripple-container').appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());

  /* Validate */
  const weight = validateField(weightInput, weightBox, weightErr, 'น้ำหนัก', 1,  500);
  const height = validateField(heightInput, heightBox, heightErr, 'ส่วนสูง', 50, 300);
  if (weight === null || height === null) {
    haptic('medium'); // ← error feedback
    return;
  }

  const bmi = calcBMI(weight, height);
  const cat = getCategory(bmi);
  haptic('heavy'); // ← success feedback เมื่อคำนวณสำเร็จ

  /* Show result */
  resultCard.classList.remove('is-hidden');
  renderResults(weight, height, bmi, cat, selectedGender);
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ================================================================
   13. RESET
================================================================ */
btnReset.addEventListener('click', () => {
  haptic('light');
  weightInput.value = '';
  heightInput.value = '';
  weightSlider.value = 65;
  heightSlider.value = 170;
  updateSliderFill(weightSlider);
  updateSliderFill(heightSlider);
  clearFieldError(weightBox, weightErr);
  clearFieldError(heightBox, heightErr);

  resultCard.classList.add('is-hidden');
  inputCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => weightInput.focus(), 400);
});

/* ================================================================
   14. KEYBOARD SHORTCUTS
================================================================ */
[weightInput, heightInput].forEach(el =>
  el.addEventListener('keydown', e => { if (e.key === 'Enter') btnCalc.click(); })
);
