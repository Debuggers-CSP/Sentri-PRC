function HistoryView({ dashboardData, pillStyle, smallCardStyle }) {
  const recentCheckins = dashboardData?.recent_checkins || [];

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
        {recentCheckins.length === 0 ? (
          <div style={smallCardStyle}>
            <div style={{ fontWeight: "700", marginBottom: "8px" }}>
              No check-ins yet
            </div>
            <div style={{ color: "#6b7280" }}>
              Your recent check-ins will appear here once you start submitting
              them.
            </div>
          </div>
        ) : (
          recentCheckins.map((entry, index) => (
            <div
              key={entry.id || `${entry.date}-${index}`}
              style={smallCardStyle}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap"
                }}
              >
                <div style={{ fontWeight: "700" }}>
                  {entry.date || "Unknown date"}
                </div>
                <div style={{ textTransform: "capitalize", color: "#6b7280" }}>
                  {(entry.risk_level || "unknown").replace("_", " ")} risk
                </div>
              </div>

              <div style={{ marginTop: "10px", color: "#374151", lineHeight: "1.6" }}>
                Mood: {entry.mood ?? "—"} · Stress: {entry.stress ?? "—"} ·
                Craving: {entry.craving ?? "—"}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  color: "#6b7280",
                  fontSize: "14px"
                }}
              >
                Points earned: {entry.points_earned ?? 0}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default HistoryView;