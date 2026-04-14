import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/ui/button";

export interface GuideAnswers {
  is_substance_abuse: number;
  is_family_member: number;
  has_trauma: number;
  is_minor: number;
  is_behavioral_issue: number;
  focus_alcohol: number;
  focus_drugs: number;
  focus_cocaine: number;
  focus_gambling: number;
  focus_sex_rel: number;
}

interface PRCGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMatch: (programId: number, answers: GuideAnswers) => void;
}

type DiscoveryStep = "who" | "me-heavy" | "substances" | "habits" | "others" | "adult" | "thinking";

interface Option {
  id: string;
  title: string;
  emoji: string;
  nextStep?: Exclude<DiscoveryStep, "thinking">;
  matchProgramId?: number;
  featureUpdates?: Partial<GuideAnswers>;
}

const defaultAnswers: GuideAnswers = {
  is_substance_abuse: 0,
  is_family_member: 0,
  has_trauma: 0,
  is_minor: 0,
  is_behavioral_issue: 0,
  focus_alcohol: 0,
  focus_drugs: 0,
  focus_cocaine: 0,
  focus_gambling: 0,
  focus_sex_rel: 0
};

const stepPrompts: Record<Exclude<DiscoveryStep, "thinking">, string> = {
  who: "Who are we focusing on today?",
  "me-heavy": "What feels most heavy?",
  substances: "Best description?",
  habits: "Focus area?",
  others: "Your age?",
  adult: "Situation?"
};

const stepOptions: Record<Exclude<DiscoveryStep, "thinking">, Option[]> = {
  who: [
    { id: "me", title: "Me", emoji: "🧘", nextStep: "me-heavy" },
    {
      id: "others",
      title: "Others",
      emoji: "❤️",
      nextStep: "others",
      featureUpdates: { is_family_member: 1 }
    }
  ],
  "me-heavy": [
    {
      id: "substances",
      title: "Substances",
      emoji: "💊",
      nextStep: "substances",
      featureUpdates: { is_substance_abuse: 1 }
    },
    {
      id: "habits",
      title: "Habits",
      emoji: "🎰",
      nextStep: "habits",
      featureUpdates: { is_behavioral_issue: 1 }
    },
    { id: "past", title: "My Past", emoji: "🧸", matchProgramId: 2, featureUpdates: { has_trauma: 1 } }
  ],
  substances: [
    { id: "alcohol", title: "Alcohol", emoji: "🍺", matchProgramId: 1, featureUpdates: { is_substance_abuse: 1, focus_alcohol: 1 } },
    { id: "narcotics", title: "Narcotics", emoji: "💉", matchProgramId: 5, featureUpdates: { is_substance_abuse: 1, focus_drugs: 1 } },
    { id: "cocaine", title: "Cocaine", emoji: "❄️", matchProgramId: 6, featureUpdates: { is_substance_abuse: 1, focus_cocaine: 1 } }
  ],
  habits: [
    { id: "luck", title: "Luck/Money", emoji: "🎲", matchProgramId: 7, featureUpdates: { is_behavioral_issue: 1, focus_gambling: 1 } },
    { id: "relationships", title: "Relationships", emoji: "🫂", matchProgramId: 8, featureUpdates: { is_behavioral_issue: 1, focus_sex_rel: 1 } }
  ],
  others: [
    {
      id: "teen",
      title: "Teen",
      emoji: "🎒",
      matchProgramId: 3,
      featureUpdates: { is_family_member: 1, is_minor: 1 }
    },
    {
      id: "adult",
      title: "Adult",
      emoji: "🏠",
      nextStep: "adult",
      featureUpdates: { is_family_member: 1 }
    }
  ],
  adult: [
    {
      id: "dysfunctional-home",
      title: "Dysfunctional Home",
      emoji: "🏚️",
      matchProgramId: 2,
      featureUpdates: { is_family_member: 1, has_trauma: 1 }
    },
    {
      id: "drinking",
      title: "Loved one's drinking",
      emoji: "🍷",
      matchProgramId: 4,
      featureUpdates: { is_family_member: 1, focus_alcohol: 1 }
    }
  ]
};

export function PRCGuidePanel({ isOpen, onClose, onMatch }: PRCGuidePanelProps) {
  const [step, setStep] = useState<DiscoveryStep>("who");
  const [pendingMatchId, setPendingMatchId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<GuideAnswers>(defaultAnswers);

  useEffect(() => {
    if (!isOpen) {
      setStep("who");
      setPendingMatchId(null);
      setAnswers(defaultAnswers);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "thinking" || !pendingMatchId) {
      return;
    }

    const timeout = setTimeout(() => {
      onMatch(pendingMatchId, answers);
      onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [step, pendingMatchId, onMatch, onClose, answers]);

  const handleOptionClick = (option: Option) => {
    if (option.featureUpdates) {
      setAnswers((prev) => ({ ...prev, ...option.featureUpdates }));
    }

    if (option.matchProgramId) {
      setPendingMatchId(option.matchProgramId);
      setStep("thinking");
      return;
    }

    if (option.nextStep) {
      setStep(option.nextStep);
    }
  };

  const questionStep = step === "thinking" ? null : step;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed left-8 bottom-28 z-50 w-[min(90vw,26rem)] rounded-3xl border border-blue-100 bg-white shadow-2xl"
          initial={{ x: -40, y: 20, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: -40, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
        >
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-600">Assistant</p>
                <h2 className="text-xl text-slate-900">Program Discovery</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {questionStep && (
                <motion.div
                  key={questionStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="mb-4 text-2xl text-slate-900">{stepPrompts[questionStep]}</h3>
                  <div className="space-y-3">
                    {stepOptions[questionStep].map((option, index) => (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full rounded-2xl border-2 border-blue-100 bg-white p-4 text-left shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        <span className="flex items-center gap-3 text-lg text-slate-900">
                          <span className="text-3xl">{option.emoji}</span>
                          <span>{option.title}</span>
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "thinking" && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  className="py-8 text-center"
                >
                  <div className="relative mx-auto mb-6 h-40 w-40">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-3 w-3 rounded-full bg-blue-500"
                        style={{
                          left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                          top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`
                        }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-12 w-12 text-purple-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl text-slate-900">Analyzing your path...</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export const PRCGuide = PRCGuidePanel;