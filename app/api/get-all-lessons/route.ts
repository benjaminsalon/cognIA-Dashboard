import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const lessonsDir = path.join(process.cwd(), "data", "lessons");

    if (!fs.existsSync(lessonsDir)) {
      return NextResponse.json(
        {
          success: true,
          lessons: [],
        },
        { status: 200 }
      );
    }

    // Get all JSON files in the lessons directory
    const files = fs.readdirSync(lessonsDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const lessons = [];

    for (const file of jsonFiles) {
      const filePath = path.join(lessonsDir, file);
      const fileData = fs.readFileSync(filePath, "utf-8");
      const lessonData = JSON.parse(fileData);

      lessons.push({
        id: lessonData.id,
        title: lessonData.title,
        description: lessonData.description,
        duration: lessonData.duration,
        difficulty: lessonData.difficulty,
      });
    }

    // Sort by id to maintain consistent order
    lessons.sort((a, b) => a.id.localeCompare(b.id));

    return NextResponse.json(
      {
        success: true,
        lessons,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting all lessons:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
