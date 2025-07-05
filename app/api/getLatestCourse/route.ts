import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const latestCourse = await prisma.course.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        lessons: {
          orderBy: { id: "asc" }, // consistent lesson order
        },
      },
    });

    if (!latestCourse) {
      return NextResponse.json({ error: "No course found" }, { status: 404 });
    }

    return NextResponse.json(latestCourse);
  } catch (error) {
    console.error("Error fetching latest course:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
