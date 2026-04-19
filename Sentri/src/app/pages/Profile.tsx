import { useEffect, useMemo, useState, useRef } from "react";
import { Calendar, LayoutDashboard, Leaf, Sprout, Sparkles, Wind, Star, Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindProgram } from "./FindProgram";
import { FindMeeting } from "./FindMeeting";
import sproutGif from "../../assets/garden/sprout.gif";

// Icons mapping for programs (KEEPING AS IS)
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

const programVisuals: Record<string, { logo: string; name: string }> = {
  aa: { logo: aaLogo, name: "Alcoholics Anonymous" },
  aca: { logo: acaLogo, name: "Adult Children of Alcoholics" },
  alateen: { logo: alateenLogo, name: "Alateen Support Group" },
  alanon: { logo: alanonLogo, name: "Al-Anon Family Groups" },
  na: { logo: naLogo, name: "Narcotics Anonymous" },
  ca: { logo: caLogo, name: "Cocaine Anonymous" },
  ga: { logo: gaLogo, name: "Gamblers Anonymous" },
  sa: { logo: saLogo, name: "Sexaholics Anonymous" },
};

export function Profile() {

  // Inside Profile function
const [sobrietyDate, setSobrietyDate] = useState<string>(() => {
  return localStorage.getItem("sobrietyStartDate") || "";
});

const handleSetDate = (e: React.FormEvent) => {
  e.preventDefault();
  const dateInput = (e.target as any).date.value;
  setSobrietyDate(dateInput);
  localStorage.setItem("sobrietyStartDate", dateInput);
};
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dashboardPrograms, setDashboardPrograms] = useState<DashboardProgram[]>([]);
  const [dbUser, setDbUser] = useState<DbUserDetails | null>(null);
  const [, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);

  // --- INTERACTIVE STATES ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeText, setGratitudeText] = useState("");
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dailyQuotes = ["One day at a time.", "Progress, not perfection.", "Belief creates the actual fact.", "Recovery is a journey, not a destination.", "Small steps lead to big changes."];
  const dailyQuote = useMemo(() => dailyQuotes[new Date().getDate() % dailyQuotes.length], []);

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

  // --- INITIALIZE CANVAS WITH TEXT ---
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
        
        // WHITE TEXT OVER GREEN PILL
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 10px sans-serif";
        ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2);
      }
    }
  }, [activeTab, contentVisible]);

  // Data Fetching (STRICTLY KEPT)
  useEffect(() => {
    const fetchData = async () => {
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
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    setContentVisible(false);
    const fadeInTimer = window.setTimeout(() => setContentVisible(true), 120);
    return () => window.clearTimeout(fadeInTimer);
  }, [activeTab]);

  const fullName = dbUser ? `${dbUser.fname} ${dbUser.lname}` : user.username || "Member";
  const email = dbUser?.email || user.email || "";

  const renderDashboardHome = () => (
    <Card className="h-full rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </div>

          {/* SCRATCH CARD PILL */}
          <div className="relative h-10 w-64 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center select-none">
              <p className="text-[11px] font-bold italic text-[#005A2C]">"{dailyQuote}"</p>
            </div>
            <canvas ref={canvasRef} onMouseMove={handleScratch} onTouchMove={handleScratch} className="absolute inset-0 z-10 cursor-crosshair touch-none" />
          </div>
        </div>

        <div>
          <h1 className="text-[clamp(28px,3vw,38px)] leading-[1.06] tracking-[-0.02em] text-[#005A2C]">Welcome back, {fullName}</h1>
          <p className="mt-1 text-sm text-[#5A7462]">{email}</p>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-[#355844]">Program Zone</h2>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {dashboardPrograms.length > 0 ? dashboardPrograms.map((p) => (
                <button key={p.program_id} className="flex w-full items-center gap-3 rounded-[18px] border border-[#DFE9DD] bg-white px-3 py-3 text-left transition hover:border-[#B8D7A9] hover:bg-[#F6FBF1]">
                  <img src={programVisuals[p.program_id]?.logo} alt="logo" className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#173723]">{programVisuals[p.program_id]?.name}</p>
                    <p className="truncate text-xs text-[#617765]">{p.last_message.text}</p>
                  </div>
                </button>
              )) : <p className="px-2 text-sm text-[#6B7F70]">Join a program to start.</p>}
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

  const renderCenterContent = () => {
   if (activeTab === "tracker") {
  return (
    <div className="h-full rounded-[30px] border border-[#E0EADD] bg-white p-6 shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
      {!sobrietyDate ? (
        // SETUP VIEW: Show if no date is set
        <div className="flex h-full flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
          <div className="p-4 bg-[#F1F8EB] rounded-full">
            <Calendar className="h-10 w-10 text-[#005A2C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#005A2C]">Set Your Start Date</h2>
            <p className="text-sm text-[#5A7462] mt-2">
              Before your Poway Recovery Garden can grow, please enter the date your journey began.
            </p>
          </div>
          
          <form onSubmit={handleSetDate} className="w-full space-y-4">
            <input 
              name="date"
              type="date" 
              required
              className="w-full p-3 rounded-xl border border-[#E0EADD] bg-[#F8FAF5] text-[#1F3B2B] focus:ring-2 focus:ring-[#76B82A] outline-none"
            />
            <Button type="submit" className="w-full bg-[#005A2C] hover:bg-[#124627] text-white py-6 rounded-xl font-bold">
              Start My Streak
            </Button>
          </form>
        </div>
      ) : (
        // GARDEN VIEW: Show once date is set
        <div className="h-full p-2">
           {/* We pass the sobrietyDate to your TrackerMain component */}
          <TrackerMain 
            userName={dbUser?.fname || user.username || "Guest User"} 
            startDate={sobrietyDate} 
          />
          <button 
            onClick={() => {setSobrietyDate(""); localStorage.removeItem("sobrietyStartDate");}}
            className="mt-4 text-[10px] text-gray-400 hover:text-red-500 underline"
          >
            Reset Start Date
          </button>
        </div>
      )}
    </div>
  );
}
    if (activeTab === "programs") return <FindProgram embedded />;
    if (activeTab === "meetings") return <FindMeeting embedded />;
    return renderDashboardHome();
  };

  return (
    <div className="h-[calc(100vh-97px)] w-full overflow-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_55%,#E8F5E9_100%)]">
      <style>{`
        @keyframes starHeroAction {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30% { transform: scale(1.8) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 20px #fbbf24); }
          50% { transform: scale(1.5) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 30px #fbbf24); }
          100% { transform: translateY(150px) scale(0.3) rotate(20deg); opacity: 0; }
        }
        @keyframes jarImpact { 0%, 100% { transform: scale(1); } 85% { transform: scale(1); } 92% { transform: scale(1.1) rotate(2deg); } }
      `}</style>

      {/* --- AESTHETIC GRATITUDE JAR --- */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-center gap-2">
        {isAnimating && (
          <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 z-[110] text-yellow-400 animate-[starHeroAction_1.2s_ease-in-out] pointer-events-none">
            <Star className="h-16 w-16 fill-current shadow-[0_0_30px_#fbbf24]" />
          </div>
        )}

        <div className="group relative">
          <div onClick={() => setIsJarOpen(!isJarOpen)} 
               className={`relative w-24 h-32 cursor-pointer transition-all hover:scale-105 active:scale-95 
               ${isAnimating ? "animate-[jarImpact_1.2s_ease-in-out]" : ""}`}>
            
            {/* GREEN LID */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#005A2C] rounded-t-lg border-b-4 border-black/30 z-30 shadow-md" />
            
            {/* GLASS BODY */}
            <div className="absolute inset-0 top-3 rounded-b-[2.5rem] rounded-t-xl border-[4px] border-white/50 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute top-2 left-3 w-5 h-20 bg-white/30 rounded-full blur-[3px] -rotate-12" />
              
              {/* PERSISTENT STARS INSIDE THE JAR */}
              <div className="flex h-full w-full flex-wrap-reverse content-start justify-center gap-1.5 p-4 pt-10">
                {[...Array(gratitudeCount)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-300 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,1)] animate-pulse" />
                ))}
              </div>
            </div>

            {/* JAR LABEL */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-18 bg-white/95 border border-gray-300 py-1 shadow-sm rounded-sm">
               <p className="text-[7px] font-black text-[#124627] text-center uppercase whitespace-nowrap px-1">GRATITUDE JAR</p>
            </div>
          </div>

          {isJarOpen && (
            <div className="absolute bottom-36 right-0 w-72 rounded-[30px] border border-[#E0EADD] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-8 duration-500 z-[120]">
              <div className="flex items-center gap-2 mb-3 text-[#005A2C]">
                <Heart className="h-4 w-4 fill-current" />
                <h4 className="text-sm font-bold uppercase tracking-tight">Add to Jar</h4>
              </div>
              <form onSubmit={handleAddGratitude} className="flex flex-col gap-3">
                <textarea autoFocus value={gratitudeText} onChange={(e) => setGratitudeText(e.target.value)}
                          className="w-full rounded-2xl border-none bg-[#F8FAF5] p-3 text-xs text-[#124627] outline-none h-20 placeholder:text-gray-400"
                          placeholder="What are you grateful for?" />
                <Button type="submit" className="bg-[#005A2C] text-white rounded-xl h-10 font-bold hover:bg-[#173723] shadow-lg">Drop into Jar</Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="grid h-full w-full grid-cols-[260px_minmax(0,1fr)] gap-4 p-4">
        <aside className="h-full rounded-[30px] border border-[#DCEAD8] bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,90,44,0.08)]">
          <nav className="space-y-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
              { key: "programs", label: "Programs", icon: <Leaf className="h-4 w-4" /> },
              { key: "meetings", label: "Meetings", icon: <Calendar className="h-4 w-4" /> },
              { key: "tracker", label: "Recovery Tracker", icon: <Sprout className="h-4 w-4" /> },
            ].map((item) => (
              <button key={item.key} type="button" onClick={() => setActiveTab(item.key as MainTab)}
                className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key ? "border-[#A3D977] bg-[#E8F5E9] text-[#005A2C] shadow-[inset_3px_0_0_0_#76B82A]" : "border-transparent text-[#355844] hover:border-[#DCEAD8] hover:bg-[#F8FAF5]"
                }`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-h-0 overflow-hidden rounded-[30px] border border-[#DCEAD8]/70 bg-[#F8FAF5]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className={`h-full transition-opacity duration-300 ${contentVisible ? "opacity-100" : "opacity-0"}`}>
            {renderCenterContent()}
          </div>
        </section>
      </div>
    </div>
  );
}