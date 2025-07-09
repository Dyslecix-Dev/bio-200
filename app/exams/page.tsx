"use client";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import Card from "@/app/_components/_cards/Card";
import SpringCard from "@/app/_components/_cards/SpringCard";

export default function ExamHome() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <Exams />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const Exams = () => {
  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Exam 1" subtitle="First mock lecture test." link="exams/exam-one" className="bg-rose-300 block lg:hidden" />
        <SpringCard title="Exam 1" subtitle="First mock lecture test." link="exams/exam-one" className="bg-rose-300 hidden lg:block" />

        <Card title="Exam 2" subtitle="Second mock lecture test." link="exams/exam-two" className="bg-emerald-300 block lg:hidden" />
        <SpringCard title="Exam 2" subtitle="Second mock lecture test." link="exams/exam-two" className="bg-emerald-300 hidden lg:block" />

        <Card title="Exam 3" subtitle="Coming soon." link="#" className="bg-sky-300 block lg:hidden" />
        <SpringCard title="Exam 3" subtitle="Coming soon." link="#" className="bg-sky-300 hidden lg:block" />
      </div>
    </section>
  );
};
