import { useEffect, useMemo, useState } from "react";
import { Calendar, LayoutDashboard, Leaf, Sprout } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindProgram } from "./FindProgram";
import { FindMeeting } from "./FindMeeting";
import sproutGif from "../../assets/garden/sprout.gif";
import aaLogo from "../../assets/735899c7aa27fedc5bfff3f073c9492f49572a67.png";
import acaLogo from "../../assets/054168f67c068da00639dd1c8048e86acf2571ca.png";
import alateenLogo from "../../assets/2c91f86ad959487223d3461bd473cbc2855a8351.png";
import alanonLogo from "../../assets/3c35ee6fefb6bfce531c22f63b9380fedac4d6a6.png";
import naLogo from "../../assets/2115c4842bd36bd47cd1708c3d26e2e14999ef8a.png";
import caLogo from "../../assets/58e3f4b9794493f73bea7d751b9df8993b8c105f.png";
import gaLogo from "../../assets/675121813725057c96f90900dde1cdb27e6a8031.png";
import saLogo from "../../assets/50593eb25097566896b0e6a4b491eabb700c98a6.png";

interface Meeting {
  id: number;
  program_id?: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface DashboardProgram {
  program_id: string;
  fullName: string;
  last_message: {
    text: string;
    timestamp: string | null;
  };
}

interface DbUserDetails {
  username: string;
  email: string;
  fname: string;
  lname: string;
  joined_program?: string | null;
}

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

const formatMessageTimestamp = (timestamp: string | null) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (date >= todayStart) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (date >= yesterdayStart && date < todayStart) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const isUnreadMessage = (timestamp: string | null) => {
  if (!timestamp) return false;
  const created = new Date(timestamp);
  if (Number.isNaN(created.getTime())) return false;

  const twoHoursMs = 2 * 60 * 60 * 1000;
  return Date.now() - created.getTime() <= twoHoursMs;
};

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dashboardPrograms, setDashboardPrograms] = useState<DashboardProgram[]>([]);
  const [dbUser, setDbUser] = useState<DbUserDetails | null>(null);
  const [, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);

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
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
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
      <div className="grid h-full w-full grid-cols-[260px_minmax(0,1fr)] gap-4 p-4">
        <aside className="h-full rounded-[30px] border border-[#DCEAD8] bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,90,44,0.08)]">
          <nav className="space-y-2">
            {[
              {
                key: "dashboard",
                label: "Dashboard",
                icon: <LayoutDashboard className="h-4 w-4" />,
              },
              {
                key: "programs",
                label: "Programs",
                icon: <Leaf className="h-4 w-4" />,
              },
              {
                key: "meetings",
                label: "Meetings",
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                key: "tracker",
                label: "Recovery Tracker",
                icon: <Sprout className="h-4 w-4" />,
              },
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