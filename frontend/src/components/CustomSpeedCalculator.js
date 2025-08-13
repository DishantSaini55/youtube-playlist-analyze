import React, { useState } from "react";

const CustomSpeedCalculator = ({ totalSeconds }) => {
  const [customSpeed, setCustomSpeed] = useState("");
  const [customResult, setCustomResult] = useState(null);

  const calculateCustomSpeed = () => {
    const speed = parseFloat(customSpeed);
    if (speed > 0 && speed <= 10) {
      const newDuration = Math.round(totalSeconds / speed);
      const formatted = formatDuration(newDuration);
      setCustomResult({ speed, duration: newDuration, formatted });
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="custom-speed-section">
      <h3 className="custom-speed-title">Custom Speed Calculator</h3>
      <div className="custom-speed-controls">
        <input
          type="number"
          value={customSpeed}
          onChange={(e) => setCustomSpeed(e.target.value)}
          placeholder="1.5"
          min="0.1"
          max="10"
          step="0.1"
          className="speed-input"
        />
        <span style={{ color: "#718096", fontWeight: "500" }}>× speed</span>
        <button
          onClick={calculateCustomSpeed}
          className="speed-calculate-btn"
          disabled={!customSpeed || parseFloat(customSpeed) <= 0}
        >
          Calculate
        </button>
      </div>

      {customResult && (
        <div className="custom-speed-result">
          At {customResult.speed}× speed:{" "}
          <strong>{customResult.formatted}</strong>
        </div>
      )}
    </div>
  );
};

export default CustomSpeedCalculator;
