"use client";
import { motion } from "motion/react";

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
      ease: "easeOut",
    },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-black flex justify-center items-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />
      <motion.div
        className="z-1 overflow-hidden"
        variants={headerVariant}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-white text-6xl">
          Bite-Sized Brilliance in Seconds
        </h1>
      </motion.div>
    </div>
  );
};

export default LandingPage;
