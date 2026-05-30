CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  age           INTEGER,
  gender        VARCHAR(50),
  token_balance INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id          SERIAL PRIMARY KEY,
  client_id   INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  goal_tokens INTEGER NOT NULL DEFAULT 1,
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_events (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  token_emoji VARCHAR(10) NOT NULL,
  awarded_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rewards (
  id          SERIAL PRIMARY KEY,
  client_id   INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  cost        INTEGER NOT NULL,
  redeemed_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);