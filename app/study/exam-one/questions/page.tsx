"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiArrowRight, FiHome } from "react-icons/fi";

import Countdown from "../../../_components/Countdown";
import Beams from "../../../_components/_background/Beams";
import GradientGrid from "../../../_components/_background/GradientGrid";

import { trueOrFalseQuestions, multipleChoiceQuestions, shortAnswerQuestions } from "../../../_data/exams/exam-one"; // BUG

// TODO move types
interface Option {
  text: string;
  correct: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

interface ShortAnswerQuestion {
  question: string;
  answer: string;
}

interface Score {
  correctAnswers: number;
  totalQuestions: number;
}

interface ExamQuestionsProps {
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  router: ReturnType<typeof useRouter>;
  score: Score | null;
  setScore: (score: Score) => void;
  calculateScoreRef: React.MutableRefObject<(() => Score) | null>;
}

export default function Questions() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<Score | null>(null);
  const calculateScoreRef = useRef<(() => Score) | null>(null);

  const router = useRouter();

  const handleTimeUp = () => {
    if (!isSubmitted && calculateScoreRef.current) {
      const calculatedScore = calculateScoreRef.current();
      setScore(calculatedScore);
      setIsSubmitted(true);
      // TODO save answers to database
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Countdown onTimeUp={handleTimeUp} />
      <ExamQuestions isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} router={router} score={score} setScore={setScore} calculateScoreRef={calculateScoreRef} />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const getRandomElements = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleOptions = (questions: Question[]): Question[] => {
  return questions.map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
};

const ExamQuestions: React.FC<ExamQuestionsProps> = ({ isSubmitted, setIsSubmitted, router, score, setScore, calculateScoreRef }) => {
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Question[]>([]);
  const [selectedMultipleChoice, setSelectedMultipleChoice] = useState<Question[]>([]);
  const [selectedShortAnswer, setSelectedShortAnswer] = useState<ShortAnswerQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Select 6 random true/false questions
    const randomTF = getRandomElements(trueOrFalseQuestions, 6);
    setSelectedTrueFalse(randomTF);

    // Select 14 random multiple choice questions
    const randomMC = getRandomElements(multipleChoiceQuestions, 14);
    const shuffledMC = shuffleOptions(randomMC);
    setSelectedMultipleChoice(shuffledMC);

    // Select 2 random short answer questions
    const randomSA = getRandomElements(shortAnswerQuestions, 2);
    setSelectedShortAnswer(randomSA);
  }, []);

