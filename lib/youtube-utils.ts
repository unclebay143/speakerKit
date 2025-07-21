// YouTube Support Feature:
// - Supports both individual videos (youtubeVideo) and playlists (youtubePlaylist)
// - Automatically detects YouTube URLs and creates embeds
// - Supports youtu.be, youtube.com/watch, and youtube.com/playlist formats
// - Provides fallback to regular links for non-YouTube URLs
// - Shows YouTube badges and red-themed buttons for YouTube content
// - Responsive iframe embeds with hover effects
export const parseYouTubeUrl = (url: string) => {
  // Handle youtu.be format
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return { videoId, type: "video" };
  }

  // Handle youtube.com/watch format
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const videoId = urlParams.get("v");
    return { videoId, type: "video" };
  }

  // Handle youtube.com/playlist format
  if (url.includes("youtube.com/playlist")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const playlistId = urlParams.get("list");
    return { playlistId, type: "playlist" };
  }

  return null;
};

export const getYouTubeEmbedUrl = (url: string) => {
  const parsed = parseYouTubeUrl(url);
  if (!parsed) return null;

  if (parsed.type === "video" && parsed.videoId) {
    return `https://www.youtube.com/embed/${parsed.videoId}?autoplay=1&rel=0`;
  }

  if (parsed.type === "playlist" && parsed.playlistId) {
    return `https://www.youtube.com/embed/videoseries?list=${parsed.playlistId}&autoplay=1&rel=0`;
  }

  return null;
};

export const getYouTubeThumbnail = (url: string) => {
  const parsed = parseYouTubeUrl(url);
  if (!parsed || parsed.type !== "video" || !parsed.videoId) return null;

  return `https://img.youtube.com/vi/${parsed.videoId}/maxresdefault.jpg`;
};

export const getHoverVideoUrl = (url: string) => {
  const parsed = parseYouTubeUrl(url);
  if (!parsed || parsed.type !== "video" || !parsed.videoId) return null;

  return `https://www.youtube.com/embed/${parsed.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${parsed.videoId}&rel=0`;
};

export const isYouTubeUrl = (url: string) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

// Enhanced Event interface
export interface Event {
  _id?: string;
  userId?: string;
  title: string;
  event: string;
  date: string;
  location: string;
  type: string;
  coverImage: string;
  link: string;
  youtubeVideo?: string; // YouTube video URL
  youtubePlaylist?: string; // YouTube playlist URL
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
