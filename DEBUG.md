# 🐛 Debug Guide - My GMAT Vocab

## ❌ Vấn đề: Nhấn Shift không hoạt động

### ✅ Checklist để kiểm tra:

#### 1. **Extension đã load đúng chưa?**
- Mở `chrome://extensions/`
- Tìm "My GMAT Vocab"
- Check xem có lỗi gì không (chữ đỏ)
- Nếu có lỗi → Click "Reload" (icon reload)

#### 2. **Test với trang debug**
```
Mở file: C:\Users\quanc\.gemini\antigravity\scratch\my-gmat-vocab\test.html
```
- Bôi đen từ "attribute"
- Nhấn Shift 1 lần
- Xem debug output phía dưới trang

#### 3. **Kiểm tra Console Log**
- Mở bất kỳ trang web nào
- Nhấn **F12** (mở DevTools)
- Chọn tab **Console**
- Bôi đen một từ
- Nhấn **Shift**
- Bạn sẽ thấy log:
  ```
  ✅ My GMAT Vocab: Content script loaded successfully!
  🔑 My GMAT Vocab: Shift key detected!
  📝 My GMAT Vocab: Selected text: <từ bạn chọn>
  ✅ My GMAT Vocab: Showing popup for word: <từ>
  🎨 My GMAT Vocab: Creating popup overlay...
  ```

#### 4. **Nếu KHÔNG thấy log gì cả**
Nghĩa là content script chưa load. Thử:
- Reload extension: `chrome://extensions/` → Click reload
- Reload lại trang web (F5)
- Kiểm tra lại

#### 5. **Nếu thấy log "⚠️ No text selected"**
- Bạn chưa bôi đen text đủ rõ
- Thử bôi đen lại, đảm bảo text được highlight (màu xanh)

#### 6. **Test trên nhiều trang khác nhau**
- Wikipedia: https://en.wikipedia.org
- Google: https://google.com
- Bất kỳ trang web nào

---

## 🔧 Các bước debug:

### Bước 1: Reload Extension
```
1. Mở chrome://extensions/
2. Tìm "My GMAT Vocab"
3. Click biểu tượng reload (↻)
```

### Bước 2: Reload Page
```
1. Mở trang web bất kỳ
2. Nhấn F5 để reload
```

### Bước 3: Test
```
1. Bôi đen một từ
2. Nhấn Shift
3. Nhấn F12 → xem Console
```

---

## 📊 Các lỗi thường gặp:

### Lỗi 1: "Extension context invalidated"
**Giải pháp**: Reload extension + reload page

### Lỗi 2: Content script không load
**Giải pháp**: 
- Check manifest.json đúng chưa
- Check quyền `<all_urls>` trong manifest
- Reload extension

### Lỗi 3: Shift không trigger
**Nguyên nhân có thể**:
- Text chưa được select đúng cách
- Extension chưa load
- Conflict với extension khác

**Giải pháp**:
- Disable các extension khác tạm thời
- Thử trên Incognito mode: `Ctrl+Shift+N`
- Enable extension trong Incognito:
  - `chrome://extensions/`
  - Tìm "My GMAT Vocab"
  - Click "Details"
  - Bật "Allow in incognito"

---

## 🎯 Test ngay bây giờ:

1. **Mở test.html**:
   ```
   File explorer → my-gmat-vocab → test.html → Kéo vào Chrome
   ```

2. **Bôi đen từ "attribute"**

3. **Nhấn Shift 1 lần**

4. **Xem kết quả**:
   - Có popup xuất hiện? ✅
   - Không có gì? ❌ → Mở Console (F12) xem log

---

## 💡 Debug Commands (Console)

Paste vào Console để test:

```javascript
// Test 1: Check if content script loaded
console.log('Testing My GMAT Vocab...');

// Test 2: Manually trigger
const text = window.getSelection().toString().trim();
console.log('Selected text:', text);

// Test 3: Check for popup
const overlay = document.getElementById('my-gmat-vocab-overlay');
console.log('Popup exists:', !!overlay);
```

---

## 📞 Nếu vẫn không được:

Chụp màn hình:
1. `chrome://extensions/` (show extension status)
2. Console tab (F12) với log messages
3. Test page với text selected

Gửi cho tôi để debug tiếp!
