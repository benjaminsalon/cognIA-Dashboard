import { NextRequest, NextResponse } from "next/server";
import { getAllLessons, getCompletedLessons } from "@/lib/storage";

export async function GET() {
  try {
    const completedLessonIds = await getCompletedLessons();

    if (completedLessonIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          completedLessons: [],
        },
        { status: 200 }
      );
    }

    // Get all lessons and filter for completed ones
    const allLessons = await getAllLessons();
    const completedLessons = allLessons.filter((lesson: any) =>
      completedLessonIds.includes(lesson.id)
    );

    return NextResponse.json(
      {
        success: true,
        completedLessons: completedLessons.map((lesson: any) => ({
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
    console.error("Error getting completed lessons:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}