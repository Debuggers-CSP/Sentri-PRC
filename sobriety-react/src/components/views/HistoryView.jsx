function HistoryView({ dashboardData, pillStyle, smallCardStyle }) {
  const recentCheckins = dashboardData?.recent_checkins || [];

  const getRiskStyle = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return {
          background: "rgba(134, 239, 172, 0.18)",
          color: "#2f6f4f",
          border: "1px solid rgba(134, 239, 172, 0.45)"
        };
      case "medium":
        return {
          background: "rgba(251, 191, 36, 0.14)",
          color: "#9a6700",
          border: "1px solid rgba(251, 191, 36, 0.35)"
        };
      case "high":
        return {
          background: "rgba(248, 113, 113, 0.14)",
          color: "#b45309",
          border: "1px solid rgba(248, 113, 113, 0.3)"
        };
      default:
        return {
          background: "rgba(203, 213, 225, 0.18)",
          color: "#64748b",
          border: "1px solid rgba(203, 213, 225, 0.4)"
        };
    }
  };

  const getSobrietyStyle = (stayedSoberToday) => {
    if (stayedSoberToday === true) {
      return {
        background: "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)",
        color: "#2f4a42",
        border: "1px solid rgba(122, 156, 143, 0.35)",
        label: "Sober"
      };
    }

    if (stayedSoberToday === false) {
      return {
        background: "rgba(248, 113, 113, 0.12)",
        color: "#9f1239",
        border: "1px solid rgba(244, 114, 182, 0.22)",
        label: "Not sober"
      };
    }

    return {
      background: "rgba(203, 213, 225, 0.18)",
      color: "#64748b",
      border: "1px solid rgba(203, 213, 225, 0.4)",
      label: "Unknown"
    };
  };

  return (
    <>
      <div>
        <div style={pillStyle}>📈 History</div>
        <h1
          style={{
            fontSize: "34px",
            margin: "18px 0 8px 0",
            color: "#24323d",
            letterSpacing: "-0.02em"
          }}
        >
          Recent check-ins
        </h1>
        <p style={{ margin: 0, color: "#667685", fontSize: "17px" }}>
          Review your recent patterns and progress.
        </p>
      </div>

      <div
        style={{
          marginTop: "22px",
          display: "grid",
          gap: "14px"
        }}
      >
        {recentCheckins.length === 0 ? (
          <div style={smallCardStyle}>
            <div style={{ fontWeight: "700", marginBottom: "8px", color: "#24323d" }}>
              No check-ins yet
            </div>
            <div style={{ color: "#70808e" }}>
              Your recent check-ins will appear here once you start submitting
              them.
            </div>
          </div>
        ) : (
          recentCheckins.map((entry, index) => {
            const riskStyle = getRiskStyle(entry.risk_level);
            const sobrietyStyle = getSobrietyStyle(entry.stayed_sober_today);

            return (
              <div
                key={entry.id || `${entry.date}-${index}`}
                style={{
                  ...smallCardStyle,
                  padding: "14px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ fontWeight: "700", color: "#24323d" }}>
                    {entry.date || "Unknown date"}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        ...riskStyle
                      }}
                    >
                      {(entry.risk_level || "unknown").replace("_", " ")} risk
                    </div>

                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                        ...sobrietyStyle
                      }}
                    >
                      {sobrietyStyle.label}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    color: "#475569",
                    lineHeight: "1.6",
                    fontSize: "15px"
                  }}
                >
                  Mood: {entry.mood_score ?? "—"} · Stress: {entry.stress_score ?? "—"} ·
                  Craving: {entry.craving_score ?? "—"} · Sleep: {entry.sleep_hours ?? "—"}h
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    color: "#70808e",
                    fontSize: "14px",
                    display: "flex",
                    gap: "14px",
                    flexWrap: "wrap"
                  }}
                >
                  <span>Points earned: {entry.points_earned ?? 0}</span>
                  <span>
                    Meeting: {entry.attended_meeting ? "Yes" : "No"}
                  </span>
                  <span>
                    Exercise: {entry.exercise_done ? "Yes" : "No"}
                  </span>
                </div>

                {entry.journal_note && entry.journal_note.trim() && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(214, 223, 230, 0.85)",
                      color: "#526171",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#334155" }}>
                      Reflection:
                    </span>{" "}
                    {entry.journal_note}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default HistoryView;