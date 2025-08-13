import React, { useState } from "react";

const VideoList = ({ videos }) => {
  const [showAll, setShowAll] = useState(false);
  const displayVideos = showAll ? videos : videos.slice(0, 10);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="video-list">
      <h3>Video List ({videos.length} videos)</h3>

      {displayVideos.map((video, index) => (
        <div key={video.id} className="video-item">
          <img
            src={
              video.thumbnails?.medium?.url || video.thumbnails?.default?.url
            }
            alt={video.title}
            className="video-thumbnail"
          />
          <div className="video-info">
            <div className="video-title">{video.title}</div>
            <div className="video-meta">
              <span>#{index + 1}</span>
              <span>{formatDuration(video.durationSeconds)}</span>
              {video.channelTitle && <span>by {video.channelTitle}</span>}
            </div>
          </div>
        </div>
      ))}

      {videos.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="reset-button"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {showAll ? "Show Less" : `Show All ${videos.length} Videos`}
        </button>
      )}
    </div>
  );
};

export default VideoList;
