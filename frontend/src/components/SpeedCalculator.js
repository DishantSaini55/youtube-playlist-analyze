import React from "react";

const SpeedCalculator = ({ speeds }) => {
  const speedOrder = ["normal", "speed125", "speed150", "speed175", "speed200"];

  return (
    <div className="speed-calculator">
      <h3>Duration at Different Speeds</h3>
      <div className="speed-grid">
        {speedOrder.map((speedKey) => {
          const speed = speeds[speedKey];
          return (
            <div key={speedKey} className="speed-card">
              <div className="speed-multiplier">{speed.speed}</div>
              <div className="speed-duration">{speed.formatted}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeedCalculator;
