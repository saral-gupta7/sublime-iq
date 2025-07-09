"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { languages } from "@/constants/constant";

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
  const [courseCount, setCourseCount] = useState(0);
  const [language, setLanguage] = useState("");
  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const res = await axios.get("/api/userCourseCount", {
          withCredentials: true,
        });
        setCourseCount(res.data.count); // assume backend returns `{ count: number }`
      } catch (err) {
        console.error("Failed to fetch course count", err);
      }
    };

    fetchCourseCount();
  }, []);
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setStatusMessage("Please enter a topic first.");
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
      return;
    }

    if (courseCount >= 3) {
      setStatusMessage("You can only create up to 3 courses.");
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Generating your course... Be right there!");

      const selectedLang = language || "English";
      const generateRes = await axios.post("/api/generate", {
        topic,
        language: selectedLang,
      });

      const generatedLessons = generateRes.data.lessons;

      const createdCourse = await axios.post("/api/createCourse", {
        topic,
        language: selectedLang,
        lessons: generatedLessons,
      });

      setStatusMessage("Course created successfully!");
      setCourseId(createdCourse.data.id);
      setTopic("");
      setCourseCount((prev) => prev + 1); // update count on success
    } catch (error) {
      console.error(error);
      setStatusMessage("Something went wrong! Please retry later.");
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

        <motion.div
          className="flex flex-col items-center gap-4"
          variants={childVariant}
        >
          <div className="flex gap-5 w-full">
            <input
              type="text"
              className="border-1 border-white rounded-sm px-5 py-3 text-white bg-transparent w-full"
              placeholder="What would you like to learn today?"
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGenerate();
                }
              }}
              value={topic}
            />

            <div className="relative w-full md:w-auto">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none border-2 border-white bg-transparent text-white  px-4 pr-8 py-3  rounded-sm w-full flex-center"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="">
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
                ▼
              </div>
            </div>
          </div>
          <button onClick={handleGenerate} className="create-button">
            {loading ? "Generating..." : "Generate"}
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
