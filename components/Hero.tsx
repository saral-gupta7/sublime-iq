import { Plus, Ellipsis } from "lucide-react";
import React from "react";

type HeroProps = {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  handleGenerate: () => void;
  loading: boolean;
};

const Hero = ({ topic, setTopic, handleGenerate, loading }: HeroProps) => {
  return (
    <div className="max-w-4xl flex items-end gap-8">
      <div className="flex flex-col gap-10">
        <h1 className="text-5xl font-bold">Welcome to Sublime-IQ</h1>

        <div className="flex gap-4">
          <input
            type="text"
            className="border-2 border-white rounded-full px-5 py-3 text-white bg-transparent w-full"
            placeholder="What would you like to learn today?"
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGenerate();
              }
            }}
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
  );
};

export default Hero;
