graph TD

%% === Root ===
Seasons --> Leagues
Seasons --> Countries

%% === Leagues-related ===
Leagues --> Fixtures
Leagues --> Odds
Leagues --> Standings

%% === Fixtures tree ===
Fixtures --> H2H
Fixtures --> Live
Fixtures --> Events
Fixtures --> Lineups
Fixtures --> "Fixtures Statistics"
H2H --> Predictions
H2H --> Injuries

%% === Odds tree ===
Odds --> "Live Odds"
Odds --> "Pre-match Odds"
"Live Odds" --> Bets
"Pre-match Odds" --> Bookmakers

%% === Countries-related ===
Countries --> Venues
Countries --> Teams
Countries --> "Top Scorers"
Countries --> Players
Countries --> "Teams Statistics"

%% === Players tree ===
Players --> "Players Statistics"
Players --> "Players Squads"
Players --> "Players Profiles"
"Players Squads" --> "Players Teams"

%% === Teams tree ===
Teams --> "Teams Statistics"
Teams --> Transfers
Teams --> Coaches
Transfers --> Trophies
Coaches --> Sidelined

%% === Cross-links ===
Venues --> "Players Statistics"
Fixtures --> Odds
Teams --> Players
Players --> Transfers
