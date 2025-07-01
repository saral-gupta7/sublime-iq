"use client";
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
  return (
    <div className="fixed text-white min-h-screen w-84 bg-[#161819] flex flex-col overflow-y-auto gap-8">
      <div className="h-40 w-full flex items-center justify-center border-b border-white/10">
        <h1 className="text-2xl uppercase font-bold">Sublime IQ</h1>
      </div>

      <div>
        {lessons.map((lesson, index) => {
          const key = `lesson-${index}`;
          return (
            <div className="mb-2 mx-4" key={key}>
              <div
                onClick={() => onSelect(key)}
                className={`hover:bg-[#383640] px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 flex flex-col ${
                  selectedKey === key ? "bg-[#383640]" : ""
                }`}
              >
                <span className="text-lg text-neutral-400">
                  Lesson {Number(key.split("-")[1]) + 1}
                </span>
                <span className="font-bold">{lesson.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseBar;
