import { useEffect, useMemo, useState } from "react";

export type RecoveryProgram =
  | "AA"
  | "ACA"
  | "Alateen"
  | "Al-Anon"
  | "NA"
  | "CA"
  | "GA"
  | "SA";

type CheckinEntry = {
  date: string;
  stayed_on_track_today?: boolean; // Generic field for all programs
  mood_score?: number;
  stress_score?: number;
  craving_score?: number;
  sleep_hours?: number;
  attended_meeting?: boolean;
  exercise_done?: boolean;
  journal_note?: string;
  risk_level?: "low" | "medium" | "high" | "unknown";
  points_earned?: number;
};

type RecoveryData = {
  points: number;
  xp: number;
  checkins: CheckinEntry[];
};

const STORAGE_PREFIX = "sentri.recovery";
const XP_PER_CHECKIN = 10;
const XP_PER_LEVEL = 30;

function computeStreak(checkins: CheckinEntry[]) {
  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (const entry of sorted) {
    if (entry.stayed_on_track_today === true) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function getGardenStage(level: number) {
  if (level >= 4) return "Blooming Tree";
  if (level >= 3) return "Flowering Plant";
  if (level >= 2) return "Healthy Sprout";
  if (level >= 1) return "Young Sprout";
  return "Seed";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getNextMilestone(streak: number) {
  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
  const next = milestones.find((m) => streak < m);
  return {
    days: next ?? 365,
    days_remaining: next ? Math.max(next - streak, 0) : 0,
  };
}

function evaluateSupportModel(checkins: CheckinEntry[], currentStreak: number) {
  const latest = checkins[0];
  if (!latest) {
    return {
      ml_risk_level: "low" as const,
      ml_risk_score: 0.18,
      ml_support_message: "You have not checked in yet. Start today to build momentum.",
      ml_suggested_action: "Complete your first check-in",
    };
  }

  let score = 0;
  const mood = Number(latest.mood_score ?? 5);
  const stress = Number(latest.stress_score ?? 5);
  const craving = Number(latest.craving_score ?? 0);
  const sleep = Number(latest.sleep_hours ?? 8);

  // Unified scoring logic
  if (latest.stayed_on_track_today === false) score += 0.38;
  if (mood <= 3) score += 0.16;
  if (stress >= 8) score += 0.18;
  if (craving >= 7) score += 0.20;
  if (sleep < 6) score += 0.12;

  if (latest.attended_meeting) score -= 0.08;
  if (latest.exercise_done) score -= 0.06;
  if (currentStreak >= 7) score -= 0.05;

  score = clamp(score, 0.02, 0.98);

  let ml_risk_level: "low" | "medium" | "high";
  if (score >= 0.6) ml_risk_level = "high";
  else if (score >= 0.32) ml_risk_level = "medium";
  else ml_risk_level = "low";

  return {
    ml_risk_level,
    ml_risk_score: Number(score.toFixed(2)),
    ml_support_message: ml_risk_level === "high" 
        ? "Your pattern suggests you need extra support. Reach out to a peer or attend a meeting."
        : "Your pattern looks steady. Keep reinforcing your daily routines.",
    ml_suggested_action: ml_risk_level === "high" ? "Contact support" : "Maintain consistency",
  };
}

export function useRecoveryData(program: RecoveryProgram = "AA") {
  const storageKey = `${STORAGE_PREFIX}.${program}`;
  const [state, setState] = useState<RecoveryData>({ points: 0, xp: 0, checkins: [] });

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.checkins)) setState(parsed);
    } catch { window.localStorage.removeItem(storageKey); }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const streak = useMemo(() => computeStreak(state.checkins), [state.checkins]);
  const gardenLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = state.xp % XP_PER_LEVEL;

  const supportModel = useMemo(
    () => evaluateSupportModel(state.checkins, streak),
    [state.checkins, streak]
  );

  const dashboardData = {
    profile: { current_streak_days: streak, total_points: state.points },
    ml_risk_level: supportModel.ml_risk_level,
    ml_risk_score: supportModel.ml_risk_score,
    ml_support_message: supportModel.ml_support_message,
    ml_suggested_action: supportModel.ml_suggested_action,
    garden: {
      level: gardenLevel,
      label: getGardenStage(gardenLevel),
      xp: xpInLevel,
      xp_to_next_level: XP_PER_LEVEL,
    },
    recent_checkins: state.checkins,
    next_milestone: getNextMilestone(streak),
  };

  const submitCheckin = (formData: Record<string, any>) => {
    const newCheckin: CheckinEntry = {
      date: new Date().toISOString().slice(0, 10),
      stayed_on_track_today: Boolean(formData.stayed_on_track_today),
      mood_score: Number(formData.mood_score ?? 5),
      stress_score: Number(formData.stress_score ?? 5),
      craving_score: Number(formData.craving_score ?? 0),
      sleep_hours: Number(formData.sleep_hours ?? 8),
      attended_meeting: Boolean(formData.attended_meeting),
      exercise_done: Boolean(formData.exercise_done),
      journal_note: String(formData.journal_note ?? ""),
      points_earned: XP_PER_CHECKIN,
    };

    setState((prev) => ({
      points: prev.points + XP_PER_CHECKIN,
      xp: prev.xp + XP_PER_CHECKIN,
      checkins: [newCheckin, ...prev.checkins].slice(0, 30),
    }));
  };

  const resetDemo = () => setState({ points: 0, xp: 0, checkins: [] });

  return { dashboardData, streak, points: state.points, submitCheckin, resetDemo };
}