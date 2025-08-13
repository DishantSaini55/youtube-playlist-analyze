import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div className="loading-text">
        Analyzing playlist...
        <br />
        <small style={{ opacity: 0.8, fontSize: "0.9rem" }}>
          Fetching video data from YouTube API
        </small>
      </div>
    </div>
  );
};

export default LoadingSpinner;
