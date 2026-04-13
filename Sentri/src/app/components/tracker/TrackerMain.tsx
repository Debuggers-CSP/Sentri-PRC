import { useMemo, useState } from "react";
import CheckinView from "./views/CheckinView";
import GardenView from "./views/GardenView";
import HistoryView from "./views/HistoryView";
import HomeView from "./views/HomeView";
import RewardsView from "./views/RewardsView";
import { useRecoveryData, type RecoveryProgram } from "./useRecoveryData";

type ViewKey = "home" | "checkin" | "garden" | "rewards" | "history";

type TrackerMainProps = {
  program?: RecoveryProgram;
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

export default function TrackerMain({ program = "AA", userName = "Guest User" }: TrackerMainProps) {
  const [activeView, setActiveView] = useState<ViewKey>("home");
  const labels = PROGRAM_LABELS[program];
  const isSubstanceProgram = SUBSTANCE_PROGRAMS.includes(program);
  const { dashboardData, points, streak, submitCheckin, resetDemo } = useRecoveryData(
    program,
    isSubstanceProgram,
  );

  const cardClass =
    "rounded-3xl border border-slate-200/80 bg-white/60 p-4 shadow-[0_8px_24px_rgba(96,122,133,0.05)] backdrop-blur";

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(233, 240, 236, 0.95)",
    border: "1px solid rgba(209, 222, 215, 0.9)",
    fontSize: "14px",
    color: "#5b6f68",
    fontWeight: "500",
  } as const;

  const smallCardStyle = {
    background: "rgba(255,255,255,0.52)",
    border: "1px solid rgba(214, 223, 230, 0.95)",
    borderRadius: "22px",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(96, 122, 133, 0.05)",
  } as const;

  const navItems = useMemo(
    () => [
      { key: "home" as const, icon: "🏠", label: "Dashboard" },
      { key: "checkin" as const, icon: "📝", label: "Check-in" },
      { key: "garden" as const, icon: "🌱", label: "Garden" },
      { key: "rewards" as const, icon: "🎁", label: "Rewards" },
      { key: "history" as const, icon: "📈", label: "History" },
    ],
    [],
  );

  const aiSupport = dashboardData.ml_risk_level?.replace("_", " ") ?? "low";

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
        return <GardenView dashboardData={dashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} />;
      case "rewards":
        return (
          <RewardsView mockDashboardData={dashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} />
        );
      case "history":
        return <HistoryView dashboardData={dashboardData} pillStyle={pillStyle} smallCardStyle={smallCardStyle} />;
      default:
        return (
          <HomeView
            dashboardData={dashboardData}
            pillStyle={pillStyle}
            smallCardStyle={smallCardStyle}
            setActiveView={setActiveView}
            streakLabel={labels.streak}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#edf5f1_0%,#eef4f7_45%,#f4f6fb_100%)] p-6 text-slate-700">
      <div className="mx-auto flex max-w-7xl gap-4">
        <div className="relative flex-1 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_rgba(80,108,119,0.12)] backdrop-blur-xl">
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className={cardClass}>
              <p className="text-xs text-slate-500">Program</p>
              <p className="mt-1 text-xl font-bold">{program}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs text-slate-500">{labels.streak}</p>
              <p className="mt-1 text-xl font-bold">{streak}</p>
              <p className="text-xs text-slate-500">{labels.days}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs text-slate-500">Points</p>
              <p className="mt-1 text-xl font-bold">{points}</p>
            </div>
            <div className={cardClass}>
              <p className="text-xs text-slate-500">AI Support Level</p>
              <p className="mt-1 text-xl font-bold capitalize">{aiSupport}</p>
              <p className="text-xs text-slate-500">Welcome, {userName}</p>
            </div>
          </div>

          <div className="h-[calc(100vh-14rem)] min-h-[560px] overflow-auto pr-2">{renderActive()}</div>

          <button
            onClick={resetDemo}
            className="absolute right-5 top-5 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm"
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
              className={`h-14 w-14 rounded-2xl border text-xl transition ${
                activeView === item.key
                  ? "border-emerald-400 bg-gradient-to-b from-emerald-500 to-sky-500 text-white shadow-lg"
                  : "border-slate-200 bg-white/70 text-slate-600"
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