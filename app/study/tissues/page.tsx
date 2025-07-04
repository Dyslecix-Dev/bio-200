/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

import { motion } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";

import Navbar from "../../_components/Navbar";
import Beams from "../../_components/_background/Beams";
import GradientGrid from "../../_components/_background/GradientGrid";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
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
      <CardCarousel />
      <Beams />
      <GradientGrid />
    </main>
  );
}

const CardCarousel = () => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<any[]>([]);

  // Randomize items on component mount
  useEffect(() => {
    setShuffledItems(shuffleArray(items));
  }, []);

  const CARD_BUFFER = width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT = Math.abs(offset) < CARD_SIZE * (shuffledItems.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  return (
    <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36" ref={ref}>
      <div className="relative overflow-hidden p-4">
        {/* CARDS */}
        <div className="mx-auto max-w-6xl">
          <motion.div
            animate={{
              x: offset,
            }}
            className="flex"
          >
            {shuffledItems.map((item: any) => {
              return <Card key={item.id} {...item} />;
            })}
          </motion.div>
        </div>

        {/* BUTTONS */}
        <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card = ({ image, frontText, backText }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: MARGIN,
      }}
      onClick={handleClick}
    >
      <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
        {/* Front of card - Text */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-white shadow-md"
          style={{
            backfaceVisibility: "hidden",
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-center p-6">
            <h3 className="text-2xl font-bold text-white text-center leading-tight drop-shadow-lg">{frontText}</h3>
          </div>
        </div>

        {/* Back of card - Image */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-md flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-3xl font-bold text-white text-center leading-tight">{backText}</h3>
        </div>
      </motion.div>
    </div>
  );
};

const items = [
  {
    id: 1,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/adipose-sWpqjqBSJz5shCtNbYH4LrYLOZyWW3.png",
    backText: "Adipose",
  },
  {
    id: 2,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/areolar_ct-UdLeKfvE9ckSgN8iLRi17l11NYZiZe.png",
    backText: "Areolar CT",
  },
  {
    id: 3,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/blood-Weec6633Oz5jy9MZu4BvxOzHK2sBwo.png",
    backText: "Blood",
  },
  {
    id: 4,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/bone-1Ns6hCfcvK2dywIuY6Ju40RVNBWfo3.png",
    backText: "Bone",
  },
  {
    id: 5,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/cardiac_muscle-9MYVX1XIsNDSv30OzZ15KMXByDeHB1.png",
    backText: "Cardiac muscle",
  },
  {
    id: 6,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/dense_irregular_ct-ClJdWEvlj3rhTIRKYbMOCPCOqHdHAY.png",
    backText: "Dense irregular CT",
  },
  {
    id: 7,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/dense_regular_ct-fcPwi9aytxEjsH98Mja1hv0cwfIrfd.png",
    backText: "Dense regular CT",
  },
  {
    id: 8,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/elastic_cartilage-qBmNS4R1zF40DNOECHqeCcbtppMnCx.png",
    backText: "Elastic cartilage",
  },
  {
    id: 9,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/elastic_ct-taZGMdpe1t0ixYudME1HrhOoitbUol.png",
    backText: "Elastic CT",
  },
  {
    id: 10,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/fibrocartilage-etjub63r9s9UZMxcCiQmASyK6MPDl1.png",
    backText: "Fibrocartilage",
  },
  {
    id: 11,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/hyaline_cartilage-2A23WadnojQWkK1EAEOqjynbGbSiw5.png",
    backText: "Hyaline cartilage",
  },
  {
    id: 12,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/neuron-VGHV6tLLCA0FCMarGblZ3pCSC85Twq.png",
    backText: "Neuron",
  },
  {
    id: 13,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/pseudostratified_epithelium-QdqbAC7WLRJYTZymzoK7FSKb7u8Vpo.png",
    backText: "Pseudostratified epithelium",
  },
  {
    id: 14,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/reticular_ct-pUhDxYdqhAjgSpd9p2Nsvfgxggqbaa.png",
    backText: "Reticular CT",
  },
  {
    id: 15,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/simple_columnar_epithelium-OkgL00udf2UzVpnsh82XDVtf5tSqzw.png",
    backText: "Simple columnar epithelium",
  },
  {
    id: 16,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/simple_cuboidal_epithelium-9sbPYTsOccJ4kCwGjtidMKbef25Sb4.png",
    backText: "Simple cuboidal epithelium",
  },
  {
    id: 17,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/simple_squamous_epithelium-fn010SKYE4hucEZVlKljoAusOokHeD.png",
    backText: "Simple squamous epithelium",
  },
  {
    id: 18,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/skeletal_muscle-um2f588mqGkk5dsq9lwldZtjRRevtF.png",
    backText: "Skeletal muscle",
  },
  {
    id: 19,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/smooth_muscle-ioa4QseWKI4FDgRhsNwskhdoCRziYQ.png",
    backText: "Smooth muscle",
  },
  {
    id: 20,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/stratified_columnar_epithelium-ADz3zMHQ89VkaqyKy27zg7BiwHY8Xv.png",
    backText: "Stratified columnar epithelium",
  },
  {
    id: 21,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/stratified_cuboidal_epithelium-fAnqzhM9fA1tgAcAQBbBF5ugol28tv.png",
    backText: "Stratified cuboidal epithelium",
  },
  {
    id: 22,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/stratified_squamous_epithelium-5JVQ1i0Owi4LltKUZ8Z1OsjAJae0mN.png",
    backText: "Stratified squamous epithelium",
  },
  {
    id: 23,
    image: "https://boej6iprvajfuxis.public.blob.vercel-storage.com/transitional_epithelium-mNhKdSnhiZcWG1YEM5H0HTpi1mZXHN.png",
    backText: "Transitional epithelium",
  },
];

