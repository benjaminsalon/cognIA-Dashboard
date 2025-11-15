import { NextRequest, NextResponse } from "next/server";
import { getAllLessons, getCompletedLessons } from "@/lib/storage";

export async function GET() {
  try {
    // Get all available lessons
    const availableLessons = await getAllLessons();
    const availableLessonIds = availableLessons.map((lesson: any) => lesson.id);

    // Get completed lessons
    const completedLessons = await getCompletedLessons();

    // Filter out completed lessons
    const upcomingLessonIds = availableLessonIds.filter(
      (lessonId: string) => !completedLessons.includes(lessonId)
    );

    // Get full lesson data for upcoming lessons
    const upcomingLessons = availableLessons.filter((lesson: any) =>
      upcomingLessonIds.includes(lesson.id)
    );

    return NextResponse.json(
      {
        success: true,
        upcomingLessons: upcomingLessons.map((lesson: any) => ({
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
    console.error("Error getting upcoming lessons:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}