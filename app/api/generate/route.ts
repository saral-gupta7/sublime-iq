import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";

import { fetchYoutubeVideo } from "@/lib/youtube";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  const prompt = `
  Create a 5 to 6 part microcourse on the topic: "${topic}".
  
  Each part must include:
  
  1. "title": A clear lesson title
  2. "summary": A 1–2 sentence summary
  3. "youtube_query": A high-quality YouTube search query string that would return helpful results
  4. "article_content": Markdown content with:
     - ## Headings
     - At least 2 detailed paragraphs
     - Real-world explanations
  5. Do not include youtube shorts and prefer strong academic content and avoid channels like Apna College.
  
  Respond only with a JSON array like:
  [
    {
      "title": "Lesson Title",
      "summary": "This lesson explains...",
      "youtube_query": "How layout grids work in UI design",
      "article_content": "## Grids Matter\\n\\nContent here...\\n\\n"
    },
    ...
  ]
  `;
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const response = chat.choices[0].message.content;
  type Lesson = {
    title: string;
    summary: string;
    youtube_query: string;
    article_content: string;
    youtube_url?: string;
  };

  try {
    const parsed: Lesson[] = JSON.parse(response!);
    const enrichedLessons: Lesson[] = await Promise.all(
      parsed.map(async (lesson: Lesson) => {
        const url = await fetchYoutubeVideo(lesson.youtube_query);
        return {
          ...lesson,
          youtube_url: url,
        };
      })
    );
    return NextResponse.json({ lessons: enrichedLessons });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "Could not parse JSON from OpenAI",
      raw: response,
    });
  }
}
