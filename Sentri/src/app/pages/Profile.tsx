import { useEffect, useMemo, useState, useRef } from "react"; // Added useRef
import { Calendar, LayoutDashboard, Leaf, Sprout, Sparkles, Wind, Star, Heart } from "lucide-react"; // Added interactive icons
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button"; // Added Button
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindProgram } from "./FindProgram";
import { FindMeeting } from "./FindMeeting";
import sproutGif from "../../assets/garden/sprout.gif";

// ... (Existing interfaces and helper functions stay the same)

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dashboardPrograms, setDashboardPrograms] = useState<DashboardProgram[]>([]);
  const [dbUser, setDbUser] = useState<DbUserDetails | null>(null);
  const [, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);

  // --- NEW: INTERACTIVE STATES ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeText, setGratitudeText] = useState("");
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dailyQuotes = [
    "One day at a time.",
    "Progress, not perfection.",
    "Your past does not define your future.",
    "Believe you can and you're halfway there.",
    "Small steps lead to big changes."
  ];
  const dailyQuote = useMemo(() => dailyQuotes[new Date().getDate() % dailyQuotes.length], []);

  // --- NEW: INTERACTIVE LOGIC ---
  const handleScratch = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
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

  useEffect(() => {
    if (activeTab === "dashboard" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#124627");
        gradient.addColorStop(0.5, "#005A2C");
        gradient.addColorStop(1, "#124627");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("SCRATCH FOR DAILY FOCUS", canvas.width / 2, canvas.height / 2);
      }
    }
  }, [activeTab, contentVisible]);

  // ... (Existing fetchData useEffect and useMemos stay exactly the same)
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const summaryRes = await fetch(
          `${pythonURI}/get-dashboard-summary/${user.id}`,
          fetchOptions
        );

        if (summaryRes.ok) {
          const summary = await summaryRes.json();
          setDashboardPrograms(summary.programs || []);
          setMeetings(summary.meetings || []);
        } else {
          const meetingRes = await fetch(
            `${pythonURI}/get-user-meetings?user_id=${user.id}`,
            fetchOptions
          );
          if (meetingRes.ok) setMeetings(await meetingRes.json());
        }

        const userRes = await fetch(
          `${pythonURI}/get-user-details?user_id=${user.id}`,
          fetchOptions
        );
        if (userRes.ok) setDbUser(await userRes.json());
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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
      if (Array.isArray(parsed)) return parsed.map((value) => String(value).trim()).filter(Boolean);
    } catch {
      return raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    return [];
  }, [dbUser?.joined_program]);

  const displayedPrograms = useMemo(() => {
    return dashboardPrograms.filter((program) =>
      joinedProgramIds.includes(program.program_id)
    );
  }, [dashboardPrograms, joinedProgramIds]);

  const sortedMeetings = useMemo(() => {
    const parseMeetingDate = (meeting: Meeting) => {
      const [startTime] = (meeting.time || "").split("-");
      return new Date(`${meeting.date} ${startTime.trim() || "00:00"}`).getTime();
    };

    return [...meetings].sort((a, b) => parseMeetingDate(a) - parseMeetingDate(b));
  }, [meetings]);

  const fullName = dbUser ? `${dbUser.fname} ${dbUser.lname}` : user.username || "Member";
  const email = dbUser?.email || user.email || "";

  const cardShell =
    "h-full rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]";

  const renderDashboardHome = () => (
    <Card className={cardShell}>
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </div>

          {/* --- NEW: SCRATCH CARD (Pill Style) --- */}
          <div className="relative h-10 w-64 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center select-none">
              <p className="text-[11px] font-bold italic text-[#005A2C]">"{dailyQuote}"</p>
            </div>
            <canvas
              ref={canvasRef}
              onMouseMove={handleScratch}
              onTouchMove={handleScratch}
              className="absolute inset-0 z-10 cursor-crosshair touch-none"
            />
          </div>
        </div>

        <div>
          <h1 className="text-[clamp(28px,3vw,38px)] leading-[1.06] tracking-[-0.02em] text-[#005A2C]">
            Welcome back, {fullName}
          </h1>
          <p className="mt-1 text-sm text-[#5A7462]">{email}</p>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-[#355844]">
              Program Zone
            </h2>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {displayedPrograms.length > 0 ? (
                displayedPrograms.map((program) => {
                  const visual = programVisuals[program.program_id];
                  const messagePreview = program.last_message?.text || "No messages yet";
                  const timeLabel = formatMessageTimestamp(program.last_message?.timestamp ?? null);
                  const unread = isUnreadMessage(program.last_message?.timestamp ?? null);

                  return (
                    <button
                      key={program.program_id}
                      type="button"
                      onClick={() =>
                        console.log("Program modal placeholder:", {
                          programId: program.program_id,
                          fullName: program.fullName,
                        })
                      }
                      className="flex w-full items-center gap-3 rounded-[18px] border border-[#DFE9DD] bg-white px-3 py-3 text-left transition hover:border-[#B8D7A9] hover:bg-[#F6FBF1]"
                    >
                      <img
                        src={visual?.logo}
                        alt={`${program.fullName} logo`}
                        className="h-12 w-12 flex-none rounded-full border border-[#DCEAD8] object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#173723]">
                          {visual?.name || program.fullName}
                        </p>
                        <p className="truncate text-xs text-[#617765]">{messagePreview}</p>
                      </div>

                      <div className="ml-2 flex flex-col items-end gap-1">
                        <span className="text-[11px] text-[#6A7F70]">{timeLabel}</span>
                        {unread && <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="px-2 py-5 text-sm text-[#6B7F70]">
                  Join programs to view your conversations here.
                </p>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-[#355844]">
              Meetings Zone
            </h2>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {sortedMeetings.length > 0 ? (
                sortedMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-[16px] border border-[#DFE9DD] bg-white px-3 py-2.5"
                  >
                    <p className="truncate text-sm font-semibold text-[#173723]">{meeting.name}</p>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-[#5F7565]">
                      <span>Day: {meeting.date}</span>
                      <span>Time: {meeting.time}</span>
                      <span className="col-span-2 truncate">Location: {meeting.location || "TBD"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-2 py-5 text-sm text-[#6B7F70]">No upcoming meetings scheduled.</p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[20px] border border-[#DCEAD8] bg-[#F8FAF5] p-3">
          <div className="flex items-center gap-3">
            <img
              src={sproutGif}
              alt="Garden preview"
              className="h-12 w-12 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <div>
              <p className="text-xs text-[#5A7462]">Recovery Tracker</p>
              <p className="text-sm font-semibold text-[#005A2C]">
                Keep checking in to unlock your next garden stage.
              </p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );

  const renderCenterContent = () => {
    if (activeTab === "tracker") {
      return (
        <div className="h-full rounded-[30px] border border-[#E0EADD] bg-white p-2 shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
          <TrackerMain userName={dbUser?.fname || user.username || "Guest User"} />
        </div>
      );
    }

    if (activeTab === "programs") {
      return (
        <Card className={cardShell}>
          <CardContent className="h-full p-4">
            <FindProgram embedded />
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "meetings") {
      return (
        <Card className={cardShell}>
          <CardContent className="h-full p-4">
            <FindMeeting embedded />
          </CardContent>
        </Card>
      );
    }

    return renderDashboardHome();
  };

  return (
    <div className="h-[calc(100vh-97px)] w-full overflow-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_55%,#E8F5E9_100%)]">
      <style>{`
        @keyframes starHeroAction {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30% { transform: scale(1.5) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 20px #fbbf24); }
          100% { transform: translateY(400px) scale(0.2) rotate(20deg); opacity: 0; }
        }
        @keyframes jarImpact {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1) rotate(2deg); }
        }
      `}</style>

      {/* --- NEW: GRATITUDE JAR WIDGET --- */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {isAnimating && (
          <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 text-yellow-400 animate-[starHeroAction_1.2s_ease-in-out] pointer-events-none">
            <Star className="h-12 w-12 fill-current" />
          </div>
        )}

        <div className="group relative">
          <div onClick={() => setIsJarOpen(!isJarOpen)} className={`relative w-16 h-24 cursor-pointer transition-all hover:brightness-110 active:scale-95 ${isAnimating ? "animate-[jarImpact_1.2s_ease-in-out]" : ""}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#124627] rounded-t-md border-b-2 border-black/20 z-20" />
            <div className="absolute inset-0 top-2 rounded-b-[1.5rem] rounded-t-md border-2 border-white/60 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="flex h-full w-full flex-wrap-reverse content-start justify-center gap-1 p-2 pt-4">
                {[...Array(Math.min(gratitudeCount, 15))].map((_, i) => (
                  <Star key={i} className="h-2.5 w-2.5 text-yellow-300 fill-current animate-pulse" />
                ))}
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 bg-white/80 border border-gray-200 px-1 py-0.5 shadow-sm rounded-sm">
               <p className="text-[6px] font-bold text-[#124627] text-center uppercase">Gratitude</p>
            </div>
          </div>

          {isJarOpen && (
            <div className="absolute bottom-28 right-0 w-64 rounded-[24px] border border-[#E0EADD] bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-6 duration-300 z-[110]">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-3 w-3 text-[#76B82A] fill-current" />
                <h4 className="text-xs font-bold text-[#005A2C]">One nice thing today?</h4>
              </div>
              <form onSubmit={handleAddGratitude} className="flex flex-col gap-2">
                <textarea 
                  autoFocus 
                  value={gratitudeText} 
                  onChange={(e) => setGratitudeText(e.target.value)} 
                  className="w-full rounded-xl border-none bg-[#F8FAF5] p-2 text-xs outline-none" 
                  placeholder="I am thankful for..." 
                  rows={2} 
                />
                <Button type="submit" size="sm" className="bg-[#005A2C] text-white rounded-lg h-8 text-[10px]">Drop Star</Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="grid h-full w-full grid-cols-[260px_minmax(0,1fr)] gap-4 p-4">
        {/* ... (Sidebar stays the same) */}
        <aside className="h-full rounded-[30px] border border-[#DCEAD8] bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,90,44,0.08)]">
          <nav className="space-y-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
              { key: "programs", label: "Programs", icon: <Leaf className="h-4 w-4" /> },
              { key: "meetings", label: "Meetings", icon: <Calendar className="h-4 w-4" /> },
              { key: "tracker", label: "Recovery Tracker", icon: <Sprout className="h-4 w-4" /> },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key as MainTab)}
                className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "border-[#A3D977] bg-[#E8F5E9] text-[#005A2C] shadow-[inset_3px_0_0_0_#76B82A]"
                    : "border-transparent text-[#355844] hover:border-[#DCEAD8] hover:bg-[#F8FAF5]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-h-0 overflow-hidden rounded-[30px] border border-[#DCEAD8]/70 bg-[#F8FAF5]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div
            className={`h-full transition-opacity duration-300 ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {renderCenterContent()}
          </div>
        </section>
      </div>
    </div>
  );
}