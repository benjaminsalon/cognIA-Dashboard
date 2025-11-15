import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { deckId } = await request.json();

    if (!deckId) {
      return NextResponse.json(
        { success: false, error: "Deck ID is required" },
        { status: 400 }
      );
    }

    // Load flashcard deck from JSON file
    const flashcardsDir = path.join(process.cwd(), "data", "flashcards");
    const deckPath = path.join(flashcardsDir, `${deckId}.json`);

    if (!fs.existsSync(deckPath)) {
      return NextResponse.json(
        { success: false, error: "Flashcard deck not found" },
        { status: 404 }
      );
    }

    const deckData = fs.readFileSync(deckPath, "utf-8");
    const deck = JSON.parse(deckData);

    return NextResponse.json(
      { success: true, deck },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading flashcard deck:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
