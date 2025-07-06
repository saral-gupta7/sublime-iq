"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { PointerHighlight } from "./ui/pointer-highlight";

const headerVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};
const childVariant = {
  initial: {
    opacity: 0,
    y: -50,
  },

  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-[#000] flex justify-center items-center text-[#eee]">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)`,
        }}
      />
      <motion.div
        className="z-1 flex items-center justify-center flex-col gap-8 px-7"
        variants={headerVariant}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-white text-3xl md:text-5xl flex gap-2 flex-wrap justify-center"
          variants={childVariant}
        >
          Your Intelligence,
          <PointerHighlight
            rectangleClassName="bg-[#342569] dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
            pointerClassName="text-[#37276D] h-3 w-3"
          >
            <span className="relative z-10">Augmented</span>
          </PointerHighlight>
        </motion.h1>

        <motion.p
          className="text-neutral-300 text-center text-sm"
          variants={childVariant}
        >
          Skip the Information Overload - Get Focused Learning Modules
        </motion.p>

        <motion.div variants={childVariant}>
          <button className="flex items-center justify-center px-8 py-2 border-[0.5px] border-white text-white rounded-sm text-md hover:bg-[#eee] hover:text-black transition-all duration-300">
            <Link href={"/create"}>Try it Now</Link>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
