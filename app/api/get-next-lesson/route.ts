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

    // Find the first lesson that hasn't been completed
    const nextLessonId = availableLessons.find(
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

    // Load lesson metadata (lessonsDir already defined above)
    const lessonJsonPath = path.join(lessonsDir, `${nextLessonId}.json`);

    if (!fs.existsSync(lessonJsonPath)) {
      return NextResponse.json(
        { success: false, error: "Next lesson not found" },
        { status: 404 }
      );
    }

    const lessonJson = fs.readFileSync(lessonJsonPath, "utf-8");
    const lessonData = JSON.parse(lessonJson);

    return NextResponse.json(
      {
        success: true,
        nextLesson: {
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          duration: lessonData.duration,
          difficulty: lessonData.difficulty,
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
