// TODO apply fonts

"use client";

import Link from "next/link";

import { twMerge } from "tailwind-merge";
import { MotionConfig, motion } from "motion/react";
import { FiArrowRight } from "react-icons/fi";

import Navbar from "@/app/_components/Navbar";
import Beams from "./_components/_background/Beams"; // BUG
import GradientGrid from "./_components/_background/GradientGrid"; // BUG

import { CardType } from "../../types/types"; // BUG

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <SpringCards />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const SpringCards = () => {
  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Tissues" subtitle="Timed exams." link="/mock-tests" className="bg-red-300" />
        <Card title="Axial bones" subtitle="Terms and definitions." link="/flash-cards" className="bg-emerald-300" />
        <Card title="Appendicular bones" subtitle="Math and word problems, and drawings." link="/visual-problems" className="bg-indigo-300" />
      </div>
    </section>
  );
};

const Card = ({ title, subtitle, link, className }: CardType) => {
  return (
    <MotionConfig
      transition={{
        type: "spring",
        bounce: 0.5,
      }}
    >
      <motion.div whileHover="hovered" className={twMerge("group w-full border-2 border-black bg-white", className)}>
        <motion.div
          initial={{
            x: 0,
            y: 0,
          }}
          variants={{
            hovered: {
              x: -8,
              y: -8,
            },
          }}
          className={twMerge("-m-0.5 border-2 border-black bg-emerald-300", className)}
        >
          <motion.div
            initial={{
              x: 0,
              y: 0,
            }}
            variants={{
              hovered: {
                x: -8,
                y: -8,
              },
            }}
            className={twMerge("relative -m-0.5 flex h-72 flex-col justify-between overflow-hidden border-2 border-black bg-emerald-300 p-8", className)}
          >
            <p className="flex items-center text-2xl font-medium uppercase">
              <FiArrowRight className="-ml-8 mr-2 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-0 group-hover:opacity-100" />
              {title}
            </p>
            <div>
              <p className="transition-[margin] duration-300 ease-in-out group-hover:mb-10">{subtitle}</p>
              <Link
                href={`/study/${link}`}
                className="absolute bottom-2 left-2 right-2 translate-y-full border-2 border-black bg-white px-4 py-2 text-black opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
              >
                LET&apos;S GO
              </Link>
            </div>

            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              style={{
                top: "0",
                right: "0",
                x: "50%",
                y: "-50%",
                scale: 0.75,
              }}
              width="200"
              height="200"
              className="pointer-events-none absolute z-10 rounded-full"
            >
              <path id="circlePath" d="M100,100 m-100,0 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0" fill="none" />
              <text>
                <textPath href="#circlePath" fill="black" className="fill-black text-2xl font-black uppercase opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  BIO 200 • BIO 200 • BIO 200 • BIO 200 • BIO 200 •
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

