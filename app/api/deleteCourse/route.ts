import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
