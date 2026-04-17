import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Calendar,
  CheckCircle,
  History,
  LayoutDashboard,
  Leaf,
  Sprout,
  Users,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";

interface Meeting {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface CommunityChat {
  id: number;
  program_id: string;
  message: string;
  timestamp: string;
}

interface DbUserDetails {
  username: string;
  email: string;
  fname: string;
  lname: string;
  joined_program?: string | null;
}

type MainTab = "dashboard" | "tracker" | "programs" | "meetings";
type DashboardView = "home" | "meetings" | "community";

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [dashboardView, setDashboardView] = useState<DashboardView>("home");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [chatHistory, setChatHistory] = useState<CommunityChat[]>([]);
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

        const meetingRes = await fetch(
          `${pythonURI}/get-user-meetings?user_id=${user.id}`,
          fetchOptions
        );
        if (meetingRes.ok) {
          setMeetings(await meetingRes.json());
        }

        const chatRes = await fetch(
          `${pythonURI}/get-user-community-chats?user_id=${user.id}`,
          fetchOptions
        );
        if (chatRes.ok) {
          setChatHistory(await chatRes.json());
        }

        const userRes = await fetch(
          `${pythonURI}/get-user-details?user_id=${user.id}`,
          fetchOptions
        );
        if (userRes.ok) {
          setDbUser(await userRes.json());
        }
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
    const fadeInTimer = window.setTimeout(() => setContentVisible(true), 130);
    return () => window.clearTimeout(fadeInTimer);
  }, [activeTab, dashboardView]);

  const today = useMemo(() => {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    return dt;
  }, []);

  const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= today);
  const pastMeetings = meetings.filter((m) => new Date(m.date) < today);

  const formatDate = (ts: string) => {
    if (!ts) return "";
    return new Date(ts.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const joinedProgram = dbUser?.joined_program?.trim() || "No Program Joined";
  const fullName = dbUser ? `${dbUser.fname} ${dbUser.lname}` : user.username || "Member";
  const email = dbUser?.email || user.email || "";

  const supportLevel = useMemo(() => {
    const chatSignal = chatHistory.length >= 10 ? "high" : chatHistory.length >= 4 ? "medium" : "low";
    return {
      label: `Support need: ${chatSignal}`,
      className:
        chatSignal === "high"
          ? "border-[#F6CF9F] bg-[#FFF5EC] text-[#8D4C08]"
          : chatSignal === "medium"
          ? "border-[#C9E59D] bg-[#F2F7E9] text-[#356020]"
          : "border-[#A3D977] bg-[#E8F5E9] text-[#005A2C]",
    };
  }, [chatHistory.length]);

  const cardShell =
    "rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]";

  const dashboardSubNav = [
    { key: "home" as const, icon: "🏠", label: "Home" },
    { key: "meetings" as const, icon: "📅", label: "Meetings" },
    { key: "community" as const, icon: "💬", label: "Community" },
  ];

  const renderUpcomingMeetingsCard = () => (
    <Card className={cardShell}>
      <CardContent className="p-6">
        <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#1F3B2B]">
          <Calendar className="h-5 w-5 text-[#005A2C]" /> Upcoming Meetings
        </h3>
        <div className="space-y-4">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-[20px] border border-[#DCEAD8] bg-[#F1F8EB] p-4"
              >
                <div className="font-semibold text-[#1F3B2B]">{meeting.name}</div>
                <div className="text-xs text-[#5A7462]">
                  {meeting.date} at {meeting.time} • {meeting.location}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-[#6B7F70]">
              No upcoming meetings yet. Add one from a program page.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderCommunityCard = () => (
    <Card className={cardShell}>
      <CardContent className="p-6">
        <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#1F3B2B]">
          <History className="h-5 w-5 text-[#2D6A37]" /> Community Chat History
        </h3>
        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="rounded-[18px] border border-[#DCEAD8] bg-[#F8FAF5] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge className="bg-[#E8F5E9] text-[#005A2C] uppercase text-[10px] hover:bg-[#E8F5E9]">
                    {chat.program_id} Room
                  </Badge>
                  <span className="text-[10px] text-[#6B7F70]">{formatDate(chat.timestamp)}</span>
                </div>
                <p className="text-sm italic text-[#2D5138]">"{chat.message}"</p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#6B7F70]">No community chats found.</p>
              <Link
                to="/programs"
                className="mt-2 inline-block text-xs font-medium text-[#005A2C] hover:underline"
              >
                Join a room
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboardHome = () => (
    <div className="flex min-h-full flex-col gap-4">
      <Card className={`${cardShell} bg-[linear-gradient(135deg,#ffffff_0%,#F5FBF1_100%)]`}>
        <CardContent className="p-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
            <Leaf className="h-3.5 w-3.5" /> Wellness Profile
          </div>
          <h1 className="text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-[#005A2C]">
            Welcome back, {fullName}
          </h1>
          <p className="mt-1 text-sm text-[#5A7462]">{email}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Card className={cardShell}>
          <CardContent className="p-5">
            <p className="text-xs text-[#5A7462]">Upcoming Meetings</p>
            <p className="mt-1 text-3xl font-bold text-[#005A2C]">{upcomingMeetings.length}</p>
          </CardContent>
        </Card>

        <Card className={cardShell}>
          <CardContent className="p-5">
            <p className="text-xs text-[#5A7462]">Past Meetings</p>
            <p className="mt-1 text-3xl font-bold text-[#005A2C]">{pastMeetings.length}</p>
          </CardContent>
        </Card>

        <Card className={cardShell}>
          <CardContent className="p-5">
            <p className="text-xs text-[#5A7462]">Current Program</p>
            <p className="mt-1 line-clamp-2 text-lg font-bold text-[#005A2C]">{joinedProgram}</p>
          </CardContent>
        </Card>

        <Card className={cardShell}>
          <CardContent className="p-5">
            <p className="text-xs text-[#5A7462]">Support Level</p>
            <Badge className={`mt-2 border ${supportLevel.className}`}>{supportLevel.label}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px_minmax(300px,360px)]">
        <div />

        <Card className={`${cardShell} bg-[radial-gradient(circle_at_center,#ffffff_0%,#F3F9EE_58%,#E8F5E9_100%)]`}>
          <CardContent className="flex h-full min-h-[320px] items-center justify-center p-4">
            <div className="flex aspect-square w-[200px] flex-col items-center justify-center rounded-full border-[8px] border-[#E8F5E9] bg-white p-4 text-center shadow-[0_12px_30px_rgba(0,90,44,0.1)]">
              <div className="mb-1 text-4xl">🌱</div>
              <div className="text-sm text-[#5A7462]">Garden Level</div>
              <div className="text-2xl font-bold text-[#005A2C]">Young Sprout</div>
              <div className="mt-2 text-xs text-[#5A7462]">XP 24 / 100</div>
              <div className="mt-2 h-2 w-[70%] overflow-hidden rounded-full bg-[#E8F5E9]">
                <div className="h-full w-[24%] rounded-full bg-[linear-gradient(90deg,#76B82A_0%,#005A2C_100%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid min-h-0 grid-rows-[auto_auto_auto] gap-3">
          <Card className={cardShell}>
            <CardContent className="p-4">
              <p className="mb-3 text-xs text-[#5A7462]">Sobriety Streak timeline</p>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 7, 14, 30, 60].map((milestone) => (
                  <span
                    key={milestone}
                    className="rounded-full border border-[#DCEAD8] bg-[#EEF6EA] px-3 py-1 text-sm font-semibold text-[#5A7462]"
                  >
                    {milestone}d
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={cardShell}>
            <CardContent className="p-4">
              <p className="text-xs text-[#5A7462]">Next Milestone</p>
              <p className="mt-1 text-2xl font-bold text-[#005A2C]">30 days</p>
              <p className="mt-1 text-sm text-[#5A7462]">6 days to go</p>
            </CardContent>
          </Card>

          <Card className={cardShell}>
            <CardContent className="p-4">
              <p className="text-xs text-[#5A7462]">AI Support Insight</p>
              <p className="mt-1 text-sm text-[#2D5138]">
                Keep the same rhythm this week. A short reflection entry can improve trend stability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCenterContent = () => {
    if (activeTab === "tracker") {
      return (
        <div className="rounded-[30px] border border-[#E0EADD] bg-white p-2 shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
          <TrackerMain
            program={
              (dbUser?.joined_program as
                | "AA"
                | "NA"
                | "CA"
                | "SA"
                | "GA"
                | "ACA"
                | "Al-Anon"
                | "Alateen") || "AA"
            }
            userName={dbUser?.fname || user.username || "Guest User"}
          />
        </div>
      );
    }

    if (activeTab === "programs") {
      return (
        <Card className={cardShell}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl font-bold text-[#005A2C]">Programs</h2>
            <p className="text-[#5A7462]">Browse available programs and update your joined recovery track.</p>
            <Link
              to="/programs"
              className="inline-flex rounded-full border border-[#A3D977] bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#005A2C]"
            >
              Open Programs Directory
            </Link>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "meetings") {
      return (
        <div className="space-y-4">
          {renderUpcomingMeetingsCard()}
          <Card className={cardShell}>
            <CardContent className="p-6">
              <Link
                to="/meetings"
                className="inline-flex rounded-full border border-[#A3D977] bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#005A2C]"
              >
                Find More Meetings
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (dashboardView === "meetings") return renderUpcomingMeetingsCard();
    if (dashboardView === "community") return renderCommunityCard();
    return renderDashboardHome();
  };

  return (
    <div className="h-[calc(100vh-97px)] w-full overflow-hidden bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_55%,#E8F5E9_100%)]">
      <div className="grid h-full w-full grid-cols-[260px_minmax(0,1fr)_80px] gap-4 p-4">
        <aside className="h-full rounded-[30px] border border-[#DCEAD8] bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,90,44,0.08)]">
          <nav className="space-y-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
              { key: "tracker", label: "Recovery Tracker", icon: <Sprout className="h-4 w-4" /> },
              { key: "programs", label: "Programs", icon: <Leaf className="h-4 w-4" /> },
              { key: "meetings", label: "Meetings", icon: <Calendar className="h-4 w-4" /> },
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
            className={`h-full overflow-y-auto pr-2 transition-opacity duration-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {renderCenterContent()}
          </div>
        </section>

        <aside className="h-full rounded-[30px] border border-[#DCEAD8] bg-white/90 p-2 shadow-[0_12px_30px_rgba(0,90,44,0.06)]">
          <div className="flex h-full flex-col items-center gap-3 pt-2">
            {(activeTab === "dashboard"
              ? dashboardSubNav
              : [
                  { key: "a", icon: "🧭", label: "Quick" },
                  { key: "b", icon: "📌", label: "Pins" },
                  { key: "c", icon: "👥", label: "Community" },
                ]
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                title={item.label}
                onClick={() => {
                  if (activeTab === "dashboard") {
                    setDashboardView(item.key as DashboardView);
                  }
                }}
                className={`flex h-14 w-14 items-center justify-center rounded-full border text-xl transition ${
                  activeTab === "dashboard" && dashboardView === item.key
                    ? "border-[#76B82A] bg-[linear-gradient(135deg,#76B82A_0%,#005A2C_100%)] text-white shadow-[0_12px_26px_rgba(0,90,44,0.22)]"
                    : "border-[#DCEAD8] bg-white text-[#5A7462]"
                } ${activeTab !== "dashboard" ? "cursor-default" : "cursor-pointer"}`}
              >
                {item.icon}
              </button>
            ))}

            <div className="mt-auto pb-2 text-center text-[10px] text-[#6B7F70]">
              <Users className="mx-auto mb-1 h-4 w-4" />
              Sub-Views
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}