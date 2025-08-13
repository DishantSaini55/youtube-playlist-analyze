const YouTubeAPI = require("../utils/youtubeApi");

const youtubeApi = new YouTubeAPI(process.env.YOUTUBE_API_KEY);

const analyzePlaylist = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Playlist URL is required" });
    }

    // Extract playlist ID
    const playlistId = youtubeApi.extractPlaylistId(url);

    if (!playlistId) {
      return res.status(400).json({ error: "Invalid YouTube playlist URL" });
    }

    console.log(`🎵 Analyzing playlist: ${playlistId}`);

    // Get playlist data
    const playlistData = await youtubeApi.getPlaylistData(playlistId);

    // Calculate total duration
    const totalSeconds = playlistData.videos.reduce(
      (sum, video) => sum + video.durationSeconds,
      0
    );

    // Calculate durations at different speeds
    const durations = {
      normal: totalSeconds,
      speed125: Math.round(totalSeconds / 1.25),
      speed150: Math.round(totalSeconds / 1.5),
      speed175: Math.round(totalSeconds / 1.75),
      speed200: Math.round(totalSeconds / 2),
    };

    // Format durations
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      } else {
        return `${secs}s`;
      }
    };

    const response = {
      success: true,
      playlist: playlistData.playlist,
      videos: playlistData.videos,
      statistics: {
        totalVideos: playlistData.totalVideos,
        totalDuration: {
          seconds: totalSeconds,
          formatted: formatDuration(totalSeconds),
        },
        speedVariations: {
          normal: {
            seconds: durations.normal,
            formatted: formatDuration(durations.normal),
            speed: "1x",
          },
          speed125: {
            seconds: durations.speed125,
            formatted: formatDuration(durations.speed125),
            speed: "1.25x",
          },
          speed150: {
            seconds: durations.speed150,
            formatted: formatDuration(durations.speed150),
            speed: "1.5x",
          },
          speed175: {
            seconds: durations.speed175,
            formatted: formatDuration(durations.speed175),
            speed: "1.75x",
          },
          speed200: {
            seconds: durations.speed200,
            formatted: formatDuration(durations.speed200),
            speed: "2x",
          },
        },
      },
    };

    console.log(
      `✅ Analysis complete: ${
        playlistData.totalVideos
      } videos, ${formatDuration(totalSeconds)} total`
    );
    res.json(response);
  } catch (error) {
    console.error("❌ Error analyzing playlist:", error.message);

    if (error.response?.status === 403) {
      res
        .status(403)
        .json({ error: "YouTube API quota exceeded or invalid API key" });
    } else if (error.response?.status === 404) {
      res.status(404).json({ error: "Playlist not found or is private" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to analyze playlist. Please try again." });
    }
  }
};

module.exports = {
  analyzePlaylist,
};
