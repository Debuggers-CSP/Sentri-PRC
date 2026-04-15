import { useMemo, useState } from "react";
import CheckinView from "./views/CheckinView";
import GardenView from "./views/GardenView";
import HistoryView from "./views/HistoryView";
import HomeView from "./views/HomeView";
import RewardsView from "./views/RewardsView";
import { useRecoveryData, type RecoveryProgram } from "./useRecoveryData";

type ViewKey = "home" | "checkin" | "garden" | "rewards" | "history";

type TrackerMainProps = {
  program?: RecoveryProgram | string;
  userName?: string;
};

const PROGRAM_LABELS: Record<
  RecoveryProgram,
  {
    streak: string;
    days: string;
    checkin: string;
  }
> = {
  AA: { streak: "Sobriety Streak", days: "Days Sober", checkin: "Sober Today?" },
  NA: { streak: "Sobriety Streak", days: "Days Sober", checkin: "Sober Today?" },
  CA: { streak: "Sobriety Streak", days: "Days Sober", checkin: "Sober Today?" },
  SA: { streak: "Sobriety Streak", days: "Days Sober", checkin: "Sober Today?" },
  GA: { streak: "Sobriety Streak", days: "Days Sober", checkin: "Sober Today?" },
  ACA: {
    streak: "Serenity Streak",
    days: "Days of Self-Care",
    checkin: "Practiced Self-Care today?",
  },
  "Al-Anon": {
    streak: "Serenity Streak",
    days: "Days of Self-Care",
    checkin: "Practiced Self-Care today?",
  },
  Alateen: {
    streak: "Serenity Streak",
    days: "Days of Self-Care",
    checkin: "Practiced Self-Care today?",
  },
};

const SUBSTANCE_PROGRAMS: RecoveryProgram[] = ["AA", "NA", "CA", "SA", "GA"];

export default function TrackerMain({
  program = "AA",
  userName = "Guest User",
}: TrackerMainProps) {
  const [activeView, setActiveView] = useState<ViewKey>("home");

  const normalizedProgram =
    typeof program === "string" ? program.trim() : "AA";

  const safeProgram: RecoveryProgram =
    normalizedProgram in PROGRAM_LABELS
      ? (normalizedProgram as RecoveryProgram)
      : "AA";

  const labels = PROGRAM_LABELS[safeProgram];
  const isSubstanceProgram = SUBSTANCE_PROGRAMS.includes(safeProgram);

  const { dashboardData, points, streak, submitCheckin, resetDemo } =
    useRecoveryData(safeProgram, isSubstanceProgram);

  const safeDashboardData = dashboardData ?? {
    ml_risk_level: "low",
    profile: {
      current_streak_days: 0,
      streak: 0,
      total_points: 0,
    },
    garden: {
      level: 1,
      xp: 0,
      xp_to_next_level: 100,
      label: "Seedling",
      image: "/assets/garden/stage-1.svg",
    },
    recent_checkins: [],
    next_milestone: null,
    rewards: [],
  };

  const cardClass =
    "rounded-[24px] border border-[#E0EADD] bg-white p-4 shadow-[0_12px_26px_rgba(118,184,42,0.08)]";

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
    fontWeight: "600",
  } as const;

  const smallCardStyle = {
    background: "#ffffff",
    border: "1px solid #E0EADD",
    borderRadius: "24px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(0, 90, 44, 0.08)",
  } as const;

  const navItems = useMemo(
    () => [
      { key: "home" as const, icon: "🏠", label: "Dashboard" },
      { key: "checkin" as const, icon: "🌱", label: "Check-in" },
      { key: "garden" as const, icon: "🌿", label: "Garden" },
      { key: "rewards" as const, icon: "🌼", label: "Rewards" },
      { key: "history" as const, icon: "🍃", label: "History" },
    ],
    []
  );

  const aiSupport =
    safeDashboardData.ml_risk_level?.replace("_", " ") ?? "low";

  const renderActive = () => {
    switch (activeView) {
      case "checkin":
        return (
          <CheckinView
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
            onSubmit={async (formData: Record<string, unknown>) => {
              submitCheckin(formData);
              setActiveView("home");
            }}
            checkinLabel={labels.checkin}
          />
        );
      case "garden":
        return (
          <GardenView
            dashboardData={safeDashboardData}
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
          />
        );
      case "rewards":
        return (
          <RewardsView
            mockDashboardData={safeDashboardData}
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
          />
        );
      case "history":
        return (
          <HistoryView
            dashboardData={safeDashboardData}
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
          />
        );
      default:
        return (
          <HomeView
            dashboardData={safeDashboardData}
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
            setActiveView={setActiveView}
            streakLabel={labels.streak}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_48%,#E8F5E9_100%)] p-6 text-[#1F3B2B]">
      <div className="mx-auto flex max-w-7xl gap-4">
        <div className="relative flex-1 rounded-[32px] border border-[#E0EADD] bg-[#F8FAF5]/90 p-5 shadow-[0_20px_60px_rgba(0,90,44,0.09)]">
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className={cardClass}>
              <p className="text-xs text-[#5A7462]">Program</p>
              <p className="mt-1 text-xl font-bold text-[#005A2C]">
                {safeProgram}
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs text-[#5A7462]">{labels.streak}</p>
              <p className="mt-1 text-xl font-bold text-[#005A2C]">
                {streak ?? 0}
              </p>
              <p className="text-xs text-[#5A7462]">{labels.days}</p>
            </div>

            <div className={cardClass}>
              <p className="text-xs text-[#5A7462]">Points</p>
              <p className="mt-1 text-xl font-bold text-[#005A2C]">
                {points ?? 0}
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs text-[#5A7462]">AI Support Level</p>
              <p className="mt-1 text-xl font-bold capitalize text-[#005A2C]">
                {aiSupport}
              </p>
              <p className="text-xs text-[#5A7462]">Welcome, {userName}</p>
            </div>
          </div>

          <div className="h-[calc(100vh-14rem)] min-h-[560px] overflow-auto pr-2">
            {renderActive()}
          </div>

          <button
            onClick={resetDemo}
            className="absolute right-5 top-5 rounded-[24px] border border-[#DCEAD8] bg-white px-4 py-2 text-sm text-[#005A2C]"
          >
            Reset Demo
          </button>
        </div>

        <aside className="flex w-16 flex-col items-center gap-3 pt-24">
          {navItems.map((item) => (
            <button
              key={item.key}
              title={item.label}
              onClick={() => setActiveView(item.key)}
              className={`h-14 w-14 rounded-[24px] border text-xl transition ${
                activeView === item.key
                  ? "border-[#76B82A] bg-[linear-gradient(135deg,#76B82A_0%,#005A2C_100%)] text-white shadow-[0_12px_26px_rgba(0,90,44,0.22)]"
                  : "border-[#DCEAD8] bg-white text-[#5A7462]"
              }`}
            >
              {item.icon}
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}