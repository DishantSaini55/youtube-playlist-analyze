require("dotenv").config();
const express = require("express");
const cors = require("cors");
const playlistRoutes = require("./routes/playlist");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? true  // Allow all origins for now, we'll restrict later
      : "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Routes
app.use("/api/playlist", playlistRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      hasApiKey: !!process.env.YOUTUBE_API_KEY,
      apiKeyPrefix: process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.substring(0, 10) + '...' : 'Not found'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler for API routes only
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

// Export for Vercel serverless
module.exports = app;
