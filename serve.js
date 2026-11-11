/**
 * serve.js — Local Dev Server สำหรับ BMI Calculator
 * รัน: node serve.js
 * เปิดหน้าเว็บ + แสดง URL สำหรับมือถือ
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const PORT = 5500;
const ROOT = __dirname;

/* ── MIME types ── */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

/* ── Get local Wi-Fi IP ── */
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
          return net.address;
        }
      }
    }
  }
  return 'localhost';
}

/* ── HTTP Server ── */
const server = http.createServer((req, res) => {
  /* Normalize URL */
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();

  /* Security: prevent path traversal */
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }
    res.writeHead(200, {
      'Content-Type':  MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      /* Allow PWA Service Worker scope */
      'Service-Worker-Allowed': '/',
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip  = getLocalIP();
  const url = `http://${ip}:${PORT}`;

  console.log('\n' + '═'.repeat(50));
  console.log('  🚀  BMI Calculator — Dev Server');
  console.log('═'.repeat(50));
  console.log(`  💻  Local   : http://localhost:${PORT}`);
  console.log(`  📱  Network : ${url}`);
  console.log('═'.repeat(50));
  console.log('  สแกน QR ด้านล่างด้วยกล้องมือถือ:');
  console.log('  (หรือกดปุ่ม QR ในแอปหลังเปิดบนคอม)\n');

  /* เปิด browser อัตโนมัติ */
  const { exec } = require('child_process');
  exec(`start "" "${url}"`);

  console.log(`  ✅  เปิด browser ที่ ${url} แล้ว`);
  console.log('  🛑  หยุด server: กด Ctrl + C\n');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} ถูกใช้งานอยู่แล้ว`);
    console.error(`   ลองเปลี่ยน PORT ในไฟล์ serve.js บรรทัด: const PORT = ${PORT}\n`);
  } else {
    console.error('Server error:', e);
  }
  process.exit(1);
});
