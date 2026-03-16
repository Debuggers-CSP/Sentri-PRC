function RewardsView({ mockDashboardData, pillStyle, smallCardStyle }) {
  const rewards = mockDashboardData?.rewards || [];

  return (
    <>
      <div>
        <div style={pillStyle}>🎁 Rewards</div>
        <h1
          style={{
            fontSize: "34px",
            margin: "18px 0 8px 0",
            color: "#24323d",
            letterSpacing: "-0.02em"
          }}
        >
          Redeem your points
        </h1>
        <p style={{ margin: 0, color: "#667685", fontSize: "17px" }}>
          Small wins deserve visible rewards.
        </p>
      </div>

      <div
        style={{
          marginTop: "22px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px"
        }}
      >
        {rewards.length === 0 ? (
          <>
            <div
              style={{
                ...smallCardStyle,
                gridColumn: "1 / -1"
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#24323d"
                }}
              >
                Rewards coming soon
              </div>
              <div
                style={{
                  color: "#70808e",
                  marginTop: "8px",
                  lineHeight: "1.6"
                }}
              >
                Your points system is working, but redeemable rewards have not been
                connected yet. This screen is ready for the next backend step.
              </div>
            </div>

            <div style={smallCardStyle}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#24323d" }}>
                How points work
              </div>
              <div style={{ marginTop: "10px", color: "#70808e", lineHeight: "1.6" }}>
                You earn points from daily check-ins, honest logging, and healthy
                support actions like meetings, exercise, and reflection.
              </div>
            </div>

            <div style={smallCardStyle}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#24323d" }}>
                What’s next
              </div>
              <div style={{ marginTop: "10px", color: "#70808e", lineHeight: "1.6" }}>
                The next build step is to connect these points to unlockable rewards,
                redemptions, or milestone-based incentives.
              </div>
            </div>
          </>
        ) : (
          rewards.map((reward) => (
            <div
              key={reward.name}
              style={{
                ...smallCardStyle,
                background: reward.unlocked
                  ? "linear-gradient(180deg, rgba(123,160,142,0.14) 0%, rgba(109,143,151,0.08) 100%)"
                  : smallCardStyle.background
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#24323d"
                }}
              >
                {reward.name}
              </div>
              <div style={{ color: "#70808e", marginTop: "8px" }}>
                Cost: {reward.pointsCost} points
              </div>
              <div
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  color: reward.unlocked ? "#2f4a42" : "#64748b"
                }}
              >
                {reward.unlocked ? "Unlocked" : "Locked"}
              </div>
              <button
                style={{
                  marginTop: "14px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: reward.unlocked
                    ? "linear-gradient(180deg, #7ba08e 0%, #6d8f97 100%)"
                    : "#d1d5db",
                  color: reward.unlocked ? "white" : "#6b7280",
                  cursor: reward.unlocked ? "pointer" : "not-allowed",
                  fontWeight: "600"
                }}
              >
                Redeem
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default RewardsView;