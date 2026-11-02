# Thiệp cưới Tuấn & Dung

Thiệp mời cưới một trang, viết bằng HTML, CSS và JavaScript thuần. Không dùng build step, framework hay npm package. Chạy bằng `python3 -m http.server 8080`.

## Credit và quyền sử dụng

- **Mẫu thiệp gốc:** [quanbui210/wedding-invitation](https://github.com/quanbui210/wedding-invitation).
- **Quyền sử dụng:** tác giả quanbui210 đã đồng ý trong [issue #1](https://github.com/quanbui210/wedding-invitation/issues/1) (2026-11-02). Tác giả xác nhận dự án được tuỳ ý sử dụng và chỉnh sửa code, mẫu, hình minh hoạ cho phù hợp, và không yêu cầu ghi credit. Dự án vẫn giữ credit như dưới đây.
- **Phần lấy từ mẫu:** cành hồng mai trong `assets/js/flora.js` (hàm `maiShapes`). Hình nhà, trà và bánh trong `assets/js/sketches.js` (chép từ `sketches.js` của repo gốc, kèm hàm vẽ hoa mai, trái tim và lá). Các phần khác được viết lại cho dự án này.
- **Credit trên thiệp:** icon hoa nhỏ ở cuối phần mời, dẫn tới repo gốc. Tên hiển thị cho trình đọc màn hình lấy từ khoá `credit` trong `config.js`.

## Cấu trúc

- `config.js`: toàn bộ nội dung (tên, ngày, địa điểm, ảnh, nhạc, chữ VI/EN).
- `index.html`: khung trang và thẻ meta.
- `assets/css/style.css`: toàn bộ kiểu dáng, token màu và font ở `:root`.
- `assets/js/main.js`: mở thiệp, chữ, hero, nhà hai bên, nhạc.
- `assets/js/events.js`: lễ cưới, chương trình, lịch (xé lịch hoặc trang tháng).
- `assets/js/album.js`: album và xem ảnh toàn màn hình.
- `assets/js/rsvp.js`: form xác nhận tham dự.
- `assets/js/calendar.js`: hàm ngày tháng.
- `assets/js/flora.js`: hoa lá và cánh hoa rơi ở cover.
- `assets/js/sketches.js`: hình vẽ tay (nhà, đèn lồng, trà, bánh, tơ hồng).
- `assets/js/guest.js`: làm sạch tên khách từ `?to=`.
- `tests/`: kiểm tra bằng `node --test tests/*.test.js`.

## Việc còn thiếu

Ngày, địa điểm, tên bố mẹ, ảnh, file nhạc `assets/music/background.mp3`, và tên miền. Các chỗ chưa có đều đánh dấu `TODO` trong `config.js`.
