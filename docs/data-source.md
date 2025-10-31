# data source
┌─────────────────────────────────────────────┐
│         DATA PROVIDERS (Nguồn chính)        │
│  - Opta (Stats Perform)  💰 $$$$$          │
│  - Sportradar            💰 $$$$$          │
│  - API-Football          💰 $$             │
│  - RapidAPI Football     💰 $              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         YOUR DATABASE (PostgreSQL)          │
│                                              │
│  ┌────────────────────────────────┐        │
│  │   CRON JOBS / Workers          │        │
│  │                                │        │
│  │  Every 1 min:  Live scores     │        │
│  │  Every 5 min:  Match stats     │        │
│  │  Every 1 hour: Standings       │        │
│  │  Every 6 hours: Player info    │        │
│  │  Daily:        Fixtures        │        │
│  └────────────────────────────────┘        │
└─────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         YOUR API (Node.js)                  │
│  - Serve data to frontend                   │
│  - Cache layer (Redis)                      │
│  - Webhooks from providers                  │
└─────────────────────────────────────────────┘



## source api
1. API-FOOTBALL (by API-SPORTS)

➡️ Link: https://dashboard.api-football.com/

➡️ Docs: https://www.api-football.com/documentation-v3

➡️ Free plan: Có (đủ để test / project nhỏ)

✅ Ưu điểm:

Phổ biến nhất và được dùng trong hầu hết app football hiện nay (SofaScore clones, FlashScore clones, ...).

Bao phủ hơn 180+ league/cup toàn cầu.

Live update 15s, có cả odds, lineups, coaches, players, standings, scorers, events, predictions.

Có sẵn widgets & demo UI, dễ tích hợp.

Độ trễ thấp (~105ms), uptime 100%.

Cung cấp API khác cùng hệ thống: basketball, baseball, etc.

⚠️ Nhược điểm:

Free plan hơi giới hạn (thường chỉ 10 requests/min).

Một số dữ liệu chuyên sâu (expected goals, xG, passes map) chỉ có ở plan cao cấp.

👉 Đánh giá tổng: ⭐️⭐️⭐️⭐️⭐️ (9.8/10)
👉 Thích hợp cho: Website/app live score, dashboard bóng đá, ứng dụng phân tích cơ bản.

🏆 2. SportAPI (by rapidsportapi, dùng dữ liệu SofaScore)

➡️ Docs: Không công khai đầy đủ (dựa trên SofaScore)

✅ Ưu điểm:

Lấy dữ liệu từ SofaScore, nghĩa là rất đầy đủ & nhanh.

Có hơn 5000+ leagues (gấp nhiều lần API-FOOTBALL).

Hỗ trợ 20+ môn thể thao + Esports.

Cập nhật liên tục real-time (vì SofaScore có engine push).

Có custom plan cho dự án lớn.

⚠️ Nhược điểm:

Không có free plan rõ ràng.

Docs không chính thức (phải đăng ký hoặc liên hệ).

API hơi phức tạp hơn (vì từ SofaScore raw data).

👉 Đánh giá tổng: ⭐️⭐️⭐️⭐️⭐️ (9.7/10)
👉 Thích hợp cho: Dự án lớn, nền tảng thống kê thể thao đa môn, startup thể thao.

🎯 3. Pinnacle Odds (by Tipsters CO)

➡️ Link: https://oddsfe.com/

✅ Ưu điểm:

Chuyên về tỷ lệ cược (odds) – có pre-match + live odds, historical odds.

Cực nhanh (94ms) và cập nhật real-time.

Hỗ trợ nhiều môn thể thao + esports.

Uptime 100%, dữ liệu chuẩn Pinnacle bookmaker (rất uy tín).

⚠️ Nhược điểm:

Không tập trung vào dữ liệu trận đấu (events, players, v.v).

Không có thông tin như lineups, standings, ...

👉 Đánh giá tổng: ⭐️⭐️⭐️⭐️ (9.5/10)
👉 Thích hợp cho: App dự đoán, so odds, betting tools, phân tích cược.


Football Prediction (by boggio)

➡️ Mô tả: Dự đoán kết quả trận đấu sắp tới.

✅ Ưu điểm:

