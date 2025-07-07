import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const courseCount = await prisma.course.count({
      where: { userId: decoded.id },
    });

    return NextResponse.json({ count: courseCount });
  } catch (err) {
    console.error("Failed to fetch user course count:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
