import { useState } from "react";

function LoginView({ onLogin, loading, switchToRegister }) {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const cardStyle = {
    width: "min(460px, 92vw)",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "28px",
    padding: "32px",
    boxSizing: "border-box",
    boxShadow: "0 20px 60px rgba(31, 41, 55, 0.10)"
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    fontSize: "16px",
    marginTop: "8px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "18px",
    opacity: loading ? 0.7 : 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!uid.trim() || !password.trim()) {
      setLocalError("Please enter both username and password.");
      return;
    }

    try {
      await onLogin({
        uid: uid.trim(),
        password
      });
    } catch (err) {
      setLocalError(err.message || "Login failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #f4f8f4 0%, #eef4ff 45%, #f8f7ff 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        boxSizing: "border-box"
      }}
    >
      <form onSubmit={handleSubmit} style={cardStyle}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#f3f4f6",
            fontSize: "14px",
            color: "#4b5563"
          }}
        >
          🌱 Sobriety Tracker
        </div>

        <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0", color: "#111827" }}>
          Welcome back
        </h1>

        <p style={{ margin: 0, color: "#6b7280", fontSize: "16px" }}>
          Log in to continue to your dashboard.
        </p>

        <div style={{ marginTop: "22px" }}>
          <label style={{ display: "block", fontWeight: "600", color: "#374151" }}>
            Username
          </label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your username"
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "block", fontWeight: "600", color: "#374151" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={inputStyle}
          />
        </div>

        {localError && (
          <div style={{ marginTop: "14px", color: "crimson", fontSize: "14px" }}>
            {localError}
          </div>
        )}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={switchToRegister}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginView;