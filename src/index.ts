import { Logger, loggingMiddleware } from "@rudrprasad05/logs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./db/prisma";
import { Login } from "./routes/auth/post";
import { authenticateToken } from "./middleware/jwt";

dotenv.config();

const app = express();
const logger = new Logger();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JSON;

app.use(express.json());
app.use(loggingMiddleware(logger));
app.use(cors());

app.get("/admin", async () => {
  console.log("res");
});

app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ message: "Pong", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/token", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(403).json({ error: "no token" });
      return;
    }
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET as string);

    res.status(200).json({ message: "ok" });
    return;
  } catch (error) {
    res.status(403).json({ error: "invalid token" });
    return;
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

    const token = jwt.sign({ userId: email }, JWT_SECRET as string, {
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
    console.log(email, password);

    if (!email || !password) {
      console.log("1");
      res.status(400).json({ message: "invalid json" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log("2");
      res.status(400).json({ message: "invalid creds" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      console.log("3");
      res.status(400).json({ message: "invalid creds" });
      return;
    }
    const token = jwt.sign({ userId: email }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "success", token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
