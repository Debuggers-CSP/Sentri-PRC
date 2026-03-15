function HomeView({ dashboardData, pillStyle, smallCardStyle, setActiveView }) {
  const profile = dashboardData?.profile || {};
  const garden = dashboardData?.garden || {};
  const nextMilestone = dashboardData?.next_milestone || {};
  const recentCheckins = dashboardData?.recent_checkins || [];

  const userName = profile.name || profile.username || "there";

  const gardenLabel = garden.label || "Seedling";
  const gardenLevel = garden.level ?? 1;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 100;

  const latestCheckin = recentCheckins.length > 0 ? recentCheckins[0] : null;
  const latestRiskLevel = latestCheckin?.risk_level || "unknown";

  const currentStreakDays = profile.current_streak_days ?? 0;

  const milestoneDays = nextMilestone.days ?? "—";
  const milestoneDaysRemaining = nextMilestone.days_remaining ?? "—";

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getEncouragementMessage = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return "You’re building steady momentum. Keep protecting what is working.";
      case "medium":
        return "Stay grounded and focus on one stabilizing action today.";
      case "high":
        return "Keep today small and gentle. Reach for support early.";
      default:
        return "Every check-in is a step forward.";
    }
  };

  const getSuggestedAction = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return "Keep momentum going with another healthy routine today.";
      case "medium":
        return "Pause, reset, hydrate, and reduce friction around triggers.";
      case "high":
        return "Take one low-effort coping step right now and reach out if needed.";
      default:
        return "Check in today to earn points and water your garden.";
    }
  };

  const getGardenEmoji = (level) => {
    if (level >= 10) return "🌳";
    if (level >= 7) return "🌸";
    if (level >= 4) return "🌷";
    if (level >= 2) return "🪴";
    return "🌱";
  };

  return (
    <>
      <div>
        <div style={pillStyle}>🌿 Daily Growth Mode</div>
        <h1
          style={{
            fontSize: "clamp(28px, 3vw, 38px)",
            margin: "16px 0 8px 0",
            lineHeight: 1.1
          }}
        >
          Welcome back, {userName}
        </h1>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "clamp(15px, 1.4vw, 18px)",
            maxWidth: "560px"
          }}
        >
          Track your progress, protect your streak, and grow your recovery
          garden.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(260px, 0.8fr)",
          gap: "18px",
          alignItems: "stretch",
          marginTop: "18px",
          minHeight: 0
        }}
      >
        <div
          style={{
            height: "100%",
            minHeight: 0,
            borderRadius: "28px",
            background:
              "radial-gradient(circle at center, #ffffff 0%, #f8fafc 55%, #eef2ff 100%)",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            position: "relative",
            padding: "18px"
          }}
        >
          <div
            style={{
              width: "min(100%, 300px)",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "8px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.6)",
              padding: "20px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "clamp(34px, 5vw, 48px)", marginBottom: "10px" }}>
              {getGardenEmoji(gardenLevel)}
            </div>
            <div
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "#6b7280",
                marginBottom: "4px"
              }}
            >
              Garden Level
            </div>
            <div
              style={{
                fontSize: "clamp(28px, 4vw, 34px)",
                fontWeight: "700",
                lineHeight: 1.1
              }}
            >
              {gardenLabel}
            </div>
            <div
              style={{
                marginTop: "12px",
                color: "#6b7280",
                fontSize: "clamp(13px, 1.5vw, 16px)"
              }}
            >
              XP {xp} / {xpToNextLevel}
            </div>
            <div
              style={{
                width: "70%",
                height: "10px",
                borderRadius: "999px",
                background: "#e5e7eb",
                marginTop: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#86efac",
                  borderRadius: "999px"
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateRows: "repeat(4, minmax(0, 1fr))",
            minHeight: 0
          }}
        >
          <div style={{ ...smallCardStyle, padding: "14px" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Next Milestone</div>
            <div style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: "700", marginTop: "6px" }}>
              {milestoneDays} days
            </div>
            <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "15px" }}>
              {milestoneDaysRemaining} days to go
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "14px" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Current Streak</div>
            <div style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: "700", marginTop: "6px" }}>
              {currentStreakDays} days
            </div>
            <div style={{ color: "#6b7280", marginTop: "4px", fontSize: "15px" }}>
              Latest support level: {latestRiskLevel.replace("_", " ")}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "14px" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              Today’s Encouragement
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "clamp(16px, 1.8vw, 18px)",
                lineHeight: 1.35,
                fontWeight: "600"
              }}
            >
              {getEncouragementMessage(latestRiskLevel)}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "14px" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              Suggested Action
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "clamp(15px, 1.6vw, 17px)",
                lineHeight: 1.35
              }}
            >
              {getSuggestedAction(latestRiskLevel)}
            </div>
            <button
              onClick={() => setActiveView("checkin")}
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                borderRadius: "14px",
                border: "none",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "14px"
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