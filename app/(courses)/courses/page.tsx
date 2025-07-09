"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeIcon, X, Plus } from "lucide-react";
import Modal from "@/components/modal";
import { useRouter } from "next/navigation";
type Course = {
  id: string;
  topic: string;
  language: string;
};

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
};

type MeResponse = {
  user: User;
};
const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleDelete = async (courseId: string) => {
    try {
      const res = await axios.delete("/api/deleteCourse", {
        data: { courseId },
      });

      if (res.status === 200) {
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Something went wrong while deleting the course.");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get<MeResponse>("/api/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
        const courseRes = await axios.get("/api/getAllCourses", {
          withCredentials: true,
        });
        setCourses(courseRes.data);
      } catch (err) {
        console.error("User not authenticated:", err);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  return (
    <div className="min-h-screen w-full relative bg-black flex justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
        }}
      />
      <div
        className={`relative z-2 text-white p-10 flex flex-col items-start gap-5 md:min-w-4xl max-w-screen-md mx-auto ${
          courseToDelete && "blur-md transition-all"
        }`}
      >
        <div className="flex justify-between w-full">
          <Link href={"/"}>
            <span className="flex gap-2 items-center px-4 py-3 bg-white/10 w-fit rounded-sm">
              <HomeIcon size={18} />
            </span>
          </Link>

          <Link href={"/create"}>
            <span className="flex gap-2 items-center px-4 py-3 bg-white/10 w-fit rounded-sm hover:bg-white/15 transition-all duration-300 text-sm">
              New
              <Plus size={18} />
            </span>
          </Link>
        </div>

        <h1 className="text-4xl font-semibold mb-8 text-gradient">
          Welcome, {user && user.firstName}
        </h1>

        {loading ? (
          <p className="text-gray-400">Fetching your courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-400">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                className="relative bg-[#15141E] px-8 py-8 rounded-lg hover:bg-[#08090D] transition-all duration-300 border-[0.5px] border-gray-700"
                key={course.id}
              >
                <Link
                  href={`/courses/${course.id}`}
                  className="flex flex-col gap-2"
                >
                  <p className="text-xs bg-white/10 w-fit px-2 py-1 rounded-xs">
                    {course.language}
                  </p>
                  <h2 className="text-lg font-semibold mb-2 capitalize">
                    {course.topic}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Click to explore this course
                  </p>
                </Link>

                <div className="absolute right-1 top-1 rounded-full p-1 z-40">
                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="hover:bg-white/10 rounded-full p-1"
                  >
                    <X size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {courseToDelete && (
        <Modal
          courseId={courseToDelete.id}
          handleDelete={(id: string) => {
            handleDelete(id);
            setCourseToDelete(null); // close modal after delete
          }}
          onClose={() => setCourseToDelete(null)}
        />
      )}
    </div>
  );
};

export default Courses;
