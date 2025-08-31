import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM transactions WHERE user_id = $1 ORDER BY posted_at DESC",
            [req.userId]
        );
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

router.post("/", async (req, res) => {
    const { category, amount, posted_at } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO transactions (user_id, category, amount, posted_at)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.userId, category, amount, posted_at] // <-- FIXED HERE
        );
        const transaction = rows[0];
        res.json({ score: 0, transaction });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

export default router;