// ======================================================
// USERS & AUTHENTICATION
// ======================================================

Table users {
  id integer [pk]
  
  // Basic Info
  email varchar [unique, note: 'Email chính (có thể null nếu dùng phone)']
  phone varchar [unique, note: 'Số điện thoại (có thể null nếu dùng email)']
  username varchar [unique, note: 'Username unique']
  
  // Password auth (nullable nếu dùng OAuth)
  password_hash varchar [note: 'NULL nếu chỉ dùng OAuth']
  
  // Profile
  full_name varchar
  display_name varchar [note: 'Tên hiển thị']
  avatar_url varchar
  bio text [note: 'Giới thiệu bản thân']
  date_of_birth date
  gender varchar [note: 'male, female, other, prefer_not_to_say']
  country varchar
  city varchar
  
  // Preferences
  language varchar [default: 'vi', note: 'vi, en']
  timezone varchar [default: 'Asia/Ho_Chi_Minh']
  theme varchar [default: 'light', note: 'light, dark, auto']
  
  // Account status
  role varchar [default: 'user', note: 'user, moderator, admin, editor']
  status varchar [default: 'active', note: 'active, suspended, banned, deleted']
  is_verified boolean [default: false]
  is_premium boolean [default: false]
  premium_expires_at timestamp
  
  // Verification
  email_verified boolean [default: false]
  email_verified_at timestamp
  phone_verified boolean [default: false]
  phone_verified_at timestamp
  
  // GDPR & Privacy
  terms_accepted boolean [default: false]
  terms_accepted_at timestamp
  privacy_accepted boolean [default: false]
  privacy_accepted_at timestamp
  marketing_consent boolean [default: false]
  data_processing_consent boolean [default: true]
  
  // Security & Tracking
  last_login_at timestamp
  last_login_ip varchar
  last_activity_at timestamp
  login_count integer [default: 0]
  failed_login_attempts integer [default: 0]
  locked_until timestamp [note: 'Khóa tài khoản tạm thời sau nhiều lần đăng nhập sai']
  
  // Soft delete
  deleted_at timestamp [note: 'Soft delete - GDPR compliance']
  deletion_reason varchar
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    email
    phone
    username
    status
    (email, status)
  }
}

// OAuth/Social Login
Table user_social_accounts {
  id integer [pk]
  user_id integer [ref: > users.id]
  
  provider varchar [note: 'google, facebook, apple, twitter']
  provider_user_id varchar [note: 'ID từ provider']
  provider_email varchar
  
  access_token text [note: 'Encrypted']
  refresh_token text [note: 'Encrypted']
  token_expires_at timestamp
  
  profile_data json [note: 'Thông tin profile từ OAuth provider']
  
  is_primary boolean [default: false, note: 'Account chính để login']
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (provider, provider_user_id) [unique]
    user_id
  }
}

// Email/Phone OTP verification
Table verification_codes {
  id integer [pk]
  user_id integer [ref: > users.id, note: 'NULL nếu chưa có user']
  
  code varchar [note: '6-digit code']
  type varchar [note: 'email_verify, phone_verify, password_reset, login_2fa']
  
  email varchar [note: 'Nếu verify email']
  phone varchar [note: 'Nếu verify phone']
  
  expires_at timestamp
  used_at timestamp [note: 'NULL nếu chưa dùng']
  
  ip_address varchar
  user_agent text
  
  created_at timestamp
  
  Indexes {
    (code, type)
    email
    phone
    expires_at
  }
}

// Session management (optional - nếu dùng JWT có thể bỏ)
Table user_sessions {
  id integer [pk]
  user_id integer [ref: > users.id]
  
  token varchar [unique, note: 'Session token hoặc JWT ID']
  
  ip_address varchar
  user_agent text
  device_type varchar [note: 'mobile, desktop, tablet']
  device_name varchar
  
  expires_at timestamp
  last_activity_at timestamp
  
  created_at timestamp
  
  Indexes {
    user_id
    token
    expires_at
  }
}

// ======================================================
// USER PREFERENCES & FAVORITES
// ======================================================

Table user_preferences {
  id integer [pk]
  user_id integer [ref: > users.id, note: 'UNIQUE']
  
  // Favorite teams/players
  favorite_team_ids integer[] [note: 'Array of team IDs']
  favorite_player_ids integer[] [note: 'Array of player IDs']
  favorite_league_ids integer[] [note: 'Array of league IDs']
  
  // Notifications
  notify_match_start boolean [default: true]
  notify_match_goals boolean [default: true]
  notify_match_end boolean [default: false]
  notify_news boolean [default: true]
  notify_transfers boolean [default: true]
  notify_injuries boolean [default: false]
  
  // Notification channels
  notify_via_email boolean [default: true]
  notify_via_push boolean [default: true]
  notify_via_sms boolean [default: false]
  
  // AI Chatbot preferences
  ai_response_style varchar [default: 'balanced', note: 'concise, balanced, detailed']
  ai_language varchar [default: 'vi']
  ai_show_sources boolean [default: true]
  ai_enable_voice boolean [default: false]
  
  // Privacy settings
  profile_visibility varchar [default: 'public', note: 'public, friends, private']
  show_online_status boolean [default: true]
  allow_messages boolean [default: true]
  
  // Display preferences
  default_view varchar [default: 'home', note: 'home, matches, standings, news']
  matches_per_page integer [default: 20]
  compact_mode boolean [default: false]
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    user_id [unique]
  }
}

