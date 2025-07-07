import React from "react";

const About = () => {
  return (
    <div className="min-h-screen w-full relative bg-black flex-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}
      />
      <div className="flex flex-col w-full max-w-3xl px-10 gap-5">
        <h1 className="text-6xl md:text-8xl z-20 text-neutral-500">About</h1>
        <p className="text-md z-40 text-neutral-300">
          Sublime IQ is your personalized microcourse generator, built to
          simplify your learning journey. Just enter a topic, and let AI craft a
          concise, focused course with curated lessons, handpicked videos, and
          crisp reading material — all tailored to your interests.
        </p>
        <p className="text-md z-40 text-neutral-300">
          Built with modern technologies like Next.js, Prisma, TailwindCSS,
          PostgreSQL, and the Gemini API, Sublime IQ blends speed, simplicity,
          and intelligence into a seamless user experience.
        </p>
      </div>
    </div>
  );
};

export default About;
