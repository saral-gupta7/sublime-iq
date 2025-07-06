"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { marked } from "marked";
import CourseBar from "@/components/CourseBar";

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

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axios.get(`/api/getCourseById?id=${id}`);
      const course = res.data;

      const formattedLessons = course.lessons.map((lesson: Lesson[]) => ({
        ...lesson,
      }));

      setLessons(formattedLessons);
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
      />

      {lessons[selectedIndex] && (
        <div className="flex px-10 py-8 overflow-y-auto max-w-3xl mx-auto flex-col gap-5">
          <h1 className="text-3xl font-bold mb-4">
            {lessons[selectedIndex].title}
          </h1>
          <p className="mb-4">{lessons[selectedIndex].summary}</p>
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
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: marked.parse(lessons[selectedIndex].articleContent),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CoursePage;