// ======================================================
// CONTENT - ARTICLES & NEWS
// ======================================================

Table articles {
  id integer [pk]
  
  // Content
  title varchar [note: 'Tiêu đề bài viết']
  slug varchar [unique, note: 'URL-friendly slug']
  content text [note: 'Nội dung HTML']
  excerpt text [note: 'Đoạn trích ngắn']
  
  // Media
  thumbnail_url varchar
  cover_image_url varchar
  images json [note: 'Array of image URLs in content']
  
  // Author & Source
  author_id integer [ref: > users.id]
  source_name varchar [note: 'Nguồn gốc nếu aggregate từ nơi khác']
  source_url varchar [note: 'Link bài gốc']
  
  // Categorization
  category varchar [note: 'news, analysis, interview, opinion, match_report']
  tags varchar[] [note: 'Array of tags']
  language varchar [default: 'vi']
  
  // Related entities
  related_match_id integer [ref: > matches.id]
  related_team_ids integer[] [note: 'Array of team IDs']
  related_player_ids integer[] [note: 'Array of player IDs']
  related_league_id integer [ref: > leagues.id]
  
  // AI generated
  is_ai_generated boolean [default: false]
  ai_model varchar [note: 'claude-3.5, gpt-4, etc nếu dùng AI']
  ai_prompt text [note: 'Prompt đã dùng để generate']
  
  // Status & Publishing
  status varchar [default: 'draft', note: 'draft, published, archived']
  published_at timestamp
  featured boolean [default: false]
  featured_until timestamp [note: 'Hết thời gian featured']
  
  // Engagement
  views_count integer [default: 0]
  likes_count integer [default: 0]
  comments_count integer [default: 0]
  shares_count integer [default: 0]
  
  // SEO
  meta_title varchar
  meta_description text
  meta_keywords varchar[]
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    slug [unique]
    author_id
    category
    status
    published_at
    featured
    (status, published_at)
  }
}

// ======================================================
// COMMENTS & INTERACTIONS
// ======================================================

Table comments {
  id integer [pk]
  
  // Reference
  article_id integer [ref: > articles.id]
  user_id integer [ref: > users.id]
  
  // Content
  content text
  
  // Threading (nested comments)
  parent_comment_id integer [ref: > comments.id, note: 'NULL nếu top-level comment']
  depth integer [default: 0, note: '0 = top level, 1 = reply, 2 = reply to reply']
  thread_root_id integer [ref: > comments.id, note: 'ID của comment gốc trong thread']
  
  // Engagement
  likes_count integer [default: 0]
  replies_count integer [default: 0]
  
  // Moderation
  is_edited boolean [default: false]
  edited_at timestamp
  is_deleted boolean [default: false]
  deleted_at timestamp
  
  moderation_status varchar [default: 'pending', note: 'pending, approved, rejected, flagged']
  moderation_reason varchar
  moderated_by integer [ref: > users.id]
  moderated_at timestamp
  
  is_pinned boolean [default: false]
  is_locked boolean [default: false, note: 'Không cho reply']
  
  // Reports
  report_count integer [default: 0]
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    article_id
    user_id
    parent_comment_id
    moderation_status
    (article_id, created_at)
  }
}

Table comment_likes {
  id integer [pk]
  comment_id integer [ref: > comments.id]
  user_id integer [ref: > users.id]
  
  created_at timestamp
  
  Indexes {
    (comment_id, user_id) [unique]
    user_id
  }
}

Table article_likes {
  id integer [pk]
  article_id integer [ref: > articles.id]
  user_id integer [ref: > users.id]
  
  created_at timestamp
  
  Indexes {
    (article_id, user_id) [unique]
    user_id
  }
}

// ======================================================
// AI CHATBOT
// ======================================================

Table chat_conversations {
  id integer [pk]
  user_id integer [ref: > users.id, note: 'NULL nếu anonymous']
  
  title varchar [note: 'Tự động generate từ first message']
  
  // Session info
  session_id varchar [note: 'Session ID cho anonymous users']
  ip_address varchar
  user_agent text
  
  // Stats
  messages_count integer [default: 0]
  tokens_used integer [default: 0]
  
  is_archived boolean [default: false]
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    user_id
    session_id
    created_at
  }
}

