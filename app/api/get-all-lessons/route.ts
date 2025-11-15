import { NextRequest, NextResponse } from "next/server";
import { getAllLessons } from "@/lib/storage";

export async function GET() {
  try {
    const lessons = await getAllLessons();

    return NextResponse.json(
      {
        success: true,
        lessons: lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          difficulty: lesson.difficulty,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting all lessons:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}