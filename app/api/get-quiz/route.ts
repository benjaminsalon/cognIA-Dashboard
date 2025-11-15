import { NextRequest, NextResponse } from "next/server";
import generalQuiz from "@/data/quiz-questions.json";
import pythonQuiz from "@/data/python-quiz.json";

export async function POST(request: NextRequest) {
  try {
    const { subject } = await request.json();

    // Mock API call - return different quizzes based on subject
    let quiz;
    
    if (subject && subject.toLowerCase().includes("python")) {
      quiz = pythonQuiz;
    } else {
      // Default to general quiz
      quiz = generalQuiz;
    }

    return NextResponse.json(
      { success: true, questions: quiz },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, error: String(error), questions: generalQuiz },
      { status: 500 }
    );
  }
}
