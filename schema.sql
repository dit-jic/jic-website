CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  appt_date TEXT NOT NULL,
  appt_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  patient_name TEXT NOT NULL,
  gender TEXT, age TEXT,
  phone TEXT NOT NULL,
  email TEXT, cnic TEXT, city TEXT,
  visit_type TEXT, mr_number TEXT, reason TEXT,
  staff_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- one active booking per doctor per slot: the database itself blocks double-booking
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_slot
  ON appointments (doctor_id, appt_date, appt_time) WHERE status IN ('pending','confirmed');
CREATE INDEX IF NOT EXISTS idx_date ON appointments (appt_date);
CREATE INDEX IF NOT EXISTS idx_phone ON appointments (phone);
