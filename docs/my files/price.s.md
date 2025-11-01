#
# Bảng So Sánh Mức Giá Sportmonks vs API-Football

| **Mức Giá / API** | **Giá (Tháng / Năm)** | **Giải đấu / Phạm vi** | **Tính năng chính** | **Giới hạn API Calls** | **Ghi chú / Đối tượng phù hợp** |
|--------------------|------------------------|--------------------------|----------------------|--------------------------|----------------------------------|
| **Sportmonks – Free Plan** | Miễn phí (không hết hạn) | 2 giải đấu (Danish Superliga, Scottish Premiership) | Dùng để test API | Không chỉ định cụ thể | Phù hợp test, demo |
| **Sportmonks – European Plan** | €39/tháng hoặc €34/tháng (hàng năm, €408/năm) | Giải đấu lớn châu Âu | Tính năng cơ bản | Không chỉ định | Ứng dụng tập trung vào châu Âu |
| **Sportmonks – Worldwide Plan** | €129/tháng hoặc €112/tháng (hàng năm, €1,344/năm) | Tất cả giải đấu lớn toàn cầu | Tính năng nâng cao | Không chỉ định | Ứng dụng toàn cầu |
| **Sportmonks – Enterprise Plan** | Liên hệ để báo giá (custom) | >2,200 giải đấu | Hỗ trợ tùy chỉnh, đầy đủ | Không chỉ định | Người dùng chuyên nghiệp |
| **Sportmonks – Custom Plan** | Tùy chỉnh (ví dụ: €116 cho 50 giải) | Giải đấu do người dùng chọn | Tùy chọn feature (weather, fixtures, players, injuries, ...) | Không chỉ định | Startup, cần linh hoạt |
| **Sportmonks – Add-ons** | Liên hệ (giá tùy chỉnh) | Áp dụng mọi gói | Predictions API, News API, Football Widgets,... | – | Nâng cao ứng dụng |

---

| **Mức Giá / API** | **Giá (Tháng)** | **Giới hạn requests/ngày** | **Giải đấu / Phạm vi** | **Tính năng chính** | **Ghi chú / Đối tượng phù hợp** |
|--------------------|------------------|-----------------------------|--------------------------|----------------------|----------------------------------|
| **API-Football – Free Plan** | Miễn phí (mãi mãi) | 100 requests/ngày | >1,180 giải | Tất cả endpoints (giới hạn mùa giải) | Test, dự án nhỏ |
| **API-Football – Pro Plan** | $19/tháng | 7,500 requests/ngày | Tất cả competitions | Tất cả endpoints | Ứng dụng trung bình |
| **API-Football – Ultra Plan** | $29/tháng | 75,000 requests/ngày | Tất cả competitions | Tất cả tính năng | Ứng dụng lớn hơn |
| **API-Football – Mega Plan (hoặc cao hơn)** | Không công khai cụ thể (khoảng $10–19/tháng đến cao hơn) | Lên đến 1,500,000 requests/ngày | Tất cả competitions | Rate limit cao, full features | Ứng dụng cao tải |

---

**Ghi chú chung:**  
- Tất cả gói Sportmonks có **thử nghiệm miễn phí 14 ngày** và **chưa bao gồm VAT**.  
- API-Football thanh toán qua **Stripe/PayPal**. Nếu vượt giới hạn, có thể bị **suspend hoặc charge overage**.  
- Tất cả gói API-Football bao gồm **real-time updates (15 giây)**.  
