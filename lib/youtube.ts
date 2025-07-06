import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Define minimum duration (in seconds): 15 minutes
const MIN_VIDEO_LENGTH = 5 * 60;

const BLOCKED_CHANNELS = [
  "Cocomelon",
  "Kids TV",
  "ChuChu TV",
  "Little Baby Bum", // common kids channels
  "Super Simple Songs",
  "Pinkfong",
  "BabyBus",
  "Mother Goose Club",
  "Blippi",
  "Ryan's World",
  "Peppa Pig",
  "Little Angel",
  "Dave and Ava",
  "Apna College",
  "Vedantu",
  "Unacademy", // generic or roadmap-heavy channels (optional)
  "BYJU'S",
  "StudyIQ",
  "Wifistudy",
  "Adda247",
  "Khan Academy Kids",
  "Numberblocks",
  "Alphablocks",
  "Masha and The Bear",
  "T-Series Kids Hut",
];

export async function fetchYoutubeVideo(query: string) {
  const searchRes = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 10,
        key: YOUTUBE_API_KEY,
      },
    }
  );

  const videos = searchRes.data.items;

  for (const video of videos) {
    const videoId = video.id.videoId;
    const channelTitle = video.snippet.channelTitle;

    // Step 1: Skip blocked or kids channels
    if (BLOCKED_CHANNELS.some((blocked) => channelTitle.includes(blocked))) {
      continue;
    }

    // Step 2: Fetch video duration
    const detailRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails",
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    const isoDuration = detailRes.data.items[0]?.contentDetails?.duration;
    const durationSeconds = parseISODuration(isoDuration);

    // Step 3: Only return if duration >= 15 minutes
    if (durationSeconds >= MIN_VIDEO_LENGTH) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
  }

  return null; // fallback if no valid long-form video found
}

// Helper: Parse ISO 8601 duration (e.g. PT20M13S) to total seconds
function parseISODuration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, hours, minutes, seconds] = duration.match(regex) || [];

  return (
    parseInt(hours || "0") * 3600 +
    parseInt(minutes || "0") * 60 +
    parseInt(seconds || "0")
  );
}
