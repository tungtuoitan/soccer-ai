// ======================================================
// FOOTBALL DATABASE SCHEMA - CLEAN DBML (NO INLINE REFS)
// All relationships declared below with unique Ref names
// ======================================================
Table organizations {
  id integer [pk]
  code varchar
  name varchar
  type varchar [note: 'country, international, world']
  parent_id integer [ref: > organizations.id]
  created_at timestamp
  updated_at timestamp
}

Table leagues {
  id integer [pk]
  code varchar
  name varchar
  organization_id integer [ref: > organizations.id]
  type varchar
  created_at timestamp
  updated_at timestamp
}

Table seasons {
  id integer [pk]
  code varchar 
  year_start integer
  is_current boolean
  start_date date
  end_date date
  created_at timestamp
  updated_at timestamp
}

Table league_seasons {
  id integer [pk]
  league_id integer [ref: > leagues.id]
  season_id integer [ref: > seasons.id]
  
  start_date date [note: 'Ngày bắt đầu mùa giải cụ thể']
  end_date date [note: 'Ngày kết thúc mùa giải']
  current_round integer [note: 'Vòng đấu hiện tại']
  total_rounds integer [note: 'Tổng số vòng đấu']
  
  format varchar [note: 'round_robin, knockout, group_knockout']
  status varchar [note: 'scheduled, ongoing, completed']
  is_current boolean [default: false]
  
  // Optional aggregate fields (có thể null, tính sau)
  champion_id integer [ref: > teams.id, note: 'Đội vô địch (sau khi kết thúc)']
  top_scorer_id integer [ref: > players.id, note: 'Vua phá lưới']
  top_scorer_goals integer
  total_goals integer [note: 'Tổng số bàn thắng cả mùa']
  total_matches integer
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (league_id, season_id) [unique]
  }
}

Table teams {
  id integer [pk]
  code varchar
  name varchar
  short_name varchar
  country varchar
  home_venue varchar
  created_at timestamp
  updated_at timestamp
}

Table coaches {
  id integer [pk]
  name varchar
  full_name varchar
  nationality varchar
  date_of_birth date
  photo_url varchar
  coaching_license varchar [note: 'UEFA Pro, etc']
  preferred_formation varchar
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

Table players {
  id integer [pk]
  name varchar
  full_name varchar
  date_of_birth date [note: 'Hoặc dùng birth_year integer nếu GDPR']
  nationality varchar
  position varchar [note: 'GK, DF, MF, FW']
  preferred_foot varchar [note: 'left, right, both']
  height integer [note: 'cm']
  weight integer [note: 'kg']
  photo_url varchar
  market_value decimal
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

Table player_contracts {
  id integer [pk]
  player_id integer [ref: > players.id]
  team_id integer [ref: > teams.id]
  season_id integer [ref: > seasons.id]
  
  shirt_number integer
  joined_at date [note: 'Ngày bắt đầu hợp đồng']
  left_at date [note: 'Ngày rời đội']
  contract_until date [note: 'Ngày hết hạn hợp đồng']
  is_loan boolean [default: false, note: 'Đang cho mượn hay không']
  loan_fee decimal [note: 'Phí cho mượn nếu là loan']
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (player_id, team_id, season_id)
  }
}

Table coaching_staff {
  id integer [pk]
  coach_id integer [ref: > coaches.id]
  team_id integer [ref: > teams.id]
  season_id integer [ref: > seasons.id]
  
  role varchar [note: 'head_coach, assistant, goalkeeper_coach, fitness_coach']
  joined_at date
  left_at date [note: 'NULL nếu đang làm việc']
  contract_until date
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (coach_id, team_id, season_id)
  }
}

Table matches {
  id integer [pk]
  league_id integer [ref: > leagues.id]
  season_id integer [ref: > seasons.id]
  home_team_id integer [ref: > teams.id]
  away_team_id integer [ref: > teams.id]
  
  round integer
  home_score integer
  away_score integer
  status varchar [note: 'scheduled, live, finished, postponed, cancelled']
  
  match_date datetime
  venue varchar
  use_neutral_venue boolean [default: false]
  attendance integer
  
  referee_id integer [note: 'FK to referees table nếu có']
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    match_date
    status
    (league_id, season_id)
  }
}

Table match_events {
  id integer [pk]
  match_id integer [ref: > matches.id]
  minute integer
  extra_time integer [note: 'Phút bù giờ']
  
  type varchar [note: 'goal, card, substitution, var, penalty, own_goal']
  team_id integer [ref: > teams.id]
  player_id integer [ref: > players.id]
  
  // Related players cho events khác nhau
  assist_player_id integer [ref: > players.id, note: 'Người kiến tạo']
  substitution_out_player_id integer [ref: > players.id, note: 'Cầu thủ ra sân']
  
  card_type varchar [note: 'yellow, red, yellow_red']
  detail text [note: 'Mô tả chi tiết event']
  
  created_at timestamp
  
  Indexes {
    match_id
    type
    player_id
  }
}

Table lineups {
  id integer [pk]
  match_id integer [ref: > matches.id]
  team_id integer [ref: > teams.id]
  player_id integer [ref: > players.id]
  
  position varchar [note: 'GK, LB, CB, RB, DM, CM, AM, LW, RW, ST']
  formation varchar [note: '4-3-3, 4-4-2, 3-5-2']
  is_starter boolean
  shirt_number integer
  
  substituted_in_min integer [note: 'Phút vào sân']
  substituted_out_min integer [note: 'Phút rời sân']
  
  created_at timestamp
  
  Indexes {
    (match_id, team_id)
    player_id
  }
}

