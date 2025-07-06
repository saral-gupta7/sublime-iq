import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error("User not found!");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          error: "Incorrect Password. Please try again",
        },
        {
          status: 401,
        }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        password: user.password,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
