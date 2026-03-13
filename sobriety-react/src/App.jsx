import { useState } from "react";

function App() {
  const [activeView, setActiveView] = useState("home");

  const mockDashboardData = {
    userName: "Max",
    sobrietyStreakDays: 12,
    checkinStreakDays: 5,
    totalPoints: 140,
    supportLevel: "medium",
    garden: {
      level: 1,
      levelName: "Sprout",
      xp: 20,
      xpToNextLevel: 50
    },
    nextMilestone: {
      days: 14,
      daysRemaining: 2
    },
    encouragementMessage:
      "Today may be heavier than usual. Lean into your support system.",
    rewards: [
      { name: "$5 Coffee Gift Card", pointsCost: 100, unlocked: true },
      { name: "$10 Bookstore Gift Card", pointsCost: 250, unlocked: false },
      { name: "$15 Smoothie Gift Card", pointsCost: 350, unlocked: false }
    ],
    recentCheckins: [
      { date: "2026-03-10", mood: 7, stress: 5, craving: 4, risk: "low" },
      { date: "2026-03-11", mood: 6, stress: 7, craving: 5, risk: "medium" },
      { date: "2026-03-12", mood: 5, stress: 8, craving: 7, risk: "medium" }
    ]
  };

  const appStyle = {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    background:
      "linear-gradient(180deg, #f4f8f4 0%, #eef4ff 45%, #f8f7ff 100%)",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
    position: "relative"
  };

  const shellStyle = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative"
  };

  const mainPanelStyle = {
    width: "min(1100px, 88vw)",
    height: "min(760px, 90vh)",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "32px",
    boxShadow: "0 20px 60px rgba(31, 41, 55, 0.10)",
    backdropFilter: "blur(14px)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 28px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden"
  };

  const summaryBarStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
    gap: "14px",
    marginBottom: "20px"
  };

  const summaryCardStyle = {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "20px",
    padding: "14px 16px",
    minHeight: "76px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(31, 41, 55, 0.04)"
  };

  const contentAreaStyle = {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    overflow: "hidden"
  };

  const centerCardStyle = {
    flex: 1,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "28px",
    padding: "28px",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative"
  };

  const sideNavStyle = {
    position: "absolute",
    right: "32px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    zIndex: 2
  };

  const getNavButtonStyle = (view) => ({
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    border: activeView === view ? "2px solid #111827" : "1px solid #e5e7eb",
    background: activeView === view ? "#111827" : "rgba(255,255,255,0.92)",
    color: activeView === view ? "#ffffff" : "#111827",
    fontSize: "26px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(31, 41, 55, 0.08)"
  });

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#f3f4f6",
    fontSize: "14px",
    color: "#4b5563"
  };

  const smallCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px"
  };

  function renderHomeView() {
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

  function renderCheckinView() {
    return (
      <>
        <div>
          <div style={pillStyle}>📝 Daily Check-In</div>
          <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0" }}>
            How are you feeling today?
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "17px" }}>
            Keep this quick, honest, and judgment-free.
          </p>
        </div>

        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            alignContent: "start"
          }}
        >
          {[
            "Mood Score",
            "Stress Score",
            "Craving Score",
            "Sleep Hours"
          ].map((label) => (
            <div key={label} style={smallCardStyle}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
                {label}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  fontSize: "16px"
                }}
              />
            </div>
          ))}

          <div style={smallCardStyle}>
            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="checkbox" />
              Attended a meeting
            </label>
          </div>

          <div style={smallCardStyle}>
            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="checkbox" />
              Exercised today
            </label>
          </div>

          <div style={{ ...smallCardStyle, gridColumn: "1 / span 2" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
              Journal Note
            </label>
            <textarea
              rows="5"
              placeholder="Write a short reflection..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box",
                fontSize: "15px",
                resize: "none"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
          <button
            style={{
              padding: "14px 22px",
              borderRadius: "16px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Submit Check-In
          </button>
        </div>
      </>
    );
  }

  function renderGardenView() {
    return (
      <>
        <div>
          <div style={pillStyle}>🌼 Garden</div>
          <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0" }}>
            Your recovery garden
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "17px" }}>
            Every check-in helps your garden grow.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            marginTop: "22px",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "20px"
          }}
        >
          <div
            style={{
              ...smallCardStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "160px"
            }}
          >
            🌷
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={smallCardStyle}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Current Level</div>
              <div style={{ fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>
                {mockDashboardData.garden.levelName}
              </div>
            </div>

            <div style={smallCardStyle}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Growth Progress</div>
              <div style={{ marginTop: "10px" }}>
                XP {mockDashboardData.garden.xp} /{" "}
                {mockDashboardData.garden.xpToNextLevel}
              </div>
            </div>

            <div style={smallCardStyle}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Next Unlock</div>
              <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>
                Blooming Plant
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderRewardsView() {
    return (
      <>
        <div>
          <div style={pillStyle}>🎁 Rewards</div>
          <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0" }}>
            Redeem your points
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "17px" }}>
            Small wins deserve visible rewards.
          </p>
        </div>

        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px"
          }}
        >
          {mockDashboardData.rewards.map((reward) => (
            <div
              key={reward.name}
              style={{
                ...smallCardStyle,
                background: reward.unlocked ? "#ecfdf5" : "#f8fafc"
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: "700" }}>{reward.name}</div>
              <div style={{ color: "#6b7280", marginTop: "8px" }}>
                Cost: {reward.pointsCost} points
              </div>
              <div style={{ marginTop: "12px", fontWeight: "600" }}>
                {reward.unlocked ? "Unlocked" : "Locked"}
              </div>
              <button
                style={{
                  marginTop: "14px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: reward.unlocked ? "#111827" : "#d1d5db",
                  color: reward.unlocked ? "white" : "#6b7280",
                  cursor: reward.unlocked ? "pointer" : "not-allowed"
                }}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderHistoryView() {
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

  function renderActiveView() {
    switch (activeView) {
      case "checkin":
        return renderCheckinView();
      case "garden":
        return renderGardenView();
      case "rewards":
        return renderRewardsView();
      case "history":
        return renderHistoryView();
      case "home":
      default:
        return renderHomeView();
    }
  }

  const navItems = [
    { key: "home", icon: "🏠", label: "Home" },
    { key: "checkin", icon: "📝", label: "Check-In" },
    { key: "garden", icon: "🌱", label: "Garden" },
    { key: "rewards", icon: "🎁", label: "Rewards" },
    { key: "history", icon: "📈", label: "History" }
  ];

  return (
    <div style={appStyle}>
      <div style={shellStyle}>
        <div style={mainPanelStyle}>
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

          <div style={contentAreaStyle}>{renderActiveView()}</div>
        </div>

        <div style={sideNavStyle}>
          {navItems.map((item) => (
            <button
              key={item.key}
              title={item.label}
              onClick={() => setActiveView(item.key)}
              style={getNavButtonStyle(item.key)}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;