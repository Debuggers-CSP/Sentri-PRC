import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calendar, Users, Activity, Award, Clock, CheckCircle, MessageSquare, History } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log("DEBUG: No User ID found in session. Fetching cancelled.");
        return;
      }

      try {
        setLoading(true);
        console.log(`DEBUG: Starting data fetch for User ID: ${user.id}`);

        // 1. Fetch Meetings
        const meetingRes = await fetch(`${pythonURI}/get-user-meetings?user_id=${user.id}`, fetchOptions);
        if (meetingRes.ok) {
          const mData = await meetingRes.json();
          setMeetings(mData);
        }

        // 2. Fetch Community Chat History
        const chatRes = await fetch(`${pythonURI}/get-user-community-chats?user_id=${user.id}`, fetchOptions);
        if (chatRes.ok) {
          const cData = await chatRes.json();
          setChatHistory(cData);
        }

        // 3. Fetch Real User Details (fname, lname, etc.) from DB
        const userRes = await fetch(`${pythonURI}/get-user-details?user_id=${user.id}`, fetchOptions);
        if (userRes.ok) {
          const uData = await userRes.json();
          
          // HIGH VISIBILITY LOG FOR YOU
          console.log("%cDEBUG: REAL USER PACKET RECEIVED FROM DB:", "color: green; font-weight: bold; font-size: 12px;");
          console.log(uData); 
          
          setDbUser(uData);
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

  // Logic to split meetings into Past and Upcoming
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= today);
  const pastMeetings = meetings.filter(m => new Date(m.date) < today);

  // Helper to format SQLite timestamp
  const formatDate = (ts: string) => {
    if (!ts) return "";
    return new Date(ts.replace(" ", "T") + "Z").toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get initials from dbUser (fname[0] + lname[0])
  const getInitials = () => {
    if (dbUser?.fname && dbUser?.lname) {
      return (dbUser.fname[0] + dbUser.lname[0]).toUpperCase();
    }
    // Fallback if DB data hasn't arrived yet
    return (user.username?.[0] || "U").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* User Info Card - NOW USES DB DATA */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4">
              {/* INITIALS: fname[0] + lname[0] */}
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                {getInitials()}
              </div>
              <div>
                {/* NAME: fname + lname */}
                <h2 className="text-3xl mb-1">
                  {dbUser ? `${dbUser.fname} ${dbUser.lname}` : (user.username || "Loading...")}
                </h2>
                {/* EMAIL: Fetched from DB */}
                <p className="text-blue-100">
                  {dbUser ? dbUser.email : user.email}
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-white/20 text-white border-white/30">Member</Badge>
                  <Badge className="bg-green-500/80 text-white border-none">Active Now</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="p-3 w-fit rounded-lg bg-blue-100 text-blue-600 mb-4"><Calendar /></div>
              <div className="text-3xl font-bold">{upcomingMeetings.length}</div>
              <div className="text-sm text-gray-600">Upcoming Meetings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="p-3 w-fit rounded-lg bg-green-100 text-green-600 mb-4"><CheckCircle /></div>
              <div className="text-3xl font-bold">{pastMeetings.length}</div>
              <div className="text-sm text-gray-600">Past Meetings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="p-3 w-fit rounded-lg bg-purple-100 text-purple-600 mb-4"><MessageSquare /></div>
              <div className="text-3xl font-bold">{chatHistory.length}</div>
              <div className="text-sm text-gray-600">Chat Messages</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Meetings List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="text-blue-600" /> Upcoming Meetings
              </h3>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? upcomingMeetings.map((m) => (
                  <div key={m.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.date} at {m.time} • {m.location}</div>
                  </div>
                )) : <p className="text-gray-400 text-sm text-center">No upcoming meetings.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Community Chat History SECTION */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <History className="text-purple-600" /> Community Chat History
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {chatHistory.length > 0 ? chatHistory.map((chat) => (
                  <div key={chat.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase text-[10px]">
                        {chat.program_id} Room
                      </Badge>
                      <span className="text-[10px] text-gray-400">{formatDate(chat.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{chat.message}"</p>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-sm">No community chats found.</p>
                    <Link to="/programs" className="text-blue-600 text-xs hover:underline mt-2 inline-block">Join a room</Link>
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