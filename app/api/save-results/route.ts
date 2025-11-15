import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const results = await request.json();

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save results to JSON file
    const resultsPath = path.join(dataDir, "quiz-results.json");
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Results saved successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving results:", error);
    return NextResponse.json(
      { message: "Failed to save results", success: false, error: String(error) },
      { status: 500 }
    );
  }
}
