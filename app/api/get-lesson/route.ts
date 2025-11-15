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

    // Load lesson metadata from JSON file
    const lessonsDir = path.join(process.cwd(), "data", "lessons");
    const lessonJsonPath = path.join(lessonsDir, `${lessonId}.json`);

    if (!fs.existsSync(lessonJsonPath)) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const lessonJson = fs.readFileSync(lessonJsonPath, "utf-8");
    const lessonData = JSON.parse(lessonJson);

    // Load markdown content
    const markdownPath = path.join(lessonsDir, lessonData.markdownFile);

    if (!fs.existsSync(markdownPath)) {
      return NextResponse.json(
        { success: false, error: "Lesson content not found" },
        { status: 404 }
      );
    }

    const markdownContent = fs.readFileSync(markdownPath, "utf-8");

    return NextResponse.json(
      {
        success: true,
        lesson: {
          ...lessonData,
          content: markdownContent,
        },
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
