
# KIẾN TRÚC TỔNG THỂ
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  - Homepage (tin tức, lịch thi đấu)                             │
│  - AI Chatbot Widget                                             │
│  - Community Feed (social posts)                                 │
│  - Admin Dashboard                                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                    BACKEND API (Node.js/Express)                 │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐        │
│  │   Content   │  │   Football   │  │   AI Chatbot    │        │
│  │   Service   │  │    Service   │  │     Service     │        │
│  └─────────────┘  └──────────────┘  └─────────────────┘        │
└───────┬──────────────────┬───────────────────┬──────────────────┘
        │                  │                   │
        ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│  PostgreSQL  │  │  RapidAPI    │  │  AI Services    │
│              │  │  - Football  │  │  - Claude/GPT   │
│  - articles  │  │  - Odds      │  │  - Text2SQL     │
│  - teams     │  │  - Stats     │  │  - RAG          │
│  - matches   │  │              │  │                 │
│  - players   │  │  Facebook    │  │  Google Search  │
│  - comments  │  │  Scraper     │  │  API            │
└──────────────┘  └──────────────┘  └─────────────────┘