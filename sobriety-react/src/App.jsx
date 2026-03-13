import { useState } from "react";
import SideNav from "./components/SideNav";
import SummaryBar from "./components/SummaryBar";
import HomeView from "./components/views/HomeView";
import CheckinView from "./components/views/CheckinView";
import GardenView from "./components/views/GardenView";
import RewardsView from "./components/views/RewardsView";
import HistoryView from "./components/views/HistoryView";

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
      <HomeView
        mockDashboardData={mockDashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
        setActiveView={setActiveView}
      />
    );
  }

  function renderCheckinView() {
    return <CheckinView pillStyle={pillStyle} smallCardStyle={smallCardStyle} />;
  }

  function renderGardenView() {
    return (
      <GardenView
        mockDashboardData={mockDashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
      />
    );
  }

  function renderRewardsView() {
    return (
      <RewardsView
        mockDashboardData={mockDashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
      />
    );
  }

  function renderHistoryView() {
    return (
      <HistoryView
        mockDashboardData={mockDashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
      />
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
          <SummaryBar
            mockDashboardData={mockDashboardData}
            summaryBarStyle={summaryBarStyle}
            summaryCardStyle={summaryCardStyle}
          />

          <div style={contentAreaStyle}>{renderActiveView()}</div>
        </div>

        <SideNav
          navItems={navItems}
          activeView={activeView}
          setActiveView={setActiveView}
          getNavButtonStyle={getNavButtonStyle}
        />
      </div>
    </div>
  );
}

export default App;