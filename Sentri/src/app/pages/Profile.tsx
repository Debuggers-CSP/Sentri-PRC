import { useEffect, useMemo, useState } from "react";
import { Calendar, LayoutDashboard, Leaf, Sprout } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindProgram } from "./FindProgram";
import { FindMeeting } from "./FindMeeting";
import sproutGif from "../../assets/garden/sprout.gif";

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

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
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
        if (meetingRes.ok) setMeetings(await meetingRes.json());

        const chatRes = await fetch(
          `${pythonURI}/get-user-community-chats?user_id=${user.id}`,
          fetchOptions
        );
        if (chatRes.ok) setChatHistory(await chatRes.json());

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

  const today = useMemo(() => {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    return dt;
  }, []);

  const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= today);
  const recentChats = chatHistory.slice(0, 4);

  const joinedProgram = dbUser?.joined_program?.trim() || "No Program Joined";
  const fullName = dbUser ? `${dbUser.fname} ${dbUser.lname}` : user.username || "Member";
  const email = dbUser?.email || user.email || "";
  const supportLevel =
    chatHistory.length >= 10 ? "High" : chatHistory.length >= 4 ? "Medium" : "Low";

  const cardShell =
    "rounded-[30px] border border-[#E0EADD] bg-white shadow-[0_12px_30px_rgba(0,90,44,0.09)]";

  const zoneShell = "rounded-[24px] border border-[#DCEAD8] bg-[#F8FAF5] p-4";

  const renderDashboardHome = () => (
    <Card className={cardShell}>
      <CardContent className="space-y-5 p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
        </div>

        <div>
          <h1 className="text-[clamp(28px,3vw,38px)] leading-[1.06] tracking-[-0.02em] text-[#005A2C]">
            Welcome back, {fullName}
          </h1>
          <p className="mt-1 text-sm text-[#5A7462]">{email}</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <section className={zoneShell}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#355844]">
              Programs
            </h2>

            <div className="mb-3 rounded-[16px] border border-[#E0EADD] bg-white p-3">
              <p className="text-xs text-[#5A7462]">Joined Program</p>
              <p className="mt-1 text-lg font-bold text-[#005A2C]">{joinedProgram}</p>
              <Badge className="mt-2 border border-[#A3D977] bg-[#E8F5E9] text-[#005A2C]">
                Support: {supportLevel}
              </Badge>
            </div>

            <div className="rounded-[16px] border border-[#E0EADD] bg-white p-3">
              <p className="mb-2 text-xs text-[#5A7462]">Community Chat</p>
              <div className="space-y-2">
                {recentChats.length > 0 ? (
                  recentChats.map((chat) => (
                    <p
                      key={chat.id}
                      className="line-clamp-1 rounded-md bg-[#F1F8EB] px-2 py-1 text-xs text-[#2D5138]"
                    >
                      {chat.message}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-[#6B7F70]">No recent chat history.</p>
                )}
              </div>
            </div>
          </section>

          <section className={zoneShell}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#355844]">
              Meetings
            </h2>
            <div className="space-y-3">
              <div className="rounded-[16px] border border-[#E0EADD] bg-white p-3">
                <p className="text-xs text-[#5A7462]">Next Meeting</p>
                <p className="mt-1 text-sm font-semibold text-[#1F3B2B]">
                  {upcomingMeetings[0]?.name || "No upcoming meetings scheduled"}
                </p>
              </div>

              <div className="rounded-[16px] border border-[#E0EADD] bg-white p-3">
                <p className="text-xs text-[#5A7462]">Upcoming count</p>
                <p className="text-3xl font-bold text-[#005A2C]">
                  {upcomingMeetings.length}
                </p>
              </div>
            </div>
          </section>

          <section className={zoneShell}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#355844]">
              Recovery Tracker
            </h2>

            <div className="mb-3 rounded-[16px] border border-[#E0EADD] bg-white p-4 text-center">
              <img
                src={sproutGif}
                alt="Garden preview"
                className="mx-auto h-36 w-36 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <p className="mt-2 text-xs text-[#5A7462]">Garden Preview</p>
              <p className="text-xl font-bold text-[#005A2C]">Young Sprout</p>
              <div className="mx-auto mt-3 h-2 w-[70%] overflow-hidden rounded-full bg-[#E8F5E9]">
                <div className="h-full w-[30%] rounded-full bg-[linear-gradient(90deg,#76B82A_0%,#005A2C_100%)]" />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[16px] border border-[#E0EADD] bg-white p-3">
                <p className="text-xs text-[#5A7462]">Current Sobriety Streak</p>
                <p className="text-2xl font-bold text-[#005A2C]">
                  {Math.max(1, upcomingMeetings.length)} days
                </p>
              </div>

              <div className="rounded-[16px] border border-[#E0EADD] bg-white p-3">
                <p className="text-xs text-[#5A7462]">Milestone Progress</p>
                <p className="text-sm font-semibold text-[#1F3B2B]">
                  Keep checking in to unlock your next garden stage.
                </p>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );

  const renderCenterContent = () => {
    if (activeTab === "tracker") {
      return (
        <div className="rounded-[30px] border border-[#E0EADD] bg-white p-2 shadow-[0_12px_30px_rgba(0,90,44,0.09)]">
          <TrackerMain userName={dbUser?.fname || user.username || "Guest User"} />
        </div>
      );
    }

    if (activeTab === "programs") {
      return (
        <Card className={cardShell}>
          <CardContent className="p-4">
            <FindProgram embedded />
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "meetings") {
      return (
        <Card className={cardShell}>
          <CardContent className="p-4">
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
            className={`h-full overflow-y-auto pr-2 transition-opacity duration-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
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