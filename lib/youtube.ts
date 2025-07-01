import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function fetchYoutubeVideo(query: string) {
  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1,
      key: YOUTUBE_API_KEY,
    },
  });

  const video = res.data.items[0];
  return `https://www.youtube.com/watch?v=${video.id.videoId}`;
}
