import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { UserProfile } from "../components/UserProfile";

const preferences = [
  { id: "meditation", label: "#Meditation" },
  { id: "highEnergy", label: "#HighEnergy" },
  { id: "beginnerFriendly", label: "#BeginnerFriendly" },
  { id: "youngAdults", label: "#YoungAdults" },
  { id: "speaker", label: "#Speaker" },
  { id: "smallGroup", label: "#SmallGroup" },
  { id: "largeGroup", label: "#LargeGroup" },
  { id: "spiritual", label: "#Spiritual" },
  { id: "bookStudy", label: "#BookStudy" },
  { id: "womenOnly", label: "#WomenOnly" },
  { id: "menOnly", label: "#MenOnly" },
  { id: "lgbtq", label: "#LGBTQ+" },
  { id: "newcomers", label: "#Newcomers" },
  { id: "dualRecovery", label: "#DualRecovery" },
  { id: "candlelight", label: "#Candlelight" },
  { id: "discussion", label: "#Discussion" },
  { id: "stepWork", label: "#StepWork" },
  { id: "outdoor", label: "#Outdoor" },
  { id: "na", label: "#NA" },
  { id: "aa", label: "#AA" },
];

export function ProgramRecommender() {
  const navigate = useNavigate();
  const { completeRecommender } = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Save preferences (in real app would save to backend)
    localStorage.setItem("userPreferences", JSON.stringify(selectedPreferences));
    completeRecommender();
    navigate("/programs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-end">
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl text-white">Find Your Perfect Match</h1>
          </div>
          <p className="text-xl text-blue-200">
            Select the preferences that matter most to you
          </p>
          <p className="text-blue-300 mt-2">
            We'll recommend programs that align with your needs
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {preferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`px-6 py-3 rounded-full text-sm font-mono transition-all ${
                    selectedPreferences.includes(pref.id)
                      ? "bg-blue-500 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/50"
                      : "bg-transparent text-blue-200 border-2 border-blue-400/30 hover:border-blue-400/60"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-blue-300 mb-6">
                {selectedPreferences.length} preference{selectedPreferences.length !== 1 ? "s" : ""} selected
              </p>
              <Button
                size="lg"
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Continue to Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <button
            onClick={handleContinue}
            className="text-blue-300 hover:text-blue-200 text-sm underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
