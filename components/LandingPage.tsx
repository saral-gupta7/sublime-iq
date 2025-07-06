"use client";
import { motion } from "motion/react";
import Link from "next/link";

const headerVariant = {
  initial: {
    opacity: 0,
    y: -100,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-black flex justify-center items-center text-[#eee]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />
      <motion.div
        className="z-1 overflow-hidden flex items-center justify-center flex-col gap-10 text-center"
        variants={headerVariant}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-white text-3xl md:text-5xl">
          Bite-Sized Brilliance in Seconds
        </h1>
        <button className="flex items-center justify-center px-8 py-2 border-1 border-white text-white rounded-lg text-xl hover:bg-[#eee] hover:text-black transition-all duration-300">
          <Link href={"/create"}>Get Started</Link>
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
