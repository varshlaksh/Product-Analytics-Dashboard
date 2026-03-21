import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, age, gender } = req.body;

    if (!username || !password || !age || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        age: Number(age),
        gender,
      },
    });

    return res.status(201).json(user);
  } catch (error: any) {
  console.error("REGISTER ERROR:", error);

  // ✅ handle duplicate username gracefully
  if (error.code === 'P2002') {
    return res.status(400).json({ error: "Username already taken" });
  }

  return res.status(500).json({ error: "Something went wrong" });
}
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};