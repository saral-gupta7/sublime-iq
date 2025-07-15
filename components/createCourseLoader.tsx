"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LoaderOne } from "@/components/ui/loader";

const CourseLoader = ({
  statusMessage,
  courseId,
}: {
  statusMessage: string;
  courseId?: string;
}) => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (courseId) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);

      timeout = setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [courseId, router]);

  return (
    <motion.section
      className="fixed h-screen w-full z-50 backdrop-blur-3xl flex justify-center items-center flex-col gap-5 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "easeOut",
        duration: 0.3,
      }}
    >
      <h1 className="text-lg">{statusMessage}</h1>
      {!courseId && <LoaderOne />}

      {courseId && (
        <>
          <p className="text-sm text-gray-400">
            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition"
          >
            Explore Now
          </Link>
        </>
      )}
    </motion.section>
  );
};

export default CourseLoader;
