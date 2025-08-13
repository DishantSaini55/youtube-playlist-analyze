const axios = require("axios");

class YouTubeAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://www.googleapis.com/youtube/v3";
  }

  // Extract playlist ID from URL
  extractPlaylistId(url) {
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
  }

  // Get playlist info and videos
  async getPlaylistData(playlistId) {
    try {
      // Get playlist details
      const playlistResponse = await axios.get(`${this.baseURL}/playlists`, {
        params: {
          part: "snippet,status",
          id: playlistId,
          key: this.apiKey,
        },
      });

      if (!playlistResponse.data.items.length) {
        throw new Error("Playlist not found or is private");
      }

      const playlist = playlistResponse.data.items[0];

      // Get all videos in the playlist
      const videos = await this.getAllPlaylistVideos(playlistId);

      return {
        playlist: {
          id: playlist.id,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          thumbnails: playlist.snippet.thumbnails,
          channelTitle: playlist.snippet.channelTitle,
          publishedAt: playlist.snippet.publishedAt,
        },
        videos: videos,
        totalVideos: videos.length,
      };
    } catch (error) {
      console.error(
        "YouTube API Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get all videos from playlist (handles pagination)
  async getAllPlaylistVideos(playlistId) {
    let allVideos = [];
    let nextPageToken = null;
    const maxResults = 50;

    try {
      do {
        const response = await axios.get(`${this.baseURL}/playlistItems`, {
          params: {
            part: "snippet",
            playlistId: playlistId,
            maxResults: maxResults,
            pageToken: nextPageToken,
            key: this.apiKey,
          },
        });

        const videoIds = response.data.items.map(
          (item) => item.snippet.resourceId.videoId
        );
        const videosWithDuration = await this.getVideosDuration(videoIds);

        // Combine playlist item info with duration
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
  }

  // Get video durations
  async getVideosDuration(videoIds) {
    try {
      const response = await axios.get(`${this.baseURL}/videos`, {
        params: {
          part: "contentDetails",
          id: videoIds.join(","),
          key: this.apiKey,
        },
      });

      return response.data.items.map((item) => ({
        id: item.id,
        duration: item.contentDetails.duration,
        durationSeconds: this.parseDurationToSeconds(
          item.contentDetails.duration
        ),
      }));
    } catch (error) {
      console.error("Error fetching video durations:", error);
      return [];
    }
  }

  // Parse ISO 8601 duration to seconds
  parseDurationToSeconds(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }
}

module.exports = YouTubeAPI;
