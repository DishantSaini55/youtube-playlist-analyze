import React, { useState } from "react";
import PlaylistForm from "./components/PlaylistForm";
import PlaylistResults from "./components/PlaylistResults";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

function App() {
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError(null);
    setPlaylistData(null);

    try {
      const response = await fetch("/api/playlist/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze playlist");
      }

      setPlaylistData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlaylistData(null);
    setError(null);
  };

  return (
    <div className="App">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      <header className="app-header">
        <div className="creator-badge">✨ Made by Dishant</div>
        <div className="container">
          <h1 className="app-title">
            <span className="youtube-icon">📺</span>
            YouTube Playlist Analyzer
          </h1>
          <p className="app-subtitle">
            Beautiful analytics for your favorite playlists with stunning
            visualizations
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {!playlistData && !loading && (
            <div className="fade-in-up">
              <PlaylistForm onAnalyze={handleAnalyze} error={error} />
            </div>
          )}

          {loading && <LoadingSpinner />}

          {playlistData && !loading && (
            <div className="fade-in-up">
              <PlaylistResults data={playlistData} onReset={handleReset} />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-text">
              &copy; 2024 YouTube Playlist Analyzer
            </div>
            <div className="dishant-credit">🚀 Crafted with ❤️ by Dishant</div>
            <div className="footer-text">Built with React & Node.js</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
