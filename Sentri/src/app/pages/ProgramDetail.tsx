import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock, MapPin, Send, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import aaLogo from "../../assets/735899c7aa27fedc5bfff3f073c9492f49572a67.png";
import acaLogo from "../../assets/054168f67c068da00639dd1c8048e86acf2571ca.png";
import alateenLogo from "../../assets/2c91f86ad959487223d3461bd473cbc2855a8351.png";
import alanonLogo from "../../assets/3c35ee6fefb6bfce531c22f63b9380fedac4d6a6.png";
import naLogo from "../../assets/2115c4842bd36bd47cd1708c3d26e2e14999ef8a.png";
import caLogo from "../../assets/58e3f4b9794493f73bea7d751b9df8993b8c105f.png";
import gaLogo from "../../assets/675121813725057c96f90900dde1cdb27e6a8031.png";
import saLogo from "../../assets/50593eb25097566896b0e6a4b491eabb700c98a6.png";
import { useAuth } from "../context/AuthContext";

const programsData: Record<string, any> = {
  aa: {
    id: 1,
    name: "AA",
    fullName: "Alcoholics Anonymous",
    logo: aaLogo,
    description: "Alcoholics Anonymous is a fellowship of people who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from alcoholism. The only requirement for membership is a desire to stop drinking. There are no dues or fees for AA membership; we are self-supporting through our own contributions.",
    focus: ["Alcohol addiction recovery", "12-step program", "Peer support"],
    meetings: [
      { day: "Monday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Open" },
      { day: "Tuesday", time: "6:30 PM - 8:00 PM", location: "Room A", type: "Closed" },
      { day: "Wednesday", time: "12:00 PM - 1:00 PM", location: "Community Center", type: "Open" },
      { day: "Thursday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Closed" },
      { day: "Friday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" },
      { day: "Saturday", time: "10:00 AM - 11:30 AM", location: "Main Hall", type: "Open" },
      { day: "Sunday", time: "6:00 PM - 7:30 PM", location: "Chapel", type: "Closed" },
    ]
  },
  aca: {
    id: 2,
    name: "ACA",
    fullName: "Adult Children of Alcoholics",
    logo: acaLogo,
    description: "Adult Children of Alcoholics (ACA) is a 12-step program for adults who grew up in alcoholic or dysfunctional homes. The program focuses on healing childhood trauma and breaking the patterns learned in dysfunctional family systems. ACA provides a safe space to address the effects of growing up with addiction or dysfunction.",
    focus: ["Childhood trauma healing", "Family dysfunction", "Inner child work"],
    meetings: [
      { day: "Monday", time: "6:00 PM - 7:30 PM", location: "Room C", type: "Closed" },
      { day: "Wednesday", time: "7:00 PM - 8:30 PM", location: "Room B", type: "Open" },
      { day: "Friday", time: "6:30 PM - 8:00 PM", location: "Room C", type: "Closed" },
      { day: "Sunday", time: "4:00 PM - 5:30 PM", location: "Main Hall", type: "Open" },
    ]
  },
  alateen: {
    id: 3,
    name: "Alateen",
    fullName: "Alateen Support Group",
    logo: alateenLogo,
    description: "Alateen is a recovery program for young people (ages 13-18) who have been affected by someone else's drinking. Through sharing experiences with peers who understand, teens learn coping skills and how to handle the challenges of living with or caring about someone with a drinking problem.",
    focus: ["Teen support", "Family impact", "Peer understanding"],
    meetings: [
      { day: "Tuesday", time: "4:00 PM - 5:00 PM", location: "Youth Center", type: "Closed" },
      { day: "Thursday", time: "4:00 PM - 5:00 PM", location: "Youth Center", type: "Closed" },
      { day: "Saturday", time: "2:00 PM - 3:00 PM", location: "Room A", type: "Open" },
    ]
  },
  "al-anon": {
    id: 4,
    name: "Al-Anon",
    fullName: "Al-Anon Family Groups",
    logo: alanonLogo,
    description: "Al-Anon Family Groups provide support to anyone whose life is or has been affected by someone else's drinking. Members share their experience, strength, and hope to help each other cope with the effects of alcoholism in a loved one and learn to take care of themselves.",
    focus: ["Family support", "Codependency", "Self-care"],
    meetings: [
      { day: "Monday", time: "7:30 PM - 9:00 PM", location: "Room D", type: "Open" },
      { day: "Wednesday", time: "6:00 PM - 7:30 PM", location: "Main Hall", type: "Closed" },
      { day: "Friday", time: "12:00 PM - 1:00 PM", location: "Room A", type: "Open" },
      { day: "Saturday", time: "9:00 AM - 10:30 AM", location: "Community Center", type: "Open" },
    ]
  },
  na: {
    id: 5,
    name: "NA",
    fullName: "Narcotics Anonymous",
    logo: naLogo,
    description: "Narcotics Anonymous is a global, community-based organization with a multi-lingual and multicultural membership. NA was founded in 1953, and our membership growth was minimal during our initial twenty years. Since the 1970s, our membership has increased rapidly, and NA can be found in 144 countries worldwide.",
    focus: ["Drug addiction recovery", "12-step program", "Clean living"],
    meetings: [
      { day: "Monday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" },
      { day: "Tuesday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Closed" },
      { day: "Thursday", time: "6:30 PM - 8:00 PM", location: "Room B", type: "Open" },
      { day: "Friday", time: "7:00 PM - 8:30 PM", location: "Chapel", type: "Closed" },
      { day: "Saturday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Open" },
    ]
  },
  ca: {
    id: 6,
    name: "CA",
    fullName: "Cocaine Anonymous",
    logo: caLogo,
    description: "Cocaine Anonymous is a fellowship of men and women who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from their addiction. The only requirement for membership is a desire to stop using cocaine and all other mind-altering substances.",
    focus: ["Cocaine recovery", "Substance-free living", "Support network"],
    meetings: [
      { day: "Tuesday", time: "8:00 PM - 9:30 PM", location: "Room A", type: "Closed" },
      { day: "Thursday", time: "7:30 PM - 9:00 PM", location: "Room D", type: "Open" },
      { day: "Saturday", time: "5:00 PM - 6:30 PM", location: "Room B", type: "Closed" },
    ]
  },
  ga: {
    id: 7,
    name: "GA",
    fullName: "Gamblers Anonymous",
    logo: gaLogo,
    description: "Gamblers Anonymous is a fellowship of men and women who have joined together to do something about their own gambling problem and to help other compulsive gamblers do the same. The only requirement for membership is a desire to stop gambling.",
    focus: ["Gambling addiction", "Financial recovery", "Behavioral change"],
    meetings: [
      { day: "Monday", time: "6:30 PM - 8:00 PM", location: "Room E", type: "Open" },
      { day: "Wednesday", time: "7:30 PM - 9:00 PM", location: "Room E", type: "Closed" },
      { day: "Friday", time: "6:00 PM - 7:30 PM", location: "Room D", type: "Open" },
    ]
  },
  sa: {
    id: 8,
    name: "SA",
    fullName: "Sexaholics Anonymous",
    logo: saLogo,
    description: "Sexaholics Anonymous is a fellowship of men and women who share their experience, strength, and hope with each other that they may solve their common problem and help others to recover from sexual addiction. Membership is open to all who share a desire to stop sexually destructive thinking and behavior.",
    focus: ["Sexual sobriety", "Relationship health", "Personal boundaries"],
    meetings: [
      { day: "Tuesday", time: "7:00 PM - 8:30 PM", location: "Room F", type: "Closed" },
      { day: "Thursday", time: "8:00 PM - 9:30 PM", location: "Room F", type: "Closed" },
      { day: "Sunday", time: "7:00 PM - 8:30 PM", location: "Room E", type: "Open" },
    ]
  }
};

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  
  const program = programId ? programsData[programId] : null;

  // Mock chat messages
  const [chatMessages] = useState([
    { id: 1, user: "Sarah M.", message: "Just celebrated 90 days today! Thank you all for the support.", time: "2 hours ago", isOwn: false },
    { id: 2, user: "Mike T.", message: "Congratulations Sarah! That's amazing progress! 🎉", time: "1 hour ago", isOwn: false },
    { id: 3, user: "Jennifer K.", message: "Looking forward to tonight's meeting. See everyone there!", time: "45 min ago", isOwn: false },
    { id: 4, user: "You", message: "Great job Sarah! Your story is inspiring.", time: "30 min ago", isOwn: true },
  ]);

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Program not found</h2>
          <Link to="/programs">
            <Button>Back to Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to a backend
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/programs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Programs</span>
              </Link>
              <h1 className="text-3xl text-gray-900">{program.name} - {program.fullName}</h1>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Program Overview */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <img src={program.logo} alt={program.name} className="w-32 h-32 object-contain bg-white/10 rounded-lg p-4" />
              <div className="flex-1">
                <h2 className="text-4xl mb-3">{program.fullName}</h2>
                <div className="flex flex-wrap gap-2">
                  {program.focus.map((item: string, idx: number) => (
                    <Badge key={idx} className="bg-white/20 text-white border-white/30">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Program</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{program.description}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meeting Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Weekly Meeting Schedule</h3>
                </div>
                <div className="space-y-3">
                  {program.meetings.map((meeting: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-20 font-semibold text-gray-900">{meeting.day}</div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                      <Badge variant={meeting.type === "Open" ? "default" : "secondary"}>
                        {meeting.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to My Calendar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Community Chatroom */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Community Chat</h3>
                    <p className="text-sm text-gray-500">24 members online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.isOwn 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {!msg.isOwn && <div className="text-xs font-semibold mb-1 opacity-70">{msg.user}</div>}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!message.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
