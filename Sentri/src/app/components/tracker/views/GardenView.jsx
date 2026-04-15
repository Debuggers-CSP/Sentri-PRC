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
      ? "Your sanctuary tree is thriving"
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
            color: "#005A2C",
            letterSpacing: "-0.02em"
          }}
        >
          Your recovery garden
        </h1>
        <p style={{ margin: 0, color: "#5A7462", fontSize: "17px" }}>
          Every check-in nourishes a new branch of growth.
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
            background: "radial-gradient(circle at center, #ffffff 0%, #f3f9ee 58%, #e8f5e9 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 12px 28px rgba(0, 90, 44, 0.09)"
          }}
        >
          <div
            style={{
              width: "min(100%, 260px)",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              border: "8px solid #E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              boxShadow: "0 12px 30px rgba(0, 90, 44, 0.1)",
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
            <div style={{ fontSize: "140px", lineHeight: 1, display: "none" }}>{getGardenEmoji(gardenLevel)}</div>
          </div>

          <div style={{ marginTop: "14px", color: "#5A7462", fontSize: "14px" }}>Level {gardenLevel} garden</div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#5A7462" }}>Current Stage</div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: "700",
                marginTop: "8px",
                color: "#005A2C"
              }}
            >
              {gardenLabel}
            </div>
            <div style={{ color: "#5A7462", marginTop: "6px" }}>Level {gardenLevel}</div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#5A7462" }}>Growth Progress</div>
            <div
              style={{
                marginTop: "10px",
                color: "#1F3B2B",
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
                background: "#E8F5E9",
                marginTop: "12px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #76B82A 0%, #005A2C 100%)",
                  borderRadius: "999px"
                }}
              />
            </div>

            <div style={{ marginTop: "10px", color: "#5A7462", fontSize: "13px" }}>
              Earn XP by checking in, staying sober, and completing healthy habits.
            </div>
          </div>

          <div style={smallCardStyle}>
            <div style={{ fontSize: "14px", color: "#5A7462" }}>Next Unlock</div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#005A2C"
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