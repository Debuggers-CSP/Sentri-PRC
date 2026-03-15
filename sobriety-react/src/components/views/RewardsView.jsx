function RewardsView({ mockDashboardData, pillStyle, smallCardStyle }) {
  const rewards = mockDashboardData?.rewards || [];

  return (
    <>
      <div>
        <div style={pillStyle}>🎁 Rewards</div>
        <h1 style={{ fontSize: "34px", margin: "18px 0 8px 0" }}>
          Redeem your points
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "17px" }}>
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
          <div
            style={{
              ...smallCardStyle,
              gridColumn: "1 / -1"
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              Rewards coming soon
            </div>
            <div style={{ color: "#6b7280", marginTop: "8px", lineHeight: "1.6" }}>
              Your points system is working, but redeemable rewards have not been
              connected yet. This screen is ready for the next backend step.
            </div>
          </div>
        ) : (
          rewards.map((reward) => (
            <div
              key={reward.name}
              style={{
                ...smallCardStyle,
                background: reward.unlocked ? "#ecfdf5" : "#f8fafc"
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: "700" }}>
                {reward.name}
              </div>
              <div style={{ color: "#6b7280", marginTop: "8px" }}>
                Cost: {reward.pointsCost} points
              </div>
              <div style={{ marginTop: "12px", fontWeight: "600" }}>
                {reward.unlocked ? "Unlocked" : "Locked"}
              </div>
              <button
                style={{
                  marginTop: "14px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: reward.unlocked ? "#111827" : "#d1d5db",
                  color: reward.unlocked ? "white" : "#6b7280",
                  cursor: reward.unlocked ? "pointer" : "not-allowed"
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