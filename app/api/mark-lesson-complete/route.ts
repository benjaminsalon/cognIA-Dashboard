import { NextRequest, NextResponse } from "next/server";
import { getCompletedLessons, saveCompletedLessons } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Get current completed lessons
    const completedLessons = await getCompletedLessons();

    // Add lesson if not already completed
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      await saveCompletedLessons(completedLessons);
    }

    return NextResponse.json(
      { success: true, message: "Lesson marked as complete" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}