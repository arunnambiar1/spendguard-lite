// db.js
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://localhost/spendguard",
});

// Run migrations once on startup
(async () => {
  await pool.query(`
    -- Enable UUID generation
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT now()
    );

    -- Transactions table (linked to users)
    CREATE TABLE IF NOT EXISTS transactions (
      id         SERIAL PRIMARY KEY,
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      category   TEXT,
      amount     NUMERIC,
      posted_at  TIMESTAMPTZ
    );

    -- Alerts table (linked to users)
    CREATE TABLE IF NOT EXISTS alerts (
      id         SERIAL PRIMARY KEY,
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      category   TEXT,
      score      NUMERIC,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
})();


export default pool;
