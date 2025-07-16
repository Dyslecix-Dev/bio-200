"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, FC } from "react";
import { FiArrowRight, FiHome, FiClock } from "react-icons/fi";

import Countdown from "@/app/_components/Countdown";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import StackedNotification from "@/app/_components/StackedNotification";

import { createClient } from "@/utils/supabase/client";
import { updateStudyStreak } from "@/app/utils/studyStreak/updateStudyStreak";

import { ScoreType, LabQuestionsType, SupabaseClientType, LabExamQuestionsType } from "@/types/types";

// Helper function to normalize answers for comparison
const normalizeAnswer = (answer: string) => {
  return (
    answer
      .toLowerCase()
      .trim()
      // Remove content in parentheses (including the parentheses)
      .replace(/\s*\([^)]*\)\s*/g, " ")
      // Replace multiple spaces with single space
      .replace(/\s+/g, " ")
      .trim()
  );
};

// Helper function to check if answers match
const answersMatch = (userAnswer: string, correctAnswer: string) => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  return normalizedUser === normalizedCorrect;
};

// Helper function to format elapsed time
const formatElapsedTime = (milliseconds: number): string => {
  return Math.floor(milliseconds / 1000).toString();
};

// Helper function to save/update exam score using upsert (requires unique constraint)
const saveExamScore = async (supabase: SupabaseClientType, userId: string, examNumber: number, calculatedScore: ScoreType, timeElapsed: number): Promise<void> => {
  const isPerfect = calculatedScore.correctAnswers / calculatedScore.totalQuestions === 1;
  const newScore = calculatedScore.correctAnswers;
  const newTimeElapsed = parseInt(formatElapsedTime(timeElapsed));

  try {
    // First, try to get existing record to check current values
    const { data: existingRecord } = await supabase
      .from("exam_scores")
      .select("score, time_elapsed, number_of_tries_to_reach_perfect_score")
      .eq("user_id", userId)
      .eq("exam_type", "lab")
      .eq("exam_number", examNumber)
      .maybeSingle();

    if (existingRecord) {
      // Record exists - prepare update data based on your existing logic
      const existingScore = existingRecord.score;
      const existingTimeElapsed = existingRecord.time_elapsed;
      const existingTries = existingRecord.number_of_tries_to_reach_perfect_score || 0;
      const existingIsPerfect = existingScore === calculatedScore.totalQuestions;

      // Prepare update object
      const updateData = {
        user_id: userId,
        exam_type: "lab",
        exam_number: examNumber,
        score: existingScore, // Default to existing score
        time_elapsed: existingTimeElapsed, // Default to existing time
        number_of_tries_to_reach_perfect_score: existingTries, // Default to existing tries
        updated_at: new Date().toISOString(),
      };

      // Update score only if new score is higher
      if (newScore > existingScore) {
        updateData.score = newScore;
      }

      // Update time_elapsed based on your logic
      const shouldUpdateTime = (newTimeElapsed < existingTimeElapsed && newScore >= existingScore) || (newTimeElapsed > existingTimeElapsed && newScore > existingScore);

      if (shouldUpdateTime) {
        updateData.time_elapsed = newTimeElapsed;
      }

      // Update number_of_tries only if neither current nor existing score is perfect
      if (!isPerfect && !existingIsPerfect) {
        updateData.number_of_tries_to_reach_perfect_score = existingTries + 1;
      }

      // Use upsert to update the record
      const { error } = await supabase.from("exam_scores").upsert(updateData, {
        onConflict: "user_id,exam_type,exam_number",
      });

      if (error) {
        console.error("Error updating exam score:", error);
      } else {
        console.log("Exam score updated successfully");
      }
    } else {
      // No existing record - use upsert to insert new one
      const { error } = await supabase.from("exam_scores").upsert(
        {
          user_id: userId,
          exam_type: "lab",
          score: newScore,
          time_elapsed: newTimeElapsed,
          exam_number: examNumber,
          number_of_tries_to_reach_perfect_score: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,exam_type,exam_number",
        }
      );

      if (error) {
        console.error("Error saving exam score:", error);
      } else {
        console.log("Exam score saved successfully");
      }
    }
  } catch (error) {
    console.error("Error in saveExamScore:", error);
  }
};

