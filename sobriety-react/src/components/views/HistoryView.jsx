function HistoryView({ mockDashboardData, pillStyle, smallCardStyle }) {
  return (
    <>
      <div>
        <div style={pillStyle}>📈 History</div>
        <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0" }}>
          Recent check-ins
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "17px" }}>
          Review your recent patterns and progress.
        </p>
      </div>

      <div
        style={{
          marginTop: "22px",
          display: "grid",
          gap: "14px"
        }}
      >
        {mockDashboardData.recentCheckins.map((entry) => (
          <div key={entry.date} style={smallCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: "700" }}>{entry.date}</div>
              <div style={{ textTransform: "capitalize", color: "#6b7280" }}>
                {entry.risk} risk
              </div>
            </div>
            <div style={{ marginTop: "10px", color: "#374151" }}>
              Mood: {entry.mood} · Stress: {entry.stress} · Craving:{" "}
              {entry.craving}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HistoryView;