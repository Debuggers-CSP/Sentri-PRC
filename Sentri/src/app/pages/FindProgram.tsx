import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import { PRCGuidePanel } from "./PRCGuide";
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
    shortIntro: "Support for alcohol addiction recovery through shared experience and the 12-step program.",
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
    shortIntro: "Healing childhood trauma from growing up in alcoholic or dysfunctional homes.",
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
    shortIntro: "Peer support for teens affected by someone else's drinking.",
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
    shortIntro: "Support for families and friends affected by a loved one's alcoholism.",
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
    shortIntro: "Recovery community for those seeking freedom from drug addiction.",
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
    shortIntro: "Recovery fellowship for cocaine and other substance addictions.",
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
    shortIntro: "Support for overcoming compulsive gambling through peer fellowship.",
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
    shortIntro: "Fellowship for achieving sexual sobriety and healthy relationships.",
    category: "behavioral",
    focuses: ["behavioral", "recovery"]
  }
];

export function FindProgram() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [matchedProgramId, setMatchedProgramId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/programs" } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!matchedProgramId) {
      return;
    }

    const matchedCard = document.getElementById(`program-card-${matchedProgramId}`);
    if (matchedCard) {
      matchedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [matchedProgramId]);

  if (!user) {
    return null;
  }

  const getMatchScore = (programId: number) => {
    return 85 + (programId * 3) % 12;
  };

  const handleProgramClick = (programSlug: string) => {
    navigate(`/programs/${programSlug}`);
  };

  const handleGuideMatch = (programId: number) => {
    setMatchedProgramId(programId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Explore Our Programs</h2>
            <p className="text-gray-600 text-lg mb-4">
              Hover over each program to see your match score and learn more
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, idx) => {
              const matchScore = getMatchScore(program.id);
              const isHovered = hoveredProgram === program.id;
              const isMatchedProgram = matchedProgramId === program.id;

              return (
                <motion.div
                  key={program.id}
                  id={`program-card-${program.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredProgram(program.id)}
                  onMouseLeave={() => setHoveredProgram(null)}
                >
                  <Card
                    className={`overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full relative group ${
                      isMatchedProgram ? "border-4 border-green-500 shadow-2xl ring-4 ring-green-200" : ""
                    }`}
                    onClick={() => handleProgramClick(program.slug)}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      {isMatchedProgram && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                            <span>Your Match!</span>
                            <span>🎉</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-center h-full min-h-[180px] mb-4">
                        <img
                          src={program.logo}
                          alt={`${program.name} logo`}
                          style={program.logoStyle}
                          className="transition-transform group-hover:scale-105"
                        />
                      </div>

                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-b from-blue-600/95 to-purple-600/95 p-6 flex flex-col justify-between text-white"
                          >
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                              <p className="text-sm text-blue-100 mb-4">{program.fullName}</p>
                              <p className="text-sm leading-relaxed">{program.shortIntro}</p>
                            </div>
                            <div className="mt-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                                <div className="text-3xl font-bold">{matchScore}%</div>
                                <div className="text-xs text-blue-100">Match Score</div>
                              </div>
                              <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50">
                                View Details →
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <div className="fixed bottom-8 left-8 z-40 flex flex-col items-center">
        {!isGuideOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-4 max-w-[270px] rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-xl"
          >
            Hello! Click on me to find the right program for you.
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-blue-100 bg-white" />
          </motion.div>
        )}

        <motion.button
          type="button"
          className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsGuideOpen((prev) => !prev)}
        >
          <Bot className="h-7 w-7" />
        </motion.button>
      </div>

      <PRCGuidePanel
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onMatch={handleGuideMatch}
      />
    </div>
  );
}