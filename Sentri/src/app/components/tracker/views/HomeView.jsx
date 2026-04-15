function HomeView({ dashboardData, pillStyle, smallCardStyle, setActiveView, streakLabel = "Sobriety Streak" }) {
  const profile = dashboardData?.profile || {};
  const garden = dashboardData?.garden || {};
  const nextMilestone = dashboardData?.next_milestone || {};

  const userName = profile.name || profile.username || "there";

  const gardenLabel = garden.label || "Young Sprout";
  const gardenLevel = garden.level ?? 1;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 100;

  const currentStreakDays = profile.current_streak_days ?? 0;

  const milestoneDays = nextMilestone.days ?? "—";
  const milestoneDaysRemaining = nextMilestone.days_remaining ?? "—";

  const mlRiskLevel = dashboardData?.ml_risk_level || "unknown";
  const mlRiskScore = dashboardData?.ml_risk_score;
  const mlSupportMessage = dashboardData?.ml_support_message || "Keep checking in daily.";
  const mlSuggestedAction = dashboardData?.ml_suggested_action || "Open Check-In";

  const progressPercent = xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenEmoji = (level) => {
    if (level >= 10) return "🌳";
    if (level >= 7) return "🌸";
    if (level >= 4) return "🌿";
    if (level >= 2) return "🪴";
    return "🌱";
  };

  const getMlRiskBadgeStyle = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return {
          background: "#E8F5E9",
          color: "#005A2C",
          border: "1px solid #A3D977",
          label: "Support need: low"
        };
      case "medium":
        return {
          background: "#F2F7E9",
          color: "#356020",
          border: "1px solid #C9E59D",
          label: "Support need: medium"
        };
      case "high":
        return {
          background: "#FFF5EC",
          color: "#8D4C08",
          border: "1px solid #F6CF9F",
          label: "Support need: high"
        };
      default:
        return {
          background: "#EEF6EA",
          color: "#5A7462",
          border: "1px solid #DCEAD8",
          label: "Support need: unknown"
        };
    }
  };

  const mlRiskBadge = getMlRiskBadgeStyle(mlRiskLevel);

  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
  const nextTimelineMilestone = milestones.find((m) => currentStreakDays < m) ?? milestones[milestones.length - 1];

  return (
    <>
      <div>
        <div style={pillStyle}>🌿 Daily Growth Mode</div>
        <h1
          style={{
            fontSize: "clamp(30px, 3vw, 40px)",
            margin: "12px 0 6px 0",
            lineHeight: 1.08,
            color: "#005A2C",
            letterSpacing: "-0.02em"
          }}
        >
          Welcome back, {userName}
        </h1>
        <p
          style={{
            margin: 0,
            color: "#5A7462",
            fontSize: "clamp(15px, 1.4vw, 18px)",
            maxWidth: "620px",
            lineHeight: 1.35
          }}
        >
          Your digital wellness sanctuary is here to support recovery, reflection, and steady growth.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 240px minmax(320px, 360px)",
          gap: "14px",
          alignItems: "stretch",
          marginTop: "14px",
          minHeight: 0
        }}
      >
        <div />

        <div
          style={{
            height: "100%",
            minHeight: 0,
            borderRadius: "30px",
            background: "radial-gradient(circle at center, #ffffff 0%, #f3f9ee 58%, #e8f5e9 100%)",
            border: "1px solid #E0EADD",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 12px 28px rgba(0, 90, 44, 0.09)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            position: "relative",
            padding: "12px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: "180px",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "8px solid #E8F5E9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              boxShadow: "0 12px 30px rgba(0, 90, 44, 0.1)",
              padding: "14px",
              textAlign: "center",
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginBottom: "6px" }}>{getGardenEmoji(gardenLevel)}</div>
            <div
              style={{
                fontSize: "clamp(14px, 1.7vw, 18px)",
                color: "#5A7462",
                marginBottom: "4px"
              }}
            >
              Garden Level
            </div>
            <div
              style={{
                fontSize: "clamp(20px, 2.4vw, 26px)",
                fontWeight: "700",
                lineHeight: 1.02,
                color: "#005A2C"
              }}
            >
              {gardenLabel}
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#5A7462",
                fontSize: "clamp(13px, 1.4vw, 15px)"
              }}
            >
              XP {xp} / {xpToNextLevel}
            </div>
            <div
              style={{
                width: "68%",
                height: "10px",
                borderRadius: "999px",
                background: "#E8F5E9",
                marginTop: "8px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #76B82A 0%, #005A2C 100%)",
                  borderRadius: "999px"
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateRows: "auto auto auto auto auto",
            minHeight: 0
          }}
        >
          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#5A7462", marginBottom: "10px" }}>{streakLabel} timeline</div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {milestones.map((milestone) => {
                const reached = currentStreakDays >= milestone;
                const isNext = milestone === nextTimelineMilestone && !reached;

                return (
                  <div
                    key={milestone}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: isNext ? "1.5px solid #76B82A" : "1px solid #DCEAD8",
                      background: reached
                        ? "linear-gradient(135deg, rgba(118,184,42,0.17) 0%, rgba(0,90,44,0.12) 100%)"
                        : isNext
                        ? "#ffffff"
                        : "#EEF6EA",
                      color: reached ? "#005A2C" : isNext ? "#1F3B2B" : "#5A7462"
                    }}
                  >
                    {milestone}d
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#5A7462" }}>Next Milestone</div>
            <div
              style={{
                fontSize: "clamp(18px, 2.4vw, 26px)",
                fontWeight: "700",
                marginTop: "4px",
                color: "#005A2C",
                lineHeight: 1.05
              }}
            >
              {milestoneDays} days
            </div>
            <div style={{ color: "#5A7462", marginTop: "4px", fontSize: "13px" }}>{milestoneDaysRemaining} days to go</div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#5A7462" }}>Sobriety Streak</div>
            <div
              style={{
                fontSize: "clamp(18px, 2.4vw, 26px)",
                fontWeight: "700",
                marginTop: "4px",
                color: "#005A2C",
                lineHeight: 1.05
              }}
            >
              {currentStreakDays} days
            </div>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, rgba(118,184,42,0.17) 0%, rgba(0,90,44,0.12) 100%)",
                  color: "#005A2C",
                  border: "1px solid #A3D977"
                }}
              >
                Sober today
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  ...mlRiskBadge
                }}
              >
                {mlRiskBadge.label}
              </div>
            </div>

            <div style={{ color: "#5A7462", marginTop: "8px", fontSize: "13px" }}>
              {mlRiskScore !== null && mlRiskScore !== undefined
                ? `AI confidence score: ${mlRiskScore.toFixed(2)}`
                : "AI confidence score unavailable"}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#5A7462" }}>AI Support Insight</div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                lineHeight: 1.28,
                fontWeight: "600",
                color: "#1F3B2B"
              }}
            >
              {mlSupportMessage}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#5A7462" }}>Suggested Action</div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "clamp(13px, 1.3vw, 15px)",
                lineHeight: 1.25,
                color: "#2D5138"
              }}
            >
              {mlSuggestedAction}
            </div>
            <button
              onClick={() => setActiveView("checkin")}
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                borderRadius: "24px",
                border: "none",
                background: "linear-gradient(135deg, #76B82A 0%, #005A2C 100%)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 12px 26px rgba(0, 90, 44, 0.2)"
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