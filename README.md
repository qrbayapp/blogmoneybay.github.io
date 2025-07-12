# MoneyBay - Ứng Dụng Quản Lý Chi Tiêu

Ứng dụng web quản lý chi tiêu hiện đại với giao diện đẹp mắt và tính năng đầy đủ.

## 🌟 Tính Năng Chính

### 📊 Tổng Quan Tài Chính
- **Tổng Thu**: Hiển thị tổng thu nhập
- **Tổng Chi**: Hiển thị tổng chi tiêu  
- **Số Dư**: Tính toán số dư hiện tại
- **Biểu Đồ**: Biểu đồ tròn thể hiện chi tiêu theo danh mục

### 💰 Quản Lý Giao Dịch
- **Thêm Thu Nhập**: Ghi nhận các khoản thu nhập
- **Thêm Chi Tiêu**: Ghi nhận các khoản chi tiêu
- **Chỉnh Sửa**: Sửa đổi thông tin giao dịch
- **Xóa**: Xóa giao dịch không cần thiết

### 📋 Danh Mục Chi Tiêu
**Thu Nhập:**
- Lương
- Thưởng
- Đầu tư
- Kinh doanh
- Khác

**Chi Tiêu:**
- Ăn uống
- Di chuyển
- Nhà ở
- Mua sắm
- Giải trí
- Y tế
- Giáo dục
- Tiện ích
- Khác

### 🔍 Lọc và Tìm Kiếm
- Lọc theo loại giao dịch (Thu nhập/Chi tiêu)
- Lọc theo danh mục
- Hiển thị lịch sử giao dịch theo thời gian

### 📈 Báo Cáo và Phân Tích
- Biểu đồ tròn thể hiện tỷ lệ chi tiêu theo danh mục
- Thống kê chi tiết với phần trăm
- Xuất dữ liệu dưới dạng JSON

## 🚀 Cách Sử Dụng

### 1. Khởi Động
- Mở file `index.html` trong trình duyệt web
- Ứng dụng sẽ tự động tải dữ liệu từ localStorage

### 2. Thêm Giao Dịch
1. Nhấn nút **"Thêm Thu Nhập"** hoặc **"Thêm Chi Tiêu"**
2. Điền thông tin:
   - **Mô tả**: Mô tả giao dịch
   - **Số tiền**: Số tiền (VNĐ)
   - **Danh mục**: Chọn danh mục phù hợp
   - **Ngày**: Ngày giao dịch
3. Nhấn **"Lưu"** để hoàn tất

### 3. Quản Lý Giao Dịch
- **Chỉnh sửa**: Nhấn biểu tượng bút chì
- **Xóa**: Nhấn biểu tượng thùng rác
- **Lọc**: Sử dụng dropdown để lọc giao dịch

### 4. Xuất Dữ Liệu
- Dữ liệu được tự động lưu trong localStorage
- Có thể xuất dữ liệu ra file JSON để sao lưu

## 🎨 Giao Diện

### Thiết Kế Hiện Đại
- **Responsive**: Tương thích với mọi thiết bị
- **Gradient**: Sử dụng gradient đẹp mắt
- **Animation**: Hiệu ứng mượt mà
- **Icons**: Sử dụng Font Awesome icons

### Màu Sắc
- **Thu nhập**: Xanh lá (#28a745)
- **Chi tiêu**: Đỏ (#dc3545)
- **Số dư**: Xanh dương (#007bff)

## 📱 Tương Thích

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling và responsive design
- **JavaScript ES6+**: Logic ứng dụng
- **Chart.js**: Biểu đồ tương tác
- **Font Awesome**: Icons
- **LocalStorage**: Lưu trữ dữ liệu

## 📁 Cấu Trúc File

```
blogmoneybay.github.io/
├── index.html          # Trang chính
├── styles.css          # CSS styles
├── script.js           # JavaScript logic
└── README.md           # Hướng dẫn sử dụng
```

## 🔧 Tùy Chỉnh

### Thêm Danh Mục Mới
Chỉnh sửa file `script.js`, phần `categories`:

```javascript
this.categories = {
    income: [
        'Lương',
        'Thưởng',
        'Đầu tư',
        'Kinh doanh',
        'Khác',
        'Danh mục mới'  // Thêm vào đây
    ],
    expense: [
        'Ăn uống',
        'Di chuyển',
        'Nhà ở',
        'Mua sắm',
        'Giải trí',
        'Y tế',
        'Giáo dục',
        'Tiện ích',
        'Khác',
        'Danh mục mới'  // Thêm vào đây
    ]
};
```

### Thay Đổi Màu Sắc
Chỉnh sửa file `styles.css`:

```css
.card-icon.income {
    background: linear-gradient(135deg, #your-color 0%, #your-color 100%);
}
```

## 💡 Mẹo Sử Dụng

1. **Sử dụng thường xuyên**: Ghi nhận mọi giao dịch để có báo cáo chính xác
2. **Phân loại rõ ràng**: Chọn danh mục phù hợp để dễ theo dõi
3. **Kiểm tra biểu đồ**: Xem biểu đồ để hiểu rõ chi tiêu của mình
4. **Sao lưu dữ liệu**: Xuất dữ liệu định kỳ để tránh mất mát

## 🐛 Xử Lý Lỗi

### Dữ liệu không hiển thị
- Kiểm tra localStorage trong Developer Tools
- Refresh trang web

### Biểu đồ không hiển thị
- Kiểm tra kết nối internet (Chart.js CDN)
- Thử thêm giao dịch chi tiêu mới

### Giao diện bị lỗi
- Kiểm tra file CSS và JavaScript có được tải đúng không
- Thử trình duyệt khác

## 📞 Hỗ Trợ

Nếu gặp vấn đề hoặc có góp ý, vui lòng:
1. Kiểm tra console trong Developer Tools
2. Thử refresh trang web
3. Xóa cache trình duyệt

---

**MoneyBay** - Giúp bạn quản lý tài chính một cách thông minh và hiệu quả! 💰✨ 