import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // Create lessons directory if it doesn't exist
    const lessonsDir = path.join(process.cwd(), "data", "lessons");
    if (!fs.existsSync(lessonsDir)) {
      fs.mkdirSync(lessonsDir, { recursive: true });
    }

    // Save JSON metadata file
    const jsonPath = path.join(lessonsDir, `${lessonData.id}.json`);
    const jsonData = {
      id: lessonData.id,
      title: lessonData.title,
      description: lessonData.description,
      duration: lessonData.duration,
      difficulty: lessonData.difficulty,
      markdownFile: `${lessonData.id}.md`,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");

    // Save markdown content file
    const markdownPath = path.join(lessonsDir, `${lessonData.id}.md`);
    fs.writeFileSync(markdownPath, lessonData.markdownContent, "utf-8");

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
