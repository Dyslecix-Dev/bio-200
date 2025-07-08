import Link from "next/link";

import { motion } from "motion/react";

export default function RainbowButton() {
  return (
    <div className="bg-transparent min-h-[200px] flex items-center justify-center">
      <Button />
    </div>
  );
}

const Button = () => {
  return (
    <button className="text-white font-semibold py-3 px-8 rounded-lg overflow-hidden relative transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 ">
      <Link href={`/contact`} className="relative z-10">
        Found an error?
      </Link>
      <motion.div
        initial={{ left: 0 }}
        animate={{ left: "-300%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 4,
          ease: "linear",
        }}
        className="bg-[linear-gradient(to_right,#8f14e6,#e614dc,#e61453,#e68414,#e6e614)] absolute z-0 inset-0 w-[400%]"
      />
    </button>
  );
};
