import { useState } from "react";

function RegisterView({ onRegister, loading, switchToLogin }) {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    marginTop: "6px"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await onRegister({ uid, password });
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #f4f8f4 0%, #eef4ff 45%, #f8f7ff 100%)"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "420px",
          background: "white",
          padding: "32px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Create Account</h2>

        <label>Username</label>
        <input
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={inputStyle}
        />

        <label style={{ marginTop: "16px", display: "block" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "red", marginTop: "12px" }}>{error}</div>
        )}

        <button
          type="submit"
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "#111827",
            color: "white",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={switchToLogin}
          >
            Log in
          </span>
        </div>
      </form>
    </div>
  );
}

export default RegisterView;