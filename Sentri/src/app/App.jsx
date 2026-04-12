import { useEffect, useState } from "react";
import SideNav from "./components/tracker/SideNav";
import SummaryBar from "./components/tracker/SummaryBar";
import HomeView from "./components/tracker/views/HomeView";
import CheckinView from "./components/tracker/views/CheckinView";
import GardenView from "./components/tracker/views/GardenView";
import RewardsView from "./components/tracker/views/RewardsView";
import HistoryView from "./components/tracker/views/HistoryView";

function App() {
  const [activeView, setActiveView] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const DESIGN_WIDTH = 1120;
  const DESIGN_HEIGHT = 760;
  const horizontalPadding = 48;
  const verticalPadding = 48;
  const navReserve = 110; // room for right-side nav

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const scale = Math.min(
    (viewport.width - horizontalPadding - navReserve) / DESIGN_WIDTH,
    (viewport.height - verticalPadding) / DESIGN_HEIGHT,
    1
  );

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const API_BASE = "http://localhost:8587/api";

  const placeholderUser = {
    id: 1,
    uid: "guest_user",
    name: "Guest User"
  };

  const placeholderDashboard = {
    profile: {
      streak_days: 5,
      total_points: 120,
      garden_level: 2,
      garden_xp: 45
    },
    garden: {
      level: 2,
      label: "Sprouting Garden",
      xp: 45,
      xp_to_next_level: 30
    },
    next_milestone: {
      days: 7,
      label: "7-Day Streak"
    },
    recent_checkins: [
      {
        date: "2026-04-10",
        mood: 4,
        stress: 2,
        craving: 1,
        sleep_hours: 8,
        risk_level: "low",
        points_earned: 20
      },
      {
        date: "2026-04-09",
        mood: 3,
        stress: 3,
        craving: 2,
        sleep_hours: 7,
        risk_level: "medium",
        points_earned: 15
      },
      {
        date: "2026-04-08",
        mood: 5,
        stress: 1,
        craving: 1,
        sleep_hours: 8,
        risk_level: "low",
        points_earned: 18
      }
    ],
    rewards: []
  };

  const appStyle = {
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
    background:
      "linear-gradient(180deg, #edf5f1 0%, #eef4f7 45%, #f4f6fb 100%)",
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    color: "#22313f",
    position: "relative"
  };

  const shellStyle = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden"
  };

  const mainPanelStyle = {
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.75)",
    borderRadius: "36px",
    boxShadow: "0 20px 60px rgba(80, 108, 119, 0.12)",
    backdropFilter: "blur(18px)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 24px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden"
  };

  const scaledPanelWrapStyle = {
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
    position: "relative",
    flexShrink: 0
  };

  const summaryBarStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr auto",
    gap: "14px",
    marginBottom: "20px"
  };

  const summaryCardStyle = {
    background: "rgba(255,255,255,0.58)",
    border: "1px solid rgba(210, 220, 228, 0.9)",
    borderRadius: "22px",
    padding: "14px 16px",
    minHeight: "76px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(96, 122, 133, 0.06)"
  };

  const contentAreaStyle = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    overflow: "hidden"
  };

  const sideNavStyle = {
    position: "absolute",
    right: "-88px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: 2
  };

  const getNavButtonStyle = (view) => ({
    width: "62px",
    height: "62px",
    borderRadius: "20px",
    border:
      activeView === view
        ? "1.5px solid rgba(122, 156, 143, 0.95)"
        : "1px solid rgba(220, 228, 234, 0.95)",
    background:
      activeView === view
        ? "linear-gradient(180deg, #7ba08e 0%, #6d8f97 100%)"
        : "rgba(255,255,255,0.76)",
    color: activeView === view ? "#ffffff" : "#51626f",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow:
      activeView === view
        ? "0 10px 24px rgba(109, 143, 151, 0.18)"
        : "0 8px 18px rgba(96, 122, 133, 0.05)",
    transition: "all 0.18s ease"
  });

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(233, 240, 236, 0.95)",
    border: "1px solid rgba(209, 222, 215, 0.9)",
    fontSize: "14px",
    color: "#5b6f68",
    fontWeight: "500"
  };

  const smallCardStyle = {
    background: "rgba(255,255,255,0.52)",
    border: "1px solid rgba(214, 223, 230, 0.95)",
    borderRadius: "22px",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(96, 122, 133, 0.05)"
  };

  const logoutButtonStyle = {
    padding: "12px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(214, 223, 230, 0.95)",
    background: "rgba(255,255,255,0.7)",
    color: "#334155",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    boxShadow: "0 8px 20px rgba(96, 122, 133, 0.05)"
  };

  const loadDashboard = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/sobriety/dashboard/${userId}`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Using placeholder dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setDashboardData(placeholderDashboard);
    }
  };

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError("");

      // For now, always use placeholder user so the app can render
      setCurrentUser(placeholderUser);

      // Try loading real dashboard data later if backend is ready,
      // otherwise fall back to placeholder data
      await loadDashboard(placeholderUser.id);
    } catch (err) {
      setCurrentUser(placeholderUser);
      setDashboardData(placeholderDashboard);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleLogout = () => {
    // Placeholder logout behavior for now
    setCurrentUser(placeholderUser);
    setDashboardData(placeholderDashboard);
    setActiveView("home");
    setError("");
  };

  const handleSubmitCheckin = async (formData) => {
    if (!currentUser) return;

    try {
      setError("");

      // Placeholder behavior: just prepend a fake check-in locally
      const newCheckin = {
        date: new Date().toISOString().slice(0, 10),
        mood: formData.mood ?? 3,
        stress: formData.stress ?? 3,
        craving: formData.craving ?? 2,
        sleep_hours: formData.sleep_hours ?? 7,
        risk_level: "low",
        points_earned: 10
      };

      setDashboardData((prev) => {
        const safePrev = prev || placeholderDashboard;
        return {
          ...safePrev,
          recent_checkins: [newCheckin, ...(safePrev.recent_checkins || [])],
          profile: {
            ...(safePrev.profile || {}),
            total_points: (safePrev.profile?.total_points || 0) + 10
          }
        };
      });

      setActiveView("home");
    } catch (err) {
      setError("Failed to submit check-in");
      throw err;
    }
  };

  const displayData = dashboardData
    ? {
        ...dashboardData,
        rewards: dashboardData.rewards || []
      }
    : null;

  function renderHomeView() {
    return (
      <HomeView
        dashboardData={dashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
        setActiveView={setActiveView}
      />
    );
  }

  function renderCheckinView() {
    return (
      <CheckinView
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
        onSubmit={handleSubmitCheckin}
      />
    );
  }

  function renderGardenView() {
    return (
      <GardenView
        dashboardData={dashboardData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
      />
    );
  }

  function renderRewardsView() {
    return (
      <RewardsView
        mockDashboardData={displayData}
        pillStyle={pillStyle}
        smallCardStyle={smallCardStyle}
      />
    );
  }

  function renderHistoryView() {
    return (
      <HistoryView
        dashboardData={dashboardData}
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

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading sobriety dashboard...</div>;
  }

  if (!displayData) {
    return <div style={{ padding: "40px" }}>No dashboard data available.</div>;
  }

  return (
    <div style={appStyle}>
      <div style={shellStyle}>
        <div style={scaledPanelWrapStyle}>
          <div style={mainPanelStyle}>
            {error && (
              <div style={{ marginBottom: "12px", color: "crimson" }}>
                {error}
              </div>
            )}

            <div style={summaryBarStyle}>
              <SummaryBar
                dashboardData={dashboardData}
                currentUser={currentUser}
                summaryBarStyle={{ display: "contents" }}
                summaryCardStyle={summaryCardStyle}
              />
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Reset Demo
              </button>
            </div>

            <div style={contentAreaStyle}>{renderActiveView()}</div>
          </div>

          <div style={sideNavStyle}>
            <SideNav
              navItems={navItems}
              activeView={activeView}
              setActiveView={setActiveView}
              getNavButtonStyle={getNavButtonStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;