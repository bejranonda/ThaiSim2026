# Cloudflare Pages - Quick Start Guide

ยังไม่เจออะไรที่ยุ่งซับซ้อนเหลือ - ขั้นตอนง่ายๆ เพียง 5 ขั้น!

## ✅ สิ่งที่คุณต้องเตรียม

1. **GitHub Account** - มีการ push code เรียบร้อย
2. **Cloudflare Account** - ฟรีก็ได้
3. **Firebase Credentials** - จาก Firebase Console

## 🚀 ขั้นตอน 5 ขั้น (ง่ายๆ)

### ขั้นที่ 1: ไปที่ Cloudflare Pages
```
https://pages.cloudflare.com
```

### ขั้นที่ 2: สร้างโปรเจกต์ใหม่
- คลิก **"Create a project"**
- เลือก **"Connect to Git"**
- ตรวจสอบ Cloudflare เข้าถึง GitHub ได้
- เลือก repository **ThaiSim2026**

### ขั้นที่ 3: ตั้งค่า Build
```
Build command: npm run build
Build output directory: dist
Branch: master
```
ตั้งค่าเสร็จ → คลิก **"Save and Deploy"**

### ขั้นที่ 4: ตั้งค่า Environment Variables ⭐ สำคัญมาก!
1. ไปที่ **Settings** → **Environment variables**
2. คลิก **"Add variable"** และเพิ่ม 7 ตัวนี้:

```
VITE_FIREBASE_API_KEY = [ค่าจาก Firebase]
VITE_FIREBASE_AUTH_DOMAIN = [ค่าจาก Firebase]
VITE_FIREBASE_PROJECT_ID = [ค่าจาก Firebase]
VITE_FIREBASE_STORAGE_BUCKET = [ค่าจาก Firebase]
VITE_FIREBASE_MESSAGING_SENDER_ID = [ค่าจาก Firebase]
VITE_FIREBASE_APP_ID = [ค่าจาก Firebase]
VITE_FIREBASE_MEASUREMENT_ID = [ค่าจาก Firebase]
```

3. Set for: **Production** (และ Staging ถ้าอยากได้)
4. คลิก **"Save"** และรอให้ redeploy อัตโนมัติ

### ขั้นที่ 5: เสร็จ!
รอสักครู่ แล้วคุณจะได้ URL:
```
https://thaisim2569.pages.dev
```
(หรือชื่อโปรเจกต์ของคุณแทน thaisim2569)

## 🔑 จะเอา Firebase Credentials มาจากไหน?

1. ไป Firebase Console
2. เลือก Project ของคุณ
3. คลิกไปที่ **⚙️ Project Settings**
4. ด้านล่าง **"Your apps"** → เลือก Web app
5. คุณจะเห็น object ที่เหมือนนี้:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "yourproject.firebaseapp.com",
  projectId: "yourproject",
  storageBucket: "yourproject.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-ABC123..."
};
```

**ทำการ Map** ดังนี้:
- `apiKey` → `VITE_FIREBASE_API_KEY`
- `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId` → `VITE_FIREBASE_PROJECT_ID`
- `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `VITE_FIREBASE_APP_ID`
- `measurementId` → `VITE_FIREBASE_MEASUREMENT_ID`

## 🎯 หลังจากตั้งค่าเสร็จ

✅ ทุกครั้งที่ push code ไป `master` branch บน GitHub
✅ Cloudflare จะ build และ deploy อัตโนมัติ
✅ ดูเวอร์ชันล่าสุดได้ที่ Deployments tab

## ❓ ปัญหาเบื้องต้น

### "Build Failed"
- ✅ ตรวจสอบให้แน่ใจว่า env variables ตั้งค่าถูก
- ✅ รอ 1-2 นาที แล้ว Retry deployment

### "Firebase Not Working"
- ✅ ตรวจสอบ env variables ตั้งค่าถูก (case-sensitive!)
- ✅ ไปที่ browser DevTools (F12) → Console เพื่อดู error
- ✅ ตรวจสอบ Firebase Security Rules อนุญาต reads/writes

### "SPA Routes ไม่เวิร์ก"
- ✅ ไฟล์ `_redirects` ต้องอยู่ใน folder `dist/`
- ✅ เช็คว่า build ไปเสร็จแล้ว

## 📚 ข้อมูลเพิ่มเติม

- 📖 [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) - คู่มายละเอียด
- 🔗 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 🔥 [Firebase Setup](https://firebase.google.com/docs/web/setup)

---

**ติดปัญหา?** ดูคู่มือเต็มใน [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)

**มีข้อสงสัย?** เปิด issue ใน GitHub repo 🎉
