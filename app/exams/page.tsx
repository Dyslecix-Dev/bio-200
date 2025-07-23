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
        <Card title="Lab 1" subtitle="Coming soon." link="#" className="bg-rose-300 block xl:hidden" />
        <SpringCard title="Lab 1" subtitle="Coming soon." link="#" className="bg-rose-300 hidden xl:block" />

        <Card title="Lecture 1" subtitle="First mock lecture test." link="exams/lecture-one" className="bg-rose-300 block xl:hidden" />
        <SpringCard title="Lecture 1" subtitle="First mock lecture test." link="exams/lecture-one" className="bg-rose-300 hidden xl:block" />

        <Card title="Lab 2" subtitle="Second mock lab practical." link="exams/lab-two" className="bg-emerald-300 block xl:hidden" />
        <SpringCard title="Lab 2" subtitle="Second mock lab practical." link="exams/lab-two" className="bg-emerald-300 hidden xl:block" />

        <Card title="Lecture 2" subtitle="Second mock lecture test." link="exams/lecture-two" className="bg-emerald-300 block xl:hidden" />
        <SpringCard title="Lecture 2" subtitle="Second mock lecture test." link="exams/lecture-two" className="bg-emerald-300 hidden xl:block" />

        <Card title="Lab 3" subtitle="Coming soon." link="#" className="bg-sky-300 block xl:hidden" />
        <SpringCard title="Lab 3" subtitle="Coming soon." link="#" className="bg-sky-300 hidden xl:block" />

        <Card title="Lecture 3" subtitle="Third mock lecture test." link="exams/lecture-three" className="bg-sky-300 block xl:hidden" />
        <SpringCard title="Lecture 3" subtitle="Third mock lecture test." link="exams/lecture-three" className="bg-sky-300 hidden xl:block" />
      </div>
    </section>
  );
};
