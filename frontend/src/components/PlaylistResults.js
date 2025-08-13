import React, { useState } from "react";
import SpeedCalculator from "./SpeedCalculator";
import VideoList from "./VideoList";
import ChartVisualizations from "./ChartVisualizations";
import CustomSpeedCalculator from "./CustomSpeedCalculator";

const PlaylistResults = ({ data, onReset }) => {
  const { playlist, statistics, videos } = data;

  return (
    <div className="results-container fade-in-up">
      <div className="results-header">
        <div className="playlist-info">
          <h2>{playlist.title}</h2>
          <div className="playlist-meta">
            <span>📺 By {playlist.channelTitle}</span> •
            <span> 🎵 {statistics.totalVideos} videos</span> •
            <span> ⏱️ {statistics.totalDuration.formatted}</span>
          </div>
        </div>
        <button onClick={onReset} className="reset-button">
          🔄 Analyze Another
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statistics.totalVideos}</div>
          <div className="stat-label">📹 Total Videos</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statistics.totalDuration.formatted}</div>
          <div className="stat-label">⏱️ Total Duration</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {Math.round(
              statistics.totalDuration.seconds / statistics.totalVideos / 60
            )}{" "}
            min
          </div>
          <div className="stat-label">📊 Average per Video</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {(statistics.totalDuration.seconds / 3600).toFixed(1)}h
          </div>
          <div className="stat-label">🕐 Hours Total</div>
        </div>
      </div>

      <CustomSpeedCalculator totalSeconds={statistics.totalDuration.seconds} />
      <SpeedCalculator speeds={statistics.speedVariations} />
      <ChartVisualizations data={data} />
      <VideoList videos={videos} />
    </div>
  );
};

export default PlaylistResults;
