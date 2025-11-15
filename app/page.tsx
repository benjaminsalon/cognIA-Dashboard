"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TabType = "flashcards" | "next-lesson" | "quizzes";

interface NextLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("next-lesson");
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [upcomingLessons, setUpcomingLessons] = useState<NextLesson[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<NextLesson[]>([]);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);

  const tabs = [
    { id: "next-lesson" as TabType, label: "Next Lesson", icon: "📖" },
    { id: "flashcards" as TabType, label: "Flashcards", icon: "📚" },
    { id: "quizzes" as TabType, label: "Quizzes", icon: "✏️" },
  ];

  const loadNextLesson = async () => {
    setIsLoadingLesson(true);
    try {
      const response = await fetch("/api/get-next-lesson");
      const data = await response.json();

      if (data.success && data.nextLesson) {
        setNextLesson(data.nextLesson);
        return { nextLesson: data.nextLesson };
      } else {
        setNextLesson(null);
        return { nextLesson: null };
      }
    } catch (error) {
      console.error("Error loading next lesson:", error);
      setNextLesson(null);
      return { nextLesson: null };
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const loadUpcomingLessons = async (currentNextLesson: NextLesson | null = null) => {
    setIsLoadingUpcoming(true);
    try {
      const response = await fetch("/api/get-upcoming-lessons");
      const data = await response.json();

      if (data.success && data.upcomingLessons) {
        // Filter out the current next lesson from upcoming list
        const nextLessonId = currentNextLesson?.id || nextLesson?.id;
        const filteredLessons = data.upcomingLessons.filter(
          (lesson: NextLesson) => lesson.id !== nextLessonId
        );
        setUpcomingLessons(filteredLessons);
      } else {
        setUpcomingLessons([]);
      }
    } catch (error) {
      console.error("Error loading upcoming lessons:", error);
      setUpcomingLessons([]);
    } finally {
      setIsLoadingUpcoming(false);
    }
  };

  const loadCompletedLessons = async () => {
    setIsLoadingCompleted(true);
    try {
      const response = await fetch("/api/get-completed-lessons");
      const data = await response.json();

      if (data.success && data.completedLessons) {
        setCompletedLessons(data.completedLessons);
      } else {
        setCompletedLessons([]);
      }
    } catch (error) {
      console.error("Error loading completed lessons:", error);
      setCompletedLessons([]);
    } finally {
      setIsLoadingCompleted(false);
    }
  };

  useEffect(() => {
    loadNextLesson().then((data) => {
      loadUpcomingLessons(data.nextLesson);
    });
    loadCompletedLessons();
  }, []);

  // Refresh lessons when returning to dashboard
  useEffect(() => {
    if (activeTab === "next-lesson") {
      loadNextLesson().then((data) => {
        const lesson = data?.nextLesson || null;
        loadUpcomingLessons(lesson);
      });
      loadCompletedLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Update upcoming lessons when next lesson changes
  useEffect(() => {
    if (nextLesson) {
      loadUpcomingLessons(nextLesson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLesson]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-600 dark:text-green-400";
      case "intermediate":
        return "text-yellow-600 dark:text-yellow-400";
      case "advanced":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-6">
              Dashboard
          </h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "flashcards" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
                      My Flashcards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link
                        href="/flashcards/python-basics"
                        className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Python Basics
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            ✓ 12/15
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Continue learning →
                        </p>
                      </Link>
                      <Link
                        href="/flashcards/javascript-es6"
                        className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            JavaScript ES6
                          </span>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            ⏳ 5/20
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          In progress →
                        </p>
                      </Link>
                      <Link
                        href="/flashcards/react-hooks"
                        className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            React Hooks
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            📚 New
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Start learning →
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "next-lesson" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
                      Next Lesson
                    </h2>
                    {isLoadingLesson ? (
                      <div className="p-6 text-center text-zinc-600 dark:text-zinc-400">
                        Loading next lesson...
                      </div>
                    ) : nextLesson ? (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
                          {nextLesson.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                          {nextLesson.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            ⏱️ {nextLesson.duration}
                          </span>
                          <span className={`text-sm font-medium ${getDifficultyColor(nextLesson.difficulty)}`}>
                            📊 {nextLesson.difficulty}
                          </span>
                        </div>
                        <Link
                          href={`/lessons/${nextLesson.id}`}
                          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Start Lesson
                        </Link>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="text-4xl mb-4">🎉</div>
                        <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
                          All Lessons Completed!
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          Congratulations! You've finished all available lessons. Check back soon for new content!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
                      Upcoming Lessons
                    </h3>
                    {isLoadingUpcoming ? (
                      <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">
                        Loading upcoming lessons...
                      </div>
                    ) : upcomingLessons.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingLessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/lessons/${lesson.id}`}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                          >
                            <div>
                              <p className="font-medium text-black dark:text-zinc-50">
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                  ⏱️ {lesson.duration}
                                </p>
                                <p
                                  className={`text-sm font-medium ${getDifficultyColor(
                                    lesson.difficulty
                                  )}`}
                                >
                                  📊 {lesson.difficulty}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                              Upcoming
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">
                        No upcoming lessons available
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
                      Completed Lessons
                    </h3>
                    {isLoadingCompleted ? (
                      <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">
                        Loading completed lessons...
                      </div>
                    ) : completedLessons.length > 0 ? (
                      <div className="space-y-3">
                        {completedLessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/lessons/${lesson.id}`}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                          >
                            <div>
                              <p className="font-medium text-black dark:text-zinc-50">
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                  ⏱️ {lesson.duration}
                                </p>
                                <p
                                  className={`text-sm font-medium ${getDifficultyColor(
                                    lesson.difficulty
                                  )}`}
                                >
                                  📊 {lesson.difficulty}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium">
                              ✓ Completed
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">
                        No completed lessons yet. Start learning to see your progress here!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "quizzes" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
                      Available Quizzes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        href="/quiz"
                        className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">🐍</span>
                          <div>
                            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                              Python Programming
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              8 questions
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                          Test your Python knowledge
                        </p>
                        <span className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                          Take Quiz →
                        </span>
                      </Link>

                      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">🌐</span>
                          <div>
                            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                              General Knowledge
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              5 questions
          </p>
        </div>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                          Test your general knowledge
                        </p>
                        <Link
                          href="/quiz"
                          className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          Take Quiz →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
                      Recent Quiz Results
                    </h3>
                    <div className="space-y-3">
                      {[
                        { subject: "Python Programming", score: "87%", date: "2 days ago" },
                        { subject: "General Knowledge", score: "75%", date: "1 week ago" },
                        { subject: "Python Programming", score: "92%", date: "1 week ago" },
                      ].map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                        >
                          <div>
                            <p className="font-medium text-black dark:text-zinc-50">
                              {result.subject}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {result.date}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {result.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}