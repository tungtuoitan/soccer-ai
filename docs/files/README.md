# ⚽ Football AI Website - Trang Bóng Đá Với AI Chatbot Thông Minh

> Website bóng đá hiện đại với AI chatbot có khả năng trả lời mọi câu hỏi về bóng đá bằng tiếng Việt, sử dụng Text-to-SQL và RAG để cung cấp thông tin chính xác từ database và web.

---

## 🎯 TỔNG QUAN DỰ ÁN

### **Vấn đề giải quyết:**
- ❌ Các trang bóng đá hiện tại: Thiếu tương tác, khó tìm thông tin cụ thể
- ❌ Chatbot hiện có: Rất cơ bản, không hiểu tiếng Việt tốt
- ❌ Data phân tán: Phải vào nhiều trang khác nhau

### **Giải pháp:**
- ✅ AI Chatbot thông minh: Text-to-SQL + RAG + Web Search
- ✅ Hỏi đáp bằng tiếng Việt tự nhiên
- ✅ Kết hợp dữ liệu từ database + realtime từ web
- ✅ All-in-one: Livescore + News + Stats + AI Assistant

---

## 🌟 TÍNH NĂNG CHÍNH

### **1. AI Chatbot (Killer Feature)**
```
User: "MU thắng mấy trận trong 5 trận gần nhất?"
AI: [Query database] → "Manchester United thắng 3 trận, hòa 1, thua 1 
     trong 5 trận gần nhất. Tỷ số chi tiết: ..."

User: "Tin tức mới nhất về Ronaldo?"
AI: [Google Search] → "Theo tin từ BBC Sport hôm nay, Ronaldo..."

User: "So sánh Haaland và Mbappe mùa này?"
AI: [Database + Web] → "Haaland: 25 bàn/20 trận, Mbappe: 22 bàn/19 trận..."
```

### **2. Core Features**
- 📊 **Live Scores**: Cập nhật tỷ số real-time qua WebSocket
- 📅 **Fixtures**: Lịch thi đấu đầy đủ với nhắc nhở
- 🏆 **Standings**: Bảng xếp hạng tự động cập nhật
- ⚽ **Team Profiles**: Thông tin chi tiết đội bóng, cầu thủ
- 📰 **News**: Tin tức do AI viết lại từ nhiều nguồn
- 👥 **Community**: Social feed từ Facebook, Twitter

### **3. Admin Dashboard**
- ✍️ Content management
- 📊 Analytics
- 👥 User management
- ⚙️ AI settings

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  - Homepage, Match Details, Team Profile                │
│  - AI Chatbot Widget (floating)                         │
│  - Real-time Updates (Socket.io)                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Node.js Backend API                         │
│                                                          │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │   Football   │  │  AI Chatbot │  │    Content   │  │
│  │   Service    │  │   Service   │  │    Service   │  │
│  └──────────────┘  └─────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Data Sync Service (CRON + Queue)         │  │
│  └──────────────────────────────────────────────────┘  │
└────────┬─────────────────┬──────────────────┬──────────┘
         │                 │                  │
         ▼                 ▼                  ▼
    ┌─────────┐      ┌─────────┐      ┌──────────────┐
    │PostgreSQL│      │  Redis  │      │External APIs │
    │         │      │  Cache  │      │              │
    │- leagues│      │         │      │- API-Football│
    │- teams  │      │- scores │      │- Claude AI   │
    │- matches│      │- queries│      │- Google      │
    │- players│      │         │      │              │
    └─────────┘      └─────────┘      └──────────────┘
```

**📄 Chi tiết kiến trúc:** Xem [football-ai-architecture.mermaid](./football-ai-architecture.mermaid)

---

## 🤖 AI CHATBOT FLOW

```
User Query (Vietnamese)
    ↓
┌───────────────────────┐
│ Intent Classification │
└───────┬───────────────┘
        │
    ┌───┴────┐
    ↓        ↓
[DB Query] [Web Search]
    ↓        ↓
Text-to-SQL  Google API
    ↓        ↓
Execute      Fetch
    ↓        ↓
    └───┬────┘
        ↓
