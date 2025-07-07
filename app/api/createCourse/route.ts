import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "You are not authenticated",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      lastName: string;
      firstName: string;
    };
    const userId = decoded.id;
    const userCourseCount = await prisma.course.count({ where: { userId } });
    if (userCourseCount >= 3) {
      return NextResponse.json(
        { error: "You can only create up to 3 courses." },
        { status: 403 }
      );
    }
    const { topic, lessons } = await req.json();

    if (!topic || !Array.isArray(lessons)) {
      return NextResponse.json({ error: "No Topic Provided" }, { status: 400 });
    }

    type LessonInput = {
      title: string;
      summary: string;
      youtubeQuery: string;
      youtubeUrl?: string;
      articleContent: string;
    };

    const course = await prisma.course.create({
      data: {
        topic,
        userId,
        lessons: {
          create: (lessons as LessonInput[]).map((lesson) => ({
            ...lesson,
            youtubeUrl: lesson.youtubeUrl || "", // fallback for optional field
          })),
        },
      },
      include: {
        lessons: true,
      },
    });

    return NextResponse.json({ id: course.id }, { status: 201 });
  } catch (error) {
    console.error("createCourse error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
