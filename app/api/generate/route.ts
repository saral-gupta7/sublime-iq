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
     - At least 2 paragraphs
     - Real-world explanations
     - End with: "Read more: [actual article URL]"
  
  Respond only with a JSON array like:
  [
    {
      "title": "Lesson Title",
      "summary": "This lesson explains...",
      "youtube_query": "How layout grids work in UI design",
      "article_content": "## Grids Matter\\n\\nContent here...\\n\\nRead more: https://..."
    },
    ...
  ]
  `;
  const chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  let response = chat.choices[0].message.content;
  try {
    const parsed = JSON.parse(response!);
    const enrichedLessons = await Promise.all(
      parsed.map(async (lesson: any) => {
        const url = await fetchYoutubeVideo(lesson.youtube_query);
        return {
          ...lesson,
          youtube_url: url,
        };
      })
    );
    return NextResponse.json({ lessons: enrichedLessons });
  } catch (error) {
    return NextResponse.json({
      error: "Could not parse JSON from OpenAI",
      raw: response,
    });
  }
}
