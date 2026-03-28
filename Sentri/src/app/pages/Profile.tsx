import { Link } from "react-router";
import { ArrowLeft, Calendar, Users, Activity, TrendingUp, Award, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Mock data for user activities
  const recentMeetings = [
    { id: 1, program: "AA", date: "March 22, 2026", time: "7:00 PM", location: "Main Hall" },
    { id: 2, program: "NA", date: "March 21, 2026", time: "6:30 PM", location: "Room B" },
    { id: 3, program: "AA", date: "March 20, 2026", time: "7:00 PM", location: "Main Hall" },
    { id: 4, program: "CA", date: "March 19, 2026", time: "8:00 PM", location: "Room A" },
  ];

  const programActivities = [
    { id: 1, activity: "Shared your story in group", program: "AA", date: "March 22, 2026" },
    { id: 2, activity: "Completed Step 4 workbook", program: "NA", date: "March 20, 2026" },
    { id: 3, activity: "Celebrated 30-day milestone", program: "AA", date: "March 18, 2026" },
    { id: 4, activity: "Joined community chat", program: "CA", date: "March 15, 2026" },
  ];

  const stats = [
    { label: "Meetings Attended", value: "24", icon: Users, color: "blue" },
    { label: "Current Streak", value: "8 days", icon: TrendingUp, color: "green" },
    { label: "Program Groups", value: "3", icon: Award, color: "purple" },
    { label: "Days Active", value: "45", icon: Calendar, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600",
              orange: "bg-orange-100 text-orange-600",
            }[stat.color];

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
          {/* Recent Meetings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Meetings</h3>
              </div>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{meeting.program}</span>
                        <Badge variant="outline" className="text-xs">{meeting.location}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-3">
                        <span>{meeting.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Link to="/meetings" className="flex items-center gap-2">
                  View All Meetings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Program Activities */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Program Activities</h3>
              </div>
              <div className="space-y-4">
                {programActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{activity.activity}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{activity.program}</Badge>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Link to="/programs" className="flex items-center gap-2">
                  View My Programs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sobriety Tracker Placeholder */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sobriety Tracker</h3>
            </div>
            <div className="text-center py-12 bg-gradient-to-b from-green-50 to-white rounded-lg border-2 border-dashed border-green-200">
              <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl text-gray-900 mb-2">Track Your Milestones</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Monitor your recovery journey with our sobriety tracker. Coming soon!
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
                Set Up Tracker (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
