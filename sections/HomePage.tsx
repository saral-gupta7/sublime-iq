"use client";

import { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import CourseBar from "@/components/CourseBar";
import { Plus, Ellipsis } from "lucide-react";

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
      const res = await axios.post("/api/generate", { topic });

      const receivedLessons = Array.isArray(res.data.lessons)
        ? res.data.lessons
        : [];

      setLessons(receivedLessons);
      setSelectedLessonKey("lesson-0"); // default selection
      setSidebarVisible(true);
    } catch (error) {
      console.error("❌ Failed to generate course!", error);
      alert("Something went wrong while generating the course. Try again!");
    } finally {
      setLoading(false);
      setSidebarVisible(true);
    }
  };

  const selectedIndex = Number(selectedLessonKey?.split("-")[1]);
  const isValidIndex =
    !isNaN(selectedIndex) &&
    selectedIndex >= 0 &&
    selectedIndex < lessons.length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {sidebarVisible ? (
        <CourseBar
          lessons={lessons}
          selectedKey={selectedLessonKey}
          onSelect={setSelectedLessonKey}
        />
      ) : (
        ""
      )}

      {/* Main Content */}
      <section
        className={`flex-1 bg-[#111] text-[#eee] p-10 overflow-y-auto flex flex-col gap-10 ${
          sidebarVisible ? "items-start" : "items-center"
        } justify-center`}
      >
        {/* Input */}

        <div className="max-w-4xl mx-auto flex items-end gap-8">
          <div className="flex flex-col gap-10">
            <h1 className="text-7xl font-bold">Welcome to Sublime-IQ</h1>

            <div className="flex gap-4">
              <input
                type="text"
                className="border-2 border-white rounded-full px-5 py-3 text-white bg-transparent w-full"
                placeholder="What would you like to learn today?"
                onChange={(e) => setTopic(e.target.value)}
                value={topic}
              />

              <button
                onClick={handleGenerate}
                className="h-12 w-12 text-3xl bg-[#eee] text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                {loading ? <Ellipsis size={24} /> : <Plus size={24} />}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <span className="text-white">
            Creating your course...Please Wait!
          </span>
        ) : (
          ""
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
