import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { Calendar, Check, Clock, MapPin, Send, UserPlus, Users } from "lucide-react";
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
import { pythonURI, fetchOptions } from '../../../../assets/js/api/config.js';

const programsData: Record<string, any> = {
  aa: {
    id: 1, name: "AA", fullName: "Alcoholics Anonymous", logo: aaLogo,
    description: "Alcoholics Anonymous is a fellowship of people who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from alcoholism.",
    focus: ["Alcohol addiction recovery", "12-step program", "Peer support"],
    meetings: [{ day: "Monday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Open" }, { day: "Friday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" }]
  },
  aca: { id: 2, name: "ACA", fullName: "Adult Children of Alcoholics", logo: acaLogo, focus: ["Trauma healing"], description: "For adults from dysfunctional homes.", meetings: [] },
  alateen: { id: 3, name: "Alateen", fullName: "Alateen Support Group", logo: alateenLogo, focus: ["Teen support"], description: "For young people affected by someone's drinking.", meetings: [] },
  "al-anon": { id: 4, name: "Al-Anon", fullName: "Al-Anon Family Groups", logo: alanonLogo, focus: ["Family support"], description: "Support for families of alcoholics.", meetings: [] },
  na: {
    id: 5, name: "NA", fullName: "Narcotics Anonymous", logo: naLogo,
    description: "Narcotics Anonymous is a global, community-based organization for recovery from drug addiction.",
    focus: ["Drug addiction recovery", "12-step program", "Clean living"],
    meetings: [{ day: "Monday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" }, { day: "Thursday", time: "6:30 PM - 8:00 PM", location: "Room B", type: "Open" }]
  },
  ca: { id: 6, name: "CA", fullName: "Cocaine Anonymous", logo: caLogo, focus: ["Cocaine recovery"], description: "Fellowship for cocaine recovery.", meetings: [] },
  ga: { id: 7, name: "GA", fullName: "Gamblers Anonymous", logo: gaLogo, focus: ["Gambling addiction"], description: "Fellowship for gambling recovery.", meetings: [] },
  sa: { id: 8, name: "SA", fullName: "Sexaholics Anonymous", logo: saLogo, focus: ["Sexual sobriety"], description: "Fellowship for sexual addiction recovery.", meetings: [] }
};

// Helper: Given a day name like "Monday", return the next occurrence as YYYY-MM-DD
function getNextDateForDay(dayName: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDay = days.indexOf(dayName);
  if (targetDay === -1) return new Date().toISOString().split("T")[0];

  const today = new Date();
  const todayDay = today.getDay();
  let daysUntil = targetDay - todayDay;
  if (daysUntil <= 0) daysUntil += 7; // always get the NEXT occurrence

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate.toISOString().split("T")[0]; // e.g. "2026-04-07"
}

