"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseBar from "@/components/CourseBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  youtubeUrl: string;
  articleContent: string;
};

const CoursePage = () => {
  const { id } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonKey, setSelectedLessonKey] = useState("lesson-0");
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axios.get(`/api/getCourseById?id=${id}`);
      const course = res.data;

      const formattedLessons = course.lessons.map((lesson: Lesson) => ({
        ...lesson,
      }));

      setLessons(formattedLessons);
      setCourseTitle(course.topic);
    };

    fetchCourse();
  }, [id]);

  const selectedIndex = Number(selectedLessonKey?.split("-")[1]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <CourseBar
        lessons={lessons}
        selectedKey={selectedLessonKey}
        onSelect={setSelectedLessonKey}
        courseTitle={courseTitle}
      />

      <div className="w-full">
        <div className="px-10 max-w-3xl mx-auto flex flex-col bg-neutral-800">
          {/* {courseTitle} */}
        </div>
        {lessons[selectedIndex] && (
          <div className="flex px-10 py-20 overflow-y-auto max-w-3xl mx-auto flex-col gap-5">
            <h1 className="flex flex-wrap text-lg md:text-3xl font-bold mb-4">
              {lessons[selectedIndex].title}
            </h1>
            <p className="text-sm md:text-md text-justify">
              {lessons[selectedIndex].summary}
            </p>
            {lessons[selectedIndex].youtubeUrl && (
              <iframe
                width="100%"
                height="315"
                src={lessons[selectedIndex].youtubeUrl.replace(
                  "watch?v=",
                  "embed/"
                )}
                className="rounded-lg mb-6"
              />
            )}
            <div className="prose prose-sm md:prose-base prose-invert max-w-none text-justify">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {lessons[selectedIndex].articleContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
