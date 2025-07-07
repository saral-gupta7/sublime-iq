import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      {
        error: "You are not authenticated",
      },
      { status: 401 }
    );
  }
  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
    };

    const userCourses = await prisma.course.findMany({
      where: {
        userId: decodedUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        lessons: true,
      },
    });
    return NextResponse.json(userCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      {
        status: 500,
      }
    );
  }
}
