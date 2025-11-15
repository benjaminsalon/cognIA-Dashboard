import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load or create completed lessons file
    const completedLessonsPath = path.join(dataDir, "completed-lessons.json");
    let completedLessons: string[] = [];

    if (fs.existsSync(completedLessonsPath)) {
      const fileData = fs.readFileSync(completedLessonsPath, "utf-8");
      completedLessons = JSON.parse(fileData);
    }

    // Add lesson if not already completed
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      fs.writeFileSync(
        completedLessonsPath,
        JSON.stringify(completedLessons, null, 2),
        "utf-8"
      );
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
