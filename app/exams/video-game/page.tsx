"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { trueOrFalseQuestions, multipleChoiceQuestions } from "@/app/_data/exams/lecture-three";
import { doorArt, wizardArt, heartArt, skullArt, treasureArt, swordArt } from "../../_data/video-game/ascii-art";

// Type definitions
type GameState = "menu" | "playing" | "gameOver" | "victory";

type PowerUps = {
  extraLife: number;
  timeBonus: number;
  questionHelper: number;
};

type Door = {
  id: number;
  content: "powerup" | "question";
};

type Question = {
  question: string;
  options: string[];
  correct: number;
};

type OriginalQuestion = {
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
};

export default function ASCIIAdventureGame() {
  // Game states
  const [gameState, setGameState] = useState<GameState>("menu");
  const [round, setRound] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [wizardHealth, setWizardHealth] = useState<number>(5);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUps>({
    extraLife: 0,
    timeBonus: 0,
    questionHelper: 0,
  });
  const [showDoors, setShowDoors] = useState<boolean>(true);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [heartAnimation, setHeartAnimation] = useState<"none" | "gain" | "lose">("none");

  // Combined questions pool - convert to consistent format
  const questions: Question[] = [
    // Convert true/false questions
    ...(trueOrFalseQuestions as OriginalQuestion[]).map((q) => ({
      question: q.question,
      options: q.options.map((opt) => opt.text),
      correct: q.options.findIndex((opt) => opt.correct),
    })),
    // Convert multiple choice questions
    ...(multipleChoiceQuestions as OriginalQuestion[]).map((q) => ({
      question: q.question,
      options: q.options.map((opt) => opt.text),
      correct: q.options.findIndex((opt) => opt.correct),
    })),
  ];

  // Function to randomize question options
  const randomizeQuestion = (question: Question): Question => {
    const correctAnswer = question.options[question.correct];
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      ...question,
      options: shuffledOptions,
      correct: newCorrectIndex,
    };
  };

  // Heart animation effect
  useEffect(() => {
    if (heartAnimation !== "none") {
      const timer = setTimeout(() => {
        setHeartAnimation("none");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [heartAnimation]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameOver");
            setGameMessage("Time's up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameState, timeLeft]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate random doors
  const generateDoors = useCallback(() => {
    const newDoors: Door[] = [];
    for (let i = 0; i < 3; i++) {
      newDoors.push({
        id: i,
        content: Math.random() < 0.1 ? "powerup" : "question", // 10% chance for powerup, 90% for question
      });
    }
    setDoors(newDoors);
    setShowDoors(true);
  }, []);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setRound(1);
    setLives(3);
    setTimeLeft(600); // 10 minutes
    setWizardHealth(5);
    setPowerUps({ extraLife: 0, timeBonus: 0, questionHelper: 0 });
    setCurrentQuestion(null);
    setGameMessage("");
    setHeartAnimation("none");
    generateDoors();
  };

  // Select door
  const selectDoor = (door: Door) => {
    setShowDoors(false);

    if (door.content === "powerup") {
      // Weighted random selection for power-ups
      const random = Math.random();
      let powerupType: keyof PowerUps;

      if (random < 0.5) {
        powerupType = "timeBonus"; // 50% chance
      } else if (random < 0.85) {
        powerupType = "questionHelper"; // 35% chance (0.50 to 0.85)
      } else {
        powerupType = "extraLife"; // 15% chance (0.85 to 1.00)
      }

      if (powerupType === "extraLife") {
        setLives((prev) => prev + 1);
        setHeartAnimation("gain");
        setGameMessage("You found some extra credit! +1 Life");
      } else if (powerupType === "timeBonus") {
        setTimeLeft((prev) => prev + 30); // 30 seconds instead of 60
        setGameMessage("You found a time crystal! +30 Seconds");
      } else if (powerupType === "questionHelper") {
        setPowerUps((prev) => ({ ...prev, questionHelper: prev.questionHelper + 1 }));
        setGameMessage("You found a wisdom scroll! The next question will have 3 options removed");
      }

      setTimeout(() => {
        nextRound();
      }, 2000);
    } else {
      // Generate question
      const questionIndex = Math.floor(Math.random() * questions.length);
      let question: Question = { ...questions[questionIndex] };

      // First randomize all options
      question = randomizeQuestion(question);

      // Then apply question helper powerup if available
      if (powerUps.questionHelper > 0) {
        const correctAnswer = question.options[question.correct];
        const incorrectOptions = question.options.filter((_, index) => index !== question.correct);
        const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

        question.options = [correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5);
        question.correct = question.options.indexOf(correctAnswer);

        setPowerUps((prev) => ({ ...prev, questionHelper: prev.questionHelper - 1 }));
      }

      setCurrentQuestion(question);
    }
  };

  // Answer question
  const answerQuestion = (answerIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correct;

    if (round === 20) {
      // Wizard battle
      if (isCorrect) {
        setWizardHealth((prev) => {
          const newHealth = prev - 1;
          if (newHealth <= 0) {
            setGameState("victory");
            setGameMessage("You defeated the wizard! You are victorious!");
            return newHealth;
          }
          return newHealth;
        });
        setGameMessage("Critical hit! Mahguib the Mighty took damage!");

        // Continue wizard battle if wizard still has health
        setTimeout(() => {
          if (wizardHealth > 1) {
            // Check if wizard will still have health after this hit
            const questionIndex = Math.floor(Math.random() * questions.length);
            let question: Question = { ...questions[questionIndex] };

            // First randomize all options
            question = randomizeQuestion(question);

            // Apply question helper powerup for wizard battle too
            if (powerUps.questionHelper > 0) {
              const correctAnswer = question.options[question.correct];
              const incorrectOptions = question.options.filter((_, index) => index !== question.correct);
              const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

              question.options = [correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5);
              question.correct = question.options.indexOf(correctAnswer);

              setPowerUps((prev) => ({ ...prev, questionHelper: prev.questionHelper - 1 }));
            }

            setCurrentQuestion(question);
            setGameMessage("");
          }
        }, 2000);
      } else {
        setTimeLeft((prev) => Math.max(0, prev - 60)); // Remove 1 minute (60 seconds)
        setLives((prev) => {
          let newLives = 0;

          if (prev === 1) {
            newLives = 0;
          } else {
            newLives = prev - 2;
          }

          if (newLives <= 0) {
            setGameState("gameOver");
            setGameMessage("The wizard killed you!");
            return newLives;
          }
          setHeartAnimation("lose");
          return newLives;
        });
        setGameMessage("Haha you fool! You lose 2 lives and 1 minute!"); // Updated message

        // Continue wizard battle if player still has lives
        setTimeout(() => {
          if (lives > 2) {
            // Check if player will still have lives after losing 2
            const questionIndex = Math.floor(Math.random() * questions.length);
            let question: Question = { ...questions[questionIndex] };

            // First randomize all options
            question = randomizeQuestion(question);

            // Apply question helper powerup for wizard battle too
            if (powerUps.questionHelper > 0) {
              const correctAnswer = question.options[question.correct];
              const incorrectOptions = question.options.filter((_, index) => index !== question.correct);
              const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

              question.options = [correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5);
              question.correct = question.options.indexOf(correctAnswer);

              setPowerUps((prev) => ({ ...prev, questionHelper: prev.questionHelper - 1 }));
            }

            setCurrentQuestion(question);
            setGameMessage("");
          }
        }, 2000);
      }
    } else {
      // Regular rounds
      if (isCorrect) {
        setGameMessage("Amazing! You avoided the trap!");
        setTimeout(() => {
          nextRound();
        }, 2000);
      } else {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState("gameOver");
            setGameMessage("All your lives are gone!");
          } else {
            setHeartAnimation("lose");
          }
          return newLives;
        });
        setGameMessage("Oops! You fell in the trap!");

        if (lives > 1) {
          setTimeout(() => {
            nextRound();
          }, 2000);
        }
      }
    }

    setCurrentQuestion(null);
  };

  // Next round
  const nextRound = () => {
    if (round >= 19 && round < 20) {
      setRound(20);
      setGameMessage("You have reached the wizard, Mahguib the Mighty!");
      setTimeout(() => {
        const questionIndex = Math.floor(Math.random() * questions.length);
        let question: Question = { ...questions[questionIndex] };

        // First randomize all options
        question = randomizeQuestion(question);

        // Apply question helper powerup for initial wizard question too
        if (powerUps.questionHelper > 0) {
          const correctAnswer = question.options[question.correct];
          const incorrectOptions = question.options.filter((_, index) => index !== question.correct);
          const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

          question.options = [correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5);
          question.correct = question.options.indexOf(correctAnswer);

          setPowerUps((prev) => ({ ...prev, questionHelper: prev.questionHelper - 1 }));
        }

        setCurrentQuestion(question);
        setGameMessage("");
      }, 2000);
    } else if (round < 19) {
      setRound((prev) => prev + 1);
      generateDoors();
      setGameMessage("");
    }
  };

  // Render hearts with animation
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < lives; i++) {
      hearts.push(
        <span
          key={i}
          className={`inline-block ${
            heartAnimation === "gain" ? "animate-bounce text-green-400" : heartAnimation === "lose" ? "animate-pulse text-red-400" : "text-red-400"
          } transition-colors duration-300`}
        >
          {heartArt}
        </span>
      );
    }
    return hearts;
  };

  // Render menu
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <pre className="text-2xl mb-8 whitespace-pre">
            {`
╔══════════════════════════════╗
║       ANATOMY ADVENTURE      ║
╚══════════════════════════════╝

${swordArt}  WELCOME BRAVE ADVENTURER
`}
          </pre>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="bg-transparent border-2 border-green-400 hover:bg-green-400 hover:text-black text-green-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════╗
