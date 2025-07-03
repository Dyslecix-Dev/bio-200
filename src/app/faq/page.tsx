"use client";

// import Link from "next/link";
import { useState } from "react";

import { motion } from "motion/react";
import { FiChevronDown } from "react-icons/fi";
import useMeasure from "react-use-measure";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";

import { FAQuestionType } from "../../../types/types"; // BUG

export default function FAQ() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <BasicFAQ />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const BasicFAQ = () => {
  return (
    <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-4 text-center text-3xl font-semibold text-white">Frequently asked questions</h3>
        <Question title="What is the purpose of this website?" defaultOpen>
          <p>To help my fellow Citrus college students in BIO 200.</p>
        </Question>
        {/* <Question title="Why is there a leaderboard?">
          <p>It&apos;s a fun and easy way to see who is doing well in the class. That way students know who they can ask for help.</p>
        </Question> */}
        <Question title="Will you provide future features, like other subjects?">
          <p>
            Currently, I don&apos;t have any plans to. If you have a suggestion, please email me at christiandeandemesa@gmail.com
            {/* let me know{" "}
            <Link href="/contact" className="text-[#7C3AED] underline">
              here
            </Link> */}
            !
          </p>
        </Question>
        <Question title="Damn, this is a sick website! Can you make one for me?">
          <p>You bet! I&apos;m a software developer with almost four years of experience. Send me an inquiry at dyslecixdev@gmail.com!</p>
        </Question>
      </div>
    </div>
  );
};

const Question = ({ title, children, defaultOpen = false }: FAQuestionType) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div animate={open ? "open" : "closed"} className="border-b-[1px] border-b-slate-300">
      <button onClick={() => setOpen((pv) => !pv)} className="flex w-full items-center justify-between gap-4 py-6 cursor-pointer">
        <motion.span
          variants={{
            open: {
              color: "rgba(3, 6, 23, 0)",
            },
            closed: {
              color: "rgba(256, 256, 256)",
            },
          }}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-left text-lg font-medium"
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "rgb(124 58 237)",
            },
            closed: {
              rotate: "0deg",
              color: "#fff",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-slate-400"
      >
        <div ref={ref}>{children}</div>
      </motion.div>
    </motion.div>
  );
};
