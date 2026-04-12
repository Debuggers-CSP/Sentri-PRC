function MilestoneTimeline({ currentStreakDays, milestones, smallCardStyle }) {
  const nextMilestone =
    milestones.find((m) => currentStreakDays < m) ?? milestones[milestones.length - 1];

  return (
    <div style={{ ...smallCardStyle, padding: "16px" }}>
      <div style={{ fontSize: "14px", color: "#70808e", marginBottom: "12px" }}>
        Sobriety milestone timeline
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {milestones.map((milestone) => {
          const reached = currentStreakDays >= milestone;
          const isNext = milestone === nextMilestone && !reached;

          return (
            <div
              key={milestone}
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "600",
                border: isNext
                  ? "1.5px solid rgba(122, 156, 143, 0.95)"
                  : "1px solid rgba(209, 218, 225, 0.95)",
                background: reached
                  ? "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)"
                  : isNext
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(203, 213, 225, 0.18)",
                color: reached ? "#2f4a42" : isNext ? "#334155" : "#70808e"
              }}
            >
              {milestone}d
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MilestoneTimeline;