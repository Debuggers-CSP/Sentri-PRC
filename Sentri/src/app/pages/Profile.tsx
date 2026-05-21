import { useEffect, useMemo, useState, useRef, useCallback, type ComponentType } from "react";
import { Calendar, LayoutDashboard, Leaf, Sprout, Sparkles, Wind, Star, Heart, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindMeeting } from "./FindMeeting";
import { ProgramDetail } from "./ProgramDetail";
import { PRCGuidePanel, type GuideAnswers } from "./PRCGuide";
import sproutGif from "../../assets/garden/sprout.gif";

// Icons mapping for programs
import aaLogo from "../../assets/735899c7aa27fedc5bfff3f073c9492f49572a67.png";
import acaLogo from "../../assets/054168f67c068da00639dd1c8048e86acf2571ca.png";
import alateenLogo from "../../assets/2c91f86ad959487223d3461bd473cbc2855a8351.png";
import alanonLogo from "../../assets/3c35ee6fefb6bfce531c22f63b9380fedac4d6a6.png";
import naLogo from "../../assets/2115c4842bd36bd47cd1708c3d26e2e14999ef8a.png";
import caLogo from "../../assets/58e3f4b9794493f73bea7d751b9df8993b8c105f.png";
import gaLogo from "../../assets/675121813725057c96f90900dde1cdb27e6a8031.png";
import saLogo from "../../assets/50593eb25097566896b0e6a4b491eabb700c98a6.png";

interface Meeting { id: number; program_id?: string; name: string; date: string; time: string; location: string; type: string; }
interface DashboardProgram { program_id: string; fullName: string; last_message: { text: string; timestamp: string | null; }; }
interface DbUserDetails { username: string; email: string; fname: string; lname: string; joined_program?: string | null; }
type MainTab = "dashboard" | "tracker" | "programs" | "meetings";

type ProgramCardInfo = {
  id: number;
  slug: string;
  name: string;
  fullName: string;
  logo: string;
  logoStyle: { width: string; height: string; objectFit: "contain"; };
  shortIntro: string;
};

