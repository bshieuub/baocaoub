# 🚀 Hướng Dẫn Triển Khai Vercel

## Bước 1: Chuẩn bị Environment Variables

### 1.1. Lấy thông tin Firebase từ file .env.local
```bash
# Mở file .env.local và copy các giá trị sau:
VITE_FIREBASE_API_KEY=AIzaSyCSbyl8FkGDjoUCUuO2EtShH--uAHOL3hY
VITE_FIREBASE_AUTH_DOMAIN=noitruub.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=noitruub
VITE_FIREBASE_STORAGE_BUCKET=noitruub.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=938135666001
VITE_FIREBASE_APP_ID=1:938135666001:web:2476aba951c1a2b24fa770
VITE_FIREBASE_MEASUREMENT_ID=G-WBZ3PTNKXZ
```

## Bước 2: Cấu hình Vercel

### 2.1. Đăng nhập Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub account
3. Click "New Project"

### 2.2. Import Project
1. Chọn repository từ GitHub
2. Vercel sẽ tự động detect Vite framework
3. Click "Deploy" (chưa cần cấu hình gì thêm)

### 2.3. Cấu hình Environment Variables
1. Vào **Settings** > **Environment Variables**
2. Thêm từng biến môi trường:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCSbyl8FkGDjoUCUuO2EtShH--uAHOL3hY` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `noitruub.firebaseapp.com` | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | `noitruub` | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | `noitruub.firebasestorage.app` | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `938135666001` | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | `1:938135666001:web:2476aba951c1a2b24fa770` | Production, Preview, Development |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-WBZ3PTNKXZ` | Production, Preview, Development |

### 2.4. Redeploy
1. Sau khi thêm tất cả Environment Variables
2. Vào **Deployments** tab
3. Click **"Redeploy"** trên deployment mới nhất
4. Hoặc push một commit mới để trigger auto-deploy

## Bước 3: Cấu hình Firebase Security Rules

### 3.1. Mở Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Chọn project `noitruub`

### 3.2. Cấu hình Firestore Rules
1. Vào **Firestore Database** > **Rules**
2. Thay thế nội dung bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Patients collection - only authenticated users can read/write
    match /patients/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Bước 4: Test Ứng Dụng

### 4.1. Truy cập URL
- URL sẽ có dạng: `https://your-project-name.vercel.app`

### 4.2. Test các chức năng
1. **Đăng nhập**: Sử dụng tài khoản Firebase đã tạo
2. **Thêm bệnh nhân**: Test form validation
3. **Sửa thông tin**: Test edit functionality
4. **Xóa bệnh nhân**: Test delete với confirmation
5. **In báo cáo**: Test print functionality
6. **Tìm kiếm**: Test search và filter

## Bước 5: Cấu hình Domain (Tùy chọn)

### 5.1. Thêm Custom Domain
1. Vào **Settings** > **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

### 5.2. Cấu hình SSL
- Vercel tự động cấu hình SSL certificate

## 🔧 Troubleshooting

### Lỗi: "Environment Variable references Secret which does not exist"
**Nguyên nhân**: File `vercel.json` có cấu hình sai
**Giải pháp**: Đã xóa file `vercel.json`, Vercel sẽ tự động detect Vite

### Lỗi: "Firebase config is not valid"
**Nguyên nhân**: Environment Variables chưa được set đúng
**Giải pháp**: Kiểm tra lại tất cả biến môi trường trong Vercel Dashboard

### Lỗi: "Build failed"
**Nguyên nhân**: TypeScript hoặc dependency errors
**Giải pháp**: 
```bash
# Test build local
npm run build
npm run type-check
```

### Lỗi: "404 on refresh"
**Nguyên nhân**: SPA routing không được handle
**Giải pháp**: Vercel tự động handle SPA routing cho Vite

## 📊 Performance Tips

### 1. Optimize Bundle Size
- Code splitting đã được cấu hình
- Manual chunks cho vendor và firebase
- Tree shaking tự động

### 2. Caching
- Static assets được cache tự động
- API calls có thể cache với React Query

### 3. Monitoring
- Vercel Analytics tự động
- Error tracking với Vercel Functions

## 🎯 Kết Quả

Sau khi triển khai thành công:
- ✅ Ứng dụng web hoạt động trên Vercel
- ✅ HTTPS tự động
- ✅ Auto-deploy khi push code
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Custom domain (nếu cấu hình)

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Vercel Dashboard
2. Test build local: `npm run build`
3. Kiểm tra Environment Variables
4. Kiểm tra Firebase Security Rules