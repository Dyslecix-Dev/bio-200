"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import Card from "@/app/_components/_cards/Card";
import SpringCard from "@/app/_components/_cards/SpringCard";

import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    // Function to set user online
    const setUserOnline = async (userId: string) => {
      try {
        const { error } = await supabase
          .from("user_profiles")
          .update({
            online: true,
          })
          .eq("id", userId);

        if (error) {
          console.error("Error setting user online:", error);
        }
      } catch (error) {
        console.error("Error in setUserOnline:", error);
      }
    };

    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        // If session exists, set user online
        if (session?.user) {
          await setUserOnline(session.user.id);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen overflow-hidden bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

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
        <Card title="Cards" subtitle="Flash cards for repetition." link="flash-cards" className="bg-blue-300 block xl:hidden" />
        <SpringCard title="Cards" subtitle="Flash cards for repetition." link="flash-cards" className="bg-blue-300 hidden xl:block" />

        <Card title="Exams" subtitle="Lecture and lab mock exams." link="exams" className="bg-red-300 block xl:hidden" />
        <SpringCard title="Exams" subtitle="Lecture and lab mock exams." link="exams" className="bg-red-300 hidden xl:block" />

        <SpringCard title="Kanban" subtitle="Plan your studying." link="kanban" className="bg-green-300 hidden xl:block" />
      </div>
    </section>
  );
};