const allPrograms: ProgramCardInfo[] = [
  { id: 1, slug: "aa", name: "AA", fullName: "Alcoholics Anonymous", logo: aaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Support for alcohol addiction recovery through shared experience and the 12-step program." },
  { id: 2, slug: "aca", name: "ACA", fullName: "Adult Children of Alcoholics", logo: acaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Healing childhood trauma from growing up in alcoholic or dysfunctional homes." },
  { id: 3, slug: "alateen", name: "Alateen", fullName: "Alateen Support Group", logo: alateenLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Peer support for teens affected by someone else's drinking." },
  { id: 4, slug: "al-anon", name: "Al-Anon", fullName: "Al-Anon Family Groups", logo: alanonLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Support for families and friends affected by a loved one's alcoholism." },
  { id: 5, slug: "na", name: "NA", fullName: "Narcotics Anonymous", logo: naLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Recovery community for those seeking freedom from drug addiction." },
  { id: 6, slug: "ca", name: "CA", fullName: "Cocaine Anonymous", logo: caLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Recovery fellowship for cocaine and other substance addictions." },
  { id: 7, slug: "ga", name: "GA", fullName: "Gamblers Anonymous", logo: gaLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Support for overcoming compulsive gambling through peer fellowship." },
  { id: 8, slug: "sa", name: "SA", fullName: "Sexaholics Anonymous", logo: saLogo, logoStyle: { width: "180px", height: "180px", objectFit: "contain" }, shortIntro: "Fellowship for achieving sexual sobriety and healthy relationships." },
];

const programVisuals: Record<string, { logo: string; name: string }> = {
  aa: { logo: aaLogo, name: "Alcoholics Anonymous" },
  aca: { logo: acaLogo, name: "Adult Children of Alcoholics" },
  alateen: { logo: alateenLogo, name: "Alateen Support Group" },
  alanon: { logo: alanonLogo, name: "Al-Anon Family Groups" },
  "al-anon": { logo: alanonLogo, name: "Al-Anon Family Groups" },
  na: { logo: naLogo, name: "Narcotics Anonymous" },
  ca: { logo: caLogo, name: "Cocaine Anonymous" },
  ga: { logo: gaLogo, name: "Gamblers Anonymous" },
  sa: { logo: saLogo, name: "Sexaholics Anonymous" },
};

const normalizeProgramId = (programId: string) => (programId === "alanon" ? "al-anon" : programId);

const formatMessageTimestamp = (timestamp: string | null) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  if (date >= todayStart) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (date >= yesterdayStart) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const isUnreadMessage = (timestamp: string | null) => {
  if (!timestamp) return false;
  const created = new Date(timestamp);
  return !Number.isNaN(created.getTime()) && (Date.now() - created.getTime() <= 2 * 60 * 60 * 1000);
};

export function Profile() {
  const [sobrietyDate, setSobrietyDate] = useState<string>(() => localStorage.getItem("sobrietyStartDate") || "");
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dashboardPrograms, setDashboardPrograms] = useState<DashboardProgram[]>([]);
  const [dbUser, setDbUser] = useState<DbUserDetails | null>(null);
  const [activeProgramModalId, setActiveProgramModalId] = useState<string | null>(null);
  const [activeProgramModalSource, setActiveProgramModalSource] = useState<"dashboard" | "programs" | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [matchedProgramId, setMatchedProgramId] = useState<number | null>(null);
  const [hoveredProgramId, setHoveredProgramId] = useState<number | null>(null);
  const [, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeText, setGratitudeText] = useState("");
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dailyQuotes = ["One day at a time.", "Progress, not perfection.", "Belief creates the actual fact.", "Recovery is a journey, not a destination.", "Small steps lead to big changes."];
  const dailyQuote = useMemo(() => dailyQuotes[new Date().getDate() % dailyQuotes.length], []);
  type TrackerMainProps = { userName?: string; startDate: string };
  const TrackerMainTyped = TrackerMain as ComponentType<TrackerMainProps>;

  const handleSetDate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateInput = (e.target as any).date.value;
    setSobrietyDate(dateInput);
    localStorage.setItem("sobrietyStartDate", dateInput);
  };

  const handleScratch = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
  };

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;
    setIsJarOpen(false);
    setIsAnimating(true);
    new Audio("https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3").play().catch(() => {});
    setTimeout(() => {
      setGratitudeCount(prev => prev + 1);
      setIsAnimating(false);
      setGratitudeText("");
    }, 1200);
  };

  const handleGuideMatch = async (programId: number, answers: GuideAnswers) => {
    setMatchedProgramId(null);
    try {
      const response = await fetch(`${pythonURI}/api/ml/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(answers)
      });
      const data = (await response.json()) as Record<string, number>;
      const bestProgramName = Object.entries(data).sort((a, b) => b[1] - a[1])[0]?.[0];
      const bestProgram = allPrograms.find((p) => p.name === bestProgramName);
      setMatchedProgramId(bestProgram?.id ?? programId);
    } catch { setMatchedProgramId(programId); }
  };

  useEffect(() => {
    if (!matchedProgramId) return;
    const matchedCard = document.getElementById(`program-card-${matchedProgramId}`);
    if (matchedCard) matchedCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [matchedProgramId]);

  useEffect(() => {
    if (activeTab === "dashboard" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.globalCompositeOperation = "source-over"; 
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#064e3b");
        gradient.addColorStop(0.5, "#005A2C");
        gradient.addColorStop(1, "#064e3b");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 10px sans-serif";
        ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2);
      }
    }
  }, [activeTab, contentVisible]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const summaryRes = await fetch(`${pythonURI}/get-dashboard-summary/${user.id}`, fetchOptions);
      if (summaryRes.ok) {
        const summary = await summaryRes.json();
        setDashboardPrograms(summary.programs || []);
        setMeetings(summary.meetings || []);
      }
      const userRes = await fetch(`${pythonURI}/get-user-details?user_id=${user.id}`, fetchOptions);
      if (userRes.ok) setDbUser(await userRes.json());
    } catch (error) {
      console.error("Fetch dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
    window.addEventListener("sentri-programs-updated", fetchDashboardData);
    window.addEventListener("sentri-meetings-updated", fetchDashboardData);
    return () => {
      window.removeEventListener("sentri-programs-updated", fetchDashboardData);
      window.removeEventListener("sentri-meetings-updated", fetchDashboardData);
    };
  }, [fetchDashboardData]);

  useEffect(() => {
    if (activeProgramModalId === null) {
      fetchDashboardData();
    }
  }, [activeProgramModalId, fetchDashboardData]);

  useEffect(() => {
    setContentVisible(false);
    const fadeInTimer = window.setTimeout(() => setContentVisible(true), 120);
    return () => window.clearTimeout(fadeInTimer);
  }, [activeTab]);

  const joinedProgramIds = useMemo(() => {
    const raw = dbUser?.joined_program || "";
    if (!raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((v) => normalizeProgramId(String(v).trim())).filter(Boolean);
    } catch { return raw.split(",").map((v) => normalizeProgramId(v.trim())).filter(Boolean); }
    return [];
  }, [dbUser?.joined_program]);

  const displayedPrograms = useMemo(() => dashboardPrograms.filter((p) => joinedProgramIds.includes(normalizeProgramId(p.program_id))), [dashboardPrograms, joinedProgramIds]);

  const fullName = dbUser ? `${dbUser.fname} ${dbUser.lname}` : user.username || "Member";
  const email = dbUser?.email || user.email || "";
  const cardShell = "h-full rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]";

const renderDashboardHome = () => (
    <Card className="h-full rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
      <CardContent className="flex h-full flex-col gap-5 p-4 md:p-5">
        
        {/* HEADER SECTION: Changed to flex-col on mobile to prevent overflow */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Dashboard Pill */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </div>

          {/* Group: Scratcher and Jar - Centered on mobile, Right-aligned on desktop */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            
            {/* SCRATCH CARD: Reduced width on mobile to fit screen */}
            <div className="relative h-10 w-full max-w-[240px] md:w-64 overflow-hidden rounded-full border-2 border-white bg-white shadow-md shrink-0">
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center select-none">
                <p className="text-[10px] md:text-[11px] font-bold italic text-[#005A2C] line-clamp-1">"{dailyQuote}"</p>
              </div>
              <canvas 
                ref={canvasRef} 
                onMouseMove={handleScratch} 
                onTouchMove={handleScratch} 
                className="absolute inset-0 z-10 cursor-crosshair touch-none" 
              />
            </div>

            {/* GRATITUDE JAR */}
            <div className="relative z-50 shrink-0">
                {isAnimating && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-yellow-400 animate-[starHeroAction_1.2s_ease-in-out] pointer-events-none">
                    <Star className="h-10 w-10 fill-current" />
                  </div>
                )}
                <div onClick={() => setIsJarOpen(!isJarOpen)} 
                     className={`relative w-10 h-14 md:w-12 md:h-16 cursor-pointer transition-all hover:scale-110 active:scale-95 ${isAnimating ? "animate-[jarImpact_1.2s_ease-in-out]" : ""}`}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#005A2C] rounded-t-sm z-30 shadow-sm" />
                  <div className="absolute inset-0 top-1 rounded-b-xl rounded-t-md border-2 border-white/50 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                    <div className="flex h-full w-full flex-wrap-reverse content-start justify-center gap-0.5 p-1 pt-4">
                      {[...Array(Math.min(gratitudeCount, 12))].map((_, i) => (
                        <Star key={i} className="h-2 w-2 text-yellow-300 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {isJarOpen && (
                  /* Changed to fixed and centered on mobile so it doesn't float off-screen */
                  <div className="fixed md:absolute top-1/2 md:top-20 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 w-[90%] max-w-[280px] md:w-64 rounded-[20px] border border-[#E0EADD] bg-white p-4 shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-2 mb-2 text-[#005A2C]">
                      <Heart className="h-3 w-3 fill-current" />
                      <h4 className="text-[10px] font-bold uppercase">Add Gratitude</h4>
                      <button onClick={() => setIsJarOpen(false)} className="ml-auto md:hidden"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleAddGratitude} className="flex flex-col gap-2">
                      <textarea autoFocus value={gratitudeText} onChange={(e) => setGratitudeText(e.target.value)}
                                className="w-full rounded-lg border-none bg-[#F8FAF5] p-2 text-base md:text-[11px] text-[#124627] outline-none h-20 placeholder:text-gray-400"
                                placeholder="What are you grateful for?" />
                      <Button type="submit" className="bg-[#005A2C] text-white rounded-lg h-10 font-bold">Drop In</Button>
                    </form>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Welcome Text: Ensure it doesn't wrap weirdly */}
        <div className="mt-2">
          <h1 className="text-2xl md:text-[38px] leading-tight font-semibold text-[#005A2C]">
            Welcome back, <br className="md:hidden" />
            <span className="text-[#2D5138]">{fullName}</span>
          </h1>
          <p className="mt-1 text-xs md:text-sm text-[#5A7462] opacity-80">{email}</p>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-[#355844]">Program Zone</h2>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {displayedPrograms.length > 0 ? displayedPrograms.map((program) => (
                <button key={program.program_id} onClick={() => { setActiveProgramModalId(normalizeProgramId(program.program_id)); setActiveProgramModalSource("dashboard"); }}
                        className="flex w-full items-center gap-3 rounded-[18px] border border-[#DFE9DD] bg-white px-3 py-3 text-left transition hover:border-[#B8D7A9] hover:bg-[#F6FBF1]">
                  <img src={programVisuals[normalizeProgramId(program.program_id)]?.logo} alt="logo" className="h-12 w-12 flex-none rounded-full border border-[#DCEAD8] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#173723]">{programVisuals[normalizeProgramId(program.program_id)]?.name || program.fullName}</p>
                    <p className="truncate text-xs text-[#617765]">{program.last_message?.text || "No messages yet"}</p>
                  </div>
                  <div className="ml-2 flex flex-col items-end gap-1">
                    <span className="text-[11px] text-[#6A7F70]">{formatMessageTimestamp(program.last_message?.timestamp)}</span>
                    {isUnreadMessage(program.last_message?.timestamp) && <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />}
                  </div>
                </button>
              )) : <p className="px-2 py-5 text-sm text-[#6B7F70]">Join programs to view conversations here.</p>}
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-[#355844]">Meetings Zone</h2>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {meetings.length > 0 ? meetings.map((m) => (
                <div key={m.id} className="rounded-[16px] border border-[#DFE9DD] bg-white px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-[#173723]">{m.name}</p>
                  <p className="text-xs text-[#5F7565]">{m.date} • {m.time}</p>
                </div>
              )) : <p className="px-2 text-sm text-[#6B7F70]">No meetings scheduled.</p>}
            </div>
          </section>
        </div>

        <section className="rounded-[20px] border border-[#DCEAD8] bg-[#F8FAF5] p-3 flex items-center gap-3">
          <img src={sproutGif} alt="sprout" className="h-10 w-10 object-contain" />
          <p className="text-sm font-semibold text-[#005A2C]">Recovery Tracker: Keep checking in!</p>
        </section>
      </CardContent>
    </Card>
  );

  const renderProgramsTab = () => (
    <Card className={cardShell}>
      <CardContent className="h-full p-4">
        <div className="grid h-full grid-cols-1 gap-6 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3 pr-1">
          {allPrograms.map((program, idx) => (
            <motion.div key={program.id} id={`program-card-${program.id}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}
                        onMouseEnter={() => setHoveredProgramId(program.id)} onMouseLeave={() => setHoveredProgramId(null)}>
              <Card className={`overflow-hidden border border-[#E0EADD] rounded-[24px] hover:shadow-2xl transition-all cursor-pointer h-full relative group ${matchedProgramId === program.id ? "border-4 border-[#76B82A] ring-4 ring-[#D4EEC0]" : ""}`}
                    onClick={() => { setActiveProgramModalId(program.slug); setActiveProgramModalSource("programs"); }}>
                <CardContent className="p-6 h-full flex flex-col">
                  {matchedProgramId === program.id && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#76B82A] to-[#005A2C] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                      <span>Your Match!</span> 🎉
                    </div>
                  )}
                  <div className="flex items-center justify-center h-full min-h-[180px] mb-4">
                    <img src={program.logo} alt="logo" style={program.logoStyle} className="transition-transform group-hover:scale-105" />
                  </div>
                  <AnimatePresence>
                    {hoveredProgramId === program.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-b from-[#005A2C]/95 to-[#2D6A37]/95 p-6 flex flex-col text-white">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                            <p className="text-sm text-[#E8F5E9] mb-3">{program.fullName}</p>
                            <p className="text-sm leading-relaxed line-clamp-3">{program.shortIntro}</p>
                          </div>
                          <Button className="w-full mt-4 bg-white text-[#005A2C] hover:bg-[#F1F8EB]">View Details →</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCenterContent = () => {
    if (activeTab === "tracker") return (
      <div className="h-full rounded-[30px] border border-[#E0EADD] bg-white p-6 shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
        {!sobrietyDate ? (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
            <div className="p-4 bg-[#F1F8EB] rounded-full"><Calendar className="h-10 w-10 text-[#005A2C]" /></div>
            <h2 className="text-2xl font-bold text-[#005A2C]">Set Your Start Date</h2>
            <form onSubmit={handleSetDate} className="w-full space-y-4">
              <input name="date" type="date" required className="w-full p-3 rounded-xl border border-[#E0EADD] bg-[#F8FAF5] outline-none" />
              <Button type="submit" className="w-full bg-[#005A2C] text-white py-6 rounded-xl font-bold">Start My Streak</Button>
            </form>
          </div>
        ) : (
          <div className="h-full p-2">
            <TrackerMainTyped userName={dbUser?.fname || user.username || "Guest"} startDate={sobrietyDate} />
            <button onClick={() => {setSobrietyDate(""); localStorage.removeItem("sobrietyStartDate");}} className="mt-4 text-[10px] text-gray-400 hover:text-red-500 underline">Reset Start Date</button>
          </div>
        )}
      </div>
    );
    if (activeTab === "programs") return renderProgramsTab();
    if (activeTab === "meetings") return <Card className={cardShell}><CardContent className="h-full p-4"><FindMeeting embedded /></CardContent></Card>;
    return renderDashboardHome();
  };

  return (
    /* We change fixed height to 'min-h' on mobile so content doesn't get cut off by the iPhone notch */
/* We use dvh (Dynamic Viewport Height) to account for Safari's bottom bars */
      <div className="min-h-[calc(100dvh-97px)] md:h-[calc(100vh-97px)] w-full overflow-x-hidden md:overflow-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_55%,#E8F5E9_100%)] pb-[env(safe-area-inset-bottom)]">      <style>{`
        @keyframes starHeroAction {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30% { transform: scale(1.8) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 20px #fbbf24); }
          50% { transform: scale(1.5) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 30px #fbbf24); }
          100% { transform: translateY(150px) scale(0.3) rotate(20deg); opacity: 0; }
        }
        @keyframes jarImpact { 0%, 100% { transform: scale(1); } 85% { transform: scale(1); } 92% { transform: scale(1.1) rotate(2deg); } }
        
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* FIX: Prevents iPhone from shifting the layout when you click an input */
        input, textarea, select {
          font-size: 16px !important;
        }
      `}</style>

      {/* --- PRC GUIDE BOT --- */}
      {activeTab === "programs" && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end">
            {!isGuideOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:block relative mb-4 mr-2 max-w-[240px] rounded-2xl border border-[#DCEAD8] bg-white px-4 py-3 text-sm text-[#2D5138] shadow-2xl"
              >
                Find the right program for you.
                <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b border-r border-[#DCEAD8] bg-white" />
              </motion.div>
            )}

            <motion.button
              className="rounded-full bg-gradient-to-r from-[#76B82A] to-[#005A2C] p-3 md:p-4 text-white shadow-2xl"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsGuideOpen(!isGuideOpen)}
            >
              <Bot className="h-6 w-6 md:h-7 md:h-7" />
            </motion.button>
        </div>
      )}

      <PRCGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} onMatch={handleGuideMatch} />

      {/* MAIN GRID: Stacks on iPhone, Side-by-Side on Desktop */}
      <div className="flex flex-col md:grid md:grid-cols-[260px_1fr] h-full w-full gap-4 p-3 md:p-4">
        
        {/* SIDEBAR/TOP MENU */}
        <aside className="shrink-0 h-auto md:h-full rounded-[22px] md:rounded-[30px] border border-[#DCEAD8] bg-white/95 p-2 md:p-3 shadow-md">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible custom-scrollbar">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
              { key: "programs", label: "Programs", icon: <Leaf className="h-4 w-4" /> },
              { key: "meetings", label: "Meetings", icon: <Calendar className="h-4 w-4" /> },
              { key: "tracker", label: "Recovery Tracker", icon: <Sprout className="h-4 w-4" /> },
            ].map((item) => (
              <button 
                key={item.key} 
                onClick={() => setActiveTab(item.key as MainTab)}
                className={`flex flex-shrink-0 items-center gap-2 md:gap-3 rounded-xl border px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === item.key 
                    ? "border-[#A3D977] bg-[#E8F5E9] text-[#005A2C] shadow-[inset_3px_0_0_0_#76B82A]" 
                    : "border-transparent text-[#355844] hover:bg-[#F8FAF5]"
                }`}
              >
                {item.icon} <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <section className="min-h-0 flex-1 rounded-[22px] md:rounded-[30px] border border-[#DCEAD8]/70 bg-[#F8FAF5]/50 p-3 md:p-4">
          <div className={`h-full transition-opacity duration-300 ${contentVisible ? "opacity-100" : "opacity-0"}`}>
            {renderCenterContent()}
          </div>
        </section>
      </div>

      {activeProgramModalId && (
        /* We use 'fixed' and a higher z-index to ensure it sits on top of everything correctly */
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 md:p-4" onClick={() => setActiveProgramModalId(null)}>
          {/* Change h-[92vh] to h-[90dvh] so the 'Close' button isn't hidden by the notch */}
          <div className="h-[90dvh] md:h-[88vh] w-full max-w-6xl overflow-hidden rounded-[26px] bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 overflow-y-auto">
              <ProgramDetail programIdOverride={activeProgramModalId} viewMode={activeProgramModalSource} embeddedModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}