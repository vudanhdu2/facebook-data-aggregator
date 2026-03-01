# LarkSuite Uploader (Markdown + Image)

Ứng dụng React + Vite để:

- Lấy `tenant_access_token` từ LarkSuite/Feishu Open API.
- Upload file Markdown (`.md`) qua API file.
- Upload ảnh (`png/jpg/webp...`) qua API image.

## Chạy local

```bash
npm install
npm run dev
```

Mở trình duyệt tại URL Vite hiển thị trong terminal.

## Cách dùng nhanh

1. Nhập **App ID** và **App Secret** rồi bấm **Lấy tenant access token**.
2. Hoặc dán sẵn `tenant_access_token` vào ô token.
3. Chọn file `.md` và bấm **Upload Markdown**.
4. Chọn ảnh và bấm **Upload ảnh**.
5. Xem `file_key` / `image_key` ở phần kết quả.

## Lưu ý bảo mật

- Không nên để lộ `app_secret` ở frontend production.
- Nên triển khai backend/proxy để gọi API token và ký request an toàn hơn.
- Nếu gặp CORS trong môi trường frontend thuần, hãy chuyển qua backend trung gian.
