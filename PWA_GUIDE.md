# 📱 Hướng dẫn sử dụng PWA (Progressive Web App)

## 🎯 PWA là gì?

PWA (Progressive Web App) là ứng dụng web có thể hoạt động như một ứng dụng native trên thiết bị di động và desktop. Ứng dụng quản lý bệnh nhân nội trú Ung bướu đã được tối ưu để hoạt động như PWA.

## ✨ Tính năng PWA

### 🔧 Cài đặt như ứng dụng thật
- Có icon riêng trên màn hình chính
- Mở trong cửa sổ riêng (không có thanh địa chỉ)
- Hoạt động độc lập với trình duyệt

### 📶 Hoạt động offline
- Lưu trữ dữ liệu khi offline
- Đồng bộ tự động khi có mạng
- Hiển thị thông báo khi offline

### 🔔 Push Notifications
- Nhận thông báo quan trọng
- Cập nhật trạng thái bệnh nhân
- Nhắc nhở công việc

### ⚡ Hiệu suất cao
- Tải nhanh hơn
- Sử dụng ít dữ liệu
- Cache thông minh

## 📱 Cách cài đặt PWA

### Android (Chrome/Edge/Samsung Internet)

#### Phương pháp 1: Từ trình duyệt
1. Mở website trên Chrome hoặc Edge
2. Nhấn menu (3 chấm) ở góc trên bên phải
3. Chọn **"Add to Home screen"** hoặc **"Install app"**
4. Nhấn **"Add"** để cài đặt
5. Icon app sẽ xuất hiện trên màn hình chính

#### Phương pháp 2: Từ banner cài đặt
1. Mở website
2. Nhấn banner **"Cài đặt ứng dụng"** (nếu có)
3. Nhấn **"Cài đặt"**
4. App sẽ được cài đặt tự động

### iOS (Safari)

#### Phương pháp 1: Từ Safari
1. Mở website trên Safari
2. Nhấn nút **Share** (hộp với mũi tên)
3. Cuộn xuống và chọn **"Add to Home Screen"**
4. Nhấn **"Add"** để cài đặt
5. Icon app sẽ xuất hiện trên màn hình chính

#### Phương pháp 2: Từ banner cài đặt
1. Mở website trên Safari
2. Nhấn banner **"Cài đặt ứng dụng"** (nếu có)
3. Làm theo hướng dẫn để cài đặt

### Desktop (Chrome/Edge/Firefox)

#### Chrome/Edge
1. Mở website
2. Nhấn icon **"Install"** ở thanh địa chỉ (nếu có)
3. Hoặc vào menu > **"Install [App Name]"**
4. Nhấn **"Install"** để cài đặt
5. App sẽ mở trong cửa sổ riêng

#### Firefox
1. Mở website
2. Nhấn menu (3 gạch) > **"Install"**
3. Nhấn **"Add"** để cài đặt

## 🚀 Cách sử dụng PWA

### 1. Mở ứng dụng
- Nhấn icon app trên màn hình chính
- App sẽ mở trong cửa sổ riêng (không có thanh địa chỉ)
- Giao diện giống như app native

### 2. Sử dụng offline
- App tự động lưu dữ liệu khi offline
- Có thể thêm, sửa, xóa bệnh nhân khi offline
- Dữ liệu sẽ được đồng bộ khi có mạng

### 3. Đồng bộ dữ liệu
- App tự động đồng bộ khi có mạng
- Hiển thị trạng thái đồng bộ ở header
- Thông báo khi đồng bộ thành công

### 4. Push Notifications
- Cho phép nhận thông báo khi được hỏi
- Nhận thông báo về cập nhật quan trọng
- Có thể tắt thông báo trong cài đặt

## 🔧 Cài đặt PWA

### 1. Cài đặt chung
- **Tự động cập nhật**: App tự động cập nhật khi có phiên bản mới
- **Cache**: App lưu trữ dữ liệu để tải nhanh hơn
- **Offline**: Hoạt động khi không có mạng

### 2. Cài đặt thông báo
- Vào **Settings** > **Notifications**
- Bật/tắt các loại thông báo
- Cài đặt thời gian nhận thông báo

### 3. Cài đặt đồng bộ
- Vào **Settings** > **Sync**
- Chọn tần suất đồng bộ
- Xem trạng thái đồng bộ

## 📊 Trạng thái PWA

### 1. Trạng thái cài đặt
- **Đã cài đặt**: App đã được cài đặt trên thiết bị
- **Có thể cài đặt**: App có thể được cài đặt
- **Không hỗ trợ**: Trình duyệt không hỗ trợ PWA

### 2. Trạng thái mạng
- **Trực tuyến**: Có kết nối mạng
- **Offline**: Không có kết nối mạng
- **Đồng bộ**: Đang đồng bộ dữ liệu

### 3. Trạng thái cache
- **Đã cache**: Dữ liệu đã được lưu trữ
- **Đang cache**: Đang lưu trữ dữ liệu
- **Cần cập nhật**: Cần cập nhật cache

## 🛠️ Troubleshooting

### App không cài đặt được
1. **Kiểm tra trình duyệt**: Đảm bảo sử dụng Chrome, Edge, hoặc Safari mới nhất
2. **Kiểm tra HTTPS**: App chỉ cài đặt được trên HTTPS
3. **Kiểm tra manifest**: Đảm bảo manifest.json hoạt động đúng
4. **Xóa cache**: Xóa cache trình duyệt và thử lại

### App không hoạt động offline
1. **Kiểm tra Service Worker**: Đảm bảo Service Worker đã được đăng ký
2. **Kiểm tra cache**: Xóa cache và tải lại
3. **Kiểm tra dữ liệu**: Đảm bảo có dữ liệu để hiển thị offline

### Thông báo không hoạt động
1. **Kiểm tra quyền**: Đảm bảo đã cho phép thông báo
2. **Kiểm tra cài đặt**: Kiểm tra cài đặt thông báo trong app
3. **Kiểm tra trình duyệt**: Đảm bảo trình duyệt hỗ trợ thông báo

### Đồng bộ không hoạt động
1. **Kiểm tra mạng**: Đảm bảo có kết nối mạng ổn định
2. **Kiểm tra Firebase**: Đảm bảo Firebase hoạt động đúng
3. **Kiểm tra dữ liệu**: Đảm bảo dữ liệu hợp lệ

## 📈 Lợi ích của PWA

### 1. Trải nghiệm người dùng
- **Nhanh hơn**: Tải nhanh hơn app web thông thường
- **Mượt mà hơn**: Hoạt động mượt mà như app native
- **Tiện lợi hơn**: Có thể cài đặt và sử dụng như app thật

### 2. Hiệu suất
- **Ít dữ liệu**: Sử dụng ít dữ liệu hơn
- **Cache thông minh**: Lưu trữ dữ liệu để tải nhanh
- **Offline**: Hoạt động khi không có mạng

### 3. Bảo mật
- **HTTPS**: Chỉ hoạt động trên HTTPS
- **Service Worker**: Bảo mật cao hơn
- **Isolation**: Hoạt động độc lập với trình duyệt

## 🎯 Kết luận

PWA giúp ứng dụng quản lý bệnh nhân nội trú Ung bướu hoạt động tốt hơn, nhanh hơn và tiện lợi hơn. Người dùng có thể cài đặt và sử dụng như một ứng dụng native thật sự, với đầy đủ tính năng offline và đồng bộ dữ liệu.

Hãy cài đặt PWA để có trải nghiệm tốt nhất! 🚀