import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchYoutubeVideo } from "@/lib/youtube";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

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
  5. Do not include YouTube Shorts and prefer strong academic content. Avoid channels like Apna College.
  
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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  type Lesson = {
    title: string;
    summary: string;
    youtube_query: string;
    article_content: string;
    youtube_url?: string;
  };

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText = await result.response.text();

    let cleanedResponse = responseText.trim();

    // Remove markdown blocks
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/```\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsed: Lesson[] = JSON.parse(cleanedResponse);

    const enrichedLessons: Lesson[] = await Promise.all(
      parsed.map(async (lesson: Lesson) => {
        const url = await fetchYoutubeVideo(lesson.youtube_query);
        return { ...lesson, youtube_url: url };
      })
    );

    return NextResponse.json({ lessons: enrichedLessons });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      error: "Could not generate or parse content from Gemini",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
