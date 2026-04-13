function HomeView({ dashboardData, pillStyle, smallCardStyle, setActiveView, streakLabel = "Sobriety Streak" }) {
  const profile = dashboardData?.profile || {};
  const garden = dashboardData?.garden || {};
  const nextMilestone = dashboardData?.next_milestone || {};

  const userName = profile.name || profile.username || "there";

  const gardenLabel = garden.label || "Seedling";
  const gardenLevel = garden.level ?? 1;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 100;

  const currentStreakDays = profile.current_streak_days ?? 0;

  const milestoneDays = nextMilestone.days ?? "—";
  const milestoneDaysRemaining = nextMilestone.days_remaining ?? "—";

  const mlRiskLevel = dashboardData?.ml_risk_level || "unknown";
  const mlRiskScore = dashboardData?.ml_risk_score;
  const mlSupportMessage =
    dashboardData?.ml_support_message || "Keep checking in daily.";
  const mlSuggestedAction =
    dashboardData?.ml_suggested_action || "Open Check-In";

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenEmoji = (level) => {
    if (level >= 10) return "🌳";
    if (level >= 7) return "🌸";
    if (level >= 4) return "🌷";
    if (level >= 2) return "🪴";
    return "🌱";
  };

  const getMlRiskBadgeStyle = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return {
          background:
            "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)",
          color: "#2f4a42",
          border: "1px solid rgba(122, 156, 143, 0.35)",
          label: "AI risk: low"
        };
      case "medium":
        return {
          background: "rgba(251, 191, 36, 0.14)",
          color: "#9a6700",
          border: "1px solid rgba(251, 191, 36, 0.35)",
          label: "AI risk: medium"
        };
      case "high":
        return {
          background: "rgba(248, 113, 113, 0.14)",
          color: "#b45309",
          border: "1px solid rgba(248, 113, 113, 0.3)",
          label: "AI risk: high"
        };
      default:
        return {
          background: "rgba(203, 213, 225, 0.18)",
          color: "#64748b",
          border: "1px solid rgba(203, 213, 225, 0.4)",
          label: "AI risk: unknown"
        };
    }
  };

  const mlRiskBadge = getMlRiskBadgeStyle(mlRiskLevel);

  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
  const nextTimelineMilestone =
    milestones.find((m) => currentStreakDays < m) ?? milestones[milestones.length - 1];

  return (
    <>
      <div>
        <div style={pillStyle}>🌿 Daily Growth Mode</div>
        <h1
          style={{
            fontSize: "clamp(28px, 3vw, 38px)",
            margin: "12px 0 6px 0",
            lineHeight: 1.08,
            color: "#24323d",
            letterSpacing: "-0.02em"
          }}
        >
          Welcome back, {userName}
        </h1>
        <p
          style={{
            margin: 0,
            color: "#667685",
            fontSize: "clamp(15px, 1.4vw, 18px)",
            maxWidth: "620px",
            lineHeight: 1.35
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
            borderRadius: "28px",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(241,247,244,0.88) 58%, rgba(232,240,245,0.9) 100%)",
            border: "1px solid rgba(214, 223, 230, 0.95)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 28px rgba(109, 143, 151, 0.06)",
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
              border: "8px solid rgba(220, 228, 232, 0.95)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 10px 30px rgba(109, 143, 151, 0.06)",
              padding: "14px",
              textAlign: "center",
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginBottom: "6px" }}>
              {getGardenEmoji(gardenLevel)}
            </div>
            <div
              style={{
                fontSize: "clamp(14px, 1.7vw, 18px)",
                color: "#70808e",
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
                color: "#24323d"
              }}
            >
              {gardenLabel}
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#70808e",
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
                background: "rgba(220, 228, 232, 0.9)",
                marginTop: "8px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #89b59f 0%, #8fb7c7 100%)",
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
            <div style={{ fontSize: "12px", color: "#70808e", marginBottom: "10px" }}>
              {streakLabel} timeline
            </div>

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
                      border: isNext
                        ? "1.5px solid rgba(122, 156, 143, 0.95)"
                        : "1px solid rgba(209, 218, 225, 0.95)",
                      background: reached
                        ? "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)"
                        : isNext
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(203, 213, 225, 0.18)",
                      color: reached ? "#2f4a42" : isNext ? "#334155" : "#70808e"
                    }}
                  >
                    {milestone}d
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#70808e" }}>
              Next Milestone
            </div>
            <div
              style={{
                fontSize: "clamp(18px, 2.4vw, 26px)",
                fontWeight: "700",
                marginTop: "4px",
                color: "#24323d",
                lineHeight: 1.05
              }}
            >
              {milestoneDays} days
            </div>
            <div style={{ color: "#70808e", marginTop: "4px", fontSize: "13px" }}>
              {milestoneDaysRemaining} days to go
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#70808e" }}>
              Sobriety Streak
            </div>
            <div
              style={{
                fontSize: "clamp(18px, 2.4vw, 26px)",
                fontWeight: "700",
                marginTop: "4px",
                color: "#24323d",
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
                  background:
                    "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)",
                  color: "#2f4a42",
                  border: "1px solid rgba(122, 156, 143, 0.35)"
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

            <div style={{ color: "#70808e", marginTop: "8px", fontSize: "13px" }}>
              {mlRiskScore !== null && mlRiskScore !== undefined
                ? `AI confidence score: ${mlRiskScore.toFixed(2)}`
                : "AI confidence score unavailable"}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#70808e" }}>
              AI Support Insight
            </div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                lineHeight: 1.28,
                fontWeight: "600",
                color: "#334155"
              }}
            >
              {mlSupportMessage}
            </div>
          </div>

          <div style={{ ...smallCardStyle, padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#70808e" }}>
              Suggested Action
            </div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "clamp(13px, 1.3vw, 15px)",
                lineHeight: 1.25,
                color: "#475569"
              }}
            >
              {mlSuggestedAction}
            </div>
            <button
              onClick={() => setActiveView("checkin")}
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(180deg, #7ba08e 0%, #6d8f97 100%)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 10px 22px rgba(109, 143, 151, 0.18)"
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