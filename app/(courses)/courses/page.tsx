"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeIcon } from "lucide-react";

type Course = {
  id: string;
  topic: string;
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/getAllCourses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-black flex justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
        }}
      />
      <div className="relative z-2 text-white p-10 flex flex-col items-start gap-5 md:min-w-3xl max-w-screen-md mx-auto">
        <div>
          <Link href={"/"}>
            <span className="flex gap-2 items-center px-4 py-2 bg-white/10 w-fit rounded-sm">
              <HomeIcon size={18} />
              Home
            </span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Your Courses</h1>

        {/* Handling all 3 states */}
        {loading ? (
          <p className="text-gray-400">Fetching your courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-400">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className="bg-[#161819] p-6 rounded-lg hover:bg-[#1e1f20] transition"
              >
                <h2 className="text-xl font-semibold">{course.topic}</h2>
                <p className="text-sm text-gray-400">
                  Click to explore this course
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
