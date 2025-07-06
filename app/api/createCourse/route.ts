import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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
