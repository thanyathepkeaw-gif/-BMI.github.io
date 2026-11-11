# 🏥 BMI Calculator — คำนวณดัชนีมวลกาย

แอปพลิเคชันคำนวณค่าดัชนีมวลกาย (BMI) แบบ **Premium Glassmorphism UI**  
รองรับ iOS, Android, PWA, Offline, Dark/Light Mode

---

## ✨ Features

- 🎨 **Glassmorphism Design** — พื้นหลังกระจกเบลอ + Animated Orbs
- 📊 **Arc Gauge** — แสดงผล BMI แบบ radial gauge SVG พร้อมเข็มหมุน
- 🎚️ **Interactive Sliders** — ลากปรับน้ำหนัก/ส่วนสูงแบบ realtime
- ➕➖ **Stepper Buttons** — กดค้างเพื่อเพิ่ม/ลดค่าเร็วขึ้น
- 🌓 **Dark/Light Mode** — สลับได้ จำค่าไว้ใน localStorage
- 📱 **QR Code** — แชร์ URL หรือดาวน์โหลด QR Code
- 📲 **PWA Ready** — ติดตั้งบน Home Screen (iOS + Android)
- ⚡ **Haptic Feedback** — สั่นเบาๆ เมื่อกดปุ่ม (Android)
- 🎭 **Count-Up Animation** — ตัวเลข BMI นับจาก 0 → ค่าจริง
- 🔒 **Offline Support** — ใช้งานได้โดยไม่ต้อง internet (Service Worker)

---

## 🚀 วิธีเปิดบน Desktop (คอม)

### แบบง่าย — เปิดไฟล์โดยตรง
```
ดับเบิลคลิกที่ index.html
```
✅ ทำงานได้ทันที แต่ไม่มี network URL สำหรับมือถือ

---

## 📱 วิธีเปิดบนมือถือ (ผ่าน Wi-Fi วงเดียวกัน)

### วิธีที่ 1: ใช้ Node.js Server (แนะนำ)

1. เปิด PowerShell/Terminal ใน folder `bmi-calculator`
2. รันคำสั่ง:
   ```powershell
   node serve.js
   ```
3. Browser จะเปิดอัตโนมัติที่ `http://192.168.0.243:5500`
4. **บนมือถือ** — เชื่อมต่อ Wi-Fi วงเดียวกัน แล้ว:
   - เปิดกล้อง สแกน QR ที่ปรากฏใน terminal
   - หรือพิมพ์ `http://192.168.0.243:5500` ใน browser

**หยุด server:** กด `Ctrl + C`

---

### วิธีที่ 2: ใช้ Python (built-in)

```powershell
cd "c:\ปวส.2 เทอม 2\ครูรุ้ง\bmi-calculator"
python -m http.server 5500
```
เปิดที่ `http://192.168.0.243:5500`

---

### วิธีที่ 3: VS Code Live Server Extension

1. ติดตั้ง extension **"Live Server"** ใน VS Code
2. คลิกขวาที่ `index.html` → **"Open with Live Server"**
3. เปิดที่ `http://127.0.0.1:5500`
4. ดู network IP ที่ console (VS Code จะแสดง)

---

## 🎯 วิธีแชร์ผ่าน QR Code

1. เปิดแอปบน **คอม** ด้วย `node serve.js`
2. กดปุ่ม **QR Code** มุมซ้ายบน (⊞ icon)
3. สแกนด้วยกล้องมือถือ — เปิดได้ทันที!

---

## 📦 โครงสร้างโฟลเดอร์

```
bmi-calculator/
├── index.html          # หน้าหลัก
├── manifest.json       # PWA manifest (ติดตั้ง Home Screen)
├── sw.js               # Service Worker (offline cache)
├── serve.js            # Node.js dev server
├── README.md           # ไฟล์นี้
│
├── css/
│   └── style.css       # Glassmorphism + Responsive + Safe Area
│
├── js/
│   ├── bmi.js          # Logic หลัก: คำนวณ, animation, haptic
│   └── qr.js           # QR Code modal
│
└── icons/
    ├── icon.svg        # App icon (vector)
    ├── icon-192.png    # PWA icon 192x192
    ├── icon-512.png    # PWA icon 512x512
    └── gen-icons.html  # Generator สำหรับ PNG icons
```

---

## 🛠️ เทคโนโลジี

| หมวด | เทคโนโลジี |
|------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Design | Glassmorphism, CSS Variables, SVG Animation |
| PWA | Service Worker, Web App Manifest, Offline Cache |
| QR | qrcode.js (CDN) |
| Fonts | Inter + Sarabun (Google Fonts) |
| Icons | SVG inline (ไม่ใช้ icon library) |

---

## 📐 BMI Standards (Asian)

| ค่า BMI | ระดับ | ความเสี่ยง |
|---------|-------|------------|
| < 18.5 | น้ำหนักน้อย / ผอม | สูง (ขาดสารอาหาร) |
| 18.5 – 22.9 | ปกติ / สุขภาพดี | ต่ำ |
| 23.0 – 24.9 | ท้วม / น้ำหนักเกิน | ปานกลาง |
| 25.0 – 29.9 | อ้วน | สูง |
| ≥ 30.0 | อ้วนมาก / อันตราย | สูงมาก |

---

## 🌐 Deployment (ถ้าต้องการเอาขึ้น online)

### GitHub Pages (ฟรี)
```bash
git init
git add .
git commit -m "BMI Calculator"
git remote add origin https://github.com/USERNAME/bmi-calculator.git
git push -u origin main
```
Settings → Pages → Source: `main` branch → Save

### Netlify (ฟรี + auto-deploy)
1. ลาก drop folder `bmi-calculator` ใน [Netlify Drop](https://app.netlify.com/drop)
2. ได้ URL `https://RANDOM-NAME.netlify.app` ทันที

---

## 📄 License

MIT License — ใช้งานได้อิสระ แก้ไขได้ แจกจ่ายได้

---

## 👨‍💻 Credits

Designed & Developed with ❤️ for Mobile-First Web Experience
