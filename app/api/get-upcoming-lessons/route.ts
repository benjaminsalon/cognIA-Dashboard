import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Dynamically discover all available lessons
    const lessonsDir = path.join(process.cwd(), "data", "lessons");
    let availableLessons: string[] = [];

    if (fs.existsSync(lessonsDir)) {
      const files = fs.readdirSync(lessonsDir);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));
      
      for (const file of jsonFiles) {
        const filePath = path.join(lessonsDir, file);
        const fileData = fs.readFileSync(filePath, "utf-8");
        const lessonData = JSON.parse(fileData);
        availableLessons.push(lessonData.id);
      }
      
      // Sort to maintain consistent order
      availableLessons.sort();
    }

    // Load completed lessons
    const dataDir = path.join(process.cwd(), "data");
    const completedLessonsPath = path.join(dataDir, "completed-lessons.json");
    let completedLessons: string[] = [];

    if (fs.existsSync(completedLessonsPath)) {
      const fileData = fs.readFileSync(completedLessonsPath, "utf-8");
      completedLessons = JSON.parse(fileData);
    }

    // Filter out completed lessons
    const upcomingLessonIds = availableLessons.filter(
      (lessonId) => !completedLessons.includes(lessonId)
    );

    // Load metadata for all upcoming lessons (lessonsDir already defined above)
    const upcomingLessons = [];

    for (const lessonId of upcomingLessonIds) {
      const lessonJsonPath = path.join(lessonsDir, `${lessonId}.json`);

      if (fs.existsSync(lessonJsonPath)) {
        const lessonJson = fs.readFileSync(lessonJsonPath, "utf-8");
        const lessonData = JSON.parse(lessonJson);

        upcomingLessons.push({
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
        upcomingLessons,
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
