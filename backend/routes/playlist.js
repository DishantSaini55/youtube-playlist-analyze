const express = require("express");
const { analyzePlaylist } = require("../controllers/playlistController");

const router = express.Router();

router.post("/analyze", analyzePlaylist);

module.exports = router;
