import { useEffect, useMemo, useState } from "react";
import CheckinView from "./views/CheckinView";
import GardenView from "./views/GardenView";
import HistoryView from "./views/HistoryView";
import RewardsView from "./views/RewardsView";
import { useRecoveryData } from "./useRecoveryData";

type ModalKey = "checkin" | "rewards" | "history" | "streak" | null;

export default function TrackerMain() {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [showResetDemo, setShowResetDemo] = useState(false);

  // Simplified: No second argument needed
  const { dashboardData, points, streak, submitCheckin, resetDemo } = useRecoveryData();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setShowResetDemo((prev) => !prev);
      }
      if (event.key === "Escape") {
        setShowResetDemo(false);
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const safeDashboardData = dashboardData ?? {
    ml_risk_level: "low",
    ml_risk_score: 0,
    ml_support_message: "Keep checking in daily.",
    ml_suggested_action: "Open Check-In",
    profile: { current_streak_days: 0, total_points: 0 },
    garden: { level: 1, xp: 0, xp_to_next_level: 30, label: "Seedling" },
    recent_checkins: [],
    next_milestone: { days: 1, days_remaining: 1 },
  };

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "#E8F5E9",
    border: "1px solid #DCEAD8",
    fontSize: "14px",
    color: "#005A2C",
    fontWeight: "600" as const,
  };

  const smallCardStyle = {
    background: "#ffffff",
    border: "1px solid #BFD4B4",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 10px 20px rgba(0, 90, 44, 0.08)",
  };

  const streakDays = safeDashboardData.profile.current_streak_days;
  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
  const nextTimelineMilestone = milestones.find((m) => streakDays < m) ?? 365;

  const closeModal = () => setActiveModal(null);

  const renderModalBody = () => {
    switch (activeModal) {
      case "checkin":
        return (
          <CheckinView
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
            onSubmit={(formData) => {
              submitCheckin(formData);
              closeModal();
            }}
            checkinLabel="Daily Check-In"
            // CHANGED: Use the unified generic field name
            checkinField="stayed_on_track_today" 
          />
        );
      case "rewards":
        return <RewardsView mockDashboardData={safeDashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} />;
      case "history":
        return <HistoryView dashboardData={safeDashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} />;
      case "streak":
        return (
          <div className="space-y-4">
            <div style={pillStyle}>🏆 Streak</div>
            <h2 className="font-mono text-2xl text-[#005A2C]">Streak Timeline</h2>
            <div className="flex flex-wrap gap-3">
              {milestones.map((m) => {
                const reached = streakDays >= m;
                return (
                  <div key={m} className={`rounded-[10px] border px-4 py-2 font-mono text-sm ${
                      reached ? "border-[#76B82A] bg-[#E8F5E9] text-[#005A2C]" : "border-[#DCEAD8] bg-[#EEF6EA] text-[#5A7462]"
                    }`}>
                    {m}d
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[78vh] w-full overflow-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_48%,#E8F5E9_100%)] p-4 text-[#1F3B2B]">
        {/* We change p-4 to p-2 on mobile so the green cards don't get squashed */}
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col rounded-[12px] md:rounded-[26px] border border-[#A9C59D] bg-[#F8FAF5]/95 p-2 md:p-4 shadow-xl">        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button onClick={() => setActiveModal("streak")} className="rounded-[12px] border-2 border-[#A9C59D] bg-white p-3 text-left font-mono">
            <p className="text-xs text-[#5A7462]">Streak</p>
            <p className="mt-1 text-lg font-bold text-[#005A2C]">{streakDays}</p>
          </button>
          <button onClick={() => setActiveModal("rewards")} className="rounded-[12px] border-2 border-[#A9C59D] bg-white p-3 text-left font-mono">
            <p className="text-xs text-[#5A7462]">Points</p>
            <p className="mt-1 text-lg font-bold text-[#005A2C]">{points}</p>
          </button>
          <button onClick={() => setActiveModal("history")} className="rounded-[12px] border-2 border-[#A9C59D] bg-white p-3 text-left font-mono">
            <p className="text-xs text-[#5A7462]">Support Level</p>
            <p className="mt-1 text-lg font-bold capitalize text-[#005A2C]">{safeDashboardData.ml_risk_level}</p>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[20px] border-2 border-dashed border-[#BFD4B4] bg-white/85 p-2">
          <GardenView dashboardData={safeDashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} onOpenCheckin={() => setActiveModal("checkin")} />
        </div>

        {activeModal && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0f1f13]/40 p-4" onClick={closeModal}>
            <div className="max-h-[88%] w-full max-w-4xl overflow-auto rounded-[16px] border-4 border-[#87B171] bg-[#F8FAF5] p-4" onClick={(e) => e.stopPropagation()}>
              {renderModalBody()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}