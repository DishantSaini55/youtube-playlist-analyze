import React, { useState } from "react";

const PlaylistForm = ({ onAnalyze, error }) => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsAnalyzing(true);
    await onAnalyze(url.trim());
    setIsAnalyzing(false);
  };

  const isValidUrl = (url) => {
    return url.includes("youtube.com") && url.includes("list=");
  };

  return (
    <div className="playlist-form">
      <h2 className="form-title">Analyze Your Playlist</h2>
      <p className="form-description">
        Paste any YouTube playlist URL below to get detailed duration analysis
        with beautiful visualizations
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/playlist?list=..."
          className="url-input"
          required
        />

        <button
          type="submit"
          className="analyze-button"
          disabled={isAnalyzing || !url.trim() || !isValidUrl(url)}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Playlist"}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default PlaylistForm;
