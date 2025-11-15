import { NextRequest, NextResponse } from "next/server";
import { getAllLessons, getCompletedLessons } from "@/lib/storage";

export async function GET() {
  try {
    // Get all available lessons
    const availableLessons = await getAllLessons();
    const availableLessonIds = availableLessons.map((lesson) => lesson.id);

    // Get completed lessons
    const completedLessons = await getCompletedLessons();

    // Find the first lesson that hasn't been completed
    const nextLessonId = availableLessonIds.find(
      (lessonId) => !completedLessons.includes(lessonId)
    );

    if (!nextLessonId) {
      return NextResponse.json(
        {
          success: true,
          nextLesson: null,
          message: "All lessons completed!",
        },
        { status: 200 }
      );
    }

    // Find the lesson data
    const nextLesson = availableLessons.find((lesson) => lesson.id === nextLessonId);

    if (!nextLesson) {
      return NextResponse.json(
        { success: false, error: "Next lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        nextLesson: {
          id: nextLesson.id,
          title: nextLesson.title,
          description: nextLesson.description,
          duration: nextLesson.duration,
          difficulty: nextLesson.difficulty,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting next lesson:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}