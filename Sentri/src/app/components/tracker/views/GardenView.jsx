function GardenView({ dashboardData, pillStyle, smallCardStyle }) {
  const garden = dashboardData?.garden || {};

  const gardenLabel = garden.label || "Seedling";
  const gardenLevel = garden.level ?? 0;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 40;
  const gardenImage = garden.image || "/assets/garden/stage-1.svg";

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenEmoji = (level) => {
    if (level >= 4) return "🌳";
    if (level >= 3) return "🌸";
    if (level >= 2) return "🌷";
    if (level >= 1) return "🪴";
    return "🌱";
  };

  const nextUnlockLabel =
    gardenLevel >= 4
      ? "Max garden evolution reached"
      : gardenLevel >= 3
      ? "Full tree growth"
      : gardenLevel >= 2
      ? "Blooming flower"
      : gardenLevel >= 1
      ? "Larger healthy plant"
      : "First sprout";

  return (
    <>
      <div>
        <div style={pillStyle}>🌼 Garden</div>
        <h1
          style={{
            fontSize: "34px",
            margin: "18px 0 8px 0",
            color: "#24323d",
            letterSpacing: "-0.02em"
          }}
        >
          Your recovery garden
        </h1>
        <p style={{ margin: 0, color: "#667685", fontSize: "17px" }}>
          Every check-in helps your garden grow.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          marginTop: "22px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "20px",
          minHeight: 0
        }}
      >
        <div
          style={{
            ...smallCardStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(241,247,244,0.88) 58%, rgba(232,240,245,0.9) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 28px rgba(109, 143, 151, 0.06)"
          }}
        >
          <div
            style={{
              width: "min(100%, 260px)",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "8px solid rgba(220, 228, 232, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 10px 30px rgba(109, 143, 151, 0.06)",
              flexShrink: 0
            }}
          >
            <img
              src={gardenImage}
              alt={gardenLabel}
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "block";
              }}
            />
            <div style={{ fontSize: "140px", lineHeight: 1, display: "none" }}>
              {getGardenEmoji(gardenLevel)}
            </div>
          </div>

          <div style={{ marginTop: "14px", color: "#70808e", fontSize: "14px" }}>
            Level {gardenLevel} garden
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#70808e" }}>Current Stage</div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: "700",
                marginTop: "8px",
                color: "#24323d"
              }}
            >
              {gardenLabel}
            </div>
            <div style={{ color: "#70808e", marginTop: "6px" }}>
              Level {gardenLevel}
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#70808e" }}>Growth Progress</div>
            <div
              style={{
                marginTop: "10px",
                color: "#334155",
                fontWeight: "600"
              }}
            >
              XP {xp} / {xpToNextLevel}
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: "rgba(220, 228, 232, 0.9)",
                marginTop: "12px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #89b59f 0%, #8fb7c7 100%)",
                  borderRadius: "999px"
                }}
              />
            </div>

            <div style={{ marginTop: "10px", color: "#70808e", fontSize: "13px" }}>
              Earn XP by checking in, staying sober, and completing healthy habits.
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#70808e" }}>Next Unlock</div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#24323d"
              }}
            >
              {nextUnlockLabel}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GardenView;