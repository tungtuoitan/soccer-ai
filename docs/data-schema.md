# data schema
-- Teams (Đội bóng)
teams (
  id, name, logo_url, country, league, 
  founded_year, stadium, description
)

-- Matches (Trận đấu)
matches (
  id, home_team_id, away_team_id, match_date,
  home_score, away_score, status, venue, league
)

-- Players (Cầu thủ)
players (
  id, name, team_id, position, number,
  nationality, birth_date, photo_url
)

-- Articles (Bài viết)
articles (
  id, title, content, summary, thumbnail,
  author, source, published_at, category,
  is_ai_generated
)

-- Standings (Bảng xếp hạng)
standings (
  id, team_id, league, season, position,
  points, wins, draws, losses, goals_for, goals_against
)

-- Social Posts (Bài viết cộng đồng)
social_posts (
  id, platform, post_url, content, author,
  likes, comments_count, fetched_at
)

-- Chat History (Lịch sử chat)
chat_history (
  id, user_id, question, answer, 
  sql_query, data_sources, created_at
)
```