┌─────────────────┐
│ Context Builder │
│  - DB results   │
│  - Web results  │
│  - Chat history │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Claude API    │
│  Generate Answer│
└────────┬────────┘
         ↓
    Response (Vietnamese)
    with Citations
```

**📄 Chi tiết AI flow:** Xem [ai-chatbot-flow.mermaid](./ai-chatbot-flow.mermaid)

---

## 💾 DATABASE SCHEMA

### **Core Tables:**
- `leagues` - Giải đấu
- `teams` - Đội bóng
- `players` - Cầu thủ
- `matches` - Trận đấu
- `standings` - Bảng xếp hạng
- `articles` - Bài viết
- `chat_history` - Lịch sử chat với AI

**📄 Full schema:** Xem [database-schema.mermaid](./database-schema.mermaid)

---

## 🛠️ TECH STACK

### **Frontend**
- ⚛️ React 18
- 🎨 TailwindCSS
- 🔄 React Query
- 🔌 Socket.io Client
- 📊 Recharts

### **Backend**
- 🟢 Node.js + Express
- 🗃️ Prisma ORM
- 🚀 Redis (Cache)
- 🔌 Socket.io (Real-time)
- 📋 Bull Queue (Jobs)
- ⏰ node-cron (Scheduler)

### **AI & APIs**
- 🤖 Claude API (Anthropic) - Text-to-SQL, Response Generation
- ⚽ API-Football (RapidAPI) - Football Data
- 🔍 Google Search API - Real-time News
- 📱 Facebook Scraper API - Social Content

### **Infrastructure**
- ☁️ Replit - Hosting
- 🗄️ PostgreSQL - Database
- 📦 Redis - Cache & Queue

**📄 Tech stack chi tiết:** Xem [tech-stack-diagram.mermaid](./tech-stack-diagram.mermaid)

---

## 📅 TIMELINE & ROADMAP

### **Phase 1: Foundation (Week 1-2)**
- Database setup & schema
- API integration
- Data sync service
- Basic REST APIs

### **Phase 2: Core Features (Week 3-4)**
- Frontend UI components
- Live scores & real-time updates
- Content management
- Admin dashboard

### **Phase 3: AI Chatbot (Week 5-6)** ⭐
- Text-to-SQL engine
- RAG system
- Web search integration
- Chatbot UI

### **Phase 4: Advanced Features (Week 7-8)**
- Community features
- Performance optimization
- Testing & security

### **Phase 5: Launch (Week 9-10)**
- Content population
- SEO & marketing
- Beta testing
- Official launch

**📄 Roadmap chi tiết:** Xem [project-roadmap.md](./project-roadmap.md)
**📊 Gantt chart:** Xem [gantt-timeline.mermaid](./gantt-timeline.mermaid)

---

## 💰 CHI PHÍ DỰ KIẾN

### **Monthly Operating Costs:**
```
API-Football (RapidAPI):    $25
Claude API:                 $30-50
Google Search API:          $0-10
Replit Pro:                 $20
Domain:                     $1
──────────────────────────
TOTAL:                      ~$76-106/month
```

### **Development Time:**
- Full-time (8h/day): **8-10 weeks**
- Part-time (4h/day): **16-20 weeks**
- Weekend (2h/day): **28-35 weeks**

---

## 🚀 QUICK START

### **Prerequisites:**
- Node.js 18+
- PostgreSQL 14+
- Redis
- API Keys (API-Football, Claude)

### **Installation:**

```bash
# Clone repository
git clone https://github.com/yourusername/football-ai

# Install dependencies
cd football-ai/backend
npm install

cd ../frontend
npm install

# Setup database
cd backend
cp .env.example .env
# Edit .env với API keys

npx prisma migrate dev
npx prisma db seed

# Run backend
npm run dev

