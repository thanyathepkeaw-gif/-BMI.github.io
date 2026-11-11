/**
 * qr.js — QR Code Modal
 * ใช้ qrcode.js (CDN) สร้าง QR จาก URL ปัจจุบัน
 * รองรับ: local file, localhost, production URL
 */

'use strict';

(function () {

  /* ── DOM ── */
  const qrBtn        = document.getElementById('qrBtn');
  const qrOverlay    = document.getElementById('qrOverlay');
  const qrModal      = document.getElementById('qrModal');
  const qrClose      = document.getElementById('qrClose');
  const qrCodeCanvas = document.getElementById('qrCodeCanvas');
  const qrUrlText    = document.getElementById('qrUrlText');
  const qrCopyBtn    = document.getElementById('qrCopyBtn');
  const qrCopyLabel  = document.getElementById('qrCopyLabel');
  const qrDownloadBtn= document.getElementById('qrDownloadBtn');

  let qrInstance = null;  // QRCode object (จะ generate ครั้งเดียว)

  /* ══════════════════════════════════════════
     1. GET URL TO ENCODE
     ถ้าเป็น file:// จะแนะนำให้ใช้ node serve.js
  ══════════════════════════════════════════ */
  function getShareUrl() {
    const loc = window.location;

    if (loc.protocol === 'file:') {
      return { url: loc.href, isLocal: true };
    }
    // http / https — ใช้ URL เต็ม (ครอบคลุม localhost และ IP จริง)
    return { url: loc.href, isLocal: false };
  }

  /* ══════════════════════════════════════════
     2. GENERATE QR CODE
  ══════════════════════════════════════════ */
  function generateQR(url) {
    if (qrInstance) return; // สร้างแล้ว ไม่ต้อง regenerate

    const isDark = document.documentElement.dataset.theme === 'dark';

    qrInstance = new QRCode(qrCodeCanvas, {
      text:          url,
      width:         200,
      height:        200,
      colorDark:     isDark ? '#1e1b4b' : '#1a1a2e',
      colorLight:    '#ffffff',
      correctLevel:  QRCode.CorrectLevel.H,  // High error correction
    });
  }

  /* ══════════════════════════════════════════
     3. OPEN MODAL
  ══════════════════════════════════════════ */
  function openModal() {
    const { url, isLocal } = getShareUrl();

    // แสดง URL
    qrUrlText.textContent = url.length > 55 ? url.slice(0, 52) + '…' : url;

    // แจ้งเตือนถ้าเป็น local file
    const notice = document.getElementById('qr-local-notice');
    if (notice) {
      notice.style.display = isLocal ? 'block' : 'none';
    }

    // Generate QR
    generateQR(url);

    // Show overlay
    qrOverlay.hidden = false;
    // Animate in (delay 1 frame เพื่อให้ CSS transition ทำงาน)
    requestAnimationFrame(() => {
      qrOverlay.classList.add('is-open');
    });

    // Focus trap
    qrClose.focus();

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    if (window.haptic) window.haptic('light');
  }

  /* ══════════════════════════════════════════
     4. CLOSE MODAL
  ══════════════════════════════════════════ */
  function closeModal() {
    qrOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    // hide after transition
    qrOverlay.addEventListener('transitionend', () => {
      qrOverlay.hidden = true;
    }, { once: true });
    qrBtn.focus();
  }

  /* ══════════════════════════════════════════
     5. COPY URL
  ══════════════════════════════════════════ */
  async function copyUrl() {
    const { url } = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      qrCopyLabel.textContent = '✅ คัดลอกแล้ว!';
      qrCopyBtn.classList.add('copied');
    } catch {
      // Fallback for iOS < 13.1
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      qrCopyLabel.textContent = '✅ คัดลอกแล้ว!';
      qrCopyBtn.classList.add('copied');
    }
    setTimeout(() => {
      qrCopyLabel.textContent = 'คัดลอก URL';
      qrCopyBtn.classList.remove('copied');
    }, 2200);
  }

  /* ══════════════════════════════════════════
     6. DOWNLOAD QR IMAGE
  ══════════════════════════════════════════ */
  function downloadQR() {
    // qrcode.js renders into an <img> tag inside qrCodeCanvas
    const img = qrCodeCanvas.querySelector('img');
    const canvas = qrCodeCanvas.querySelector('canvas');

    let dataUrl;
    if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    } else if (img) {
      // Create a temp canvas to convert img src → data URL
      const c = document.createElement('canvas');
      c.width = 200; c.height = 200;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 200, 200);
      ctx.drawImage(img, 0, 0);
      dataUrl = c.toDataURL('image/png');
    } else {
      return;
    }

    const a = document.createElement('a');
    a.href     = dataUrl;
    a.download = 'bmi-calculator-qr.png';
    a.click();
  }

  /* ══════════════════════════════════════════
     7. EVENT LISTENERS
  ══════════════════════════════════════════ */
  qrBtn.addEventListener('click', openModal);
  qrClose.addEventListener('click', closeModal);
  qrDownloadBtn.addEventListener('click', downloadQR);
  qrCopyBtn.addEventListener('click', copyUrl);

  // Close on overlay backdrop click
  qrOverlay.addEventListener('click', e => {
    if (e.target === qrOverlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !qrOverlay.hidden) closeModal();
  });

  // Keyboard trap inside modal
  qrModal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = qrModal.querySelectorAll(
      'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

})();
