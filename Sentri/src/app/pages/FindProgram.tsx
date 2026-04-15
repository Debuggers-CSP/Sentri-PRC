import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { PRCGuidePanel, type GuideAnswers } from "./PRCGuide";
import { pythonURI } from "../../../../assets/js/api/config.js";
import aaLogo from "../../assets/735899c7aa27fedc5bfff3f073c9492f49572a67.png";
import acaLogo from "../../assets/054168f67c068da00639dd1c8048e86acf2571ca.png";
import alateenLogo from "../../assets/2c91f86ad959487223d3461bd473cbc2855a8351.png";
import alanonLogo from "../../assets/3c35ee6fefb6bfce531c22f63b9380fedac4d6a6.png";
import naLogo from "../../assets/2115c4842bd36bd47cd1708c3d26e2e14999ef8a.png";
import caLogo from "../../assets/58e3f4b9794493f73bea7d751b9df8993b8c105f.png";
import gaLogo from "../../assets/675121813725057c96f90900dde1cdb27e6a8031.png";
import saLogo from "../../assets/50593eb25097566896b0e6a4b491eabb700c98a6.png";

const programs = [
  { id: 1, slug: "aa", name: "AA", fullName: "Alcoholics Anonymous", logo: aaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Support for alcohol addiction recovery through shared experience and the 12-step program." },
  { id: 2, slug: "aca", name: "ACA", fullName: "Adult Children of Alcoholics", logo: acaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Healing childhood trauma from growing up in alcoholic or dysfunctional homes." },
  { id: 3, slug: "alateen", name: "Alateen", fullName: "Alateen Support Group", logo: alateenLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Peer support for teens affected by someone else's drinking." },
  { id: 4, slug: "al-anon", name: "Al-Anon", fullName: "Al-Anon Family Groups", logo: alanonLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Support for families and friends affected by a loved one's alcoholism." },
  { id: 5, slug: "na", name: "NA", fullName: "Narcotics Anonymous", logo: naLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Recovery community for those seeking freedom from drug addiction." },
  { id: 6, slug: "ca", name: "CA", fullName: "Cocaine Anonymous", logo: caLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Recovery fellowship for cocaine and other substance addictions." },
  { id: 7, slug: "ga", name: "GA", fullName: "Gamblers Anonymous", logo: gaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Support for overcoming compulsive gambling through peer fellowship." },
  { id: 8, slug: "sa", name: "SA", fullName: "Sexaholics Anonymous", logo: saLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" as const }, shortIntro: "Fellowship for achieving sexual sobriety and healthy relationships." }
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
    if (!matchedProgramId) return;
    const matchedCard = document.getElementById(`program-card-${matchedProgramId}`);
    if (matchedCard) matchedCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [matchedProgramId]);

  if (!user) return null;

  const handleProgramClick = (programSlug: string) => navigate(`/programs/${programSlug}`);

  const handleGuideMatch = async (programId: number, answers: GuideAnswers) => {
  
    setMatchedProgramId(null);

    try {
      const response = await fetch(`${pythonURI}/api/ml/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(answers)
      });

      if (!response.ok) {
        throw new Error(`ML match request failed with status ${response.status}`);
      }

      const data = (await response.json()) as Record<string, number>;
      const bestProgramName = Object.entries(data).sort((a, b) => b[1] - a[1])[0]?.[0];
      const bestProgram = programs.find((program) => program.name === bestProgramName);
      setMatchedProgramId(bestProgram?.id ?? programId);
    } catch (error) {
      console.error("Failed to fetch ML match result:", error);
      setMatchedProgramId(programId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF5] to-[#E8F5E9]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[600px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F3B2B] mb-4">Explore Our Programs</h2>
            <p className="text-[#5A7462] text-lg mb-4">Hover over each program to learn more</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, idx) => {
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
                    className={`overflow-hidden border border-[#E0EADD] rounded-[24px] hover:shadow-2xl transition-all cursor-pointer h-full relative group ${isMatchedProgram ? "border-4 border-[#76B82A] shadow-2xl ring-4 ring-[#D4EEC0]" : ""}`}
                    onClick={() => handleProgramClick(program.slug)}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      {isMatchedProgram && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-gradient-to-r from-[#76B82A] to-[#005A2C] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                            <span>Your Match!</span>
                            <span>🎉</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-center h-full min-h-[180px] mb-4">
                        <img src={program.logo} alt={`${program.name} logo`} style={program.logoStyle} className="transition-transform group-hover:scale-105" />
                      </div>

                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-b from-[#005A2C]/95 to-[#2D6A37]/95 p-6 flex flex-col justify-between text-white"
                          >
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                              <p className="text-sm text-[#E8F5E9] mb-4">{program.fullName}</p>
                              <p className="text-sm leading-relaxed">{program.shortIntro}</p>
                            </div>
                            <div className="mt-4">
                              <Button className="w-full mt-4 bg-white text-[#005A2C] hover:bg-[#F1F8EB]">View Details →</Button>
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
            className="relative mb-4 max-w-[270px] rounded-2xl border border-[#DCEAD8] bg-white px-4 py-3 text-sm text-[#2D5138] shadow-xl"
          >
            Hello! Click on me to find the right program for you.
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-[#DCEAD8] bg-white" />
          </motion.div>
        )}

        <motion.button
          type="button"
          className="rounded-full bg-gradient-to-r from-[#76B82A] to-[#005A2C] p-4 text-white shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsGuideOpen((prev) => !prev)}
        >
          <Bot className="h-7 w-7" />
        </motion.button>
      </div>

      <PRCGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} onMatch={handleGuideMatch} />
    </div>
  );
}