export default function LabExamQuestions({ questions, examNumber }: LabExamQuestionsType) {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<ScoreType | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  const router = useRouter();
  const calculateScoreRef = useRef<(() => ScoreType) | null>(null);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsNotifOpen(true);
  };

  const handleTimeUp = async (timeElapsed: number) => {
    if (!isSubmitted && calculateScoreRef.current) {
      showNotification("Time is up! See your score below.");
      const calculatedScore = calculateScoreRef.current();
      setScore(calculatedScore);
      setIsSubmitted(true);
      setCompletionTime(timeElapsed);

      try {
        const supabase = await createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not authenticated");
          return;
        }

        // Update study streak using the utility function
        await updateStudyStreak(supabase, user.id);

        // Save exam score using the helper function
        await saveExamScore(supabase, user.id, examNumber, calculatedScore, timeElapsed);
      } catch (error) {
        console.error("Error updating study tracking:", error);
      }
    }
  };

  const handleElapsedTimeChange = (elapsed: number) => {
    setElapsedTime(elapsed);
  };

  const handleManualSubmit = (timeElapsed: number) => {
    setCompletionTime(timeElapsed);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Countdown onTimeUp={handleTimeUp} hours={2} minutes={0} seconds={0} isSubmitted={isSubmitted} onElapsedTimeChange={handleElapsedTimeChange} />
      <Questions
        questions={questions}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        router={router}
        score={score}
        setScore={setScore}
        calculateScoreRef={calculateScoreRef}
        elapsedTime={elapsedTime}
        completionTime={completionTime}
        onManualSubmit={handleManualSubmit}
        examNumber={examNumber}
      />
      <Beams />
      <GradientGrid />
      <StackedNotification isNotifOpen={isNotifOpen} setIsNotifOpen={setIsNotifOpen} message={message} />
    </main>
  );
}

const Questions: FC<
  LabQuestionsType & {
    elapsedTime: number;
    completionTime: number | null;
    onManualSubmit: (timeElapsed: number) => void;
    examNumber: number;
  }
