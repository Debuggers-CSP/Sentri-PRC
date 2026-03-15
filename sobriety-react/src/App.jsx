import { useEffect, useState } from "react";
import SideNav from "./components/SideNav";
import SummaryBar from "./components/SummaryBar";
import HomeView from "./components/views/HomeView";
import CheckinView from "./components/views/CheckinView";
import GardenView from "./components/views/GardenView";
import RewardsView from "./components/views/RewardsView";
import HistoryView from "./components/views/HistoryView";
import LoginView from "./components/views/LoginView";
import RegisterView from "./components/views/RegisterView";

function App() {
  const [activeView, setActiveView] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [authView, setAuthView] = useState("login");

  const API_BASE = "http://localhost:8587/api";

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
    overflow: "hidden",
    minHeight: 0
  };

  const summaryBarStyle = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr auto",
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
    minHeight: 0,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: "6px"
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

  const logoutButtonStyle = {
    padding: "12px 16px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "rgba(255,255,255,0.92)",
    color: "#111827",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 8px 20px rgba(31, 41, 55, 0.05)"
  };

  const loadDashboard = async (userId) => {
    const response = await fetch(`${API_BASE}/sobriety/dashboard/${userId}`, {
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load dashboard");
    }

    setDashboardData(data);
  };

  const loadAuthenticatedUser = async () => {
    const response = await fetch(`${API_BASE}/id`, {
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    const data = await response.json();
    setCurrentUser(data);
    return data;
  };

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await loadAuthenticatedUser();
      await loadDashboard(user.id);
    } catch (err) {
      setCurrentUser(null);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleLogin = async ({ uid, password }) => {
    try {
      setAuthLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          uid,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const user = await loadAuthenticatedUser();
      await loadDashboard(user.id);
      setActiveView("home");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError("");

      await fetch(`${API_BASE}/authenticate`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (err) {
      // ignore logout fetch failures and clear local state anyway
    } finally {
      setCurrentUser(null);
      setDashboardData(null);
      setActiveView("home");
    }
  };

  const handleSubmitCheckin = async (formData) => {
    if (!currentUser) return;

    try {
      setError("");

      const response = await fetch(`${API_BASE}/sobriety/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: currentUser.id,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit check-in");
      }

      await loadDashboard(currentUser.id);
      setActiveView("home");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleRegister = async ({ uid, password }) => {
  const response = await fetch(`${API_BASE}/user/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create account");
    }

    // Automatically log in after register
    await handleLogin({ uid, password });
  };

  const displayData = dashboardData
    ? {
        userName: currentUser?.name || "User",
        sobrietyStreakDays: dashboardData.profile?.current_streak_days ?? 0,
        checkinStreakDays: dashboardData.profile?.checkin_streak_days ?? 0,
        totalPoints: dashboardData.profile?.total_points ?? 0,
        supportLevel: dashboardData.recent_checkins?.[0]?.risk_level || "low",
        garden: {
          level: dashboardData.garden?.level ?? 1,
          levelName: dashboardData.garden?.label ?? "Seedling",
          xp: dashboardData.garden?.xp ?? 0,
          xpToNextLevel: 50
        },
        nextMilestone: dashboardData.next_milestone || {},
        encouragementMessage: "Keep going. One day at a time.",
        rewards: [],
        recentCheckins: dashboardData.recent_checkins || []
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

  if (!currentUser) {
    if (authView === "register") {
      return (
        <RegisterView
          onRegister={handleRegister}
          loading={authLoading}
          switchToLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <LoginView
        onLogin={handleLogin}
        loading={authLoading}
        switchToRegister={() => setAuthView("register")}
      />
    );
  }

  if (!displayData) {
    return <div style={{ padding: "40px" }}>No dashboard data available.</div>;
  }

  return (
    <div style={appStyle}>
      <div style={shellStyle}>
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
              summaryBarStyle={{
                display: "contents"
              }}
              summaryCardStyle={summaryCardStyle}
            />
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Log Out
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
  );
}

export default App;