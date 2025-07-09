// TODO apply fonts

"use client";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import Card from "@/app/_components/_cards/Card";
import SpringCard from "@/app/_components/_cards/SpringCard";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <Cards />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const Cards = () => {
  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Cards" subtitle="Flash cards for repitition." link="flash-cards" className="bg-red-300 block lg:hidden" />
        <SpringCard title="Cards" subtitle="Flash cards for repitition." link="flash-cards" className="bg-red-300 hidden lg:block" />

        <Card title="Exams" subtitle="Lecture mock exams." link="exams" className="bg-orange-300 block lg:hidden" />
        <SpringCard title="Exams" subtitle="Lecture mock exams." link="exams" className="bg-orange-300 hidden lg:block" />
      </div>
    </section>
  );
};

