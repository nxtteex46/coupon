# Coupon Template

เว็บแอปสำหรับออกแบบและตรวจสอบคูปองโปรโมชัน BBLM — เลือกเทมเพลต ใส่ข้อความ ดูตัวอย่างแบบเรียลไทม์ และ Export เป็น PNG ขนาดมาตรฐาน

## ฟีเจอร์หลัก

### สร้างคูปอง
- กำหนด **กลุ่มลูกค้า** — M Power Tier, สิทธิ์ที่ใช้ได้, ผู้ถือบัตร BBLM (Footer)
- เลือก **ประเภทคูปอง** และ **รูปแบบ Content** พร้อมกรอกข้อความ
- **Preview** วาดด้วย pipeline เดียวกับ Export (ขนาดฐาน 1040×1040 px)
- อัปโหลดรูปพื้นหลัง (ลาก/ซูม) และโลโก้มุมขวาบน
- **Export PNG** เลือกขนาด x1–x4 (1040–4160 px)

### ดูบนมือถือ
- อัปโหลดคูปองหลายรูป แล้วดูบน mock หน้าแอป (Home / Rewards / Detail)
- เลือกรุ่นมือถือและหน้าจอจำลอง

## ความต้องการของระบบ

- [Node.js](https://nodejs.org/) 18 ขึ้นไป (แนะนำ LTS)
- npm

## การติดตั้งและรัน

```bash
git clone git@github.com:nxtteex46/coupon.git
cd coupon
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### คำสั่งอื่น

| คำสั่ง | รายละเอียด |
|--------|------------|
| `npm run dev` | รันเซิร์ฟเวอร์พัฒนา (Vite) |
| `npm run build` | Build สำหรับ production → โฟลเดอร์ `dist/` |
| `npm run preview` | ดูผล build แบบ local |

## วิธีใช้งานโดยย่อ

1. แท็บ **สร้างคูปอง** — ตั้งค่าขั้นที่ 1 (กลุ่มลูกค้า) และขั้นที่ 2 (ประเภท/ข้อความ)
2. ฝั่ง **Preview** — คลิกพื้นที่สีเทาด้านบนเพื่ออัปโหลดรูป, อัปโหลดโลโก้ (ถ้าต้องการ)
3. ตรวจสอบตัวอย่าง — สิ่งที่เห็นใน Preview ตรงกับไฟล์ Export
4. เลือกขนาด Export แล้วกด **ดาวน์โหลด**
5. แท็บ **ดูบนมือถือ** — ทดสอบว่าคูปองดูเป็นอย่างไรบนหน้าจอแอป

### Footer (แถบดำด้านล่าง)
เปิดได้จากขั้นที่ 1 → ติ๊ก **ผู้ถือบัตร BBLM** → เลือกประเภทบัตรอย่างน้อย 1 รายการ

## โครงสร้างโปรเจกต์

```
src/
├── App.tsx                 # แท็บหลักและ state รวม
├── components/
│   ├── CouponPreview.tsx   # Preview, canvas render, Export
│   ├── TemplateForm.tsx    # ฟอร์มตั้งค่าเทมเพลต
│   ├── MobileDevicePreview.tsx
│   └── ...
├── data/templates.ts       # ตัวเลือกเทมเพลตและ layout
├── assets/                 # โลโก้, ฟอนต์ DB Airy, mock UI
└── types/
```

## เทคโนโลยี

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Canvas API สำหรับ Preview / Export
- ฟอนต์ **DB Airy** (ในคูปอง), IBM Plex Sans Thai / Sora (UI)

## หมายเหตุ

- ไฟล์ `.env` ไม่ถูก commit (อยู่ใน `.gitignore`)
- โฟลเดอร์ `node_modules/` และ `dist/` ไม่ควรอัปโหลดขึ้น Git — สร้างใหม่ด้วย `npm install` / `npm run build`

## License

Private project — ใช้ภายในทีม/องค์กรตามที่กำหนด
