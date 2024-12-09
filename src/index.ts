import { Logger, loggingMiddleware } from "@rudrprasad05/logs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./db/prisma";
import { Login } from "./routes/auth/post";

dotenv.config();

const app = express();
const logger = new Logger();
const PORT = process.env.PORT || 3000;
const JSON = process.env.JSON;

app.use(express.json());
app.use(loggingMiddleware(logger));
app.use(cors());

app.get("/ping", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Pong", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "invalid json" });
    }

    const hash = await bcrypt.hash(password, 12);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hash, // Note: In a real application, you'd hash the password before saving
      },
    });

    const token = jwt.sign({ userId: email }, JSON as string, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "invalid json" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "invalid creds" });
      return;
    }

    const isCorrectPassword = await bcrypt.compare(
      user.hashedPassword,
      password
    );
    if (!isCorrectPassword) {
      res.status(400).json({ message: "invalid creds" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
