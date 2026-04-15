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
  stayed_sober_today?: boolean;
  practiced_self_care_today?: boolean;
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

function computeStreak(checkins: CheckinEntry[], positiveField: keyof CheckinEntry) {
  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (const entry of sorted) {
    if (entry[positiveField] === true) {
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

  if (!next) {
    return {
      days: 365,
      days_remaining: 0,
    };
  }

  return {
    days: next,
    days_remaining: Math.max(next - streak, 0),
  };
}

function evaluateSupportModel(
  checkins: CheckinEntry[],
  isSubstanceProgram: boolean,
  currentStreak: number
) {
  const latest = checkins[0];

  if (!latest) {
    return {
      ml_risk_level: "low" as const,
      ml_risk_score: 0.18,
      ml_support_message: "You have not checked in yet. Start with a quick daily check-in to build momentum.",
      ml_suggested_action: "Complete your first check-in",
    };
  }

  let score = 0;

  const mood = Number(latest.mood_score ?? 5);
  const stress = Number(latest.stress_score ?? 5);
  const craving = Number(latest.craving_score ?? 0);
  const sleep = Number(latest.sleep_hours ?? 8);

  const positiveToday = isSubstanceProgram
    ? latest.stayed_sober_today
    : latest.practiced_self_care_today;

  if (positiveToday === false) score += 0.38;
  if (mood <= 3) score += 0.16;
  else if (mood <= 5) score += 0.08;

  if (stress >= 8) score += 0.18;
  else if (stress >= 6) score += 0.1;

  if (craving >= 8) score += 0.22;
  else if (craving >= 6) score += 0.12;
  else if (craving >= 4) score += 0.05;

  if (sleep < 5) score += 0.14;
  else if (sleep < 7) score += 0.07;

  if (latest.attended_meeting) score -= 0.08;
  if (latest.exercise_done) score -= 0.06;
  if ((latest.journal_note ?? "").trim().length >= 20) score -= 0.04;

  if (currentStreak >= 14) score -= 0.08;
  else if (currentStreak >= 7) score -= 0.04;

  const recent = checkins.slice(0, 3);
  if (recent.length >= 2) {
    const avgStress =
      recent.reduce((sum, entry) => sum + Number(entry.stress_score ?? 5), 0) / recent.length;
    const avgCraving =
      recent.reduce((sum, entry) => sum + Number(entry.craving_score ?? 0), 0) / recent.length;

    if (avgStress >= 7) score += 0.08;
    if (avgCraving >= 6) score += 0.1;
  }

  score = clamp(score, 0.02, 0.98);

  let ml_risk_level: "low" | "medium" | "high";
  let ml_support_message: string;
  let ml_suggested_action: string;

  if (score >= 0.6) {
    ml_risk_level = "high";
    ml_support_message =
      "Your recent check-in suggests you may need extra support today. Focus on one stabilizing step right now instead of trying to do everything at once.";
    ml_suggested_action =
      stress >= craving
        ? "Attend a meeting or contact a support person today"
        : "Reduce triggers and check in again later today";
  } else if (score >= 0.32) {
    ml_risk_level = "medium";
    ml_support_message =
      "You are showing some signs of strain. A small supportive action today could help keep things steady.";
    ml_suggested_action =
      latest.attended_meeting || latest.exercise_done
        ? "Add a short journal reflection"
        : "Do one support action: meeting, walk, or journal entry";
  } else {
    ml_risk_level = "low";
    ml_support_message =
      "Your recent pattern looks relatively steady. Keep reinforcing the routines that are working for you.";
    ml_suggested_action =
      currentStreak >= 7
        ? "Protect your streak with another check-in tomorrow"
        : "Keep building consistency with another daily check-in";
  }

  return {
    ml_risk_level,
    ml_risk_score: Number(score.toFixed(2)),
    ml_support_message,
    ml_suggested_action,
  };
}

export function useRecoveryData(program: RecoveryProgram, isSubstanceProgram: boolean) {
  const storageKey = `${STORAGE_PREFIX}.${program}`;
  const [state, setState] = useState<RecoveryData>({ points: 0, xp: 0, checkins: [] });

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as RecoveryData;
      if (parsed && Array.isArray(parsed.checkins)) {
        setState(parsed);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const positiveField = isSubstanceProgram
    ? ("stayed_sober_today" as const)
    : ("practiced_self_care_today" as const);

  const streak = useMemo(
    () => computeStreak(state.checkins, positiveField),
    [state.checkins, positiveField]
  );

  const gardenLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = state.xp % XP_PER_LEVEL;

  const supportModel = useMemo(
    () => evaluateSupportModel(state.checkins, isSubstanceProgram, streak),
    [state.checkins, isSubstanceProgram, streak]
  );

  const dashboardData = {
    profile: {
      current_streak_days: streak,
      streak,
      total_points: state.points,
    },
    ml_risk_level: supportModel.ml_risk_level,
    ml_risk_score: supportModel.ml_risk_score,
    ml_support_message: supportModel.ml_support_message,
    ml_suggested_action: supportModel.ml_suggested_action,
    garden: {
      level: gardenLevel,
      label: getGardenStage(gardenLevel),
      xp: xpInLevel,
      xp_to_next_level: XP_PER_LEVEL,
      image: `/assets/garden/stage-${Math.min(gardenLevel, 4)}.svg`,
    },
    recent_checkins: state.checkins,
    rewards: [],
    next_milestone: getNextMilestone(streak),
  };

  const submitCheckin = (formData: Record<string, unknown>) => {
    const positive = isSubstanceProgram
      ? Boolean(formData.stayed_sober_today)
      : Boolean(formData.practiced_self_care_today);

    const newCheckin: CheckinEntry = {
      date: new Date().toISOString().slice(0, 10),
      mood_score: Number(formData.mood_score ?? 5),
      stress_score: Number(formData.stress_score ?? 5),
      craving_score: Number(formData.craving_score ?? 5),
      sleep_hours: Number(formData.sleep_hours ?? 8),
      attended_meeting: Boolean(formData.attended_meeting),
      exercise_done: Boolean(formData.exercise_done),
      journal_note: String(formData.journal_note ?? ""),
      stayed_sober_today: isSubstanceProgram ? positive : undefined,
      practiced_self_care_today: isSubstanceProgram ? undefined : positive,
      risk_level: "unknown",
      points_earned: XP_PER_CHECKIN,
    };

    const simulatedModel = evaluateSupportModel(
      [newCheckin, ...state.checkins].slice(0, 30),
      isSubstanceProgram,
      positive ? streak + 1 : 0
    );

    newCheckin.risk_level = simulatedModel.ml_risk_level;

    setState((prev) => ({
      points: prev.points + XP_PER_CHECKIN,
      xp: prev.xp + XP_PER_CHECKIN,
      checkins: [newCheckin, ...prev.checkins].slice(0, 30),
    }));
  };

  const resetDemo = () => setState({ points: 0, xp: 0, checkins: [] });

  return {
    dashboardData,
    streak,
    points: state.points,
    submitCheckin,
    resetDemo,
  };
}