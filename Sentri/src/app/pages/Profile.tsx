import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calendar, Users, Activity, Award, Clock, CheckCircle, MessageSquare, History } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";

interface Meeting {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

export function Profile() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK CHAT HISTORY DATA
  const mockChatHistory = [
    { id: 1, text: "Feeling a bit overwhelmed today, but staying focused on my goals.", date: "March 28, 2026", status: "Stable" },
    { id: 2, text: "Had a strong craving after work, reached out to my sponsor immediately.", date: "March 26, 2026", status: "Distressed" },
    { id: 3, text: "Woke up feeling grateful for another day of sobriety. Ready for the meeting.", date: "March 25, 2026", status: "Stable" },
    { id: 4, text: "Struggling with sleep patterns, but keeping the routine.", date: "March 24, 2026", status: "Stable" }
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:5001/get-user-meetings?user_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setMeetings(data);
        }
      } catch (err) {
        console.error("Error fetching meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user?.id]);

  if (!user) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= today);
  const pastMeetings = meetings.filter(m => new Date(m.date) < today);

  const stats = [
    { label: "Upcoming Meetings", value: upcomingMeetings.length, icon: Calendar, color: "blue" },
    { label: "Past Meetings", value: pastMeetings.length, icon: CheckCircle, color: "green" },
    { label: "Program Groups", value: "3", icon: Award, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Track your recovery journey</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h2 className="text-3xl mb-2">{user.name}</h2>
                <p className="text-blue-100 text-lg">{user.email}</p>
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-white/20 text-white border-white/30">Member since March 2026</Badge>
                  <Badge className="bg-green-500/80 text-white border-green-400/30">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600",
            }[stat.color as "blue" | "green" | "purple"];

            return (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings List */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h3>
              </div>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{meeting.name}</span>
                        <Badge variant="outline" className="text-xs">{meeting.location}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-3">
                        <span>{meeting.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.time}</span>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-sm py-4">No upcoming meetings scheduled.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Past Meetings List */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Past Meetings</h3>
              </div>
              <div className="space-y-4">
                {pastMeetings.length > 0 ? pastMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1 font-semibold">{meeting.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{meeting.type}</Badge>
                        <span className="text-xs text-gray-500">{meeting.date}</span>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-sm py-4">No past meetings recorded.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CHAT HISTORY SECTION --- */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Previous Chat History</h3>
            </div>
            
            <div className="space-y-4">
              {mockChatHistory.map((chat) => (
                <div key={chat.id} className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MessageSquare className="w-3 h-3" />
                      <span>{chat.date}</span>
                    </div>
                    <Badge className={chat.status === "Stable" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {chat.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{chat.text}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}