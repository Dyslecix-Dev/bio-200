"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { createClient } from "@/utils/supabase/client";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";

import { FlashCardType } from "@/types/types";

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Tissues() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <CardGrid />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const CardGrid = () => {
  const [flashCards, setflashCards] = useState<FlashCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch flash cards from Supabase and randomize on component mount
  useEffect(() => {
    const fetchFlashCards = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase.from("flash_cards").select("*");

        if (error) {
          setError(error.message);
          console.error("Error fetching flash cards:", error);
        } else if (data) {
          const transformedData = data.map(({ front_text, back_text, front_image, back_image, ...rest }) => ({
            frontText: front_text,
            backText: back_text,
            frontImage: front_image,
            backImage: back_image,
            ...rest,
          }));

          setflashCards(shuffleArray(transformedData));
        }
      } catch (err) {
        setError("Failed to fetch flash cards");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashCards();
  }, []);

  if (loading) {
    return (
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading flash cards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-400 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {flashCards.map((item: FlashCardType) => {
          return <FlashCard key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
};

// TODO Fix image zoomed in
// TODO Fix image and text placement
const FlashCard = ({ frontText, backText, frontImage, backImage }: FlashCardType) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative cursor-pointer aspect-square w-full max-w-sm mx-auto" onClick={handleClick}>
      <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-neutral-100 shadow-md"
          style={{
            backfaceVisibility: "hidden",
            backgroundImage: frontImage ? `url(${frontImage})` : "none",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {frontImage && <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/30 to-transparent" />}

          <div
            className={`
              absolute inset-0 p-6 overflow-auto
              ${frontImage ? "flex items-end justify-center" : "flex items-center justify-center"}
            `}
          >
            {frontText && (
              <h3
                className={`
                  text-xl font-bold text-center leading-tight drop-shadow-lg
                  ${frontImage ? "text-white" : "text-black"}
                `}
              >
                {frontText}
              </h3>
            )}
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-neutral-700 shadow-md p-6 overflow-auto"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: backImage ? `url(${backImage})` : "none",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center justify-center min-h-full">{backText && <h3 className="text-2xl font-bold text-white text-center leading-tight">{backText}</h3>}</div>
        </div>
      </motion.div>
    </div>
  );
};

