/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { motion } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

export default function AxialBones() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <CardCarousel />
      <Beams />
      <GradientGrid />
    </main>
  );
}

// TODO
const CardCarousel = () => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);

  const CARD_BUFFER = width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT = Math.abs(offset) < CARD_SIZE * (items.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  return (
    <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36" ref={ref}>
      <div className="relative overflow-hidden p-4">
        {/* CARDS */}
        <div className="mx-auto max-w-6xl">
          <motion.div
            animate={{
              x: offset,
            }}
            className="flex"
          >
            {/* TODO */}
            {items.map((item: any) => {
              return <Card key={item.id} {...item} />;
            })}
          </motion.div>
        </div>

        {/* BUTTONS */}
        <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
      </div>
    </div>
  );
};

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card = ({ image, frontText, backText }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: MARGIN,
      }}
      onClick={handleClick}
    >
      <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
        {/* Front of card - Text */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-white shadow-md"
          style={{
            backfaceVisibility: "hidden",
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-center p-6">
            <h3 className="text-2xl font-bold text-white text-center leading-tight drop-shadow-lg">{frontText}</h3>
          </div>
        </div>

        {/* Back of card - Image */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-md flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-3xl font-bold text-white text-center leading-tight">{backText}</h3>
        </div>
      </motion.div>
    </div>
  );
};

const items = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    frontText: "Just feels right",
  },
  {
    id: 2,
    image: "/imgs/computer/keyboard.png",
    frontText: "Type in style",
  },
  {
    id: 3,
    image: "/imgs/computer/monitor.png",
    frontText: "Looks like a win",
  },
  {
    id: 4,
    image: "/imgs/computer/chair.png",
    frontText: "Back feels great",
  },
  {
    id: 5,
    image: "/imgs/computer/lights.png",
    frontText: "It's lit",
  },
  {
    id: 6,
    image: "/imgs/computer/desk.png",
    frontText: "Stand up straight",
  },
  {
    id: 7,
    image: "/imgs/computer/headphones.png",
    frontText: "Sounds good",
  },
];
