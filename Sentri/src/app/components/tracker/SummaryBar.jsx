function SummaryBar({ dashboardData, currentUser, summaryBarStyle, summaryCardStyle }) {
  const profile = dashboardData?.profile || {};

  const userName = currentUser?.name || currentUser?.uid || "User";
  const sobrietyStreakDays = profile.current_streak_days ?? 0;
  const totalPoints = profile.total_points ?? 0;
  const supportLevel = dashboardData?.ml_risk_level || "unknown";

  return (
    <div style={summaryBarStyle}>
      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>User</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {userName}
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Sobriety Streak</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {sobrietyStreakDays} days
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Points</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {totalPoints}
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>AI Support Level</div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginTop: "4px",
            textTransform: "capitalize"
          }}
        >
          {supportLevel.replace("_", " ")}
        </div>
      </div>
    </div>
  );
}

export default SummaryBar;