import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import aaLogo from "../../assets/735899c7aa27fedc5bfff3f073c9492f49572a67.png";
import acaLogo from "../../assets/054168f67c068da00639dd1c8048e86acf2571ca.png";
import alateenLogo from "../../assets/2c91f86ad959487223d3461bd473cbc2855a8351.png";
import alanonLogo from "../../assets/3c35ee6fefb6bfce531c22f63b9380fedac4d6a6.png";
import naLogo from "../../assets/2115c4842bd36bd47cd1708c3d26e2e14999ef8a.png";
import caLogo from "../../assets/58e3f4b9794493f73bea7d751b9df8993b8c105f.png";
import gaLogo from "../../assets/675121813725057c96f90900dde1cdb27e6a8031.png";
import saLogo from "../../assets/50593eb25097566896b0e6a4b491eabb700c98a6.png";

// Program data with logos
const programs = [
  {
    id: 1,
    slug: "aa",
    name: "AA",
    fullName: "Alcoholics Anonymous",
    logo: aaLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A fellowship of people who share their experience, strength and hope to solve their common problem and help others recover from alcoholism.",
    category: "substance",
    focuses: ["alcohol"]
  },
  {
    id: 2,
    slug: "aca",
    name: "ACA",
    fullName: "Adult Children of Alcoholics",
    logo: acaLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A 12-step program for adults who grew up in alcoholic or dysfunctional homes, focusing on healing childhood trauma.",
    category: "family",
    focuses: ["trauma", "family"]
  },
  {
    id: 3,
    slug: "alateen",
    name: "Alateen",
    fullName: "Alateen Support Group",
    logo: alateenLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A recovery program for young people affected by someone else's drinking, providing peer support.",
    category: "family",
    focuses: ["youth", "family"]
  },
  {
    id: 4,
    slug: "al-anon",
    name: "Al-Anon",
    fullName: "Al-Anon Family Groups",
    logo: alanonLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "Support for families and friends of alcoholics, helping them cope with the effects of someone else's drinking.",
    category: "family",
    focuses: ["family", "support"]
  },
  {
    id: 5,
    slug: "na",
    name: "NA",
    fullName: "Narcotics Anonymous",
    logo: naLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A community of recovering addicts supporting each other in maintaining freedom from active addiction.",
    category: "substance",
    focuses: ["drugs", "narcotics"]
  },
  {
    id: 6,
    slug: "ca",
    name: "CA",
    fullName: "Cocaine Anonymous",
    logo: caLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A fellowship for people recovering from cocaine and all other mind-altering substances.",
    category: "substance",
    focuses: ["drugs", "cocaine"]
  },
  {
    id: 7,
    slug: "ga",
    name: "GA",
    fullName: "Gamblers Anonymous",
    logo: gaLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A fellowship helping people recover from gambling addiction through shared experience and hope.",
    category: "behavioral",
    focuses: ["gambling", "behavioral"]
  },
  {
    id: 8,
    slug: "sa",
    name: "SA",
    fullName: "Sexaholics Anonymous",
    logo: saLogo,
    logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const },
    description: "A fellowship for people seeking to achieve and maintain sexual sobriety.",
    category: "behavioral",
    focuses: ["behavioral", "recovery"]
  }
];

// Questions for the chatbot flow
const questions = [
  {
    id: 1,
    question: "What brings you here today?",
    options: [
      { label: "Substance Recovery", value: "substance", emoji: "💊" },
      { label: "Family Support", value: "family", emoji: "❤️" },
      { label: "Behavioral Support", value: "behavioral", emoji: "🧠" },
      { label: "Not Sure", value: "unsure", emoji: "🤔" }
    ]
  },
  {
    id: 2,
    question: "Have you attended recovery meetings before?",
    options: [
      { label: "Yes, regularly", value: "regular", emoji: "✅" },
      { label: "Yes, occasionally", value: "occasional", emoji: "🔄" },
      { label: "No, this is my first time", value: "first", emoji: "🌟" },
      { label: "Prefer not to say", value: "prefer_not", emoji: "🙏" }
    ]
  },
  {
    id: 3,
    question: "What's most important to you in a support group?",
    options: [
      { label: "Peer Support", value: "peer", emoji: "🤝" },
      { label: "Structured Program", value: "structure", emoji: "📋" },
      { label: "Flexibility", value: "flexibility", emoji: "🌈" },
      { label: "Confidentiality", value: "privacy", emoji: "🔒" }
    ]
  }
];

type ChatbotStep = "entry" | "questions" | "thinking" | "result";

