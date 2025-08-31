import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/spendguard",
});

// Run migrations once on startup
(async () => {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id         SERIAL PRIMARY KEY,
        user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
        category   TEXT,
        amount     NUMERIC,
        posted_at  TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id         SERIAL PRIMARY KEY,
        user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
        category   TEXT,
        score      NUMERIC,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log("DB init OK");
  } catch (err) {
    console.error("DB init FAILED", err);
    process.exit(1);
  }
})();

export default pool;