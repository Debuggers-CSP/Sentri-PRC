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

  const streak = useMemo(() => computeStreak(state.checkins, positiveField), [state.checkins, positiveField]);

  const gardenLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = state.xp % XP_PER_LEVEL;

  const dashboardData = {
    profile: {
      current_streak_days: streak,
      streak: streak,
      total_points: state.points,
    },
    ml_risk_level: "low",
    garden: {
      level: gardenLevel,
      label: getGardenStage(gardenLevel),
      xp: xpInLevel,
      xp_to_next_level: XP_PER_LEVEL,
      image: `/assets/garden/stage-${Math.min(gardenLevel, 4)}.svg`,
    },
    recent_checkins: state.checkins,
    rewards: [],
    next_milestone: null,
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
      risk_level: "low",
      points_earned: XP_PER_CHECKIN,
    };

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