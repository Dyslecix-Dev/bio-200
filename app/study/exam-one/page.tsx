"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { SquareImageType } from "@/types/types";

export default function ExamOne() {
  return (
    <main className="min-h-screen w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 mx-auto bg-zinc-950 text-zinc-100">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-indigo-500 font-medium">Did you study?</span>
        <h3 className="text-4xl md:text-6xl font-semibold">BIO 200 Exam 1</h3>
        <p className="text-base md:text-lg text-zinc-600 my-4 md:my-6">
          This is a timed test with 22 randomly generated questions (6 true/false, 14 multiple choice, and 2 short answer). You have 15 minutes to complete it. Once you start the test, you cannot stop
          until you submit it.
        </p>
        <Link href="/study/exam-one/questions" className="bg-indigo-500 text-white font-medium py-2 px-4 rounded transition-all hover:bg-indigo-600 active:scale-95 cursor-pointer">
          Start Test
        </Link>
      </div>
      <ShuffleGrid />
    </main>
  );
}

const shuffle = (array: SquareImageType[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const squareImageData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1530213786676-41ad9f7736f6?q=80&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1615505368758-8a3af2a4c379?q=80&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1453847668862-487637052f8a?q=80&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1539815208687-a0f05e15d601?q=80&auto=format&fit=crop&w=1325&q=80",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1508387104394-d13e1b497f85?q=80&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1618939279360-762c59d86c4f?q=80&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1508387027939-27cccde53673?q=80&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1557079795-846ac2fc4508?q=80&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1503429888457-07726f9469ba?q=80&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1618245596888-2fa0c17d4cec?q=80&auto=format&fit=crop&w=684&q=80",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1525270184974-93ddafe2c9b3?q=80&auto=format&fit=crop&w=882&q=80",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1629301771443-ea9ee4aee526?q=80&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?q=80&auto=format&fit=crop&w=686&q=80",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1715529134960-b49e99668dcc?q=80&auto=format&fit=crop&w=681&q=80",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1715526411349-2d9aa764ed41?q=80&auto=format&fit=crop&w=1820&q=80",
  },
];

const generateSquares = () => {
  return shuffle(squareImageData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    />
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">{squares.map((sq) => sq)}</div>;
};
