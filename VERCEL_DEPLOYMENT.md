# Hướng dẫn triển khai lên Vercel

## Bước 1: Chuẩn bị môi trường

### 1.1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### 1.2. Đăng nhập Vercel
```bash
vercel login
```

## Bước 2: Cấu hình Environment Variables

### 2.1. Tạo file .env.local
```bash
cp .env.example .env.local
```

### 2.2. Cập nhật các biến môi trường trong .env.local
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Bước 3: Triển khai

### 3.1. Triển khai lần đầu
```bash
vercel
```

### 3.2. Cấu hình Environment Variables trên Vercel Dashboard
1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào Settings > Environment Variables
4. Thêm các biến môi trường:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GEMINI_API_KEY` (optional)

### 3.3. Redeploy sau khi cấu hình environment variables
```bash
vercel --prod
```

## Bước 4: Cấu hình Firebase

### 4.1. Cập nhật Firebase Security Rules
Deploy rules mới lên Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Patients collection - only authenticated users can read/write with validation
    match /patients/{document} {
      allow read, write: if request.auth != null 
        && isValidPatientData(request.resource.data)
        && isValidUser(request.auth);
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
  
  // Validation functions
  function isValidPatientData(data) {
    return data.keys().hasAll(['name', 'patientCode', 'roomNumber', 'diagnosis', 'status'])
      && data.name is string
      && data.patientCode is string
      && data.roomNumber is string
      && data.diagnosis is string
      && data.status in ['Nội trú', 'Ra viện', 'Dự kiến ra viện']
      && data.name.size() >= 2
      && data.name.size() <= 100
      && data.patientCode.size() >= 3
      && data.patientCode.size() <= 20
      && data.roomNumber.size() >= 1
      && data.roomNumber.size() <= 10
      && data.diagnosis.size() >= 3
      && data.diagnosis.size() <= 500;
  }
  
  function isValidUser(auth) {
    return auth != null
      && auth.token.email_verified == true
      && auth.token.email.matches('.*@.*\\.com$');
  }
}
```

### 4.2. Cấu hình Firebase Authentication
1. Vào Firebase Console > Authentication
2. Bật Email/Password authentication
3. Thêm domain Vercel vào Authorized domains

## Bước 5: Kiểm tra triển khai

### 5.1. Kiểm tra build locally
```bash
npm run build
npm run preview
```

### 5.2. Kiểm tra trên Vercel
1. Vào Vercel Dashboard
2. Kiểm tra build logs
3. Test các tính năng chính

## Bước 6: Cấu hình Custom Domain (Optional)

### 6.1. Thêm custom domain
1. Vào Vercel Dashboard > Settings > Domains
2. Thêm domain của bạn
3. Cấu hình DNS records

### 6.2. Cập nhật Firebase Authorized domains
Thêm custom domain vào Firebase Console > Authentication > Settings

## Troubleshooting

### Lỗi Build
```bash
# Kiểm tra TypeScript errors
npm run type-check

# Kiểm tra linting errors
npm run lint

# Build locally để test
npm run build
```

### Lỗi Environment Variables
- Kiểm tra tất cả biến môi trường đã được set trên Vercel
- Đảm bảo tên biến bắt đầu với `VITE_`
- Redeploy sau khi thay đổi environment variables

### Lỗi Firebase
- Kiểm tra Firebase config
- Kiểm tra Security Rules
- Kiểm tra Authentication settings

### Lỗi PWA
- Đảm bảo HTTPS được enable
- Kiểm tra Service Worker
- Kiểm tra manifest.json

## Các lệnh hữu ích

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Xem logs
vercel logs

# Xem thông tin project
vercel ls

# Xóa deployment
vercel remove
```

## Monitoring

### Vercel Analytics
1. Vào Vercel Dashboard > Analytics
2. Xem performance metrics
3. Monitor errors

### Firebase Analytics
1. Vào Firebase Console > Analytics
2. Xem user behavior
3. Monitor crashes

## Backup và Recovery

### Database Backup
```bash
# Export data từ Firebase
firebase firestore:export gs://your-bucket/backup

# Import data vào Firebase
firebase firestore:import gs://your-bucket/backup
```

### Code Backup
```bash
# Clone repository
git clone your-repo-url

# Backup to different service
git remote add backup your-backup-repo-url
git push backup main
```