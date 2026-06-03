CREATE TABLE IF NOT EXISTS volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  skills TEXT NOT NULL DEFAULT '[]',
  telegram_chat_id INTEGER,
  telegram_user_id INTEGER,
  telegram_username TEXT,
  available INTEGER NOT NULL DEFAULT 1,
  approved INTEGER NOT NULL DEFAULT 0,
  rejected INTEGER NOT NULL DEFAULT 0,
  assignment_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  approved_at TEXT,
  last_response_time TEXT
);

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'searching',
  assigned_volunteer TEXT,
  requester_chat_id INTEGER,
  requester_user_id INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  assigned_at TEXT,
  completed_at TEXT,
  expired_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  chat_id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_volunteers_city ON volunteers(city);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_chat_id);