// Helper: Extract just the start time from a range like "7:00 PM - 8:30 PM"
function extractStartTime(timeRange: string): string {
  return timeRange.split(" - ")[0].trim(); // e.g. "7:00 PM"
}

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const { user, updateJoinedProgram } = useAuth();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null); // ← NEW
  const [isJoined, setIsJoined] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const program = programId ? programsData[programId] : null;

  // Auto-select the first meeting when program loads
  useEffect(() => {
    if (program?.meetings?.length > 0) {
      setSelectedMeeting(program.meetings[0]);
    }
  }, [programId]);

  useEffect(() => {
    setIsJoined(Boolean(programId && user?.joined_program === programId));
  }, [programId, user?.joined_program]);

  // 1. Function to Fetch Chat History
  const fetchChatHistory = async () => {
    if (!programId) return;
    try {
      const response = await fetch(`${pythonURI}/get-chat-history/${programId}`, fetchOptions);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  // 2. Load history on mount and poll every 5 seconds for "live" feel
  useEffect(() => {
    fetchChatHistory();
    const interval = setInterval(fetchChatHistory, 5000);
    return () => clearInterval(interval);
  }, [programId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!user || !user.id) {
      alert("Please log in to chat");
      return;
    }

    console.log("Current User Object:", user);

    const payload = {
      program_id: programId,
      user_id: user.id,
      username: user.username || user.name || "Anonymous", 
      message: message.trim()
    };

    try {
      const response = await fetch(`${pythonURI}/send-chat-message`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("");
        fetchChatHistory();
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  const handleAddToCalendar = async (meeting?: any) => {
    if (!user || !user.id) {
      alert("Please log in first!");
      return;
    }

    // Use the meeting passed directly from the row button,
    // or fall back to selectedMeeting, or the first meeting in the list
    const targetMeeting = meeting || selectedMeeting || program?.meetings?.[0];

    if (!targetMeeting) {
      alert("No meeting available to add.");
      return;
    }

    // Build the payload using REAL data from the meeting object
    const meetingToSave = {
      user_id: user.id,
      name: `${program?.name} Meeting`,          // e.g. "AA Meeting"
      date: getNextDateForDay(targetMeeting.day), // e.g. "2026-04-07" (next Monday)
      time: extractStartTime(targetMeeting.time), // e.g. "7:00 PM"
      location: targetMeeting.location,           // e.g. "Main Hall"
      type: targetMeeting.type,                   // e.g. "Open"
    };

    console.log("Saving meeting:", meetingToSave); // Debug: check browser console

    try {
      const response = await fetch(`${pythonURI}/add-meeting`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingToSave),
      });

      if (response.ok) {
        alert(`✅ ${program?.name} meeting on ${targetMeeting.day} at ${extractStartTime(targetMeeting.time)} saved to your profile!`);
      } else {
        alert("❌ Failed to save meeting.");
      }
    } catch (err) {
      console.error("Connection Error:", err);
    }
  };

  const handleJoin = async () => {
    if (!programId) return;

    if (!user || !user.id) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch(`${pythonURI}/join-program`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          program_id: programId,
        }),
      });

      if (response.ok) {
        updateJoinedProgram(programId);
        setIsJoined(true);
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to join program.");
      }
    } catch (err) {
      console.error("Join Error:", err);
      alert("Connection Error: Could not join program.");
    }
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Program not found</h2>
          <Link to="/programs"><Button>Back to Programs</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <img src={program.logo} alt={program.name} className="w-32 h-32 object-contain bg-white/10 rounded-lg p-4" />
              <div className="flex-1">
                <h2 className="text-4xl mb-3">{program.fullName}</h2>
                <div className="flex flex-wrap gap-2">
                  {program.focus.map((item: string, idx: number) => (
                    <Badge key={idx} className="bg-white/20 text-white border-white/30">{item}</Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleJoin}
                className={
                  isJoined
                    ? "bg-green-600 hover:bg-green-700 text-white border border-green-500"
                    : "bg-white text-blue-700 hover:bg-blue-100 border border-white/30"
                }
              >
                {isJoined ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Joined
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Program
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Program</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{program.description}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                  <h3 className="text-xl font-semibold text-gray-900">Weekly Meeting Schedule</h3>
                </div>

                {program.meetings.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No scheduled meetings listed for this program.</p>
                ) : (
                  <div className="space-y-3">
                    {program.meetings.map((meeting: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer border-2 ${
                          selectedMeeting === meeting
                            ? "bg-blue-100 border-blue-400"
                            : "bg-blue-50 border-transparent hover:bg-blue-100"
                        }`}
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 font-semibold text-gray-900">{meeting.day}</div>
                          <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4" /><span>{meeting.time}</span></div>
                          <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{meeting.location}</span></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={meeting.type === "Open" ? "default" : "secondary"}>{meeting.type}</Badge>
                          {/* Per-row Add button — saves THIS specific meeting */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-400 hover:bg-blue-600 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation(); // don't also trigger the row's onClick
                              handleAddToCalendar(meeting);
                            }}
                          >
                            <Calendar className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Main button — adds the selected (highlighted) meeting */}
                <Button
                  onClick={() => handleAddToCalendar(selectedMeeting)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!selectedMeeting}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedMeeting
                    ? `Add ${selectedMeeting.day} Meeting to My Calendar`
                    : "Select a Meeting Above"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Community Chat</h3>
                    <p className="text-sm text-gray-500">Live Support Room</p>
                  </div>
                </div>

                {/* Live Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No messages yet. Be the first to say hello!</p>
                  ) : (
                    chatMessages.map((msg) => {
                      const isOwn = user && msg.user_id === user.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] rounded-lg p-3 ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {!isOwn && <div className="text-xs font-bold mb-1 text-purple-600">{msg.username}</div>}
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">
                             {new Date(msg.timestamp + "Z").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={user ? "Type your message..." : "Log in to chat"}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={2}
                      disabled={!user}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-auto"
                      disabled={!message.trim() || !user}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Press Enter to send</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}