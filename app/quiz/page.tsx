"use client";

import { useState } from "react";
import Link from "next/link";
import quizQuestions from "@/data/quiz-questions.json";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface SelectedAnswer {
  questionId: number;
  selectedIndex: number;
}

interface QuizResult {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  correctlyAnswered: boolean;
  answerGiven: string;
}

export default function QuizPage() {
  const [subject, setSubject] = useState<string>("");
  const [questions, setQuestions] = useState<QuizQuestion[]>(quizQuestions as QuizQuestion[]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnswerClick = (questionId: number, optionIndex: number) => {
    // Check if answer already selected for this question
    const existingAnswer = selectedAnswers.find(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswer) {
      // Update existing answer
      setSelectedAnswers(
        selectedAnswers.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, selectedIndex: optionIndex }
            : answer
        )
      );
    } else {
      // Add new answer
      setSelectedAnswers([
        ...selectedAnswers,
        { questionId, selectedIndex: optionIndex },
      ]);
    }
  };

  const getSelectedAnswer = (questionId: number): number | null => {
    const answer = selectedAnswers.find(
      (answer) => answer.questionId === questionId
    );
    return answer ? answer.selectedIndex : null;
  };

  const isCorrect = (question: QuizQuestion, selectedIndex: number): boolean => {
    return selectedIndex === question.correctAnswer;
  };

  const generateResults = (): QuizResult[] => {
    return questions.map((question) => {
      const selectedAnswer = selectedAnswers.find(
        (answer) => answer.questionId === question.id
      );
      
      if (selectedAnswer) {
        const answerGiven = question.options[selectedAnswer.selectedIndex];
        const correctlyAnswered = selectedAnswer.selectedIndex === question.correctAnswer;
        
        return {
          ...question,
          correctlyAnswered,
          answerGiven,
        };
      }
      
      // If question not answered yet
      return {
        ...question,
        correctlyAnswered: false,
        answerGiven: "",
      };
    });
  };

  const saveResults = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const results = generateResults();
      const response = await fetch("/api/save-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results, null, 2),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage("Results saved successfully!");
      } else {
        setSaveMessage("Failed to save results. Please try again.");
      }
    } catch (error) {
      console.error("Error saving results:", error);
      setSaveMessage("An error occurred while saving results.");
    } finally {
      setIsSaving(false);
    }
  };

  const allQuestionsAnswered = selectedAnswers.length === questions.length;

  const loadQuiz = async (subjectName: string) => {
    setIsLoadingQuiz(true);
    setErrorMessage(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/get-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject: subjectName }),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setQuestions(data.questions);
        setSelectedAnswers([]); // Reset answers when loading new quiz
        setQuizLoaded(true);
      } else {
        setErrorMessage("Failed to load quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      setErrorMessage("An error occurred while loading the quiz.");
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      loadQuiz(subject.trim());
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
          Quiz
        </h1>

        {/* Subject Prompt */}
        {!quizLoaded && (
          <div className="mb-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
              What subject would you like to learn?
            </h2>
            <form onSubmit={handleSubjectSubmit} className="flex gap-4">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Python Programming"
                className="flex-1 px-4 py-2 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                disabled={isLoadingQuiz}
              />
              <button
                type="submit"
                disabled={isLoadingQuiz || !subject.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isLoadingQuiz ? "Loading..." : "Load Quiz"}
              </button>
            </form>
            {errorMessage && (
              <p className="mt-4 text-red-600 dark:text-red-400 font-medium">
                {errorMessage}
              </p>
            )}
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Tip: Try typing "Python" to get a Python programming quiz!
            </p>
          </div>
        )}

        {quizLoaded && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-medium text-black dark:text-zinc-50">
              Subject: <span className="font-semibold">{subject}</span>
            </p>
            <button
              onClick={() => {
                setQuizLoaded(false);
                setSubject("");
                setSelectedAnswers([]);
                setSaveMessage(null);
              }}
              className="px-4 py-2 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg transition-colors duration-200"
            >
              Change Subject
            </button>
          </div>
        )}

        {/* Quiz Questions */}
        {quizLoaded && (
          <div className="space-y-8">
          {questions.map((question) => {
            const selectedIndex = getSelectedAnswer(question.id);
            const hasAnswered = selectedIndex !== null;

            return (
              <div
                key={question.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
              >
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedIndex === optionIndex;
                    const isCorrectAnswer = optionIndex === question.correctAnswer;
                    const showFeedback = hasAnswered && isSelected;

                    let buttonClass =
                      "w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ";
                    
                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        buttonClass +=
                          "bg-green-100 dark:bg-green-900 border-green-500 text-green-900 dark:text-green-100";
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass +=
                          "bg-red-100 dark:bg-red-900 border-red-500 text-red-900 dark:text-red-100";
                      } else {
                        buttonClass +=
                          "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-default";
                      }
                    } else {
                      buttonClass +=
                        "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer";
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerClick(question.id, optionIndex)}
                        disabled={hasAnswered}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showFeedback && (
                            <span className="ml-2 font-bold">
                              {isCorrect(question, optionIndex) ? "✓" : "✗"}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="mt-4 p-3 rounded-lg">
                    {isCorrect(question, selectedIndex!) ? (
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        ✓ Correct! Well done.
                      </p>
                    ) : (
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        ✗ Incorrect. The correct answer is:{" "}
                        <span className="font-bold">
                          {question.options[question.correctAnswer]}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}

        {/* Save Results Button */}
        {quizLoaded && allQuestionsAnswered && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <button
              onClick={saveResults}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isSaving ? "Saving..." : "Save Results"}
            </button>
            {saveMessage && (
              <p
                className={`font-medium ${
                  saveMessage.includes("successfully")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