║   START   ║
╚═══════════╝`}</pre>
            </button>
            <br />
            <Link
              href="/"
              className="bg-transparent border-2 border-red-400 hover:bg-red-400 hover:text-black text-red-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer inline-block"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════╗
║    QUIT   ║
╚═══════════╝`}</pre>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render game over screen
  if (gameState === "gameOver") {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <pre className="text-xl mb-8 whitespace-pre">
            {`
╔══════════════════════════════╗
║          GAME OVER           ║
╚══════════════════════════════╝

${skullArt} YOU HAVE PERISHED
`}
          </pre>
          <p className="text-lg mb-4">{gameMessage}</p>
          <p className="text-md mb-8">Round Reached: {round}</p>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="bg-transparent border-2 border-green-400 hover:bg-green-400 hover:text-black text-green-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════╗
║  RESTART  ║
╚═══════════╝`}</pre>
            </button>
            <br />
            <Link
              href="/"
              className="bg-transparent border-2 border-red-400 hover:bg-red-400 hover:text-black text-red-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer inline-block"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════╗
║    QUIT   ║
╚═══════════╝`}</pre>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render victory screen
  if (gameState === "victory") {
    return (
      <div className="min-h-screen bg-gray-900 text-yellow-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <pre className="text-xl mb-8 whitespace-pre">
            {`
╔══════════════════════════════╗
║           VICTORY!           ║
╚══════════════════════════════╝

${treasureArt}  MAHGUIB THE MIGHT HAS BEEN DEFEATED!
YOU HAVE COMPLETED YOUR QUEST
`}
          </pre>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="bg-transparent border-2 border-green-400 hover:bg-green-400 hover:text-black text-green-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════════╗
║  PLAY AGAIN   ║
╚═══════════════╝`}</pre>
            </button>
            <br />
            <Link
              href="/"
              className="bg-transparent border-2 border-red-400 hover:bg-red-400 hover:text-black text-red-400 px-4 py-2 font-mono text-lg font-bold transition-colors cursor-pointer inline-block"
            >
              <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════════╗
║      QUIT     ║
╚═══════════════╝`}</pre>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render game
  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono p-4">
      {/* Game Stats */}
      <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded">
        <div>Round: {round}/20</div>
        <div className="flex items-center gap-1">Lives: {renderHearts()}</div>
        <div>Time: {formatTime(timeLeft)}</div>
        {powerUps.questionHelper > 0 && <div>Wisdom Scrolls: {powerUps.questionHelper}</div>}
      </div>

      {/* Game Message */}
      {gameMessage && <div className="text-center text-yellow-400 text-lg mb-6 bg-gray-800 p-4 rounded">{gameMessage}</div>}

      {/* Wizard Boss Battle */}
      {round === 20 && (
        <div className="text-center mb-6">
          <pre className="text-sm mb-4 whitespace-pre">{wizardArt}</pre>
          <div className="bg-red-600 h-4 rounded mb-4 max-w-md mx-auto">
            <div className="bg-red-400 h-full rounded transition-all duration-300" style={{ width: `${(wizardHealth / 5) * 100}%` }} />
          </div>
          <p className="text-lg font-bold">Boss Health: {wizardHealth}/5</p>
        </div>
      )}

      {/* Question Display */}
      {currentQuestion && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 p-6 rounded mb-6">
            <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  className="bg-transparent border-2 border-blue-400 hover:bg-blue-400 hover:text-black text-blue-400 p-3 font-mono text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-yellow-400">{String.fromCharCode(65 + index)})</span> {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Door Selection */}
      {showDoors && round < 20 && !currentQuestion && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl mb-6">Choose your path, adventurer:</h2>
          <div className="grid grid-cols-3 gap-6">
            {doors.map((door, index) => (
              <div key={door.id} className="text-center">
                <button
                  onClick={() => selectDoor(door)}
                  className="bg-transparent border-2 border-gray-400 hover:bg-gray-400 hover:text-black text-gray-400 p-4 font-mono transition-colors w-full cursor-pointer"
                >
                  <pre className="text-xs whitespace-pre">{doorArt}</pre>
                  <div className="mt-2">
                    <pre className="whitespace-pre text-sm leading-tight">{`╔═══════════╗
║  Door ${index + 1}   ║
╚═══════════╝`}</pre>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
