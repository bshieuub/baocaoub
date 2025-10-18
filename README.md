# 🏥 Hệ Thống Quản Lý Bệnh Nhân Nội Trú Ung Bướu

Ứng dụng web quản lý bệnh nhân nội trú chuyên khoa ung bướu với giao diện hiện đại và bảo mật cao.

## ✨ Tính Năng

- 🔐 **Xác thực người dùng** với Firebase Authentication
- 👥 **Quản lý bệnh nhân** - Thêm, sửa, xóa thông tin bệnh nhân
- 📊 **Báo cáo hàng ngày** - In báo cáo bệnh nhân nội trú
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- 🔍 **Tìm kiếm nâng cao** - Tìm theo tên, mã số bệnh nhân
- 📝 **Lịch sử điều trị** - Theo dõi diễn biến bệnh nhân
- 🖨️ **In báo cáo** - Xuất báo cáo PDF chất lượng cao

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js 18+ 
- npm hoặc yarn
- Tài khoản Firebase

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd quản-lý-bệnh-nhân-nội-trú-ung-bướu
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Firebase
1. Tạo project Firebase mới tại [Firebase Console](https://console.firebase.google.com)
2. Bật Authentication và Firestore Database
3. Copy file `.env.example` thành `.env.local`
4. Điền thông tin Firebase vào `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Bước 4: Cấu Hình Firestore Security Rules
1. Vào Firebase Console > Firestore Database > Rules
2. Thay thế rules mặc định bằng nội dung trong file `firestore.rules`
3. Publish rules

### Bước 5: Chạy Ứng Dụng
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Kiến Trúc

```
src/
├── components/          # React Components
│   ├── AuthGate.tsx    # Authentication wrapper
│   ├── LoginPage.tsx   # Login form
│   ├── App.tsx         # Main application
│   ├── Modal.tsx       # Reusable modal
│   ├── PatientForm.tsx # Patient form
│   ├── PatientTable.tsx# Patient list table
│   ├── ReportView.tsx  # Report view
│   ├── ConfirmModal.tsx# Confirmation dialog
│   └── SyncStatusIndicator.tsx # Sync status
├── hooks/              # Custom React Hooks
│   └── usePatients.ts  # Patient data management
├── services/           # Business Logic
│   └── patientService.ts # Firebase operations
├── types/              # TypeScript Types
│   └── patient.ts      # Patient data types
├── utils/              # Utility Functions
│   └── validation.ts   # Input validation
├── config/             # Configuration
│   └── firebase.ts     # Firebase config
└── main.tsx           # Application entry point
```

## 🔒 Bảo Mật

- ✅ Firebase config được bảo vệ bằng environment variables
- ✅ Firestore Security Rules chỉ cho phép user đã xác thực
- ✅ Input validation và sanitization
- ✅ Error handling toàn diện
- ✅ HTTPS enforcement

## 🎨 UI/UX

- **Responsive Design**: Tối ưu cho desktop, tablet, mobile
- **Loading States**: Skeleton loading và progress indicators
- **Error Handling**: Thông báo lỗi thân thiện
- **Accessibility**: ARIA labels và keyboard navigation
- **Print Support**: Tối ưu cho in báo cáo

## 📊 Performance

- **Code Splitting**: Lazy loading components
- **Bundle Optimization**: Tree shaking và minification
- **Caching**: React Query cho data caching
- **TypeScript**: Type safety và better DX

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint checking
npm run lint:fix     # Fix ESLint issues
```

### Code Style
- ESLint + Prettier
- TypeScript strict mode
- React Hooks best practices
- Component composition

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
- Netlify
- AWS S3 + CloudFront
- DigitalOcean App Platform

## 📝 Changelog

### v2.0.0 (Current)
- ✅ Refactored to TypeScript
- ✅ Modular architecture
- ✅ Enhanced security
- ✅ Improved UI/UX
- ✅ Better error handling
- ✅ Input validation

### v1.0.0 (Legacy)
- Basic patient management
- Firebase integration
- Print functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Email: bshieuubdl@gmail.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

Made with ❤️ for healthcare professionals