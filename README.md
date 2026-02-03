# My GMAT Vocab

> Chrome Extension để tra từ nhanh và quản lý từ vựng GMAT với TracAu.vn

## 📖 Giới thiệu

**My GMAT Vocab** là một Chrome Extension được thiết kế đặc biệt cho người học GMAT, giúp tra từ vựng tiếng Anh-Việt nhanh chóng và quản lý từ vựng hiệu quả.

### ✨ Tính năng chính

- **Tra từ nhanh**: Bôi đen từ và nhấn Shift 1 lần để tra ngay trên trang web
- **Tích hợp TracAu.vn**: Sử dụng API của TracAu.vn để có nghĩa chính xác và đầy đủ
- **Quản lý danh sách**: Tạo nhiều danh sách từ vựng theo chủ đề (GMAT Week1, BS1, BS2...)
- **Lưu trữ đầy đủ**: Lưu từ, phiên âm, nghĩa, và ví dụ câu
- **Trang xem lại**: Giao diện đẹp để xem lại và quản lý từ vựng đã lưu
- **Sắp xếp linh hoạt**: Mới nhất, cũ nhất, A-Z, Z-A
- **Di chuyển từ**: Chuyển từ giữa các danh sách
- **Thiết kế đẹp**: Màu xanh dương và trắng, hiện đại và chuyên nghiệp

## 🚀 Cài đặt

### Bước 1: Tải Extension

Clone hoặc download repository này về máy:

```bash
git clone <repository-url>
cd my-gmat-vocab
```

### Bước 2: Load vào Chrome

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục `my-gmat-vocab`
5. Extension đã sẵn sàng sử dụng! 🎉

## 📚 Hướng dẫn sử dụng

### Tra từ nhanh

1. Truy cập bất kỳ trang web nào (ví dụ: bài đọc GMAT)
2. Bôi đen từ bạn muốn tra
3. Nhấn phím **Shift** 1 lần
4. Popup tra từ xuất hiện giữa màn hình
5. Click **"Lưu từ"** và chọn danh sách để lưu

### Tạo danh sách mới

**Cách 1**: Khi lưu từ
- Click "Lưu từ" → Click "**+ Tạo danh sách mới**"
- Nhập tên (ví dụ: "GMAT Week 1")

**Cách 2**: Trong trang xem lại
- Click icon extension trên thanh toolbar
- Click nút **"+"** ở sidebar
- Nhập tên danh sách

### Xem lại từ vựng

1. Click icon **My GMAT Vocab** trên thanh toolbar
2. Chọn danh sách từ sidebar
3. Xem tất cả từ đã lưu với nghĩa đầy đủ
4. Sử dụng các tính năng:
   - **Sắp xếp**: Dropdown ở góc phải
   - **Xóa từ**: Click nút "Xóa" trên mỗi thẻ từ
   - **Chuyển từ**: Click "Chuyển" để di chuyển sang danh sách khác
   - **Đổi tên/Xóa danh sách**: Click icon ⚙️

## 🎨 Giao diện

### Popup tra từ
- Hiện giữa màn hình
- Hiển thị đầy đủ nghĩa từ TracAu.vn
- Dropdown chọn danh sách để lưu

### Trang xem lại
- **Sidebar**: Danh sách các list với số lượng từ
- **Main content**: Các thẻ từ với đầy đủ thông tin
- **Design**: Xanh dương sáng (#2563eb) + Trắng

## 🛠️ Cấu trúc Project

```
my-gmat-vocab/
├── manifest.json              # Chrome extension manifest
├── assets/
│   └── icons/                 # Extension icons (16, 48, 128)
├── src/
│   ├── content/
│   │   ├── content-script.js  # Detect selection, show popup
│   │   └── content-styles.css # Popup overlay styles
│   ├── vocabulary/
│   │   ├── vocabulary.html    # Review page
│   │   ├── vocabulary.js      # Review page logic
│   │   └── vocabulary.css     # Review page styles
│   ├── background/
│   │   └── background.js      # Service worker
│   └── utils/
│       ├── api.js             # TracAu.vn API wrapper
│       └── storage.js         # Storage operations
└── README.md
```

## 🔧 Kỹ thuật

- **Manifest Version**: 3 (Latest)
- **Storage**: Chrome Local Storage
- **API**: TracAu.vn REST API
- **Framework**: Vanilla JavaScript (No dependencies)
- **Design**: Modern CSS with gradients and animations

## 📝 Lưu ý

### TracAu.vn API
Extension này sử dụng API của TracAu.vn. Theo điều khoản của TracAu:
- Đã gửi email xin phép sử dụng API
- Chỉ sử dụng cho mục đích phi lợi nhuận
- Hiển thị credit cho TracAu.vn

### Dữ liệu
- Tất cả dữ liệu lưu trên máy local (Chrome Local Storage)
- Không đồng bộ giữa các thiết bị (MVP version)
- An toàn và riêng tư

## 🚧 Tính năng tương lai

- [ ] Flashcard mode để ôn tập
- [ ] Thống kê học tập (số từ đã học, streak...)
- [ ] Export ra Excel, PDF, Anki
- [ ] Phát âm từ
- [ ] Customize keyboard shortcut trong Settings
- [ ] Chrome Sync Storage để đồng bộ đa thiết bị

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Tạo issue hoặc pull request nếu bạn có ý tưởng cải thiện.

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và phi lợi nhuận.


---

**Happy Learning! 📚✨**