# Run frontend (new terminal)
cd frontend
npm run dev
```

**📄 Quick start guide:** Xem [quick-start-guide.md](./quick-start-guide.md)

---

## 📁 PROJECT STRUCTURE

```
football-ai/
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API clients
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utilities
│   └── package.json
│
├── backend/                    # Node.js API
│   ├── src/
│   │   ├── routes/           # Express routes
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   │   ├── footballAPI.js
│   │   │   ├── aiChatbot/   # AI chatbot logic
│   │   │   └── dataSync.js
│   │   ├── config/           # Configuration
│   │   ├── middlewares/      # Express middlewares
│   │   └── utils/            # Utilities
│   └── package.json
│
├── prisma/                     # Database
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration files
│   └── seed.js              # Seed data
│
├── docs/                       # Documentation
│   ├── api/                 # API docs
│   ├── diagrams/            # Mermaid diagrams
│   └── guides/              # User guides
│
└── scripts/                    # Utility scripts
    ├── sync-data.js
    └── backup.js
```

---

## 🎯 KEY FEATURES DEMO

### **1. Natural Language Query**
```
Input:  "Những trận MU thắng với tỷ số từ 3 bàn trở lên trong 2 tháng gần đây?"

Output: Manchester United có 4 trận thắng với tỷ số từ 3 bàn trở lên:
        • MU 4-1 Chelsea (15/10/2025)
        • MU 3-0 Bournemouth (02/11/2025)
        • MU 5-2 Leicester (18/11/2025)
        • MU 3-1 Everton (25/11/2025)
```

### **2. Complex Statistics**
```
Input:  "So sánh hiệu suất ghi bàn của top 3 tiền đạo EPL mùa này"

Output: [Table with stats + Chart visualization]
        1. Haaland: 25 bàn (0.89 bàn/trận)
        2. Kane: 22 bàn (0.81 bàn/trận)
        3. Salah: 20 bàn (0.74 bàn/trận)
```

### **3. Real-time + Historical**
```
Input:  "Tỷ số hiện tại trận Liverpool vs Arsenal là gì? Lịch sử đối đầu 
         5 trận gần nhất thế nào?"

Output: [Live data] Hiện tại: Liverpool 2-1 Arsenal (phút 67)
        [Database] Lịch sử 5 trận gần nhất: Liverpool thắng 3, hòa 1, thua 1
```

---

## 📊 SUCCESS METRICS

### **Technical KPIs:**
- ✅ API Response Time: <200ms (cached), <800ms (uncached)
- ✅ Lighthouse Score: >90
- ✅ AI Query Success Rate: >85%
- ✅ Uptime: >99.5%

### **Business KPIs (Month 3):**
- 🎯 1,000+ active users
- 🎯 10,000+ page views
- 🎯 5,000+ AI queries
- 🎯 100+ daily active users

---

## 🤝 CONTRIBUTING

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

### **Development Process:**
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 LICENSE

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

---

## 📞 CONTACT

- **Email:** your-email@example.com
- **Website:** https://your-website.com
- **Twitter:** @yourhandle

---

## 🙏 ACKNOWLEDGMENTS

- **API-Football** - Football data provider
- **Anthropic** - Claude AI API
- **Community** - Open source contributors

---

## 📚 DOCUMENTATION INDEX

### **Architecture & Design:**
1. [System Architecture](./football-ai-architecture.mermaid)
2. [AI Chatbot Flow](./ai-chatbot-flow.mermaid)
3. [Data Flow Diagram](./data-flow-diagram.mermaid)
4. [Database Schema](./database-schema.mermaid)
5. [Tech Stack Diagram](./tech-stack-diagram.mermaid)

### **Planning:**
6. [Complete Roadmap](./project-roadmap.md)
7. [Gantt Timeline](./gantt-timeline.mermaid)
8. [Quick Start Guide](./quick-start-guide.md)

### **Guides (Coming Soon):**
- API Documentation
- Deployment Guide
- AI Chatbot Training Guide
- Troubleshooting Guide

---

## 🔮 FUTURE ENHANCEMENTS

### **Phase 2 (After Launch):**
- [ ] Mobile app (React Native)
- [ ] Premium features
- [ ] Advanced analytics
- [ ] Betting insights
- [ ] Live streaming integration
- [ ] Multi-language support
- [ ] Voice assistant
- [ ] Personalized recommendations

---

**Built with ❤️ and ⚽ for football fans**

[⬆ Back to top](#-football-ai-website---trang-bóng-đá-với-ai-chatbot-thông-minh)
