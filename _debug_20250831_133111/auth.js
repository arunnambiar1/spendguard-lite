import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const SALT_ROUNDS = 10;

// Utility: sign a JWT for a given user ID
function signToken(userId) {
  return jwt.sign(
    { sub: userId },
    SECRET,
    { expiresIn: "24h" }
  );
}

// POST /auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, hash]
    );
    const user = rows[0];
    const token = signToken(user.id);
    res.json({ token, user });
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(400).json({ error: 'Email already in use' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT id, password_hash FROM users WHERE email = $1`,
      [email]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware: authenticate requests
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default router;
