import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Load completed lessons
    const dataDir = path.join(process.cwd(), "data");
    const completedLessonsPath = path.join(dataDir, "completed-lessons.json");
    let completedLessonIds: string[] = [];

    if (fs.existsSync(completedLessonsPath)) {
      const fileData = fs.readFileSync(completedLessonsPath, "utf-8");
      completedLessonIds = JSON.parse(fileData);
    }

    // If no completed lessons, return empty array
    if (completedLessonIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          completedLessons: [],
        },
        { status: 200 }
      );
    }

    // Load metadata for all completed lessons
    const lessonsDir = path.join(process.cwd(), "data", "lessons");
    const completedLessons = [];

    for (const lessonId of completedLessonIds) {
      const lessonJsonPath = path.join(lessonsDir, `${lessonId}.json`);

      if (fs.existsSync(lessonJsonPath)) {
        const lessonJson = fs.readFileSync(lessonJsonPath, "utf-8");
        const lessonData = JSON.parse(lessonJson);

        completedLessons.push({
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          duration: lessonData.duration,
          difficulty: lessonData.difficulty,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        completedLessons,
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
