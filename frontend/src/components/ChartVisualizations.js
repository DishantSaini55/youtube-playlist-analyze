import React, { useRef, useEffect } from "react";

const ChartVisualizations = ({ data }) => {
  const doughnutRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    // Speed Comparison Doughnut Chart
    drawSpeedDoughnut();
    // Video Duration Distribution Bar Chart
    drawDurationBar();
    // Duration Timeline Line Chart
    drawTimelineChart();
  }, [data]);

  const drawSpeedDoughnut = () => {
    const canvas = doughnutRef.current;
    const ctx = canvas.getContext("2d");
    const speeds = data.statistics.speedVariations;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    const colors = ["#667eea", "#764ba2", "#f093fb", "#a8e6cf", "#ffd93d"];

    const speedData = [
      { label: "1x", value: speeds.normal.seconds, color: colors[0] },
      { label: "1.25x", value: speeds.speed125.seconds, color: colors[1] },
      { label: "1.5x", value: speeds.speed150.seconds, color: colors[2] },
      { label: "1.75x", value: speeds.speed175.seconds, color: colors[3] },
      { label: "2x", value: speeds.speed200.seconds, color: colors[4] },
    ];

    const total = speedData[0].value; // Normal speed as reference
    let currentAngle = -Math.PI / 2;

    speedData.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI) / speedData.length;

      // Draw slice
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = item.color;
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

      ctx.fillStyle = "#4a5568";
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(item.label, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "#667eea";
    ctx.font = "bold 16px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Speed", centerX, centerY - 5);
    ctx.fillText("Comparison", centerX, centerY + 15);
  };

  const drawDurationBar = () => {
    const canvas = barRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group videos by duration ranges
    const ranges = [
      { label: "0-2m", min: 0, max: 120, count: 0 },
      { label: "2-5m", min: 120, max: 300, count: 0 },
      { label: "5-10m", min: 300, max: 600, count: 0 },
      { label: "10-20m", min: 600, max: 1200, count: 0 },
      { label: "20m+", min: 1200, max: Infinity, count: 0 },
    ];

    data.videos.forEach((video) => {
      const duration = video.durationSeconds;
      const range = ranges.find((r) => duration >= r.min && duration < r.max);
      if (range) range.count++;
    });

    const maxCount = Math.max(...ranges.map((r) => r.count));
    const barWidth = 60;
    const barSpacing = 20;
    const maxBarHeight = 120;
    const startX = 50;
    const startY = 150;

    ranges.forEach((range, index) => {
      const barHeight = (range.count / maxCount) * maxBarHeight;
      const x = startX + index * (barWidth + barSpacing);
      const y = startY - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, startY);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#f093fb");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#4a5568";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(range.label, x + barWidth / 2, startY + 20);

      // Draw count
      ctx.fillStyle = "#667eea";
      ctx.font = "bold 14px Inter";
      ctx.fillText(range.count.toString(), x + barWidth / 2, y - 10);
    });

    // Title
    ctx.fillStyle = "#4a5568";
    ctx.font = "bold 16px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Video Duration Distribution", canvas.width / 2, 30);
  };

  const drawTimelineChart = () => {
    const canvas = lineRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create cumulative duration timeline
    let cumulativeDuration = 0;
    const points = data.videos.slice(0, 20).map((video, index) => {
      cumulativeDuration += video.durationSeconds;
      return {
        x: 50 + index * ((canvas.width - 100) / 19),
        y:
          canvas.height -
          50 -
          (cumulativeDuration / data.statistics.totalDuration.seconds) * 120,
      };
    });

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = 50 + i * 24;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 50, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = "#667eea";
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw points
    points.forEach((point) => {
      ctx.fillStyle = "#f093fb";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Title
    ctx.fillStyle = "#4a5568";
    ctx.font = "bold 16px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Cumulative Duration Timeline", canvas.width / 2, 30);
  };

  return (
    <div className="charts-container">
      <h3
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #6b73ff 0%, #9c40ff 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "2rem",
        }}
      >
        📊 Beautiful Analytics Dashboard
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div className="chart-section">
          <h4 className="chart-title">⚡ Speed Comparison</h4>
          <canvas
            ref={doughnutRef}
            width={300}
            height={200}
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>

        <div className="chart-section">
          <h4 className="chart-title">📊 Duration Distribution</h4>
          <canvas
            ref={barRef}
            width={400}
            height={200}
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>

        <div className="chart-section" style={{ gridColumn: "1 / -1" }}>
          <h4 className="chart-title">📈 Timeline Progress</h4>
          <canvas
            ref={lineRef}
            width={800}
            height={200}
            style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartVisualizations;
