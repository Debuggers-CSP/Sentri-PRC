import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/ui/button";

interface PRCGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMatch: (programId: number) => void;
}

type DiscoveryStep = "who" | "me-heavy" | "substances" | "habits" | "others" | "adult" | "thinking";

interface Option {
  id: string;
  title: string;
  emoji: string;
  nextStep?: Exclude<DiscoveryStep, "thinking">;
  matchProgramId?: number;
}

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
    { id: "others", title: "Others", emoji: "❤️", nextStep: "others" }
  ],
  "me-heavy": [
    { id: "substances", title: "Substances", emoji: "💊", nextStep: "substances" },
    { id: "habits", title: "Habits", emoji: "🎰", nextStep: "habits" },
    { id: "past", title: "My Past", emoji: "🧸", matchProgramId: 2 }
  ],
  substances: [
    { id: "alcohol", title: "Alcohol", emoji: "🍺", matchProgramId: 1 },
    { id: "narcotics", title: "Narcotics", emoji: "💉", matchProgramId: 5 },
    { id: "cocaine", title: "Cocaine", emoji: "❄️", matchProgramId: 6 }
  ],
  habits: [
    { id: "luck", title: "Luck/Money", emoji: "🎲", matchProgramId: 7 },
    { id: "relationships", title: "Relationships", emoji: "🫂", matchProgramId: 8 }
  ],
  others: [
    { id: "teen", title: "Teen", emoji: "🎒", matchProgramId: 3 },
    { id: "adult", title: "Adult", emoji: "🏠", nextStep: "adult" }
  ],
  adult: [
    { id: "dysfunctional-home", title: "Dysfunctional Home", emoji: "🏚️", matchProgramId: 2 },
    { id: "drinking", title: "Loved one's drinking", emoji: "🍷", matchProgramId: 4 }
  ]
};

export function PRCGuidePanel({ isOpen, onClose, onMatch }: PRCGuidePanelProps) {
  const [step, setStep] = useState<DiscoveryStep>("who");
  const [pendingMatchId, setPendingMatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep("who");
      setPendingMatchId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "thinking" || !pendingMatchId) {
      return;
    }

    const timeout = setTimeout(() => {
      onMatch(pendingMatchId);
      onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [step, pendingMatchId, onMatch, onClose]);

  const handleOptionClick = (option: Option) => {
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