import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

import { registerSchema } from "@/lib/schema";
const saltRounds = 12;

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map((err) => err.message);
    return NextResponse.json({ error: errorMessages }, { status: 400 });
  }
  const { username, password, firstName, lastName } = parsed.data;

  const hashedPassword = await hashPassword(password);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exist" },
        { status: 409 }
      );
    }
    await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Sign Up succesful!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create user", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
