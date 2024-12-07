import express from "express";
import dotenv from "dotenv";
import pool from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/ping", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Pong", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
