import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, CheckCircle, Leaf, MessageSquare, History } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { pythonURI, fetchOptions } from '../../../../assets/js/api/config.js';

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
}

export function Profile() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [chatHistory, setChatHistory] = useState<CommunityChat[]>([]);
  const [dbUser, setDbUser] = useState<DbUserDetails | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log("DEBUG: No User ID found in session. Fetching cancelled.");
        return;
      }

      try {
        setLoading(true);

        const meetingRes = await fetch(`${pythonURI}/get-user-meetings?user_id=${user.id}`, fetchOptions);
        if (meetingRes.ok) setMeetings(await meetingRes.json());

        const chatRes = await fetch(`${pythonURI}/get-user-community-chats?user_id=${user.id}`, fetchOptions);
        if (chatRes.ok) setChatHistory(await chatRes.json());

        const userRes = await fetch(`${pythonURI}/get-user-details?user_id=${user.id}`, fetchOptions);
        if (userRes.ok) {
          setDbUser(await userRes.json());
        } else {
          console.error("DEBUG: Failed to fetch user details. Status:", userRes.status);
        }
      } catch (err) {
        console.error("DEBUG: Connection error during Profile fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= today);
  const pastMeetings = meetings.filter((m) => new Date(m.date) < today);

  const formatDate = (ts: string) => {
    if (!ts) return "";
    return new Date(ts.replace(" ", "T") + "Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = () => {
    if (dbUser?.fname && dbUser?.lname) {
      return (dbUser.fname[0] + dbUser.lname[0]).toUpperCase();
    }
    return (user.username?.[0] || "U").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_55%,#E8F5E9_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8 overflow-hidden rounded-[30px] border border-[#E0EADD] shadow-[0_14px_34px_rgba(0,90,44,0.10)]">
          <div className="bg-[linear-gradient(135deg,#76B82A_0%,#005A2C_100%)] p-8 text-white">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/35 bg-white/20 text-4xl font-bold backdrop-blur-sm">
                {getInitials()}
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <Leaf className="h-3.5 w-3.5" /> Wellness Profile
                </div>
                <h2 className="mb-1 text-3xl">{dbUser ? `${dbUser.fname} ${dbUser.lname}` : (user.username || "Loading...")}</h2>
                <p className="text-[#E8F5E9]">{dbUser ? dbUser.email : user.email}</p>
                <div className="mt-4 flex gap-2">
                  <Badge className="border-white/30 bg-white/20 text-white">Community Member</Badge>
                  <Badge className="border-none bg-[#A3D977] text-[#124627]">Active Now</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
            <CardContent className="p-6">
              <div className="mb-4 w-fit rounded-[16px] bg-[#E8F5E9] p-3 text-[#005A2C]"><Calendar /></div>
              <div className="text-3xl font-bold text-[#1F3B2B]">{upcomingMeetings.length}</div>
              <div className="text-sm text-[#5A7462]">Upcoming Meetings</div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
            <CardContent className="p-6">
              <div className="mb-4 w-fit rounded-[16px] bg-[#E8F5E9] p-3 text-[#2D6A37]"><CheckCircle /></div>
              <div className="text-3xl font-bold text-[#1F3B2B]">{pastMeetings.length}</div>
              <div className="text-sm text-[#5A7462]">Past Meetings</div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
            <CardContent className="p-6">
              <div className="mb-4 w-fit rounded-[16px] bg-[#E8F5E9] p-3 text-[#2D6A37]"><MessageSquare /></div>
              <div className="text-3xl font-bold text-[#1F3B2B]">{chatHistory.length}</div>
              <div className="text-sm text-[#5A7462]">Chat Messages</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
            <CardContent className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#1F3B2B]">
                <Calendar className="text-[#005A2C]" /> Upcoming Meetings
              </h3>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? upcomingMeetings.map((m) => (
                  <div key={m.id} className="rounded-[18px] border border-[#DCEAD8] bg-[#F1F8EB] p-4">
                    <div className="font-semibold text-[#1F3B2B]">{m.name}</div>
                    <div className="text-xs text-[#5A7462]">{m.date} at {m.time} • {m.location}</div>
                  </div>
                )) : <p className="text-center text-sm text-[#6B7F70]">No upcoming meetings yet. Add one from a program page.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
            <CardContent className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#1F3B2B]">
                <History className="text-[#2D6A37]" /> Community Chat History
              </h3>
              <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
                {chatHistory.length > 0 ? chatHistory.map((chat) => (
                  <div key={chat.id} className="rounded-[18px] border border-[#DCEAD8] bg-[#F8FAF5] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className="bg-[#E8F5E9] text-[#005A2C] hover:bg-[#E8F5E9] uppercase text-[10px]">
                        {chat.program_id} Room
                      </Badge>
                      <span className="text-[10px] text-[#6B7F70]">{formatDate(chat.timestamp)}</span>
                    </div>
                    <p className="text-sm italic text-[#2D5138]">"{chat.message}"</p>
                  </div>
                )) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-[#6B7F70]">No community chats found.</p>
                    <Link to="/programs" className="mt-2 inline-block text-xs font-medium text-[#005A2C] hover:underline">Join a room</Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}