  const handleAnswerChange = (questionIndex: number, optionIndex: number, questionType: string) => {
    // Prevent changing answers after submission
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [`${questionType}-${questionIndex}`]: optionIndex,
    }));
  };

  const handleShortAnswerChange = (questionIndex: number, value: string) => {
    // Prevent changing answers after submission
    if (isSubmitted) return;

    setShortAnswers((prev) => ({
      ...prev,
      [`sa-${questionIndex}`]: value,
    }));
  };

  // Check if all questions have been answered
  const isTestComplete = (): boolean => {
    const totalQuestions = selectedTrueFalse.length + selectedMultipleChoice.length + selectedShortAnswer.length;
    const answeredQuestions = Object.keys(answers).length + Object.keys(shortAnswers).length;
    return answeredQuestions === totalQuestions;
  };

  // Calculate score (only for true/false and multiple choice)
  const calculateScore = (): Score => {
    let correctAnswers = 0;
    const totalQuestions = selectedTrueFalse.length + selectedMultipleChoice.length;

    // Check true/false answers
    selectedTrueFalse.forEach((question, questionIndex) => {
      const userAnswer = answers[`tf-${questionIndex}`];
      // If no answer selected, count as wrong (don't increment correctAnswers)
      if (userAnswer !== undefined && question.options[userAnswer]?.correct) {
        correctAnswers++;
      }
    });

    // Check multiple choice answers
    selectedMultipleChoice.forEach((question, questionIndex) => {
      const userAnswer = answers[`mc-${questionIndex}`];
      // If no answer selected, count as wrong (don't increment correctAnswers)
      if (userAnswer !== undefined && question.options[userAnswer]?.correct) {
        correctAnswers++;
      }
    });

    return { correctAnswers, totalQuestions };
  };

  // Make calculateScore available to parent component via ref
  useEffect(() => {
    calculateScoreRef.current = calculateScore;
  }, [answers, selectedTrueFalse, selectedMultipleChoice]);

  const handleSubmit = () => {
    if (!isSubmitted && isTestComplete()) {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      setIsSubmitted(true);
    }
  };

  const handleReturnToDashboard = () => {
    router.push("/");
  };

  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="w-full max-w-4xl">
        {/* True or False Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">True or False</h2>
          <div className="space-y-8">
            {selectedTrueFalse.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {questionIndex + 1}. {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = option.correct;
                    const isSelected = answers[`tf-${questionIndex}`] === optionIndex;
                    const isWrong = isSelected && !isCorrect;

                    let labelClass = "flex items-center space-x-3 cursor-pointer hover:bg-zinc-800 p-3 rounded-md transition-colors";

                    if (isSubmitted) {
                      if (isCorrect) {
                        labelClass += " bg-green-800 border-2 border-green-600";
                      } else if (isWrong) {
                        labelClass += " bg-red-800 border-2 border-red-600";
                      }
                      labelClass = labelClass.replace("cursor-pointer hover:bg-zinc-800", "cursor-not-allowed");
                    }

                    return (
                      <label key={optionIndex} className={labelClass}>
                        <input
                          type="radio"
                          name={`tf-${questionIndex}`}
                          value={optionIndex}
                          onChange={() => handleAnswerChange(questionIndex, optionIndex, "tf")}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2"
                          disabled={isSubmitted}
                        />
                        <span className="text-gray-300">{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple Choice Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Multiple Choice</h2>
          <div className="space-y-8">
            {selectedMultipleChoice.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {questionIndex + 1}. {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = option.correct;
                    const isSelected = answers[`mc-${questionIndex}`] === optionIndex;
                    const isWrong = isSelected && !isCorrect;

                    let labelClass = "flex items-center space-x-3 cursor-pointer hover:bg-zinc-800 p-3 rounded-md transition-colors";

                    if (isSubmitted) {
                      if (isCorrect) {
                        labelClass += " bg-green-800 border-2 border-green-600";
                      } else if (isWrong) {
                        labelClass += " bg-red-800 border-2 border-red-600";
                      }
                      labelClass = labelClass.replace("cursor-pointer hover:bg-zinc-800", "cursor-not-allowed");
                    }

                    return (
                      <label key={optionIndex} className={labelClass}>
                        <input
                          type="radio"
                          name={`mc-${questionIndex}`}
                          value={optionIndex}
                          onChange={() => handleAnswerChange(questionIndex, optionIndex, "mc")}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2"
                          disabled={isSubmitted}
                        />
                        <span className="text-gray-300">
                          {String.fromCharCode(65 + optionIndex)}. {option.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Answer Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Short Answer</h2>
          <h3 className="text-xl font-bold text-gray-300 mb-8 text-center">This section is not graded</h3>
          <div className="space-y-8">
            {selectedShortAnswer.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {questionIndex + 1}. {question.question}
                </h3>

                {/* Show answer after submission */}
                {isSubmitted && (
                  <div className="mb-4 p-4 bg-green-800 rounded-lg border-2 border-green-600">
                    <p className="text-blue-200 font-medium mb-2">Correct Answer:</p>
                    <p className="text-white">{question.answer}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-gray-300 font-medium">Your Answer:</label>
                  <textarea
                    value={shortAnswers[`sa-${questionIndex}`] || ""}
                    onChange={(e) => handleShortAnswerChange(questionIndex, e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="Enter your answer here..."
                    disabled={isSubmitted}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Display */}
        {isSubmitted && score && (
          <div className="mb-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Test Complete!</h2>
            <div className="text-6xl font-bold text-white mb-2">
              {score.correctAnswers}/{score.totalQuestions}
            </div>
            <p className="text-xl text-blue-200">You scored {Math.round((score.correctAnswers / score.totalQuestions) * 100)}%</p>
            <p className="text-sm text-blue-300 mt-2">*Short answer questions are not included in this score</p>
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
        <div className="text-center">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!isTestComplete()}
              className="font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white cursor-pointer disabled:cursor-not-allowed"
            >
              Submit Test
              <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleReturnToDashboard}
              className="font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
            >
              <FiHome />
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
