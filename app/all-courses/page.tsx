"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Lesson = {
  title: string;
  summary: string;
};

type Course = {
  id: string;
  topic: string;
  createdAt: string;
  lessons: Lesson[];
};

const AllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllCourses = async () => {
    try {
      const response = await axios.get("/api/getAllCourses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <section className="min-h-screen bg-[#101214] text-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">All Courses</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-400">No courses found.</p>
      ) : (
        <div className="space-y-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#161819] rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4">📘 {course.topic}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {new Date(course.createdAt).toLocaleDateString()}
              </p>

              {course.lessons.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <li key={index}>
                      <strong>{lesson.title}</strong>: {lesson.summary}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No lessons found.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllCourses;
