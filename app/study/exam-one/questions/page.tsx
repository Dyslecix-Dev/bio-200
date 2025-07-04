"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiArrowRight, FiHome } from "react-icons/fi";

import Countdown from "../../../_components/Countdown";
import Beams from "../../../_components/_background/Beams";
import GradientGrid from "../../../_components/_background/GradientGrid";

// TODO move types
interface Option {
  text: string;
  correct: boolean;
}

interface Question {
  question: string;
  options: Option[];
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
      // Calculate score when time is up
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

const ExamQuestions: React.FC<ExamQuestionsProps> = ({ isSubmitted, setIsSubmitted, router, score, setScore, calculateScoreRef }) => {
  const [selectedMultipleChoice, setSelectedMultipleChoice] = useState<Question[]>([]);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Select 10 random multiple choice questions
    const randomMC = getRandomElements(multipleChoiceQuestions, 10);
    setSelectedMultipleChoice(randomMC);

    // Select 5 random true/false questions
    const randomTF = getRandomElements(trueOrFalseQuestions, 5);
    setSelectedTrueFalse(randomTF);
  }, []);

  const handleAnswerChange = (questionIndex: number, optionIndex: number, questionType: string) => {
    // Prevent changing answers after submission
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [`${questionType}-${questionIndex}`]: optionIndex,
    }));
  };

  // Check if all questions have been answered
  const isTestComplete = (): boolean => {
    const totalQuestions = selectedMultipleChoice.length + selectedTrueFalse.length;
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions === totalQuestions;
  };

  // Calculate score
  const calculateScore = (): Score => {
    let correctAnswers = 0;
    const totalQuestions = selectedMultipleChoice.length + selectedTrueFalse.length;

    // Check multiple choice answers
    selectedMultipleChoice.forEach((question, questionIndex) => {
      const userAnswer = answers[`mc-${questionIndex}`];
      // If no answer selected, count as wrong (don't increment correctAnswers)
      if (userAnswer !== undefined && question.options[userAnswer]?.correct) {
        correctAnswers++;
      }
    });

    // Check true/false answers
    selectedTrueFalse.forEach((question, questionIndex) => {
      const userAnswer = answers[`tf-${questionIndex}`];
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
  }, [answers, selectedMultipleChoice, selectedTrueFalse]);

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
        {/* Score Display */}
        {isSubmitted && score && (
          <div className="mb-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Test Complete!</h2>
            <div className="text-6xl font-bold text-white mb-2">
              {score.correctAnswers}/{score.totalQuestions}
            </div>
            <p className="text-xl text-blue-200">You scored {Math.round((score.correctAnswers / score.totalQuestions) * 100)}%</p>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(score.correctAnswers / score.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

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

// TODO add more questions (start at topic 3)
const multipleChoiceQuestions = [
  {
    question: "Which branch of anatomy deals with structural changes in cells, tissues, and organs caused by disease?",
    options: [
      { text: "Gross anatomy", correct: false },
      { text: "Systemic anatomy", correct: false },
      { text: "Pathological anatomy", correct: true },
      { text: "Functional morphology", correct: false },
      { text: "Developmental anatomy", correct: false },
    ],
  },
  {
    question: "Which of the following is not a level in the hierarchy of structural organization?",
    options: [
      { text: "Molecular", correct: true },
      { text: "Chemical", correct: false },
      { text: "Tissue", correct: false },
      { text: "Organ", correct: false },
      { text: "Organismal", correct: false },
    ],
  },
  {
    question: "Which sub-region is not part of the axial region?",
    options: [
      { text: "Cephalic", correct: false },
      { text: "Cervical", correct: false },
      { text: "Pedal", correct: true },
      { text: "Pubic", correct: false },
      { text: "Thoracic", correct: false },
    ],
  },
  {
    question: "Which word indicates a body part is away from the midline of the body?",
    options: [
      { text: "Distal", correct: false },
      { text: "Lateral", correct: true },
      { text: "Posterior", correct: false },
      { text: "Inferior", correct: false },
      { text: "Superficial", correct: false },
    ],
  },
  {
    question: "Which plane divides a structure into superior and inferior portions?",
    options: [
      { text: "Coronal", correct: false },
      { text: "Frontal", correct: false },
      { text: "Median", correct: false },
      { text: "Sagittal", correct: false },
      { text: "Transverse", correct: true },
    ],
  },
  {
    question: "Which of the following is not a basic feature all vertebrates share?",
    options: [
      { text: "Bilateral symmetry", correct: false },
      { text: "Dorsal hollow nerve cord", correct: false },
      { text: "Nodocord and vertebrae", correct: true },
      { text: "Pharyngeal pouches", correct: false },
      { text: "Tube-within-a-tube body plan", correct: false },
    ],
  },
  {
    question: "Which sub-cavity is part of the dorsal cavity?",
    options: [
      { text: "Vertebral", correct: true },
      { text: "Mediastinum", correct: false },
      { text: "Abdominal", correct: false },
      { text: "Pelvic", correct: false },
      { text: "Manus", correct: false },
    ],
  },
  {
    question: "Which of the following is the serous membrane around the abdominal organs?",
    options: [
      { text: "Serosa", correct: false },
      { text: "Pleura", correct: false },
      { text: "Parieta", correct: false },
      { text: "Peritoneum", correct: true },
      { text: "Pericardium", correct: false },
    ],
  },
  {
    question: "Which organ is found only in the right upper abdominal quadrant?",
    options: [
      { text: "Liver", correct: true },
      { text: "Spleen", correct: false },
      { text: "Diaphragm", correct: true },
      { text: "Appendix", correct: false },
      { text: "Urinary bladder", correct: false },
    ],
  },
  {
    question: "Which of the following does the cytoplasm not consist of?",
    options: [
      { text: "Cytosol", correct: false },
      { text: "Chromatin", correct: true },
      { text: "Pigments", correct: false },
      { text: "Larger organelles", correct: false },
      { text: "Dissolved solutes", correct: false },
    ],
  },
  {
    question: "Which of the following is not a cytoskeletal element?",
    options: [
      { text: "Centrioles", correct: false },
      { text: "Microtubules", correct: false },
      { text: "Microfilaments", correct: false },
      { text: "Intermediate tubules", correct: true },
      { text: "Intermediate filaments", correct: false },
    ],
  },
  {
    question: "Which of the following is a sticky “cell sugar coating” that helps bind cells together? ",
    options: [
      { text: "Glycolipid", correct: false },
      { text: "Glycoprotein", correct: false },
      { text: "Glycocalyx", correct: true },
      { text: "Glycosome", correct: false },
      { text: "Glycogen'", correct: false },
    ],
  },
  {
    question: "Which of the following is not a type of vesicular transport?",
    options: [
      { text: "Exocytosis", correct: false },
      { text: "Facilitated diffusion", correct: true },
      { text: "Phagocytosis", correct: false },
      { text: "Pinocytosis", correct: false },
      { text: "Receptor-mediated endocytosis", correct: false },
    ],
  },
  {
    question: "Which of the following organelles produces all of the proteins secreted by the cell?",
    options: [
      { text: "Peroxisomes", correct: false },
      { text: "Lysosomes", correct: false },
      { text: "Golgi apparatus", correct: false },
      { text: "Smooth ER", correct: false },
      { text: "Rough ER", correct: true },
    ],
  },
  {
    question: "What is the name of ATP generation that starts in the mitochondrial matrix?",
    options: [
      { text: "Acid hydrolase", correct: false },
      { text: "Catalase reaction", correct: false },
      { text: "Citric acid cycle", correct: true },
      { text: "Oxidative phosphorylation", correct: false },
      { text: "Electron transport chain", correct: false },
    ],
  },
  {
    question: "How many proteins form the bracelet-shaped complexes of nuclear pores?",
    options: [
      { text: "20", correct: false },
      { text: "21", correct: false },
      { text: "22", correct: true },
      { text: "23", correct: false },
      { text: "24", correct: false },
    ],
  },
  {
    question: "Which of the following is DNA wrapped twice around a complex of 8 disc-shaped histone proteins?",
    options: [
      { text: "Condensed chromatin", correct: false },
      { text: "Extended chromatin", correct: false },
      { text: "Chromosome", correct: false },
      { text: "Nucleosome", correct: true },
      { text: "Nucleotide", correct: false },
    ],
  },
  {
    question: "During which phase do cells produce metabolic proteins?",
    options: [
      { text: "Gap 1", correct: true },
      { text: "Synthetic", correct: false },
      { text: "Gap 2", correct: false },
      { text: "Early prophase", correct: false },
      { text: "Late prophase", correct: false },
    ],
  },
  {
    question: "Which of the following epithelia are rare in humans?",
    options: [
      { text: "Stratified columnar", correct: true },
      { text: "Simple columnar", correct: false },
      { text: "Stratified squamous", correct: false },
      { text: "Simple squamous", correct: false },
      { text: "Transitional", correct: false },
    ],
  },
  {
    question: "Which of the following is a function of pseudostratified columnar epithelium?",
    options: [
      { text: "Secreting lubricant", correct: false },
      { text: "Distending urinary organ", correct: false },
      { text: "Passing materials via diffusion", correct: false },
      { text: "Propulsion of mucus", correct: true },
      { text: "Protecting underlying tissue", correct: false },
    ],
  },
];

// TODO add more questions (start at topic 4)
const trueOrFalseQuestions = [
  {
    question: "The most common measurements for size are meters, centimeters, and millimeters.",
    options: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question: "Serous cavities are sub-cavities that are wrapped around a particular organ or a group of organs, and are surrounded by a serous membrane.",
    options: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question: "A transmission electron microscope allows for three-dimensional imaging of whole, unsectioned surfaces and structures much smaller than cells.",
    options: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question: "Ribosomes, unlike most organelles, are not surrounded by a membrane.",
    options: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question: "The plasma membrane is a bilayer of phospholipids where the phosphate head is hydrophobic and the fatty acid tail is hydrophilic.",
    options: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question: "Endocytosis and exocytosis are two examples of active transport.",
    options: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question: "The only multicellular exocrine gland in humans is the goblet cell.",
    options: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question: "Blood develops from mesenchyme tissue.",
    options: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question: "Skeletal muscle cells are long, large cylinders with few nuclei.",
    options: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question: "The skin and its appendages are an organ.",
    options: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
];

// Add short answer questions
