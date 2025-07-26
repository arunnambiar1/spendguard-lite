import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id   text,
      category  text,
      amount    numeric,
      posted_at timestamptz
    );
    CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      user_id    text,
      category   text,
      score      numeric,
      created_at timestamptz default now()
    );
  `);
}
init().catch(e => console.error("init error", e));

app.get("/transactions", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM transactions ORDER BY posted_at DESC");
  res.json(rows);
});

app.post("/transactions", async (req, res) => {
  const { user_id, category, amount, posted_at } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO transactions(user_id, category, amount, posted_at) VALUES ($1,$2,$3,$4) RETURNING *",
    [user_id, category, amount, posted_at]
  );
  // simple placeholder score
  res.json({ score: 0, transaction: rows[0] });
});

app.get("/alerts", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM alerts ORDER BY created_at DESC");
  res.json(rows);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("API running on port", port));
