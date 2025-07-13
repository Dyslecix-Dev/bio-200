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
        <Card title="Lab 4" subtitle="Muscles set 1 and the integumentary system." link="flash-cards/lab-four" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Lab 4" subtitle="Muscles set 1 and the integumentary system." link="flash-cards/lab-four" className="bg-red-300 hidden xl:block" />

        <Card title="Topic 7" subtitle="The respiratory system." link="flash-cards/topic-seven" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Topic 7" subtitle="The respiratory system." link="flash-cards/topic-seven" className="bg-red-300 hidden xl:block" />

        <Card title="Topic 8" subtitle="The digestive system." link="flash-cards/topic-eight" className="bg-orange-300 block xl:hidden" />
        <SpringCard title="Topic 8" subtitle="The digestive system." link="flash-cards/topic-eight" className="bg-orange-300 hidden xl:block" />

        <Card title="Topic 9" subtitle="The urinary system." link="flash-cards/topic-nine" className="bg-yellow-300 block xl:hidden" />
        <SpringCard title="Topic 9" subtitle="The urinary system." link="flash-cards/topic-nine" className="bg-yellow-300 hidden xl:block" />

        <Card title="Topic 10" subtitle="The reproductive systems." link="flash-cards/topic-ten" className="bg-green-300 block xl:hidden" />
        <SpringCard title="Topic 10" subtitle="The reproductive systems." link="flash-cards/topic-ten" className="bg-green-300 hidden xl:block" />

        <Card title="Topic 11" subtitle="Blood." link="flash-cards/topic-eleven" className="bg-blue-300 block xl:hidden" />
        <SpringCard title="Topic 11" subtitle="Blood." link="flash-cards/topic-eleven" className="bg-blue-300 hidden xl:block" />

        <Card title="Topic 12" subtitle="Blood vessels." link="flash-cards/topic-twelve" className="bg-purple-300 block xl:hidden" />
        <SpringCard title="Topic 12" subtitle="Blood vessels." link="flash-cards/topic-twelve" className="bg-purple-300 hidden xl:block" />

        <Card title="Topic 13" subtitle="The heart and its blood flow." link="flash-cards/topic-thirteen" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Topic 13" subtitle="The heart and its blood flow." link="flash-cards/topic-thirteen" className="bg-red-300 hidden xl:block" />
      </div>
    </section>
  );
};
