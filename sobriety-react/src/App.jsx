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
    position: "relative"
  };

  const mainPanelStyle = {
    width: "min(1120px, 88vw)",
    height: "min(760px, 90vh)",
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
    right: "20px",
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

    await handleLogin({ uid, password });
  };

  const displayData = dashboardData
    ? {
        rewards: []
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