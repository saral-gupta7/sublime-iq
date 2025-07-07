"use client";
import { ChevronLeft, MoveLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

type Lesson = {
  title: string;
  summary: string;
  youtubeUrl: string;
  articleContent: string;
};

type CourseBarProps = {
  lessons: Lesson[];
  courseTitle: string;
  selectedKey: string;
  onSelect: (key: string) => void;
};

const sidebarVariants = {
  open: {
    width: 260,
    transition: { duration: 0.2 },
  },
  closed: {
    width: 60,
    transition: { duration: 0.2 },
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
    },
  }),
};

const CourseBar = ({
  lessons,
  selectedKey,
  onSelect,
  courseTitle,
}: CourseBarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // useEffect(() => {
  //   if (sidebarOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  // }, [sidebarOpen]);

  return (
    <motion.aside
      className={`fixed md:sticky  top-0 left-0 pb-10 h-screen md:border-r bg-transparent md:bg-[#161819]/80  border-white/10 text-white z-50 flex flex-col  ${
        sidebarOpen && "px-2 backdrop-blur-3xl"
      }`}
      variants={sidebarVariants}
      animate={sidebarOpen ? "open" : "closed"}
      initial="open"
    >
      {/* Header */}
      <div
        className={`flex flex-col items-start gap-6 py-6 px-4 border-white/10 w-full ${
          sidebarOpen && "border-b"
        }`}
      >
        {/* <Link href={"/"} className="absolute left-5 top-7">
          <HomeIcon size={18} />
        </Link> */}
        {sidebarOpen && (
          <Link
            href="/courses"
            className="flex items-center gap-2 bg-white/10 text-sm px-3 py-2 rounded-sm hover:bg-white/15 transition shrink-0"
          >
            <MoveLeft size={18} />
            {sidebarOpen && <span>All Courses</span>}
          </Link>
        )}

        <div className="flex items-center justify-between flex-wrap w-full">
          {sidebarOpen && (
            <h1 className="text-lg font-semibold capitalize tracking-wide">
              {courseTitle}
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
      {sidebarOpen && (
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
      )}
    </motion.aside>
  );
};

export default CourseBar;
