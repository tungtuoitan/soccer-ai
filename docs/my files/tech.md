

# 
- nếu muốn nhanh + kiểm soát source tốt --> thì code + AI (vì quen tay)
- nếu muốn Replit thì chậm hơn tí + vibe coding --> vibe coding (vì phải làm quen)


#
Budget:           >$200/month (có ngân sách tốt) 💰💰💰
Users:            <1,000/month (MVP) 👥
Queries:          100-1,000/day (~15K-30K/month) 📊
Articles:         100-1,000 articles 📰
Content update:   Vài bài/ngày (regular) ⏱️
Content source:   Aggregate (scrape/RSS) 🌐
Latency:          <500ms (real-time) ⚡
Hosting:          Replit 🖥️
Team:             Solo developer 👨‍💻
Language:         Chỉ tiếng Việt 🇻🇳
Features:         Basic + Citations + Sources 📝
```

---

## 🏆 OPTIMAL STACK - BEST QUALITY WITHIN BUDGET

### **Cost: ~$100-150/month** ✅ (Còn dư budget!)
```
┌─────────────────────────────────────────────────────────┐
│ 1. EMBEDDING                                             │
├─────────────────────────────────────────────────────────┤
│ ✅ OpenAI text-embedding-3-small                        │
│                                                          │
│ Lý do:                                                   │
│ • $0.02/1M tokens (RẺ NHẤT commercial)                 │
│ • 1536 dimensions (optimal)                             │
│ • 50-100ms latency (NHANH, fit <500ms requirement)     │
│ • Excellent Vietnamese support                          │
│ • Best quality/price ratio                              │
│ • Stable, production-ready                              │
│                                                          │
│ Monthly cost: ~$2-5                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2. LLM (Text Generation)                                │
├─────────────────────────────────────────────────────────┤
│ ✅ Claude 3.5 Sonnet (Anthropic)                        │
│                                                          │
│ Lý do:                                                   │
│ • BEST tiếng Việt (proven by community)                │
│ • $3/1M input, $15/1M output                            │
│ • 200K context window (XỬ LÝ NHIỀU ARTICLES)           │
│ • Smart reasoning (tốt cho analysis)                    │
│ • Built-in citations                                    │
│ • Fast (500-1000ms typical)                             │
│                                                          │
│ Monthly cost: ~$90-120 (main cost)                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3. VECTOR DATABASE                                       │
├─────────────────────────────────────────────────────────┤
│ ✅ PostgreSQL + pgvector (MVP)                          │
│ → Upgrade to Pinecone khi scale                         │
│                                                          │
│ Lý do PostgreSQL first:                                 │
│ • Đã có PostgreSQL (no extra cost)                     │
│ • pgvector mature, stable                               │
│ • Good for <10K articles                                │
│ • Familiar SQL                                          │
│ • Easy backup/restore                                   │
│                                                          │
│ Khi nào upgrade Pinecone?                               │
│ • >1,000 articles                                       │
│ • >10K queries/day                                      │
│ • Need better performance                               │
│                                                          │
│ Monthly cost: $0 (PostgreSQL) / $70+ (Pinecone)       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 4. RAG FRAMEWORK                                         │
├─────────────────────────────────────────────────────────┤
│ ✅ LlamaIndex (Python)                                  │
│                                                          │
│ Lý do:                                                   │
│ • Best cho document RAG                                 │
│ • PostgreSQL + Pinecone connectors                      │
│ • Claude + OpenAI integration                           │
│ • Excellent docs                                        │
│ • Active community                                      │
│ • Free, open source                                     │
│                                                          │
│ Monthly cost: $0                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 5. CACHING LAYER (IMPORTANT!)                           │
├─────────────────────────────────────────────────────────┤
│ ✅ Redis (trên Replit)                                  │
│                                                          │
│ Lý do:                                                   │
│ • Cache RAG responses (reduce LLM calls)                │
│ • Cache embeddings (reduce API calls)                   │
│ • Session management                                    │
│ • Save 30-50% costs!                                    │
│                                                          │
│ Monthly cost: $0 (included in Replit)                  │
└─────────────────────────────────────────────────────────┘

