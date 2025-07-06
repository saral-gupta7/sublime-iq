"use client";
import { Plus, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

import { motion } from "motion/react";
import CourseLoader from "@/components/createCourseLoader";

const parentVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const childVariant = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
};
const Hero = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [courseId, setCourseId] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setStatusMessage("Please Enter a Topic First");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Generating your course...Be right there!");

      const generateRes = await axios.post("/api/generate", { topic });
      const generatedLessons = generateRes.data.lessons;

      const createdCourse = await axios.post("/api/createCourse", {
        topic,
        lessons: generatedLessons,
      });
      setStatusMessage("Course created Successfully!");
      setCourseId(createdCourse.data.id);
      setTopic("");
    } catch (error) {
      console.error(error);
      setStatusMessage("Something went wrong! Please retry later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen w-full flex justify-center items-center gap-8 text-white">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
        }}
      />
      <motion.div
        className="flex flex-col gap-10 z-1 px-5"
        variants={parentVariant}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center"
          variants={childVariant}
        >
          Welcome to Sublime-IQ
        </motion.h1>

        <motion.div className="flex gap-4" variants={childVariant}>
          <input
            type="text"
            className="border-2 border-white rounded-full px-5 py-3 text-white bg-transparent w-full"
            placeholder="What would you like to learn today?"
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGenerate();
              }
            }}
            value={topic}
          />

          <button
            onClick={handleGenerate}
            className="h-14 w-16 text-3xl bg-[#eee] text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            {loading ? <Ellipsis size={24} /> : <Plus size={24} />}
          </button>
        </motion.div>

        <div></div>
      </motion.div>

      {statusMessage && (
        <CourseLoader statusMessage={statusMessage} courseId={courseId} />
      )}
    </section>
  );
};

export default Hero;
