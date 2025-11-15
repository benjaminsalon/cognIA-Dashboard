"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  cards: Flashcard[];
}

export default function FlashcardPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params?.deck as string;

  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const loadDeck = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deckId }),
      });

      const data = await response.json();

      if (data.success && data.deck) {
        setDeck(data.deck);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setError(data.error || "Failed to load flashcard deck");
      }
    } catch (error) {
      console.error("Error loading deck:", error);
      setError("An error occurred while loading the deck");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (deck && currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    if (deck) {
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      setDeck({ ...deck, cards: shuffled });
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-medium text-black dark:text-zinc-50 mb-2">
            Loading flashcard deck...
          </div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Deck not found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error || "The flashcard deck you're looking for doesn't exist."}
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

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              {deck.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {deck.description}
            </p>
          </div>
          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-50 font-medium rounded-lg transition-colors duration-200"
          >
            🔀 Shuffle
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Card {currentIndex + 1} of {deck.cards.length}
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-6">
          <div
            onClick={handleFlip}
            className="relative h-96 cursor-pointer perspective-1000"
          >
            <div
              className={`absolute inset-0 w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-zinc-900 rounded-lg shadow-xl border-2 border-zinc-200 dark:border-zinc-800 p-8 flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Front
                  </div>
                  <p className="text-2xl font-medium text-black dark:text-zinc-50">
                    {currentCard.front}
                  </p>
                  <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                    Click to flip
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-xl border-2 border-blue-200 dark:border-blue-800 p-8 flex items-center justify-center rotate-y-180`}
              >
                <div className="text-center">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                    Back
                  </div>
                  <p className="text-2xl font-medium text-black dark:text-zinc-50">
                    {currentCard.back}
                  </p>
                  <div className="mt-6 text-sm text-blue-600 dark:text-blue-400">
                    Click to flip
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 text-black dark:text-zinc-50 font-medium rounded-lg transition-colors duration-200"
          >
            ← Previous
          </button>

          <button
            onClick={handleFlip}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isFlipped ? "Show Front" : "Show Answer"}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === deck.cards.length - 1}
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 text-black dark:text-zinc-50 font-medium rounded-lg transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
