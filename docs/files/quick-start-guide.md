# 🚀 QUICK START GUIDE - BẮT ĐẦU NGAY HÔM NAY

## ⚡ CÀI ĐẶT BAN ĐẦU (30 phút)

### **Bước 1: Setup Accounts (10 phút)**

```bash
# 1. Tạo tài khoản Replit
https://replit.com → Sign up

# 2. Đăng ký API-Football
https://rapidapi.com/api-sports/api/api-football
→ Subscribe to Basic plan ($25/month)
→ Copy API Key

# 3. Đăng ký Claude API
https://console.anthropic.com/
→ Create account
→ Add credits ($5 để test)
→ Create API key

# 4. Setup GitHub (optional nhưng recommended)
https://github.com → Create repository
```

### **Bước 2: Create Project Structure (10 phút)**

```bash
# Trên Replit, import từ GitHub hoặc tạo mới

# Structure:
football-ai/
├── frontend/          # React app
├── backend/           # Node.js API
├── prisma/           # Database schema
├── scripts/          # Utility scripts
└── README.md
```

### **Bước 3: Initialize Frontend (5 phút)**

```bash
# Trong Replit Shell
cd football-ai

# Create React app
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Install dependencies
npm install @tanstack/react-query axios socket.io-client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **Bước 4: Initialize Backend (5 phút)**

```bash
cd ../backend

# Initialize Node project
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install prisma @prisma/client
npm install redis socket.io
npm install axios bull node-cron
npm install jsonwebtoken bcrypt

# Dev dependencies
npm install -D nodemon

# Initialize Prisma
npx prisma init
```

---

## 📦 PHASE 1 CODE - DATABASE SETUP

### **File 1: prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model League {
  id        Int      @id @default(autoincrement())
  name      String
  country   String
  type      String
  logoUrl   String?  @map("logo_url")
  season    Int
  createdAt DateTime @default(now()) @map("created_at")
  
  teams     Team[]
  matches   Match[]
  standings Standing[]
  
  @@map("leagues")
}

model Team {
  id         Int      @id @default(autoincrement())
  name       String
  shortName  String   @map("short_name")
  code       String   @unique
  logoUrl    String?  @map("logo_url")
  country    String
  founded    Int?
  stadium    String?
  leagueId   Int      @map("league_id")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  league         League     @relation(fields: [leagueId], references: [id])
  players        Player[]
  homeMatches    Match[]    @relation("HomeTeam")
  awayMatches    Match[]    @relation("AwayTeam")
  standings      Standing[]
  
  @@map("teams")
}

model Player {
  id            Int       @id @default(autoincrement())
  name          String
  fullName      String    @map("full_name")
  dateOfBirth   DateTime? @map("date_of_birth")
  nationality   String
  position      String
  number        Int?
  photoUrl      String?   @map("photo_url")
  height        Int?
  weight        Int?
  teamId        Int       @map("team_id")
  value         Decimal?  @db.Decimal(12, 2)
  contractUntil DateTime? @map("contract_until")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  team          Team      @relation(fields: [teamId], references: [id])
  
  @@map("players")
}

model Match {
  id          Int       @id @default(autoincrement())
  leagueId    Int       @map("league_id")
  round       Int
  homeTeamId  Int       @map("home_team_id")
  awayTeamId  Int       @map("away_team_id")
  homeScore   Int?      @map("home_score")
  awayScore   Int?      @map("away_score")
  matchDate   DateTime  @map("match_date")
  status      String    @default("scheduled")
  venue       String?
  attendance  Int?
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  league      League    @relation(fields: [leagueId], references: [id])
  homeTeam    Team      @relation("HomeTeam", fields: [homeTeamId], references: [id])
  awayTeam    Team      @relation("AwayTeam", fields: [awayTeamId], references: [id])
  
  @@index([matchDate])
  @@index([status])
  @@map("matches")
}

model Standing {
  id             Int      @id @default(autoincrement())
  leagueId       Int      @map("league_id")
  teamId         Int      @map("team_id")
  position       Int
  played         Int      @default(0)
  won            Int      @default(0)
  drawn          Int      @default(0)
  lost           Int      @default(0)
  goalsFor       Int      @default(0) @map("goals_for")
  goalsAgainst   Int      @default(0) @map("goals_against")
  goalDifference Int      @default(0) @map("goal_difference")
  points         Int      @default(0)
  form           String?
  updatedAt      DateTime @updatedAt @map("updated_at")
  
  league         League   @relation(fields: [leagueId], references: [id])
  team           Team     @relation(fields: [teamId], references: [id])
  
  @@unique([leagueId, teamId])
  @@map("standings")
}

model Article {
  id            Int      @id @default(autoincrement())
  title         String
  slug          String   @unique
  content       String   @db.Text
  summary       String?
  thumbnail     String?
  authorId      Int?     @map("author_id")
  category      String
  tags          String[]
  source        String?
  isAiGenerated Boolean  @default(false) @map("is_ai_generated")
  viewsCount    Int      @default(0) @map("views_count")
  publishedAt   DateTime @default(now()) @map("published_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  @@index([category])
  @@index([publishedAt])
  @@map("articles")
}

model ChatHistory {
  id              Int      @id @default(autoincrement())
  userId          Int?     @map("user_id")
  question        String   @db.Text
  answer          String   @db.Text
  sqlQuery        String?  @map("sql_query") @db.Text
  dataSources     Json?    @map("data_sources")
  responseTimeMs  Int?     @map("response_time_ms")
  createdAt       DateTime @default(now()) @map("created_at")
  
  @@index([createdAt])
  @@map("chat_history")
}
```

