"use client";
import { ChevronLeft, MoveLeft, HomeIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

type Lesson = {
  title: string;
  summary: string;
  youtube_url: string;
  article_content: string;
};

type CourseBarProps = {
  lessons: Lesson[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

const sidebarVariants = {
  open: {
    width: 260,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  closed: {
    width: 80,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const lessonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

const CourseBar = ({ lessons, selectedKey, onSelect }: CourseBarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <motion.aside
      className="sticky top-0 left-0 h-screen bg-[#161819] backdrop-blur-md border-r border-white/10 text-white z-50 flex flex-col"
      variants={sidebarVariants}
      animate={sidebarOpen ? "open" : "closed"}
      initial="open"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-6 py-6 px-4 border-b border-white/10">
        <div className="flex items-center justify-between w-full ">
          <Link href={"/"}>
            <HomeIcon size={24} />
          </Link>
          {sidebarOpen && (
            <Link
              href="/courses"
              className="flex items-center gap-2 bg-white/10 text-sm px-3 py-2 rounded-md hover:bg-white/15 transition"
            >
              <MoveLeft size={16} />
              {sidebarOpen && <span>All Courses</span>}
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between w-full">
          {sidebarOpen && (
            <h1 className="text-lg font-semibold uppercase tracking-wide">
              Sublime IQ
            </h1>
          )}
          <ChevronLeft
            size={28}
            className={`cursor-pointer rounded-full hover:bg-white/10 p-1 transition-transform ${
              !sidebarOpen ? "rotate-180" : ""
            }`}
            onClick={() => setSidebarOpen((prev) => !prev)}
          />
        </div>
      </div>

      {/* Lessons List */}
      <ul className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {lessons.map((lesson, index) => {
          const key = `lesson-${index}`;
          const isSelected = selectedKey === key;
          return (
            <motion.li
              key={key}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={lessonVariants}
              onClick={() => onSelect(key)}
              className={`rounded-lg px-4 py-3 cursor-pointer transition-all duration-300 ${
                isSelected ? "bg-[#2b2d31]" : "hover:bg-[#202124]"
              }`}
            >
              {sidebarOpen && (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    Lesson {index + 1}
                  </p>
                  <p className="font-semibold text-sm">{lesson.title}</p>
                </>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.aside>
  );
};

export default CourseBar;
