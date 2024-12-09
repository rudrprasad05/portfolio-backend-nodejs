import prisma from "../../db/prisma";
import { UserType } from "src/types";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JSON;

export async function Login(req: Request, res: Response) {
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
}

export async function Register(req: Request, res: Response) {
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
}