### **File 2: backend/.env.example**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/football_db"

# Redis
REDIS_URL="redis://localhost:6379"

# APIs
RAPIDAPI_KEY="your_rapidapi_key_here"
RAPIDAPI_HOST="api-football-v1.p.rapidapi.com"

CLAUDE_API_KEY="your_claude_api_key_here"
GOOGLE_SEARCH_API_KEY="your_google_api_key_here"

# Server
PORT=3000
NODE_ENV="development"

# JWT
JWT_SECRET="your_jwt_secret_here"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### **File 3: backend/src/config/database.js**

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

### **File 4: backend/src/config/redis.js**

```javascript
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

module.exports = redis;
```

### **File 5: backend/src/services/footballAPI.js**

```javascript
const axios = require('axios');
const redis = require('../config/redis');

class FootballAPIService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
  }

  async getLeagues() {
    const cacheKey = 'football:leagues';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await this.client.get('/leagues');
    const data = response.data.response;
    
    // Cache for 24 hours
    await redis.setex(cacheKey, 86400, JSON.stringify(data));
    
    return data;
  }

  async getTeamsByLeague(leagueId, season = 2025) {
    const cacheKey = `football:teams:${leagueId}:${season}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await this.client.get('/teams', {
      params: { league: leagueId, season }
    });
    const data = response.data.response;
    
    // Cache for 24 hours
    await redis.setex(cacheKey, 86400, JSON.stringify(data));
    
    return data;
  }

  async getLiveMatches() {
    const response = await this.client.get('/fixtures', {
      params: { live: 'all' }
    });
    
    return response.data.response;
  }

  async getMatchesByDate(date) {
    const cacheKey = `football:matches:${date}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await this.client.get('/fixtures', {
      params: { date }
    });
    const data = response.data.response;
    
    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(data));
    
    return data;
  }

  async getStandings(leagueId, season = 2025) {
    const cacheKey = `football:standings:${leagueId}:${season}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await this.client.get('/standings', {
      params: { league: leagueId, season }
    });
    const data = response.data.response;
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(data));
    
    return data;
  }
}

module.exports = new FootballAPIService();
```

### **File 6: backend/src/server.js**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const prisma = require('./config/database');
const redis = require('./config/redis');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    
    res.json({ 
      status: 'healthy',
      database: 'connected',
      redis: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

// Routes will be added here
// app.use('/api/leagues', require('./routes/leagues'));
// app.use('/api/teams', require('./routes/teams'));
// app.use('/api/matches', require('./routes/matches'));
// app.use('/api/chat', require('./routes/chat'));

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
});
```

---

## 🎯 NEXT STEPS

### **Ngay bây giờ (30 phút):**

```bash
# 1. Setup database
cd backend
npx prisma migrate dev --name init

# 2. Run server
npm run dev

# 3. Test health check
curl http://localhost:3000/health

# 4. Run frontend (new terminal)
cd frontend
npm run dev
```

### **Tuần này:**
1. ✅ Complete database schema
2. ✅ Implement data sync service
3. ✅ Create first API endpoints
4. ✅ Test với API-Football

### **Tuần sau:**
1. Build React components
2. Connect frontend to backend
3. Implement live scores
4. Start AI chatbot development

---

## 📚 HELPFUL COMMANDS

```bash
# Prisma
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create migration
npx prisma generate            # Generate Prisma Client
npx prisma db seed             # Seed database

# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm test                       # Run tests

# Database
psql $DATABASE_URL             # Connect to database
redis-cli                      # Connect to Redis
```

---

**BẠN ĐÃ CÓ TẤT CẢ!** 🎉

Files đã tạo:
1. ✅ Architecture Diagram
2. ✅ AI Chatbot Flow
3. ✅ Data Flow Diagram
4. ✅ Database Schema
5. ✅ Complete Roadmap
6. ✅ Gantt Timeline
7. ✅ Tech Stack Diagram
8. ✅ Quick Start Guide

Bạn muốn tôi code thêm phần nào? 🚀
