import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchYoutubeVideo } from "@/lib/youtube";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic || !topic.trim()) {
    return NextResponse.json(
      {
        error: "Please enter the query",
      },
      { status: 400 }
    );
  }
  const prompt = `

  Respond ONLY with a **JSON array in camelCase** like:
  [
    {
      "title": "Lesson Title",
      "summary": "This lesson explains...",
      "youtubeQuery": "How layout grids work in UI design",
      "articleContent": "## Grids Matter\\n\\nContent here...\\n\\n"
    },
    ...
  ]
  Create a 5 to 6 part microcourse on the topic: "${topic}".
  
  Each part must include:
  
  1. "title": A clear lesson title
  2. "summary": A 3-4 sentence summary
  3. "youtube_query": A high-quality YouTube search query string that would return helpful results
  4. "article_content": Markdown content with:
     - ## Headings
     - At least 4 detailed paragraphs separated by space.
     - Real-world explanations
  RULES:
  1. Video URLs from Youtube must not include Youtube Shorts. 
  2. Give slighly long form content i.e content with atleast 15-20 video length priority.
  3. Give channel who specialize in the niche priority over general content creators.
  4. If there are university courses for core engineering subjects, for example: MIT Opencourseware, Stanford, Oxford for the niches, give those videos priority. 
  5. Prioritize videos that are teaching content over roadmap videos.
  
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  type Lesson = {
    title: string;
    summary: string;
    youtubeQuery: string;
    articleContent: string;
    youtubeUrl: string;
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

    const parsed = JSON.parse(cleanedResponse);

    // Don't assume it matches camelCase. Transform it manually:
    const enrichedLessons: Lesson[] = await Promise.all(
      parsed.map(async (lesson: Lesson) => {
        const url = await fetchYoutubeVideo(lesson.youtubeQuery);
        return {
          title: lesson.title,
          summary: lesson.summary,
          youtubeQuery: lesson.youtubeQuery,
          articleContent: lesson.articleContent,
          youtubeUrl: url,
        };
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
