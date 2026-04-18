import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle, LayoutDashboard, Leaf, Sprout } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";
import TrackerMain from "../components/tracker/TrackerMain";
import { FindProgram } from "./FindProgram";
import { FindMeeting } from "./FindMeeting";

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
    const fadeInTimer = window.setTimeout(() => setContentVisible(true), 130);
    return () => window.clearTimeout(fadeInTimer);
  }, [activeTab]);

  const today = useMemo(() => {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    return dt;
  }, []);

  const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= today);
  const pastMeetings = meetings.filter((m) => new Date(m.date) < today);

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

  const renderDashboardHome = () => (
    <div className="flex min-h-full flex-col gap-4">
      <Card className={`${cardShell} bg-[linear-gradient(135deg,#ffffff_0%,#F5FBF1_100%)]`}>
        <CardContent className="space-y-4 p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005A2C]">
            <Leaf className="h-3.5 w-3.5" /> Daily Summary
          </div>

          <div>
            <h1 className="text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-[#005A2C]">
              Welcome back, {fullName}
            </h1>
            <p className="mt-1 text-sm text-[#5A7462]">{email}</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#DCEAD8] bg-[#F1F8EB] px-3 py-1 text-xs text-[#2D5138]">
              <Leaf className="h-3.5 w-3.5 text-[#2D6A37]" /> Wellness Profile active
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-[#5A7462]">Upcoming Meetings</p>
                <p className="mt-1 text-3xl font-bold text-[#005A2C]">{upcomingMeetings.length}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-[#5A7462]">Past Meetings</p>
                <p className="mt-1 text-3xl font-bold text-[#005A2C]">{pastMeetings.length}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-[#5A7462]">Current Program</p>
                <p className="mt-1 line-clamp-2 text-lg font-bold text-[#005A2C]">{joinedProgram}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-[#5A7462]">Support Level</p>
                <Badge className={`mt-2 border ${supportLevel.className}`}>{supportLevel.label}</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <Card className="rounded-[24px] border border-[#E0EADD] bg-[radial-gradient(circle_at_center,#ffffff_0%,#F3F9EE_58%,#E8F5E9_100%)] shadow-none">
              <CardContent className="flex h-full items-center justify-center p-5">
                <div className="flex h-[240px] w-[240px] flex-col items-center justify-center rounded-full border-[8px] border-[#E8F5E9] bg-white text-center shadow-[0_12px_30px_rgba(0,90,44,0.1)]">
                  <div className="text-5xl">🌱</div>
                  <p className="mt-2 text-sm text-[#5A7462]">Garden Preview</p>
                  <p className="text-xl font-bold text-[#005A2C]">Young Sprout</p>
                  <div className="mt-2 h-2 w-[65%] overflow-hidden rounded-full bg-[#E8F5E9]">
                    <div className="h-full w-[24%] rounded-full bg-[linear-gradient(90deg,#76B82A_0%,#005A2C_100%)]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:grid-cols-2">
              <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-[#5A7462]">Next Meeting</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F3B2B]">
                    {upcomingMeetings[0]?.name || "No upcoming meetings scheduled"}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border border-[#E0EADD] shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-[#5A7462]">Community Pulse</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F3B2B]">
                    {chatHistory.length > 0 ? "You have new support activity." : "No recent chat activity yet."}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border border-[#E0EADD] shadow-none md:col-span-2">
                <CardContent className="p-4">
                  <p className="text-sm text-[#2D5138]">
                    Use <span className="font-semibold">Recovery Tracker</span> to check in and grow your garden, or open
                    <span className="font-semibold"> Meetings</span> to plan your next session.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
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

          {activeTab === "dashboard" && (
            <div className="mt-4 rounded-[18px] border border-[#DCEAD8] bg-[#F1F8EB] p-3 text-xs text-[#2D5138]">
              <p className="font-semibold">Daily Briefing</p>
              <p className="mt-1">Use Tracker for growth and Meetings for your next appointment.</p>
            </div>
          )}

          {activeTab === "tracker" && (
            <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[#DCEAD8] bg-[#F8FAF5] p-3 text-xs text-[#5A7462]">
              <CheckCircle className="h-4 w-4 text-[#76B82A]" />
              Tracker tools are active on the right side.
            </div>
          )}
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