import React, { useState } from "react";
import PlaylistForm from "./components/PlaylistForm";
import PlaylistResults from "./components/PlaylistResults";
import LoadingSpinner from "./components/LoadingSpinner";
import api from "./utils/api";
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
      const response = await api.post("/analyze", { url });
      setPlaylistData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to analyze playlist");
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
      {/* Background Elements */}
      <div className="background-elements">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <header className="app-header">
        <div className="container">
          <div className="header-top">
            <div className="creator-badge">Made by Dishant</div>
          </div>
          <h1 className="app-title">
            YouTube Playlist Analyzer
          </h1>
          <p className="app-subtitle">
            Analyze your YouTube playlists with beautiful insights and speed calculations
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
              &copy; 2025 YouTube Playlist Analyzer
            </div>
            <div className="dishant-credit">Crafted by Dishant © 2025</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
