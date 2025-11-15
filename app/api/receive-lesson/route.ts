import { NextRequest, NextResponse } from "next/server";
import { saveLesson } from "@/lib/storage";

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  markdownContent: string;
}

export async function POST(request: NextRequest) {
  try {
    const lessonData: LessonData = await request.json();

    // Validate required fields
    if (
      !lessonData.id ||
      !lessonData.title ||
      !lessonData.description ||
      !lessonData.duration ||
      !lessonData.difficulty ||
      !lessonData.markdownContent
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields. Required: id, title, description, duration, difficulty, markdownContent",
        },
        { status: 400 }
      );
    }

    // Save lesson using storage abstraction (works with both FS and KV)
    await saveLesson(lessonData);

    return NextResponse.json(
      {
        success: true,
        message: "Lesson received and saved successfully",
        lessonId: lessonData.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error receiving lesson:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to verify the API is working
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Lesson API is ready. Send POST requests with lesson data.",
      storage: process.env.VERCEL === "1" ? "Vercel KV" : "Filesystem",
      requiredFields: [
        "id",
        "title",
        "description",
        "duration",
        "difficulty",
        "markdownContent",
      ],
      example: {
        id: "lesson-id",
        title: "Lesson Title",
        description: "Lesson description",
        duration: "25 minutes",
        difficulty: "Intermediate",
        markdownContent: "# Lesson Title\n\nLesson content in markdown...",
      },
    },
    { status: 200 }
  );
}