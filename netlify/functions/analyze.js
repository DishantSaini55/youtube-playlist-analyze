const axios = require("axios");

// YouTube API utility functions
const extractPlaylistId = (url) => {
  const patterns = [
    /[?&]list=([^&#]*)/i,
    /playlist\?list=([^&#]*)/i,
    /embed\/videoseries\?list=([^&#]*)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const parseDurationToSeconds = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

const getVideosDuration = async (videoIds, apiKey) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: "contentDetails",
        id: videoIds.join(","),
        key: apiKey,
      },
    });

    return response.data.items.map((item) => ({
      id: item.id,
      duration: item.contentDetails.duration,
      durationSeconds: parseDurationToSeconds(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error("Error fetching video durations:", error);
    return [];
  }
};

const getAllPlaylistVideos = async (playlistId, apiKey) => {
  let allVideos = [];
  let nextPageToken = null;
  const maxResults = 50;

  try {
    do {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: maxResults,
          pageToken: nextPageToken,
          key: apiKey,
        },
      });

      const videoIds = response.data.items.map(
        (item) => item.snippet.resourceId.videoId
      );
      const videosWithDuration = await getVideosDuration(videoIds, apiKey);

      const videosData = response.data.items.map((item) => {
        const videoWithDuration = videosWithDuration.find(
          (v) => v.id === item.snippet.resourceId.videoId
        );
        return {
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          channelTitle: item.snippet.videoOwnerChannelTitle,
          publishedAt: item.snippet.publishedAt,
          position: item.snippet.position,
          duration: videoWithDuration ? videoWithDuration.duration : "PT0S",
          durationSeconds: videoWithDuration
            ? videoWithDuration.durationSeconds
            : 0,
        };
      });

      allVideos = allVideos.concat(videosData);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allVideos;
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Playlist URL is required" }),
      };
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "YouTube API key not configured" }),
      };
    }

    // Extract playlist ID
    const playlistId = extractPlaylistId(url);

    if (!playlistId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid YouTube playlist URL" }),
      };
    }

    console.log(`🎵 Analyzing playlist: ${playlistId}`);

    // Get playlist details
    const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlists`, {
      params: {
        part: "snippet,status",
        id: playlistId,
        key: apiKey,
      },
    });

    if (!playlistResponse.data.items.length) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Playlist not found or is private" }),
      };
    }

    const playlist = playlistResponse.data.items[0];

    // Get all videos in the playlist
    const videos = await getAllPlaylistVideos(playlistId, apiKey);

    // Calculate total duration
    const totalSeconds = videos.reduce(
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
      playlist: {
        id: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnails: playlist.snippet.thumbnails,
        channelTitle: playlist.snippet.channelTitle,
        publishedAt: playlist.snippet.publishedAt,
      },
      videos: videos,
      statistics: {
        totalVideos: videos.length,
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
      `✅ Analysis complete: ${videos.length} videos, ${formatDuration(totalSeconds)} total`
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error("❌ Error analyzing playlist:", error.message);

    let statusCode = 500;
    let errorMessage = "Failed to analyze playlist. Please try again.";

    if (error.response?.status === 403) {
      statusCode = 403;
      errorMessage = "YouTube API quota exceeded or invalid API key";
    } else if (error.response?.status === 404) {
      statusCode = 404;
      errorMessage = "Playlist not found or is private";
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
