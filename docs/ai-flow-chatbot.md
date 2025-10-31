
## 🤖 AI CHATBOT FLOW (Chi tiết)
```
User Query (Tiếng Việt)
    ↓
┌───────────────────────────────────┐
│  1. Intent Classification         │
│  - Is it a DB query?              │
│  - Is it news/realtime info?      │
│  - Is it general chat?            │
└───────────┬───────────────────────┘
            ↓
    ┌───────┴────────┐
    ↓                ↓
┌─────────────┐  ┌──────────────┐
│ DB Query    │  │ Web Search   │
│ Path        │  │ Path         │
└─────────────┘  └──────────────┘
    ↓                ↓
┌─────────────┐  ┌──────────────┐
│ Text-to-SQL │  │ Google API   │
│ (AI Model)  │  │ + Scraping   │
└──────┬──────┘  └──────┬───────┘
       ↓                ↓
┌──────────────────────────────┐
│  PostgreSQL Execute Query    │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│  Context Building (RAG)      │
│  - DB results                │
│  - Web search results        │
│  - Chat history              │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│  AI Response Generation      │
│  (Claude/GPT with context)   │
└──────┬───────────────────────┘
       ↓
   Answer User (Tiếng Việt)