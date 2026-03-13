function CheckinView({ pillStyle, smallCardStyle }) {
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
        {["Mood Score", "Stress Score", "Craving Score", "Sleep Hours"].map(
          (label) => (
            <div key={label} style={smallCardStyle}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600"
                }}
              >
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
          )
        )}

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
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600"
            }}
          >
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

export default CheckinView;