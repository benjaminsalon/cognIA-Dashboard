"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  markdownFile: string;
  content: string;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lesson as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completeMessage, setCompleteMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const markLessonComplete = async () => {
    setIsMarkingComplete(true);
    setCompleteMessage(null);

    try {
      const response = await fetch("/api/mark-lesson-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCompleted(true);
        setCompleteMessage("Lesson marked as complete! 🎉");
      } else {
        setCompleteMessage("Failed to mark lesson as complete. Please try again.");
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      setCompleteMessage("An error occurred while marking the lesson as complete.");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const loadLesson = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      });

      const data = await response.json();

      if (data.success && data.lesson) {
        setLesson(data.lesson);
      } else {
        setError(data.error || "Failed to load lesson");
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      setError("An error occurred while loading the lesson");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-medium text-black dark:text-zinc-50 mb-2">
            Loading lesson...
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Lesson not found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error || "The lesson you're looking for doesn't exist."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
                {lesson.title}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {lesson.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 text-sm font-medium rounded-full">
                ⏱️ {lesson.duration}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(
                  lesson.difficulty
                )}`}
              >
                {lesson.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
          <article className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-7" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                code: ({ node, className, ...props }: any) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props} />
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-zinc-900 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-4 border border-zinc-200 dark:border-zinc-700"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-blue-500 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-black dark:text-zinc-50" {...props} />
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </article>
        </div>

        {/* Finish Lesson Button */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          {!isCompleted ? (
            <button
              onClick={markLessonComplete}
              disabled={isMarkingComplete}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200 text-lg"
            >
              {isMarkingComplete ? "Marking as Complete..." : "✓ Finish Lesson"}
            </button>
          ) : (
            <div className="text-center">
              <div className="px-8 py-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-lg mb-4">
                ✓ Lesson Completed!
              </div>
              {completeMessage && (
                <p className="text-green-600 dark:text-green-400 font-medium mb-4">
                  {completeMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
