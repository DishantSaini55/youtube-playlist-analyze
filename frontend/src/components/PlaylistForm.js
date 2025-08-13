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

  const quickLinks = [
    {
      name: "Lo-Fi Hip Hop",
      url: "https://www.youtube.com/playlist?list=PLrxfgDEc2NxY_fRjEJVHntkVhF_VCtRRf",
    },
    {
      name: "Study Music",
      url: "https://www.youtube.com/playlist?list=PLGvuLuKY1jWj_QKPrN6GqvSTfZr9L4CyW",
    },
  ];

  return (
    <div className="playlist-form">
      <h2 className="form-title">🎵 Analyze Your Playlist</h2>
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
          {isAnalyzing ? "✨ Analyzing..." : "🚀 Analyze Playlist"}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: "2.5rem" }}>
        <p
          style={{
            fontSize: "1rem",
            color: "#718096",
            marginBottom: "1rem",
            fontWeight: "600",
          }}
        >
          🎯 Quick Test Links:
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {quickLinks.map((link, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setUrl(link.url)}
              style={{
                background: "rgba(102, 126, 234, 0.1)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                color: "#667eea",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.2)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              🎵 {link.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#718096" }}>
        <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
          ✅ Supported URLs:
        </p>
        <ul
          style={{
            textAlign: "left",
            marginTop: "0.5rem",
            paddingLeft: "1.5rem",
          }}
        >
          <li>📺 https://www.youtube.com/playlist?list=PLxxx...</li>
          <li>🎬 https://youtube.com/watch?v=xxx&list=PLxxx...</li>
          <li>📱 https://m.youtube.com/playlist?list=PLxxx...</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaylistForm;
