function HomeView({ mockDashboardData, pillStyle, smallCardStyle, setActiveView }) {
  return (
    <>
      <div>
        <div style={pillStyle}>🌿 Daily Growth Mode</div>
        <h1 style={{ fontSize: "38px", margin: "18px 0 8px 0" }}>
          Welcome back, {mockDashboardData.userName}
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "18px" }}>
          Track your progress, protect your streak, and grow your recovery
          garden.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "22px",
          alignItems: "center",
          marginTop: "22px"
        }}
      >
        <div
          style={{
            height: "100%",
            minHeight: "380px",
            borderRadius: "28px",
            background:
              "radial-gradient(circle at center, #ffffff 0%, #f8fafc 55%, #eef2ff 100%)",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          <div
            style={{
              width: "340px",
              height: "340px",
              borderRadius: "50%",
              border: "10px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.6)"
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌱</div>
            <div style={{ fontSize: "18px", color: "#6b7280", marginBottom: "4px" }}>
              Garden Level
            </div>
            <div style={{ fontSize: "34px", fontWeight: "700" }}>
              {mockDashboardData.garden.levelName}
            </div>
            <div style={{ marginTop: "14px", color: "#6b7280" }}>
              XP {mockDashboardData.garden.xp} /{" "}
              {mockDashboardData.garden.xpToNextLevel}
            </div>
            <div
              style={{
                width: "180px",
                height: "10px",
                borderRadius: "999px",
                background: "#e5e7eb",
                marginTop: "12px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${
                    (mockDashboardData.garden.xp /
                      mockDashboardData.garden.xpToNextLevel) *
                    100
                  }%`,
                  height: "100%",
                  background: "#86efac",
                  borderRadius: "999px"
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Next Milestone</div>
            <div style={{ fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>
              {mockDashboardData.nextMilestone.days} days
            </div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>
              {mockDashboardData.nextMilestone.daysRemaining} days to go
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Today’s Encouragement
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                lineHeight: 1.45,
                fontWeight: "600"
              }}
            >
              {mockDashboardData.encouragementMessage}
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Suggested Action
            </div>
            <div style={{ marginTop: "10px", fontSize: "17px" }}>
              Check in today to earn points and water your garden.
            </div>
            <button
              onClick={() => setActiveView("checkin")}
              style={{
                marginTop: "14px",
                padding: "12px 18px",
                borderRadius: "14px",
                border: "none",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              Open Check-In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeView;