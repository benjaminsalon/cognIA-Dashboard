import { NextRequest, NextResponse } from "next/server";
import { getLesson } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const lesson = await getLesson(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lesson,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading lesson:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}