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
        <Card title="Topic 7" subtitle="The respiratory system." link="lecture/seven" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Topic 7" subtitle="The respiratory system." link="lecture/seven" className="bg-red-300 hidden xl:block" />

        <Card title="Topic 8" subtitle="The digestive system." link="lecture/eight" className="bg-orange-300 block xl:hidden" />
        <SpringCard title="Topic 8" subtitle="The digestive system." link="lecture/eight" className="bg-orange-300 hidden xl:block" />

        <Card title="Topic 9" subtitle="The urinary system." link="lecture/nine" className="bg-yellow-300 block xl:hidden" />
        <SpringCard title="Topic 9" subtitle="The urinary system." link="lecture/nine" className="bg-yellow-300 hidden xl:block" />

        <Card title="Topic 10" subtitle="The reproductive systems." link="lecture/ten" className="bg-green-300 block xl:hidden" />
        <SpringCard title="Topic 10" subtitle="The reproductive systems." link="lecture/ten" className="bg-green-300 hidden xl:block" />

        <Card title="Topic 11" subtitle="Blood." link="lecture/eleven" className="bg-blue-300 block xl:hidden" />
        <SpringCard title="Topic 11" subtitle="Blood." link="lecture/eleven" className="bg-blue-300 hidden xl:block" />

        <Card title="Topic 12" subtitle="Blood vessels." link="lecture/twelve" className="bg-purple-300 block xl:hidden" />
        <SpringCard title="Topic 12" subtitle="Blood vessels." link="lecture/twelve" className="bg-purple-300 hidden xl:block" />

        <Card title="Topic 13" subtitle="The heart and its blood flow." link="lecture/thirteen" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Topic 13" subtitle="The heart and its blood flow." link="lecture/thirteen" className="bg-red-300 hidden xl:block" />

        <Card title="Topic 14" subtitle="The lymphatic and immune systems." link="lecture/fourteen" className="bg-orange-300 block xl:hidden" />
        <SpringCard title="Topic 14" subtitle="The lymphatic and immune systems." link="lecture/fourteen" className="bg-orange-300 hidden xl:block" />

        <Card title="Topic 15" subtitle="Fundamentals of the nervous system." link="lecture/fifteen" className="bg-yellow-300 block xl:hidden" />
        <SpringCard title="Topic 15" subtitle="Fundamentals of the nervous system." link="lecture/fifteen" className="bg-yellow-300 hidden xl:block" />

        <Card title="Topic 16" subtitle="Central, peripheral, and autonomic nervous systems." link="lecture/sixteen" className="bg-green-300 block xl:hidden" />
        <SpringCard title="Topic 16" subtitle="Central, peripheral, and autonomic nervous systems." link="lecture/sixteen" className="bg-green-300 hidden xl:block" />

        <Card title="Topic 17" subtitle="The special senses." link="lecture/seventeen" className="bg-blue-300 block xl:hidden" />
        <SpringCard title="Topic 17" subtitle="The special senses." link="lecture/seventeen" className="bg-blue-300 hidden xl:block" />

        <Card title="Topic 18" subtitle="The endocrine system." link="lecture/eighteen" className="bg-purple-300 block xl:hidden" />
        <SpringCard title="Topic 18" subtitle="The endocrine system." link="lecture/eighteen" className="bg-purple-300 hidden xl:block" />
      </div>
    </section>
  );
};
