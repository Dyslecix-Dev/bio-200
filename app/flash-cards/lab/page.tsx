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
      <LabFlashCards />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const LabFlashCards = () => {
  return (
    <section className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Lab 4" subtitle="Muscles set 1 and the integumentary system." link="lab/four" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Lab 4" subtitle="Muscles set 1 and the integumentary system." link="lab/four" className="bg-red-300 hidden xl:block" />

        <Card title="Lab 5" subtitle="Muscles set 2 and the respiratory system." link="lab/five" className="bg-orange-300 block xl:hidden" />
        <SpringCard title="Lab 5" subtitle="Muscles set 2 and the respiratory system." link="lab/five" className="bg-orange-300 hidden xl:block" />

        <Card title="Lab 6" subtitle="Muscles set 3 and the digestive system." link="lab/six" className="bg-yellow-300 block xl:hidden" />
        <SpringCard title="Lab 6" subtitle="Muscles set 3 and the digestive system." link="lab/six" className="bg-yellow-300 hidden xl:block" />

        <Card title="Lab 7" subtitle="The urinary and reproductive systems." link="lab/seven" className="bg-green-300 block xl:hidden" />
        <SpringCard title="Lab 7" subtitle="The urinary and reproductive systems." link="lab/seven" className="bg-green-300 hidden xl:block" />

        <Card title="Lab 8" subtitle="The heart and blood vessels." link="lab/eight" className="bg-blue-300 block xl:hidden" />
        <SpringCard title="Lab 8" subtitle="The heart and blood vessels." link="lab/eight" className="bg-blue-300 hidden xl:block" />

        <Card title="Lab 9" subtitle="The nervous system." link="lab/nine" className="bg-purple-300 block xl:hidden" />
        <SpringCard title="Lab 9" subtitle="The nervous system." link="lab/nine" className="bg-purple-300 hidden xl:block" />
      </div>
    </section>
  );
};
