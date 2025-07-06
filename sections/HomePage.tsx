"use client";

import { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import CourseBar from "@/components/CourseBar";
import Hero from "@/components/Hero";
import { motion } from "motion/react";
type Lesson = {
  title: string;
  summary: string;
  youtube_url: string;
  article_content: string;
};

const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedLessonKey, setSelectedLessonKey] = useState("lesson-0");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setLessons([]);
      setSidebarVisible(false);

      if (!topic.trim()) {
        alert("Please enter a topic before generating a course.");
        setSidebarVisible(false);
        setLoading(false);
        return;
      }

      const generateRes = await axios.post("/api/generate", { topic });
      const generatedLessons = generateRes.data.lessons;

      await axios.post("/api/createCourse", {
        topic,
        lessons: generatedLessons,
      });

      // ✅ Step 3: Update UI
      const res = await axios.get("/api/getLatestCourse");
      const courses = res.data;

      const formattedLessons = courses.lessons.map((lesson: any) => ({
        title: lesson.title,
        summary: lesson.summary,
        youtube_url: lesson.youtubeUrl,
        article_content: lesson.articleContent,
      }));

      setLessons(formattedLessons);
      setSelectedLessonKey("lesson-0");
      setSidebarVisible(true);
    } catch (error) {
      console.error("❌ Failed to generate course!", error);
      alert("Something went wrong while generating the course. Try again!");
    } finally {
      setLoading(false);
      setSidebarVisible(true);
    }
  };

  const handleFetchFromDB = async () => {
    try {
      setLoading(true);
      setLessons([]);
      setSidebarVisible(false);

      const res = await axios.get("/api/getLatestCourse");
      const course = res.data;

      const formattedLessons = course.lessons.map((lesson: any) => ({
        title: lesson.title,
        summary: lesson.summary,
        youtube_url: lesson.youtubeUrl,
        article_content: lesson.articleContent,
      }));

      setLessons(formattedLessons);
      setSelectedLessonKey("lesson-0");
      setSidebarVisible(true);
    } catch (error) {
      console.error("Failed to load course from DB", error);
      alert("Something went wrong while loading course from DB.");
    } finally {
      setLoading(false);
    }
  };

  const selectedIndex = Number(selectedLessonKey?.split("-")[1]);
  const isValidIndex =
    !isNaN(selectedIndex) &&
    selectedIndex >= 0 &&
    selectedIndex < lessons.length;

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Azure Depths */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
        }}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {sidebarVisible && (
          <CourseBar
            lessons={lessons}
            selectedKey={selectedLessonKey}
            onSelect={setSelectedLessonKey}
          />
        )}
      </motion.div>

      {/* Main Content */}
      <section
        className={`flex-1 text-[#eee] px-10 overflow-y-auto flex flex-col gap-10 z-1 ${
          sidebarVisible ? "items-start pl-64" : "items-center"
        } justify-center`}
      >
        {/* Input */}

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Generate New Course
          </button>

          <button
            onClick={handleFetchFromDB}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            View Latest Course
          </button>
        </div>
        {!sidebarVisible && (
          <div className={`${sidebarVisible && "pl-64"}`}>
            <Hero
              handleGenerate={handleGenerate}
              topic={topic}
              setTopic={setTopic}
              loading={loading}
            />
          </div>
        )}

        {/* Loader State */}
        {loading && (
          <span className="text-white">
            Creating your course...Please Wait!
          </span>
        )}

        {/* Lesson Viewer */}
        {isValidIndex && (
          <div className="mt-16 max-w-3xl mx-auto space-y-6">
            <div className="bg-[#161819] text-[#ddd] p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold">
                {lessons[selectedIndex].title}
              </h2>
              <p className="mt-2">{lessons[selectedIndex].summary}</p>

              {/* YouTube Video */}
              {lessons[selectedIndex].youtube_url && (
                <div className="mt-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={lessons[selectedIndex].youtube_url.replace(
                      "watch?v=",
                      "embed/"
                    )}
                    title={lessons[selectedIndex].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow"
                  ></iframe>
                </div>
              )}

              {/* Article Content */}
              {lessons[selectedIndex].article_content && (
                <div
                  className="mt-6 prose prose-sm prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(
                      lessons[selectedIndex].article_content
                    ),
                  }}
                />
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
