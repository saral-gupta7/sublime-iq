import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

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

const CourseBar = ({ lessons, selectedKey, onSelect }: CourseBarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <motion.article
      className="fixed top-0 left-0 text-white h-screen max-w-74 bg-[#161819] flex flex-col gap-8 z-50 px-4"
      // initial={{ width: "18.5rem" }}
      // animate={{ width: "4rem" }}
    >
      <div className="h-40 w-full flex border-white/10 justify-around items-center gap-5">
        {sidebarOpen && (
          <h1 className="text-2xl uppercase font-bold">Sublime IQ</h1>
        )}
        <ChevronLeft
          className=" bg-white/10 rounded-full p-2"
          size={35}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-start overflow-y-auto">
        {sidebarOpen &&
          lessons.map((lesson, index) => {
            const key = `lesson-${index}`;
            return (
              <div className="mb-2 mx-4" key={key}>
                <div
                  onClick={() => onSelect(key)}
                  className={`hover:bg-[#383640]  px-4 py-3 rounded-lg cursor-pointer transition-all gap-2 duration-300 flex flex-col ${
                    selectedKey === key ? "bg-[#383640]" : ""
                  }`}
                >
                  <span className="text-xs text-neutral-400">
                    Lesson {Number(key.split("-")[1]) + 1}
                  </span>
                  <span className="font-bold text-sm">{lesson.title}</span>
                </div>
              </div>
            );
          })}
      </div>
    </motion.article>
  );
};

export default CourseBar;