Cung cấp predictions + average odds + lịch sử hiệu suất.

Rất hữu ích nếu bạn muốn machine learning / AI dashboard.

⚠️ Nhược điểm:

Chỉ có prediction data, không có event, player, v.v.

Không có nhiều giải (thường giới hạn top leagues).

👉 Đánh giá tổng: ⭐️⭐️⭐️⭐️ (9.0/10)
👉 Thích hợp cho: Trang web dự đoán tỉ số, AI betting insights.



# provider
| Nhà cung cấp                    | Miêu tả                                                                                                                         | Được dùng bởi                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Opta Sports (Stats Perform)** | Một trong những nhà cung cấp dữ liệu bóng đá lớn nhất thế giới. Họ thu thập dữ liệu từ hàng nghìn trận (xG, passes, touches, …) | BBC Sport, ESPN, Premier League, SofaScore |
| **SportRadar**                  | Cung cấp live data, odds, match tracking, betting feed cho hơn 70 môn thể thao                                                  | FlashScore, UEFA, FIFA, bet365, FanDuel    |
| **DataFactory**                 | Phổ biến ở Nam Mỹ, chuyên về football & sports tracking                                                                         | ESPN Latin, Fox Sports                     |
| **StatsBomb**                   | Dữ liệu chuyên sâu (xG, pass map, pressing map, …)                                                                              | Club bóng đá, nhà phân tích                |
| **Enetpulse**                   | Cung cấp data và live score cho nhiều trang cá cược & tin tức                                                                   | FlashScore, OddsPortal                     |
| **LiveScore Group**             | Có đội riêng thu thập data thủ công + hợp tác SportRadar                                                                        | LiveScore.com                              |



⚙️ 1.2. Cách họ lấy dữ liệu

Họ kết hợp nhiều phương pháp:

🧍‍♂️ Scouting mạng lưới người thật (match scouts):

Mỗi trận bóng có 1–2 người quan sát (scout) nhập sự kiện (goal, foul, substitution, …) vào hệ thống → gửi về server.

Tốc độ cực nhanh (0–2s sau sự kiện).

Ví dụ: SportRadar có hàng ngàn “match scouts” trên toàn cầu.

⚡ Data feeds chính thức từ liên đoàn / nhà cái / đội bóng:

Premier League, UEFA, FIFA có API riêng cung cấp dữ liệu cho đối tác (thường trả phí cao).

Các công ty như Opta có quyền truy cập chính thức.

🤖 Crawling / parsing từ các hệ thống truyền hình và scoreboard:

Ở cấp thấp hơn, một số hệ thống tự động “đọc” bảng tỉ số hoặc ticker truyền hình để cập nhật score real-time.



----
💰 2. Vì sao họ không dùng public APIs như API-FOOTBALL
Public API chỉ cung cấp data từ bên thứ ba (độ trễ 10–30 giây).

Các nền tảng lớn cần độ chính xác và tốc độ cực cao (1–2 giây).

Họ cần license chính thức để không bị kiện vì vi phạm bản quyền dữ liệu.

Đồng thời, họ tự xử lý dữ liệu chuyên sâu (AI, prediction, heatmap, xG, ...) để tạo khác biệt.



| Hệ thống         | Nguồn dữ liệu                                      | Tốc độ cập nhật | Dùng API công khai? | Ghi chú                             |
| ---------------- | -------------------------------------------------- | --------------- | ------------------- | ----------------------------------- |
| **SofaScore**    | Opta + hệ thống riêng + scouts                     | 1–2s            | ❌                   | Có API nội bộ (private)             |
| **FlashScore**   | SportRadar + Enetpulse                             | 1s              | ❌                   | Có đội ngũ riêng thu thập thủ công  |
| **LiveScore**    | SportRadar + feed riêng                            | 1–3s            | ❌                   | Cấp dữ liệu cho nhiều đối tác khác  |
| **OneFootball**  | Opta + SportRadar                                  | 2–5s            | ❌                   | Kết hợp dữ liệu tin tức và trận đấu |
| **API-FOOTBALL** | Tập hợp lại từ các nguồn công khai + data feed nhỏ | 10–15s          | ✅                   | Bản thương mại công khai cho dev    |
