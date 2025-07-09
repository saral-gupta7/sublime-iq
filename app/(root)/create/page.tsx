"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { languages } from "@/constants/constant";
import { motion } from "motion/react";
import CourseLoader from "@/components/createCourseLoader";

const suggestedTopics = [
  "Web Development",
  "Graphic Design",
  "Modern Literature",
  "Personal Finance",
  "Data Analysis",
];
const Hero = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseCount, setCourseCount] = useState(0);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there! What would you like to learn today?" },
  ]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % suggestedTopics.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const res = await axios.get("/api/userCourseCount", {
          withCredentials: true,
        });
        setCourseCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch course count", err);
      }
    };

    fetchCourseCount();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setStatusMessage("Please enter a topic first.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    if (courseCount >= 2) {
      setStatusMessage("You can only create up to 2 courses.");
      setTimeout(() => (window.location.href = "/create"), 3000);
      return;
    }

    try {
      setStatusMessage(
        "Please wait while your course is being created. Please do not refresh the page."
      );

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
    } catch (error) {
      console.error(error);
      setStatusMessage("Something went wrong! Please retry later.");
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center px-4 bg-gradient-to-b from-black to-[#010133] text-white">
      <motion.div
        className="flex flex-col gap-6 w-full max-w-xl z-10"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        <h1 className="text-2xl sm:text-4xl ">Welcome to Sublime-IQ</h1>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={`rounded-full px-6 py-3 text-sm w-fit max-w-[80%] ${
              msg.from === "bot"
                ? "bg-white/10 self-start"
                : "bg-white/20 self-end"
            }`}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            initial="initial"
            animate="animate"
          >
            {msg.text}
          </motion.div>
        ))}

        {step === 1 && (
          <input
            type="text"
            placeholder={suggestedTopics[placeholderIndex]}
            className="mt-2 px-6 py-3 rounded-full bg-white/10 text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                const rawInput = e.currentTarget.value.trim();

                // Capitalize the first letter of each word
                const formattedInput = rawInput
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
                setMessages((m) => [
                  ...m,
                  { from: "user", text: formattedInput },
                ]);
                setTopic(formattedInput);
                setTimeout(() => {
                  setMessages((m) => [
                    ...m,
                    {
                      from: "bot",
                      text: "In which language would you like this course?",
                    },
                  ]);
                  setStep(2);
                }, 300);
              }
            }}
          />
        )}

        {step === 2 && (
          <select
            className="mt-2 px-6 py-3 rounded-full bg-white/10 text-sm outline-none cursor-pointer appearance-none"
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              setMessages((m) => [...m, { from: "user", text: lang }]);
              setStep(3);
              if (courseCount < 2) {
                setMessages((m) => [
                  ...m,
                  { from: "bot", text: "Generating your microcourse..." },
                ]);
              }

              setTimeout(() => {
                handleGenerate();
              }, 1000);
            }}
          >
            <option value="">Select a language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black">
                {lang.label}
              </option>
            ))}
          </select>
        )}
      </motion.div>

      {statusMessage && (
        <CourseLoader statusMessage={statusMessage} courseId={courseId} />
      )}
    </section>
  );
};

export default Hero;
