import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { BookOpen, Calendar, Check, Clock, Globe, HandHeart, Heart, MapPin, Send, Shield, Sparkles, UserPlus, Users, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
import { pythonURI, fetchOptions } from "../../../../assets/js/api/config.js";

type Aspect = { title: string; description: string; icon: LucideIcon };
type Meeting = { day: string; time: string; location: string; type: string };

const tagClasses = [
  "bg-[#E8F5E9] text-[#005A2C] border-[#A3D977]",
  "bg-[#EEF6EA] text-[#2D6A37] border-[#CDE6B7]",
  "bg-emerald-100 text-emerald-700 border-emerald-300",
  "bg-amber-100 text-amber-700 border-amber-300",
];

type ProgramInfo = {
  id: number;
  name: string;
  fullName: string;
  logo: string;
  description: string;
  history: string;
  philosophy: string;
  principles: string;
  focus: string[];
  recoveryTypes: string[];
  keyAspects: Aspect[];
  corePrinciples: { label: string; icon: LucideIcon }[];
  meetings: Meeting[];
};

const programsData: Record<string, ProgramInfo> = {
  aa: {
    id: 1,
    name: "AA",
    fullName: "Alcoholics Anonymous",
    logo: aaLogo,
    description:
      "Alcoholics Anonymous is a fellowship of men and women who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from alcoholism. The only requirement is a desire to stop drinking. There are no dues or fees. AA is self-supporting, non-political, and focused on staying sober and helping other alcoholics achieve sobriety.",
    history:
      "AA history begins June 10, 1935 in Akron, Ohio when Bill W. and Dr. Bob connected through the Oxford Group. Early work at Akron’s City Hospital led to the foundation of AA. Groups formed in New York and Cleveland. In 1939, the foundational text Alcoholics Anonymous introduced the Twelve Steps. In 1946, Bill W. promoted the Twelve Traditions. AA spread globally and by 2018 reported more than 2 million members and more than 120,000 groups in approximately 180 nations.",
    philosophy:
      "AA centers recovery through the Twelve Steps, regular meetings, sponsorship, literature like The Big Book, and global fellowship. Members seek help from a higher power as they understand it, practice self-examination, and make amends.",
    principles:
      "Anonymity, open and closed meetings, specialty meetings, sponsorship, and peer fellowship are foundational. The only requirement for membership is a desire to stop drinking.",
    focus: ["12-Step Program", "Anonymity", "Literature", "Global Fellowship"],
    recoveryTypes: ["Substance Recovery", "Peer Support", "Spiritual Growth", "Meeting-Based"],
    keyAspects: [
      { title: "12-Step Program", description: "Acknowledges powerlessness over alcohol, seeks help from a higher power, and includes self-examination and amends.", icon: Sparkles },
      { title: "Meetings", description: "In-person and virtual meetings help members share challenges and successes in a supportive setting.", icon: Users },
      { title: "Anonymity", description: "Members protect each other’s identity to keep the space safe and stigma-free.", icon: Shield },
      { title: "Literature", description: "The Big Book and related materials provide guidance and lived recovery stories.", icon: BookOpen },
      { title: "Support Network", description: "Sponsorship relationships connect newer members with experienced guidance.", icon: HandHeart },
      { title: "Global Fellowship", description: "AA groups exist worldwide, reinforcing community as a path to sobriety.", icon: Globe },
    ],
    corePrinciples: [
      { label: "Anonymity", icon: Shield },
      { label: "12-Steps", icon: Sparkles },
      { label: "Sponsorship", icon: HandHeart },
      { label: "Community", icon: Users },
    ],
    meetings: [
      { day: "Monday", time: "7:00 PM - 8:30 PM", location: "Main Hall", type: "Open" },
      { day: "Friday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" },
    ],
  },
  aca: {
    id: 2,
    name: "ACA",
    fullName: "Adult Children of Alcoholics",
    logo: acaLogo,
    description:
      "Adult Children of Alcoholics is a Twelve Step, Twelve Tradition program for adults who grew up in alcoholic or otherwise dysfunctional homes. ACA identifies family dysfunction as a disease that affects adulthood and recovery.",
    history:
      "ACA was founded circa 1978 for people recovering from the effects of growing up in alcoholic or dysfunctional families. Tony A. co-founded ACA and authored The Laundry List and related foundational material.",
    philosophy:
      "ACA emphasizes understanding dysfunction, identifying patterns from childhood, inner child work, emotional healing, supportive community, and personal responsibility.",
    principles:
      "Members work the Twelve Steps, focus on the ACA Solution, and accept a higher power of their understanding. Growth includes communication skills, boundaries, and self-care.",
    focus: ["Inner Child Work", "Laundry List", "The Solution", "Pattern Healing"],
    recoveryTypes: ["Trauma Recovery", "Family Systems", "Emotional Growth", "12-Step"],
    keyAspects: [
      { title: "Understanding Dysfunction", description: "Recognizes how family dysfunction impacts emotional and psychological development.", icon: Heart },
      { title: "Identifying Patterns", description: "Names recurring patterns like fear of abandonment, perfectionism, and intimacy struggles.", icon: Shield },
      { title: "Inner Child Work", description: "Heals neglected or wounded parts of self from childhood experiences.", icon: HandHeart },
      { title: "Supportive Community", description: "Creates a respectful space to share experience and recovery with peers.", icon: Users },
    ],
    corePrinciples: [
      { label: "Inner Child", icon: Heart },
      { label: "12-Steps", icon: Sparkles },
      { label: "Patterns", icon: Shield },
      { label: "Community", icon: Users },
    ],
    meetings: [],
  },
  alateen: {
    id: 3,
    name: "Alateen",
    fullName: "Alateen Support Group",
    logo: alateenLogo,
    description: "Alateen is for ages 13-18 affected by a loved one’s drinking. It provides peer support, confidentiality, and emotional coping tools.",
    history: "Alateen is part of Al-Anon Family Groups and focuses on young people impacted by family alcoholism or addiction.",
    philosophy: "Teens cannot control another person’s drinking, but they can detach with love, care for themselves, and grow with peers.",
    principles: "Confidentiality, nonjudgment, 12-step growth, and trained adult sponsorship are core to Alateen meetings.",
    focus: ["Teen Support", "Ages 13-18", "Peer Recovery", "Confidential Space"],
    recoveryTypes: ["Youth", "Family Impact", "12-Step", "Self-Regulation"],
    keyAspects: [
      { title: "Support for Teens", description: "Helps teens understand they are not alone in confusion, fear, anger, and sadness.", icon: Users },
      { title: "12-Step Growth", description: "Uses Al-Anon derived 12 steps for resilience and personal healing.", icon: Sparkles },
      { title: "Safe Meetings", description: "Trained sponsors provide supportive, nonjudgmental meeting environments.", icon: Shield },
      { title: "Emotional Control", description: "Teens gain healthier coping even when they cannot control others.", icon: Heart },
    ],
    corePrinciples: [{ label: "Confidentiality", icon: Shield }, { label: "Peer Support", icon: Users }, { label: "Self-Care", icon: Heart }, { label: "12-Step", icon: Sparkles }],
    meetings: [],
  },
  "al-anon": {
    id: 4, name: "Al-Anon", fullName: "Al-Anon Family Groups", logo: alanonLogo,
    description: "Al-Anon is a fellowship of relatives and friends of alcoholics who share experience, strength, and hope. It emphasizes changed attitudes, emotional support, and recovery for families.",
    history: "Al-Anon was co-founded in 1951 by Anne B. and Lois W. Independent family groups were consolidated and adapted AA’s Twelve Steps for families.",
    philosophy: "Family members often need recovery themselves. Al-Anon teaches self-care, emotional boundaries, and support rather than controlling the alcoholic.",
    principles: "Detachment with Love and confidentiality are central. Members focus on their own well-being and spiritual growth.",
    focus: ["Family/Friends", "Detachment with Love", "Self-Care", "12-Steps"],
    recoveryTypes: ["Family Recovery", "Emotional Support", "Spiritual Growth", "Meeting-Based"],
    keyAspects: [
      { title: "Understanding & Support", description: "Safe space to share feelings with others who understand family alcohol impact.", icon: Users },
      { title: "Self-Care", description: "Members focus on their own wellness instead of trying to control another person.", icon: Heart },
      { title: "Anonymity", description: "Confidentiality enables open, stigma-free sharing.", icon: Shield },
      { title: "Detachment with Love", description: "Care for loved ones without enabling harmful behavior.", icon: HandHeart },
    ],
    corePrinciples: [{ label: "Detachment", icon: HandHeart }, { label: "Self-Care", icon: Heart }, { label: "Anonymity", icon: Shield }, { label: "Support", icon: Users }],
    meetings: [],
  },
  na: {
    id: 5, name: "NA", fullName: "Narcotics Anonymous", logo: naLogo,
    description: "Narcotics Anonymous is a fellowship for recovery from addiction that focuses on what members want to do about the problem, not what or how much they used.",
    history: "NA was founded in 1953 by Jimmy K. It is one of the largest 12-step fellowships with global reach.",
    philosophy: "Recovery is a personal journey supported by a higher power as understood by the individual, sponsorship, and peer connection.",
    principles: "Meetings, anonymity, inclusion, literature, and global fellowship are central to NA’s model.",
    focus: ["All Drug Types", "Personal Journey", "Sponsorship", "Higher Power"],
    recoveryTypes: ["Substance Recovery", "12-Step", "Global Fellowship", "Peer Support"],
    keyAspects: [
      { title: "Meetings", description: "Regular free meetings provide peer support for anyone struggling with substance use.", icon: Users },
      { title: "12 Steps", description: "Structured recovery path emphasizing accountability, amends, and growth.", icon: Sparkles },
      { title: "Anonymity", description: "Members share openly with safety and privacy.", icon: Shield },
      { title: "Sponsorship", description: "Guidance from experienced members supports long-term recovery.", icon: HandHeart },
    ],
    corePrinciples: [{ label: "Journey", icon: Heart }, { label: "Higher Power", icon: Sparkles }, { label: "Sponsorship", icon: HandHeart }, { label: "Anonymity", icon: Shield }],
    meetings: [
      { day: "Monday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" },
      { day: "Thursday", time: "6:30 PM - 8:00 PM", location: "Room B", type: "Open" },
    ],
  },
  ca: {
    id: 6, name: "CA", fullName: "Cocaine Anonymous", logo: caLogo,
    description: "Cocaine Anonymous is a fellowship for people seeking freedom from cocaine and all other mind-altering substances.",
    history: "The name Cocaine Anonymous dates back to 1979; the program is a 12-step fellowship open to anyone with a desire for freedom from mind-altering substances.",
    philosophy: "CA emphasizes powerlessness over addiction, spirituality, honesty, personal responsibility, unity, service, and continuous growth.",
    principles: "Anonymity, sponsorship, inclusivity, literature, and service to others support sustained recovery.",
    focus: ["Cocaine + All Mind-Altering Substances", "Service", "Spiritual Growth", "Sponsorship"],
    recoveryTypes: ["Substance Recovery", "12-Step", "Service", "Community"],
    keyAspects: [
      { title: "Fellowship", description: "Members share experience, strength, and hope to help one another recover.", icon: Users },
      { title: "Service to Others", description: "Helping others reinforces personal recovery and community strength.", icon: HandHeart },
      { title: "Spirituality", description: "Members seek a higher power as they understand it.", icon: Sparkles },
      { title: "Personal Responsibility", description: "Recovery includes accountability, honesty, and growth.", icon: Shield },
    ],
    corePrinciples: [{ label: "Powerlessness", icon: Shield }, { label: "Service", icon: HandHeart }, { label: "Spirituality", icon: Sparkles }, { label: "Unity", icon: Users }],
    meetings: [],
  },
  ga: {
    id: 7, name: "GA", fullName: "Gamblers Anonymous", logo: gaLogo,
    description: "GA is a fellowship for people who want to stop gambling and help others recover from compulsive gambling.",
    history: "GA was founded in 1957 by Jim W. with the first meeting on September 13, 1957 in Los Angeles. Members use the 20 Questions guide.",
    philosophy: "GA emphasizes surrender, acceptance, and personal responsibility. Members acknowledge powerlessness over gambling and work toward stable, healthy lives.",
    principles: "Anonymity, confidentiality, fellowship, accountability, spiritual growth, and making amends are key elements.",
    focus: ["20 Questions", "Personal Responsibility", "Surrender", "Making Amends"],
    recoveryTypes: ["Behavioral Recovery", "12-Step", "Peer Fellowship", "Accountability"],
    keyAspects: [
      { title: "Peer Support", description: "Members share struggles and successes in a community that understands gambling addiction.", icon: Users },
      { title: "Anonymity & Confidentiality", description: "What is shared in meetings stays in meetings to protect trust.", icon: Shield },
      { title: "Step One Acceptance", description: "Admitting powerlessness over gambling is the start of recovery.", icon: Sparkles },
      { title: "Personal Responsibility", description: "Members make amends and build healthier coping strategies.", icon: HandHeart },
    ],
    corePrinciples: [{ label: "20 Questions", icon: BookOpen }, { label: "Surrender", icon: Sparkles }, { label: "Responsibility", icon: HandHeart }, { label: "Anonymity", icon: Shield }],
    meetings: [],
  },
  sa: {
    id: 8, name: "SA", fullName: "Sexaholics Anonymous", logo: saLogo,
    description: "Sexaholics Anonymous is a fellowship for people who desire to stop lusting and become sexually sober.",
    history: "SA grew as a 12-step recovery fellowship centered on sexual sobriety, mutual support, and anonymity.",
    philosophy: "Recovery through fellowship, personal responsibility, spiritual growth, and continuous improvement.",
    principles: "Anonymity, acceptance, service to others, integrity, honesty, humility, and spiritual principles such as love, forgiveness, and compassion.",
    focus: ["Sexual Sobriety", "Integrity/Honesty", "Inventory", "Spiritual Growth"],
    recoveryTypes: ["Behavioral Recovery", "12-Step", "Integrity", "Peer Support"],
    keyAspects: [
      { title: "12-Step Framework", description: "Personal growth, accountability, and recovery support through the steps.", icon: Sparkles },
      { title: "Anonymity", description: "Confidential sharing enables honesty without fear of judgment.", icon: Shield },
      { title: "Sponsorship & Meetings", description: "Regular meetings and sponsor relationships support sobriety.", icon: Users },
      { title: "Personal Inventory", description: "Moral inventory builds insight, honesty, and behavior change.", icon: BookOpen },
    ],
    corePrinciples: [{ label: "Sobriety", icon: Heart }, { label: "Integrity", icon: Shield }, { label: "Service", icon: HandHeart }, { label: "Growth", icon: Sparkles }],
    meetings: [],
  },
};

function getNextDateForDay(dayName: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDay = days.indexOf(dayName);
  if (targetDay === -1) return new Date().toISOString().split("T")[0];
  const today = new Date();
  let daysUntil = targetDay - today.getDay();
  if (daysUntil <= 0) daysUntil += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate.toISOString().split("T")[0];
}

function extractStartTime(timeRange: string): string {
  return timeRange.split(" - ")[0].trim();
}

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const { user, updateJoinedProgram } = useAuth();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const program = programId ? programsData[programId] : null;

  useEffect(() => { if (program?.meetings.length) setSelectedMeeting(program.meetings[0]); }, [programId, program]);
  useEffect(() => { setIsJoined(Boolean(programId && user?.joined_program === programId)); }, [programId, user?.joined_program]);

  const fetchChatHistory = async () => {
    if (!programId) return;
    try {
      const response = await fetch(`${pythonURI}/get-chat-history/${programId}`, fetchOptions);
      if (response.ok) setChatMessages(await response.json());
    } catch (err) { console.error("Error fetching chat:", err); }
  };

  useEffect(() => {
    fetchChatHistory();
    const interval = setInterval(fetchChatHistory, 5000);
    return () => clearInterval(interval);
  }, [programId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!user || !user.id) return alert("Please log in to chat");
    try {
      const response = await fetch(`${pythonURI}/send-chat-message`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program_id: programId, user_id: user.id, username: user.username || user.name || "Anonymous", message: message.trim() }),
      });
      if (response.ok) { setMessage(""); fetchChatHistory(); }
    } catch (err) { console.error("Send Error:", err); }
  };

  const handleAddToCalendar = async (meeting?: Meeting) => {
    if (!user || !user.id) return alert("Please log in first!");
    const targetMeeting = meeting || selectedMeeting || program?.meetings?.[0];
    if (!targetMeeting) return alert("No meeting available to add.");
    try {
      const response = await fetch(`${pythonURI}/add-meeting`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: `${program?.name} Meeting`,
          date: getNextDateForDay(targetMeeting.day),
          time: extractStartTime(targetMeeting.time),
          location: targetMeeting.location,
          type: targetMeeting.type,
        }),
      });
      alert(response.ok ? `✅ ${program?.name} meeting saved!` : "❌ Failed to save meeting.");
    } catch (err) { console.error("Connection Error:", err); }
  };

  const handleJoin = async () => {
    if (!programId || !user || !user.id) return alert("Please log in first!");
    try {
      const response = await fetch(`${pythonURI}/join-program`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, program_id: programId }),
      });
      if (response.ok) { updateJoinedProgram(programId); setIsJoined(true); }
    } catch (err) { console.error("Join Error:", err); }
  };

  if (!program) return <div className="min-h-screen flex items-center justify-center"><Link to="/programs"><Button>Back to Programs</Button></Link></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF5] to-[#E8F5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#76B82A] to-[#005A2C] p-8 text-white">
            <div className="flex items-center gap-6">
              <img src={program.logo} alt={program.name} className="w-28 h-28 object-contain bg-white/10 rounded-lg p-3" />
              <div className="flex-1">
                <h2 className="text-4xl mb-3">{program.fullName}</h2>
                <div className="flex flex-wrap gap-2">
                  {program.focus.map((item, idx) => <Badge key={idx} className="bg-white/20 text-white border-white/30">{item}</Badge>)}
                </div>
              </div>
              <Button onClick={handleJoin} className={isJoined ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white text-[#005A2C] hover:bg-[#E8F5E9]"}>
                {isJoined ? <><Check className="w-4 h-4 mr-2" />Joined</> : <><UserPlus className="w-4 h-4 mr-2" />Join Program</>}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Program Guide</CardTitle></CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid grid-cols-3 mb-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="philosophy">Philosophy/Principles</TabsTrigger></TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <p className="text-[#2D5138] leading-relaxed">{program.description}</p>
                    <div className="flex flex-wrap gap-2">{program.recoveryTypes.map((type, i) => <Badge key={type} className={tagClasses[i % tagClasses.length]}>{type}</Badge>)}</div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {program.keyAspects.map((aspect) => {
                        const Icon = aspect.icon;
                        return (
                          <Card key={aspect.title}><CardContent className="p-4"><div className="flex items-start gap-2"><Icon className="w-4 h-4 mt-1 text-[#005A2C]" /><div><h4 className="font-semibold text-sm">{aspect.title}</h4><p className="text-xs text-[#5A7462] mt-1">{aspect.description}</p></div></div></CardContent></Card>
                        );
                      })}
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {program.corePrinciples.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-2 text-xs p-2 rounded bg-[#F1F8EB]"><Icon className="w-4 h-4 text-[#005A2C]" />{label}</div>)}
                    </div>
                  </TabsContent>
                  <TabsContent value="history"><p className="text-[#2D5138] whitespace-pre-line leading-relaxed">{program.history}</p></TabsContent>
                  <TabsContent value="philosophy" className="space-y-4"><p className="text-[#2D5138] whitespace-pre-line leading-relaxed">{program.philosophy}</p><p className="text-[#2D5138] whitespace-pre-line leading-relaxed">{program.principles}</p></TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Meeting Schedule</CardTitle></CardHeader>
              <CardContent>
                {program.meetings.length === 0 ? <p className="text-[#6B7F70]">No scheduled meetings listed for this program.</p> : (
                  <div className="space-y-3">{program.meetings.map((meeting, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${selectedMeeting === meeting ? "bg-[#E8F5E9] border-[#76B82A]" : "bg-[#F1F8EB] border-transparent hover:bg-[#E8F5E9]"}`} onClick={() => setSelectedMeeting(meeting)}>
                      <div className="flex items-center gap-4"><div className="w-20 font-semibold">{meeting.day}</div><div className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" />{meeting.time}</div><div className="flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" />{meeting.location}</div></div>
                      <div className="flex items-center gap-2"><Badge>{meeting.type}</Badge><Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleAddToCalendar(meeting); }}><Calendar className="w-3 h-3 mr-1" />Add</Button></div>
                    </div>
                  ))}</div>
                )}
                <Button onClick={() => handleAddToCalendar(selectedMeeting || undefined)} className="w-full mt-4 bg-[#005A2C] hover:bg-[#124627] text-white" disabled={!selectedMeeting}><Calendar className="w-4 h-4 mr-2" />{selectedMeeting ? `Add ${selectedMeeting.day} Meeting` : "Select a Meeting Above"}</Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-[680px] flex flex-col">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-[#2D6A37]" />Community Chat</CardTitle></CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {chatMessages.length === 0 ? <p className="text-center text-[#6B7F70] mt-10">No messages yet. Be the first to say hello!</p> : chatMessages.map((msg) => {
                    const isOwn = user && msg.user_id === user.id;
                    return <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}><div className={`max-w-[85%] rounded-lg p-3 ${isOwn ? "bg-[#005A2C] text-white" : "bg-[#EEF6EA] text-[#1F3B2B]"}`}>{!isOwn && <div className="text-xs font-bold mb-1 text-[#2D6A37]">{msg.username}</div>}<p className="text-sm whitespace-pre-wrap">{msg.message}</p></div></div>;
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t pt-4"><div className="flex gap-2"><Textarea placeholder={user ? "Type your message..." : "Log in to chat"} value={message} onChange={(e) => setMessage(e.target.value)} className="resize-none" rows={2} disabled={!user} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} /><Button onClick={handleSendMessage} className="bg-[#005A2C] hover:bg-[#124627] text-white h-auto" disabled={!message.trim() || !user}><Send className="w-4 h-4" /></Button></div></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}