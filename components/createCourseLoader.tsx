"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const CourseLoader = ({
  statusMessage,
  courseId,
}: {
  statusMessage: string;
  courseId: string;
}) => {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    // Re-enable scroll on cleanup
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.section
      className="fixed h-screen w-full z-50 backdrop-blur-3xl flex justify-center items-center flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "easeOut",
        duration: 0.3,
      }}
    >
      <h1 className="text-xl">{statusMessage}</h1>
      {courseId && (
        <Link
          href={`/courses/${courseId}`}
          className="px-4 py-2 bg-white/10 text-white"
        >
          Explore the Lessons
        </Link>
      )}
    </motion.section>
  );
};

export default CourseLoader;