export function PRCGuide() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatbotStep, setChatbotStep] = useState<ChatbotStep>("entry");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [matchedProgram, setMatchedProgram] = useState<typeof programs[0] | null>(null);
  const [matchScore, setMatchScore] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login", { state: { from: "/prc-guide" } });
    }
  }, [user, navigate]);

  const handleStartChatbot = () => {
    setChatbotStep("questions");
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: value };
    setAnswers(newAnswers);

    // Move to next question or to thinking state
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered - move to thinking state
      setChatbotStep("thinking");

      // Simulate ML processing
      setTimeout(() => {
        // Calculate matched program based on answers
        const match = calculateMatch(newAnswers);
        setMatchedProgram(match.program);
        setMatchScore(match.score);
        setChatbotStep("result");
      }, 3000);
    }
  };

  const calculateMatch = (userAnswers: { [key: number]: string }) => {
    // Simple matching algorithm based on first answer (category)
    const category = userAnswers[0];
    let filteredPrograms = programs;

    if (category === "substance") {
      filteredPrograms = programs.filter(p => p.category === "substance");
    } else if (category === "family") {
      filteredPrograms = programs.filter(p => p.category === "family");
    } else if (category === "behavioral") {
      filteredPrograms = programs.filter(p => p.category === "behavioral");
    }

    // Pick a random program from filtered list
    const selectedProgram = filteredPrograms[Math.floor(Math.random() * filteredPrograms.length)];
    const score = Math.floor(Math.random() * 10) + 91; // 91-100%

    return { program: selectedProgram, score };
  };

  const handleViewAllPrograms = () => {
    // Store the matched program in localStorage for highlighting
    if (matchedProgram) {
      localStorage.setItem("matchedProgramId", matchedProgram.id.toString());
    }
    // Mark that user has visited programs
    localStorage.setItem("hasVisitedPrograms", "true");
    navigate("/programs");
  };

  const handleSkip = () => {
    localStorage.setItem("hasVisitedPrograms", "true");
    navigate("/programs");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl text-gray-900">PRC Guide</h1>
              <p className="text-gray-600 mt-1">Let's find the right program for you</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[600px]">
        <AnimatePresence mode="wait">
          {/* Frame 1: Entry Point - Floating Chat Bubble */}
          {chatbotStep === "entry" && (
            <motion.div
              key="entry"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-8 justify-center min-h-[500px]"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl -z-10"
                />
              </motion.div>

              <div className="text-center max-w-md">
                <h2 className="text-3xl mb-4 text-gray-900">Hi! I'm the PRC Guide.</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Can I help you find the right program?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleStartChatbot}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg shadow-xl"
                  >
                    Yes, Let's Get Started! 🚀
                  </Button>
                  <Button
                    onClick={handleSkip}
                    size="lg"
                    variant="outline"
                    className="px-12 py-6 text-lg"
                  >
                    Browse All Programs
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Frame 2: Interactive Questions */}
          {chatbotStep === "questions" && (
            <motion.div
              key="questions"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <div className="flex gap-2">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-12 rounded-full transition-colors ${
                          idx <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-4xl text-gray-900 mb-2">
                  {questions[currentQuestionIndex].question}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <motion.div
                    key={option.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Button
                      onClick={() => handleAnswer(option.value)}
                      className="w-full h-auto py-8 px-6 text-left bg-white hover:bg-blue-50 text-gray-900 border-2 border-gray-200 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl group"
                      variant="outline"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform">
                          {option.emoji}
                        </span>
                        <span className="text-xl">{option.label}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Frame 3: Thinking/Processing Animation */}
          {chatbotStep === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-8 justify-center min-h-[500px]"
            >
              <div className="relative w-64 h-64">
                {/* Neural network nodes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full"
                    style={{
                      left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                      top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}

                {/* Center glow */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="w-16 h-16 text-purple-600" />
                </motion.div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl mb-2 text-gray-900">Analyzing your preferences...</h2>
                <p className="text-gray-600">
                  Finding your perfect match
                </p>
              </div>
            </motion.div>
          )}

          {/* Frame 4: Matched Program Result */}
          {chatbotStep === "result" && matchedProgram && (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-8"
              >
                <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-2xl font-semibold shadow-lg mb-4">
                  {matchScore}% Match! 🎉
                </div>
                <h2 className="text-4xl text-gray-900 mb-2">We found your program!</h2>
              </motion.div>

              <Card className="overflow-hidden shadow-2xl border-4 border-blue-500">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white text-center">
                    <motion.img
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      src={matchedProgram.logo}
                      alt={matchedProgram.name}
                      className="mx-auto mb-6"
                      style={matchedProgram.logoStyle}
                    />
                    <h3 className="text-5xl mb-2">{matchedProgram.name}</h3>
                    <p className="text-2xl text-blue-100">{matchedProgram.fullName}</p>
                  </div>

                  <div className="p-8 bg-white">
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                      {matchedProgram.description}
                    </p>

                    <Button
                      onClick={handleViewAllPrograms}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-xl shadow-lg"
                    >
                      See All Programs →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}