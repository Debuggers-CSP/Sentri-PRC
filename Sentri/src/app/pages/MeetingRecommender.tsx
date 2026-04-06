import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

const meetingTypes = [
  {
    id: "open",
    name: "Open Meetings",
    description: "Anyone interested in the program, including potential new members, family, friends, and professionals"
  },
  {
    id: "closed",
    name: "Closed Meetings",
    description: "Only individuals who identify with the group's struggle, providing a more personal and intimate environment"
  }
];

const programs = [
  { id: "aa", name: "AA", fullName: "Alcoholics Anonymous" },
  { id: "aca", name: "ACA", fullName: "Adult Children of Alcoholics" },
  { id: "alateen", name: "Alateen", fullName: "Support for Teens" },
  { id: "alanon", name: "Al-Anon", fullName: "Support for Families" },
  { id: "na", name: "NA", fullName: "Narcotics Anonymous" },
  { id: "ca", name: "CA", fullName: "Cocaine Anonymous" },
  { id: "ga", name: "GA", fullName: "Gamblers Anonymous" },
  { id: "sa", name: "SA", fullName: "Sexaholics Anonymous" }
];

export function MeetingRecommender() {
  const navigate = useNavigate();
  const { user, completeMeetingRecommender } = useAuth();
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login", { state: { from: "/meeting-recommender" } });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  const handleComplete = () => {
    if (selectedMeetingType && selectedPrograms.length > 0) {
      // Save preferences
      localStorage.setItem("meetingPreferences", JSON.stringify({
        meetingType: selectedMeetingType,
        programs: selectedPrograms
      }));
      
      completeMeetingRecommender();
      navigate("/meetings");
    }
  };

  const canProceed = selectedMeetingType && selectedPrograms.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl text-gray-900">Meeting Preferences</h1>
              <p className="text-gray-600 mt-1">Help us find the right meetings for you</p>
            </div>
            
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meeting Type Selection */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">Select Meeting Type</h2>
            <p className="text-gray-600">Choose between open or closed meetings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {meetingTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  selectedMeetingType === type.id
                    ? "ring-2 ring-blue-500 bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
                }`}
                onClick={() => setSelectedMeetingType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedMeetingType === type.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedMeetingType === type.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info about meeting types */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="mb-2"><strong className="text-gray-900">Open meetings:</strong> Welcome newcomers and allow family, friends, and professionals to attend and learn about the program.</p>
                <p><strong className="text-gray-900">Closed meetings:</strong> Provide a more personal and intimate environment for members to share openly about their recovery and personal challenges.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Program Selection */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">Select Programs of Interest</h2>
            <p className="text-gray-600">Choose one or more programs you'd like to attend</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => handleProgramToggle(program.id)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedPrograms.includes(program.id)
                    ? "bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="text-base mb-1">{program.name}</div>
                <div className="text-xs opacity-80">{program.fullName}</div>
              </button>
            ))}
          </div>

          {/* Link to program recommender */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm mb-2">
              Not sure which program is right for you?
            </p>
            <Link
              to="/recommender"
              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1 font-medium"
            >
              Take the Program Recommender
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!canProceed}
            className={`px-8 ${
              canProceed
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            View Personalized Meetings
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {!canProceed && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Please select a meeting type and at least one program to continue
          </p>
        )}
      </div>
    </div>
  );
}