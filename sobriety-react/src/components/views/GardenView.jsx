function GardenView({ dashboardData, pillStyle, smallCardStyle }) {
  const garden = dashboardData?.garden || {};

  const gardenLabel = garden.label || "Seedling";
  const gardenLevel = garden.level ?? 1;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 100;

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenEmoji = (level) => {
    if (level >= 10) return "🌳";
    if (level >= 7) return "🌸";
    if (level >= 4) return "🌷";
    if (level >= 2) return "🪴";
    return "🌱";
  };

  const nextUnlockLabel =
    gardenLevel >= 10
      ? "Max garden evolution reached"
      : gardenLevel >= 7
      ? "Stronger bloom aura"
      : gardenLevel >= 4
      ? "Blooming plant"
      : gardenLevel >= 2
      ? "Bigger leaves"
      : "First sprout";

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
          {getGardenEmoji(gardenLevel)}
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Current Level</div>
            <div style={{ fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>
              {gardenLabel}
            </div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>
              Level {gardenLevel}
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Growth Progress</div>
            <div style={{ marginTop: "10px" }}>
              XP {xp} / {xpToNextLevel}
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: "#e5e7eb",
                marginTop: "12px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#86efac",
                  borderRadius: "999px"
                }}
              />
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Next Unlock</div>
            <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "600" }}>
              {nextUnlockLabel}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GardenView;