// State per match
Table player_stats {
  id integer [pk]

  // Liên kết chính
  match_id integer [ref: > matches.id]
  player_id integer [ref: > players.id]

  // Thời gian thi đấu
  minutes_played integer [note: 'Tổng số phút thi đấu']
  started boolean [note: 'Cầu thủ đá chính hay vào sân từ ghế dự bị']
  substituted_in_min integer [note: 'Phút vào sân (nếu có)']
  substituted_out_min integer [note: 'Phút rời sân (nếu có)']

  // Tấn công
  goals integer [default: 0]
  assists integer [default: 0]
  shots_total integer [default: 0]
  shots_on_target integer [default: 0]
  dribbles_attempted integer [default: 0]
  dribbles_success integer [default: 0]
  offsides integer [default: 0]

  // Chuyền bóng
  passes_total integer [default: 0]
  passes_accuracy decimal [note: '% chính xác đường chuyền']
  key_passes integer [default: 0]
  crosses integer [default: 0]
  long_balls integer [default: 0]

  // Phòng ngự
  tackles integer [default: 0]
  interceptions integer [default: 0]
  clearances integer [default: 0]
  duels_total integer [default: 0]
  duels_won integer [default: 0]
  aerial_duels_won integer [default: 0]
  blocks integer [default: 0]

  // Thủ môn (nếu có)
  saves integer [default: 0]
  goals_conceded integer [default: 0]
  clean_sheet boolean

  // Kỷ luật
  fouls_committed integer [default: 0]
  fouls_drawn integer [default: 0]
  yellow_cards integer [default: 0]
  red_cards integer [default: 0]
  penalties_won integer [default: 0]
  penalties_committed integer [default: 0]
  penalties_scored integer [default: 0]
  penalties_missed integer [default: 0]
  penalties_saved integer [default: 0]

  // Tổng hợp
  rating decimal [note: 'Điểm đánh giá tổng thể (VD: SofaScore rating)']
  man_of_the_match boolean
  captain boolean

  // Metadata
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (match_id, player_id) [unique]
    player_id
  }
}

// State per match per team
Table team_stats {
  id integer [pk]
  team_id integer [ref: > teams.id]
  match_id integer [ref: > matches.id]

  goals_for integer
  goals_against integer
  goal_difference integer

  shots_total integer
  shots_on_target integer
  shots_off_target integer
  shots_blocked integer

  possession_percent decimal [note: 'Average possession %']
  passes_total integer
  passes_accurate integer
  pass_accuracy decimal

  corners integer
  offsides integer
  fouls integer
  yellow_cards integer
  red_cards integer

  saves integer
  penalties_scored integer
  penalties_missed integer

  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (match_id, team_id) [unique]
  }
}

// Aggregated season stats per team
Table team_standings {
  id integer [pk]
  team_id integer [ref: > teams.id]
  season_id integer [ref: > seasons.id]
  league_id integer [ref: > leagues.id]
  
  position integer
  played integer
  won integer
  drawn integer
  lost integer
  goals_for integer
  goals_against integer
  goal_difference integer
  points integer
  form varchar [note: 'Last 5 matches: WWDLL']
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    (league_id, season_id, team_id) [unique]
    position
  }
}

Table injuries {
  id integer [pk]
  player_id integer [ref: > players.id]
  
  injury_type varchar [note: 'hamstring, knee, ankle, muscle, etc']
  severity varchar [note: 'minor, moderate, severe']
  start_date date
  expected_return date [note: 'Dự kiến trở lại']
  actual_return date [note: 'Thực tế trở lại']
  status varchar [note: 'injured, recovering, fit']
  
  created_at timestamp
  updated_at timestamp
  
  Indexes {
    player_id
    status
  }
}

Table transfers {
  id integer [pk]
  player_id integer [ref: > players.id]
  from_team_id integer [ref: > teams.id, note: 'NULL nếu free agent']
  to_team_id integer [ref: > teams.id]
  season_id integer [ref: > seasons.id]
  
  transfer_date date
  fee_amount decimal [note: 'Phí chuyển nhượng']
  fee_currency varchar [note: 'EUR, GBP, USD']
  transfer_type varchar [note: 'permanent, loan, free']
  contract_length_years integer
  
  created_at timestamp
  
  Indexes {
    player_id
    transfer_date
  }
}

// Optional: Nếu muốn track referees riêng
Table referees {
  id integer [pk]
  name varchar
  nationality varchar
  birth_year integer
  is_active boolean
  created_at timestamp
  updated_at timestamp
}

// ======================================================
// COMMENTED OUT - Content & Community tables
// Uncomment when needed for Phase 2
// ======================================================

// Table users {
//   id integer [pk]
//   email varchar
//   name varchar
//   role varchar
//   created_at timestamp
//   updated_at timestamp
// }

// Table articles {
//   id integer [pk]
//   title varchar
//   author_id integer
//   category varchar
//   related_team_id integer
//   published_at timestamp
//   updated_at timestamp
// }

// Table comments {
//   id integer [pk]
//   article_id integer
//   user_id integer
//   content text
//   created_at timestamp
//   updated_at timestamp
// }

// Table user_preferences {
//   id integer [pk]
//   user_id integer
//   language varchar
//   notify_match_start boolean
//   notify_goals boolean
//   created_at timestamp
//   updated_at timestamp
// }

// Table chat_history {
//   id integer [pk]
//   user_id integer
//   question text
//   answer text
//   user_rating integer
//   created_at timestamp
// }