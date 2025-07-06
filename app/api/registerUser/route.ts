import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

const saltRounds = 12;

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export async function POST(req: NextRequest) {
  const { username, password, firstName, lastName } = await req.json();

  if (!username.trim()) {
    console.error("Username can't be empty");
    return NextResponse.json(
      { error: "Username can't be empty" },
      { status: 400 }
    );
  }

  if (!password.trim()) {
    console.error("Password can't be empty");
    return NextResponse.json(
      { error: "Password can't be empty" },
      { status: 400 }
    );
  }
  const hashedPassword = await hashPassword(password);

  try {
    // const existingUser = await prisma.user.findUnique({
    //   where: { username },
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "Username already exist" },
    //     { status: 409 }
    //   );
    // }
    await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password: hashedPassword,
      },
      include: {
        courses: true,
      },
    });

    return NextResponse.json(
      { message: "User created succesfully!" },
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