# COMPLETE ARCHITECTURE
```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js API Gateway                         │
│  - Rate limiting (prevent abuse)                        │
│  - Authentication                                        │
│  - Request validation                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Redis Cache Check                        │
│  - Check if query cached                                │
│  - Check if similar query cached                        │
│  - Return immediately if hit (SAVE MONEY!)              │
└────────────────────┬────────────────────────────────────┘
                     │ Cache Miss
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Python RAG Service (LlamaIndex)              │
│                                                          │
│  ┌──────────────────────────────────────────┐          │
│  │ 1. Router/Intent Classifier              │          │
│  │    Decide: SQL / RAG / Web / Hybrid      │          │
│  └────────────────┬─────────────────────────┘          │
│                   │                                      │
│  ┌────────────────▼─────────────────────────┐          │
│  │ 2. Retrieval                             │          │
│  │                                           │          │
│  │  ┌─ SQL Query (if needed)                │          │
│  │  │                                        │          │
│  │  ┌─ Embed Query (OpenAI)                 │          │
│  │  │   → Vector Search (PostgreSQL)        │          │
│  │  │   → Top-K articles                    │          │
│  │  │                                        │          │
│  │  └─ Web Search (if needed)               │          │
│  └────────────────┬─────────────────────────┘          │
│                   │                                      │
│  ┌────────────────▼─────────────────────────┐          │
│  │ 3. Context Builder                       │          │
│  │    - Combine sources                     │          │
│  │    - Truncate to 3K tokens               │          │
│  │    - Add metadata                        │          │
│  └────────────────┬─────────────────────────┘          │
│                   │                                      │
│  ┌────────────────▼─────────────────────────┐          │
│  │ 4. LLM Generation (Claude)               │          │
│  │    - Generate answer                     │          │
│  │    - Add citations                       │          │
│  │    - Format Vietnamese                   │          │
│  └────────────────┬─────────────────────────┘          │
│                   │                                      │
└───────────────────┼──────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Cache Response (Redis)                      │
│  - Store for 24 hours                                   │
│  - Add to recent queries                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Return to User + Save to DB                     │
│  - chat_history table                                   │
│  - Analytics                                            │
└─────────────────────────────────────────────────────────┘


DATA STORES:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│   PostgreSQL     │  │   Redis Cache    │  │  Vector Data │
│                  │  │                  │  │              │
│ - articles       │  │ - Query cache    │  │ - Embeddings │
│ - matches        │  │ - Session        │  │ - Metadata   │
│ - chat_history   │  │ - Rate limits    │  │ (in PG)      │
└──────────────────┘  └──────────────────┘  └──────────────┘
```

---

## 📁 PROJECT STRUCTURE
```
football-ai/
├── backend/
│   ├── node/                          # Main API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── chat.js           # /api/chat
│   │   │   │   ├── articles.js
│   │   │   │   └── matches.js
│   │   │   ├── services/
│   │   │   │   ├── ragService.js     # Calls Python RAG
│   │   │   │   └── cacheService.js
│   │   │   └── server.js
│   │   └── package.json
│   │
│   └── python/                        # RAG Service
│       ├── rag_service.py            # Main FastAPI app
│       ├── indexer.py                # Index articles
│       ├── query_engine.py           # Query logic
│       ├── router.py                 # Intent classifier
│       ├── cache_manager.py          # Redis cache
│       ├── requirements.txt
│       └── .env
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
│
├── frontend/                          # React app
│   └── src/
│       ├── components/
│       │   └── ChatWidget.jsx        # AI chatbot UI
│       └── services/
│           └── api.js
│
└── docker-compose.yml                 # For local dev