function GardenView({ dashboardData, pillStyle, smallCardStyle }) {
  const garden = dashboardData?.garden || {};

  const gardenLabel = garden.label || "Young Sprout";
  const gardenLevel = garden.level ?? 0;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 40;
  const gardenImage = garden.image || "/assets/garden/stage-1.svg";

  const progressPercent = xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenEmoji = (level) => {
    if (level >= 4) return "🌳";
    if (level >= 3) return "🌸";
    if (level >= 2) return "🌿";
    if (level >= 1) return "🪴";
    return "🌱";
  };

  const nextUnlockLabel =
    gardenLevel >= 4
      ? "Tree thriving"
      : gardenLevel >= 3
      ? "Full tree"
      : gardenLevel >= 2
      ? "Bloom"
      : gardenLevel >= 1
      ? "Larger plant"
      : "First sprout";

  return (
    <>
      <div>
        <div style={pillStyle}>🌼 Garden</div>
        <h1
          style={{
            fontSize: "clamp(28px,3vw,36px)",
            margin: "14px 0 2px 0",
            color: "#005A2C",
            letterSpacing: "-0.02em",
          }}
        >
          Growth Center
        </h1>
      </div>

      <div
        style={{
          ...smallCardStyle,
          marginTop: "14px",
          padding: "16px",
          background: "radial-gradient(circle at center, #ffffff 0%, #f3f9ee 60%, #e8f5e9 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75), 0 14px 30px rgba(0, 90, 44, 0.08)",
          minHeight: "min(72vh, 700px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: 0 }}>
          <div
            style={{
              width: "min(100%, 620px)",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={gardenImage}
              alt={gardenLabel}
              style={{ width: "min(92%, 540px)", height: "min(92%, 540px)", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "block";
              }}
            />
            <div style={{ fontSize: "220px", lineHeight: 1, display: "none" }}>{getGardenEmoji(gardenLevel)}</div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "18px",
            border: "1px solid #DCEAD8",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(4px)",
            padding: "12px",
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#5A7462" }}>🌱 Stage</span>
            <span style={{ fontWeight: "700", color: "#005A2C" }}>{gardenLabel}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#5A7462" }}>⭐ Progress</span>
            <span style={{ fontWeight: "600", color: "#1F3B2B" }}>
              {xp} / {xpToNextLevel} XP
            </span>
            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "999px",
                background: "#E8F5E9",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #76B82A 0%, #005A2C 100%)",
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#5A7462" }}>🔓 Next Unlock</span>
            <span style={{ fontWeight: "700", color: "#005A2C" }}>{nextUnlockLabel}</span>
            <span style={{ fontSize: "12px", color: "#5A7462" }}>Level {gardenLevel + 1}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default GardenView;