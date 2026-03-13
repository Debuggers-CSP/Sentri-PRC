function SummaryBar({ mockDashboardData, summaryBarStyle, summaryCardStyle }) {
  return (
    <div style={summaryBarStyle}>
      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>User</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {mockDashboardData.userName}
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Sobriety Streak</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {mockDashboardData.sobrietyStreakDays} days
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Points</div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
          {mockDashboardData.totalPoints}
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Support Level</div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginTop: "4px",
            textTransform: "capitalize"
          }}
        >
          {mockDashboardData.supportLevel}
        </div>
      </div>
    </div>
  );
}

export default SummaryBar;