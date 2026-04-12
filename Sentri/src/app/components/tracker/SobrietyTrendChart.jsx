function SobrietyTrendChart({ checkins }) {
  const data = [...checkins]
    .slice()
    .reverse()
    .map((entry) => ({
      date: entry.date?.slice(5) || "",
      craving: entry.craving_score ?? 0,
      stress: entry.stress_score ?? 0,
      sleep: entry.sleep_hours ?? 0
    }));

  if (data.length === 0) {
    return null;
  }

  const width = 720;
  const height = 240;
  const paddingLeft = 42;
  const paddingRight = 18;
  const paddingTop = 20;
  const paddingBottom = 34;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 10;

  const getX = (i) =>
    paddingLeft + (i * chartWidth) / Math.max(data.length - 1, 1);

  const getY = (value) =>
    paddingTop + chartHeight - (value / maxY) * chartHeight;

  const makePoints = (key) =>
    data.map((d, i) => `${getX(i)},${getY(d[key] ?? 0)}`).join(" ");

  const yTicks = [0, 2, 4, 6, 8, 10];

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.52)",
        border: "1px solid rgba(214, 223, 230, 0.95)",
        padding: "14px 16px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#70808e",
          marginBottom: "10px"
        }}
      >
        Recent trends
      </div>

      {data.length === 1 ? (
        <div
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: 1.6
          }}
        >
          Add one more check-in to start seeing trend lines.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "260px", display: "block" }}
        >
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#dbe4ea"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#7b8794"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
          />
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
          />

          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            points={makePoints("craving")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            points={makePoints("stress")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={makePoints("sleep")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {data.map((d, i) => (
            <g key={`${d.date}-${i}`}>
              <circle cx={getX(i)} cy={getY(d.craving)} r="4" fill="#ef4444" />
              <circle cx={getX(i)} cy={getY(d.stress)} r="4" fill="#f59e0b" />
              <circle cx={getX(i)} cy={getY(d.sleep)} r="4" fill="#3b82f6" />

              <text
                x={getX(i)}
                y={height - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#7b8794"
              >
                {d.date}
              </text>
            </g>
          ))}
        </svg>
      )}

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "13px",
          color: "#64748b",
          marginTop: "8px"
        }}
      >
        <span>🔴 Craving</span>
        <span>🟠 Stress</span>
        <span>🔵 Sleep</span>
      </div>
    </div>
  );
}

export default SobrietyTrendChart;