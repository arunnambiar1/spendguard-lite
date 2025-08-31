import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;