> = ({ questions, isSubmitted, setIsSubmitted, router, score, setScore, calculateScoreRef, elapsedTime, completionTime, onManualSubmit, examNumber }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionIndex: number, location: string, value: string) => {
    // Prevent changing answers after submission
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [`q${questionIndex}-loc${location}`]: value,
    }));
  };

  // Check if all questions have been answered
  const isTestComplete = (): boolean => {
    const totalQuestions = questions.reduce((total, question) => {
      return total + Object.keys(question).filter((key) => key !== "image").length;
    }, 0);
    const answeredQuestions = Object.keys(answers).filter((key) => answers[key].trim() !== "").length;
    return answeredQuestions === totalQuestions;
  };

  // Calculate score
  const calculateScore = (): ScoreType => {
    let correctAnswers = 0;
    let totalQuestions = 0;

    questions.forEach((question, questionIndex) => {
      const questionKeys = Object.keys(question).filter((key) => key !== "image");

      questionKeys.forEach((key) => {
        totalQuestions++;
        const userAnswer = answers[`q${questionIndex}-loc${key}`]?.trim() || "";
        const correctAnswer = question[key as keyof typeof question] as string;

        if (answersMatch(userAnswer, correctAnswer)) {
          correctAnswers++;
        }
      });
    });

    return { correctAnswers, totalQuestions };
  };

  // Make calculateScore available to parent component via ref
  useEffect(() => {
    calculateScoreRef.current = calculateScore;
  }, [answers]);

  const handleSubmit = async () => {
    if (!isSubmitted && isTestComplete()) {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      setIsSubmitted(true);
      onManualSubmit(elapsedTime);

      try {
        const supabase = await createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not authenticated");
          return;
        }

        // Update study streak using the utility function
        await updateStudyStreak(supabase, user.id);

        // Save exam score using the helper function
        await saveExamScore(supabase, user.id, examNumber, calculatedScore, elapsedTime);
      } catch (error) {
        console.error("Error updating study tracking:", error);
      }
    }
  };

  const handleReturnToDashboard = () => {
    router.push("/");
  };

  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="w-full max-w-7xl">
        {questions.map((question, questionIndex) => {
          const questionKeys = Object.keys(question).filter((key) => key !== "image");
          return (
            <div key={questionIndex} className="mb-12 border-2 border-zinc-700 rounded-lg p-6 bg-zinc-900/50 backdrop-blur-sm">
              <div className="text-xl font-bold text-blue-400 mb-4">
                Question {questionIndex + 1}: Identify the {questionKeys.length} locations in this image
              </div>
              <div className="text-center mb-6">
                <Image src={question.image} alt={`Anatomy slide ${questionIndex + 1}`} width={800} height={600} className="w-full max-w-4xl h-auto mx-auto rounded-lg border-2 border-zinc-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionKeys.map((key) => {
                  const userAnswer = answers[`q${questionIndex}-loc${key}`] || "";
                  const correctAnswer = question[key as keyof typeof question] as string;
                  const isCorrect = answersMatch(userAnswer, correctAnswer);
                  const isAnswered = userAnswer.trim() !== "";

                  let inputClass = "w-full p-2 bg-zinc-700 border-2 border-zinc-600 rounded text-white placeholder-zinc-400 focus:border-indigo-500 focus:outline-none transition-colors";

                  if (isSubmitted) {
                    if (isAnswered && isCorrect) {
                      inputClass = "w-full p-2 bg-green-800 border-2 border-green-600 rounded text-white";
                    } else if (isAnswered && !isCorrect) {
                      inputClass = "w-full p-2 bg-red-800 border-2 border-red-600 rounded text-white";
                    } else {
                      inputClass = "w-full p-2 bg-red-800 border-2 border-red-600 rounded text-white";
                    }
                  }

                  return (
                    <div key={key} className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
                      <label htmlFor={`q${questionIndex + 1}-loc${key}`} className="block font-semibold text-zinc-300 mb-2">
                        Location {key}:
                      </label>
                      <input
                        type="text"
                        id={`q${questionIndex + 1}-loc${key}`}
                        value={userAnswer}
                        onChange={(e) => handleAnswerChange(questionIndex, key, e.target.value)}
                        placeholder="Enter anatomical structure"
                        className={inputClass}
                        disabled={isSubmitted}
                      />
                      {isSubmitted && !isCorrect && (
                        <div className="mt-2 p-2 bg-green-800 rounded border-2 border-green-600">
                          <p className="text-green-200 font-medium text-sm">Correct Answer:</p>
                          <p className="text-white text-sm">{correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Score Display */}
        {isSubmitted && score && (
          <div className="mb-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Test Complete!</h2>
            <div className="text-6xl font-bold text-white mb-2">
              {score.correctAnswers}/{score.totalQuestions}
            </div>
            <p className="text-xl text-blue-200 mb-4">You scored {Math.round((score.correctAnswers / score.totalQuestions) * 100)}%</p>

            {/* Completion Time Display */}
            {completionTime && (
              <div className="flex items-center justify-center gap-2 text-lg text-indigo-200 mb-4">
                <FiClock />
                <span>Completed in: {formatElapsedTime(completionTime)}</span>
              </div>
            )}

            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(score.correctAnswers / score.totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit/Return Button */}
        <div className="text-center border-t-2 border-zinc-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-evenly">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!isTestComplete()}
                className="font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white cursor-pointer disabled:cursor-not-allowed"
              >
                Submit Test
                <FiArrowRight />
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-16">
                <button
                  onClick={handleReturnToDashboard}
                  className="font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                >
                  <FiHome />
                  Return to Dashboard
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                >
                  Retake Test
                  <FiArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
