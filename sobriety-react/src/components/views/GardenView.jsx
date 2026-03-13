function GardenView({ mockDashboardData, pillStyle, smallCardStyle }) {
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

export default GardenView;