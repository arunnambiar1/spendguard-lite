const path    = require('path');
const fs      = require('fs');
const sqlite3 = require('sqlite3').verbose();

/* Build an absolute path that always points to …/src/api/data/spendguard.db */
const dbFile  = path.join(__dirname, 'data', 'spendguard.db');

/* Ensure the directory exists (recursive = true will make /data if missing) */
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

/* Now open (or create) the database */
const db = new sqlite3.Database(
  dbFile,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => { if (err) console.error('SQLite open error:', err.message); }
);

/* Create tables */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id   TEXT,
      category  TEXT,
      amount    REAL,
      posted_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category    TEXT,
      score       REAL,
      created_at  TEXT
    )
  `);
});

module.exports = db;
