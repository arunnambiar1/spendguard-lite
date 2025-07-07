/* ---- 1  Core imports ---- */
const express = require('express');
const app     = express();

/* ---- 2  Middleware ---- */
app.use(express.json());

/* ---- 3  Helpers ---- */
const db    = require('./db');
const axios = require('axios');

/* ---- 4  Routes ---- */

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date() })
);

// Receive a new transaction, score it, and store alerts
app.post('/transactions', async (req, res) => {
  const { user_id, category, amount, posted_at } = req.body;

  db.run(
    `INSERT INTO transactions (user_id, category, amount, posted_at)
     VALUES (?, ?, ?, ?)`,
    [user_id, category, amount, posted_at],
    async function (err) {
      if (err) return res.status(500).json({ error: err.message });

      try {
        const { data } = await axios.post(
          'http://analytics:8000/analyze',
          req.body
        );
        const { score } = data;

        if (score >= 2) {
          db.run(
            `INSERT INTO alerts (category, score, created_at)
             VALUES (?, ?, datetime('now'))`,
            [category, score]
          );
        }
        res.json({ id: this.lastID, score });
      } catch {
        res.status(502).json({ error: 'Analytics service down' });
      }
    }
  );
});

// List all transactions
app.get('/transactions', (_req, res) => {
  db.all(
    `SELECT id, user_id, category, amount, posted_at
     FROM transactions
     ORDER BY posted_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// List all alerts
app.get('/alerts', (_req, res) => {
  db.all(
    `SELECT id, category, score, created_at
     FROM alerts
     ORDER BY created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/* ---- 5  Start server ---- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