Table chat_messages {
  id integer [pk]
  conversation_id integer [ref: > chat_conversations.id]
  
  // Message
  role varchar [note: 'user, assistant, system']
  content text
  
  // Context used
  context_type varchar [note: 'database, web_search, general, hybrid']
  sql_query text [note: 'SQL query nếu có']
  sql_result json [note: 'Kết quả từ SQL']
  web_sources json [note: 'Array of web sources used']
  
  // Performance
  response_time_ms integer
  tokens_used integer
  model varchar [note: 'claude-3.5-sonnet, etc']
  
  // User feedback
  user_rating integer [note: '1-5 stars']
  is_helpful boolean [note: 'Thumbs up/down']
  feedback_text text
  feedback_at timestamp
  
  // Error tracking
  has_error boolean [default: false]
  error_type varchar [note: 'sql_error, timeout, api_error']
  error_message text
  
  created_at timestamp
  
  Indexes {
    conversation_id
    role
    created_at
  }
}

// ======================================================
// SOCIAL & COMMUNITY
// ======================================================

Table social_posts {
  id integer [pk]
  
  // Source
  platform varchar [note: 'facebook, twitter, instagram, tiktok']
  platform_post_id varchar [unique]
  post_url varchar
  
  // Content
  content text
  images json [note: 'Array of image URLs']
  video_url varchar
  
  // Author
  author_name varchar
  author_handle varchar
  author_avatar_url varchar
  author_verified boolean
  
  // Engagement
  likes_count integer [default: 0]
  comments_count integer [default: 0]
  shares_count integer [default: 0]
  views_count integer [default: 0]
  
  // Analysis
  sentiment varchar [note: 'positive, negative, neutral']
  language varchar
  
  // Related entities (extracted automatically)
  related_match_id integer [ref: > matches.id]
  related_team_ids integer[]
  related_player_ids integer[]
  entities_mentioned json [note: 'Auto-extracted entities']
  
  // Metadata
  posted_at timestamp
  fetched_at timestamp
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    platform
    platform_post_id [unique]
    posted_at
    sentiment
  }
}

// User follows teams/players
Table user_follows {
  id integer [pk]
  user_id integer [ref: > users.id]
  
  follow_type varchar [note: 'team, player, league']
  follow_id integer [note: 'ID của team/player/league']
  
  notify_on_match boolean [default: true]
  notify_on_news boolean [default: true]
  notify_on_transfer boolean [default: true]
  
  created_at timestamp
  
  Indexes {
    user_id
    (user_id, follow_type, follow_id) [unique]
    (follow_type, follow_id)
  }
}

// ======================================================
// MODERATION & REPORTS
// ======================================================

Table content_reports {
  id integer [pk]
  
  // What is reported
  content_type varchar [note: 'comment, article, chat_message, social_post']
  content_id integer
  
  // Who reported
  reported_by integer [ref: > users.id]
  
  // Report details
  reason varchar [note: 'spam, offensive, misinformation, harassment, inappropriate']
  details text
  
  // Status
  status varchar [default: 'pending', note: 'pending, reviewing, resolved, dismissed']
  priority varchar [default: 'normal', note: 'low, normal, high, urgent']
  
  // Review
  reviewed_by integer [ref: > users.id]
  reviewed_at timestamp
  review_notes text
  action_taken varchar [note: 'deleted, edited, warned, banned, none']
  
  created_at timestamp
  
  Indexes {
    (content_type, content_id)
    reported_by
    status
    priority
  }
}

// ======================================================
// NOTIFICATIONS
// ======================================================

Table notifications {
  id integer [pk]
  user_id integer [ref: > users.id]
  
  // Notification content
  type varchar [note: 'match_start, goal, article, comment_reply, mention, transfer']
  title varchar
  body text
  action_url varchar [note: 'Deep link để user click vào']
  
  // Related entity
  entity_type varchar [note: 'match, article, comment, transfer']
  entity_id integer
  
  // Status
  is_read boolean [default: false]
  read_at timestamp
  
  // Delivery
  sent_via_push boolean [default: false]
  sent_via_email boolean [default: false]
  sent_via_sms boolean [default: false]
  
  created_at timestamp
  
  Indexes {
    user_id
    is_read
    (user_id, is_read, created_at)
  }
}

// ======================================================
// AUDIT & LOGGING
// ======================================================

Table audit_logs {
  id integer [pk]
  
  // What changed
  table_name varchar
  record_id integer
  action varchar [note: 'INSERT, UPDATE, DELETE']
  
  // Changes
  old_values json [note: 'Giá trị cũ (cho UPDATE/DELETE)']
  new_values json [note: 'Giá trị mới (cho INSERT/UPDATE)']
  changed_fields varchar[] [note: 'Danh sách fields thay đổi']
  
  // Who & When
  user_id integer [ref: > users.id, note: 'NULL nếu system action']
  ip_address varchar
  user_agent text
  
  created_at timestamp
  
  Indexes {
    table_name
    record_id
    user_id
    created_at
    (table_name, record_id)
  }
}