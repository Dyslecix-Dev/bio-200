"use client";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import Card from "@/app/_components/_cards/Card";
import SpringCard from "@/app/_components/_cards/SpringCard";

export default function FlashCardHome() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <FlashCards />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const FlashCards = () => {
  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Lab" subtitle="Lab flash cards." link="flash-cards/lab" className="bg-teal-300 block xl:hidden" />
        <SpringCard title="Lab" subtitle="Lab flash cards." link="flash-cards/lab" className="bg-teal-300 hidden xl:block" />

        <Card title="Lecture" subtitle="Lecture flash cards." link="flash-cards/lecture" className="bg-amber-300 block xl:hidden" />
        <SpringCard title="Lecture" subtitle="Lecture flash cards." link="flash-cards/lecture" className="bg-amber-300 hidden xl:block" />
      </div>
    </section>
  );
};
