import { NextRequest, NextResponse } from "next/server";
import { resetLessons } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const deletedCount = await resetLessons();

    return NextResponse.json(
      {
        success: true,
        message: "All lessons have been reset",
        deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting lessons:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    const { getAllLessons } = await import("@/lib/storage");
    const lessons = await getAllLessons();

    return NextResponse.json(
      {
        success: true,
        message: "Lessons status",
        lessonCount: lessons.length,
        storage: process.env.VERCEL === "1" ? "Vercel KV" : "Filesystem",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting lessons status:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}