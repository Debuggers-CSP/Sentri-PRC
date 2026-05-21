import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  Globe,
  HandHeart,
  Heart,
  MapPin,
  Send,
  Shield,
  Sparkles,
  UserPlus,
  Users,
  Pin,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
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
  resourceLink?: string;
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
      {
        title: "12-Step Program",
        description:
          "Acknowledges powerlessness over alcohol, seeks help from a higher power, and includes self-examination and amends.",
        icon: Sparkles,
      },
      {
        title: "Meetings",
        description:
          "In-person and virtual meetings help members share challenges and successes in a supportive setting.",
        icon: Users,
      },
      {
        title: "Anonymity",
        description:
          "Members protect each other’s identity to keep the space safe and stigma-free.",
        icon: Shield,
      },
      {
        title: "Literature",
        description:
          "The Big Book and related materials provide guidance and lived recovery stories.",
        icon: BookOpen,
      },
      {
        title: "Support Network",
        description:
          "Sponsorship relationships connect newer members with experienced guidance.",
        icon: HandHeart,
      },
      {
        title: "Global Fellowship",
        description:
          "AA groups exist worldwide, reinforcing community as a path to sobriety.",
        icon: Globe,
      },
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
    resourceLink: "https://www.aa.org",
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
      {
        title: "Understanding Dysfunction",
        description:
          "Recognizes how family dysfunction impacts emotional and psychological development.",
        icon: Heart,
      },
      {
        title: "Identifying Patterns",
        description:
          "Names recurring patterns like fear of abandonment, perfectionism, and intimacy struggles.",
        icon: Shield,
      },
      {
        title: "Inner Child Work",
        description:
          "Heals neglected or wounded parts of self from childhood experiences.",
        icon: HandHeart,
      },
      {
        title: "Supportive Community",
        description:
          "Creates a respectful space to share experience and recovery with peers.",
        icon: Users,
      },
    ],
    corePrinciples: [
      { label: "Inner Child", icon: Heart },
      { label: "12-Steps", icon: Sparkles },
      { label: "Patterns", icon: Shield },
      { label: "Community", icon: Users },
    ],
    meetings: [],
    resourceLink: "https://adultchildren.org",
  },
  alateen: {
    id: 3,
    name: "Alateen",
    fullName: "Alateen Support Group",
    logo: alateenLogo,
    description:
      "Alateen is for ages 13-18 affected by a loved one’s drinking. It provides peer support, confidentiality, and emotional coping tools.",
    history:
      "Alateen is part of Al-Anon Family Groups and focuses on young people impacted by family alcoholism or addiction.",
    philosophy:
      "Teens cannot control another person’s drinking, but they can detach with love, care for themselves, and grow with peers.",
    principles:
      "Confidentiality, nonjudgment, 12-step growth, and trained adult sponsorship are core to Alateen meetings.",
    focus: ["Teen Support", "Ages 13-18", "Peer Recovery", "Confidential Space"],
    recoveryTypes: ["Youth", "Family Impact", "12-Step", "Self-Regulation"],
    keyAspects: [
      {
        title: "Support for Teens",
        description:
          "Helps teens understand they are not alone in confusion, fear, anger, and sadness.",
        icon: Users,
      },
      {
        title: "12-Step Growth",
        description:
          "Uses Al-Anon derived 12 steps for resilience and personal healing.",
        icon: Sparkles,
      },
      {
        title: "Safe Meetings",
        description:
          "Trained sponsors provide supportive, nonjudgmental meeting environments.",
        icon: Shield,
      },
      {
        title: "Emotional Control",
        description:
          "Teens gain healthier coping even when they cannot control others.",
        icon: Heart,
      },
    ],
    corePrinciples: [
      { label: "Confidentiality", icon: Shield },
      { label: "Peer Support", icon: Users },
      { label: "Self-Care", icon: Heart },
      { label: "12-Step", icon: Sparkles },
    ],
    meetings: [],
    resourceLink: "https://al-anon.org",
  },
  "al-anon": {
    id: 4,
    name: "Al-Anon",
    fullName: "Al-Anon Family Groups",
    logo: alanonLogo,
    description:
      "Al-Anon is a fellowship of relatives and friends of alcoholics who share experience, strength, and hope. It emphasizes changed attitudes, emotional support, and recovery for families.",
    history:
      "Al-Anon was co-founded in 1951 by Anne B. and Lois W. Independent family groups were consolidated and adapted AA’s Twelve Steps for families.",
    philosophy:
      "Family members often need recovery themselves. Al-Anon teaches self-care, emotional boundaries, and support rather than controlling the alcoholic.",
    principles:
      "Detachment with Love and confidentiality are central. Members focus on their own well-being and spiritual growth.",
    focus: ["Family/Friends", "Detachment with Love", "Self-Care", "12-Steps"],
    recoveryTypes: ["Family Recovery", "Emotional Support", "Spiritual Growth", "Meeting-Based"],
    keyAspects: [
      {
        title: "Understanding & Support",
        description:
          "Safe space to share feelings with others who understand family alcohol impact.",
        icon: Users,
      },
      {
        title: "Self-Care",
        description:
          "Members focus on their own wellness instead of trying to control another person.",
        icon: Heart,
      },
      {
        title: "Anonymity",
        description:
          "Confidentiality enables open, stigma-free sharing.",
        icon: Shield,
      },
      {
        title: "Detachment with Love",
        description:
          "Care for loved ones without enabling harmful behavior.",
        icon: HandHeart,
      },
    ],
    corePrinciples: [
      { label: "Detachment", icon: HandHeart },
      { label: "Self-Care", icon: Heart },
      { label: "Anonymity", icon: Shield },
      { label: "Support", icon: Users },
    ],
    meetings: [],
    resourceLink: "https://al-anon.org",
  },
  na: {
    id: 5,
    name: "NA",
    fullName: "Narcotics Anonymous",
    logo: naLogo,
    description:
      "Narcotics Anonymous is a fellowship for recovery from addiction that focuses on what members want to do about the problem, not what or how much they used.",
    history:
      "NA was founded in 1953 by Jimmy K. It is one of the largest 12-step fellowships with global reach.",
    philosophy:
      "Recovery is a personal journey supported by a higher power as understood by the individual, sponsorship, and peer connection.",
    principles:
      "Meetings, anonymity, inclusion, literature, and global fellowship are central to NA’s model.",
    focus: ["All Drug Types", "Personal Journey", "Sponsorship", "Higher Power"],
    recoveryTypes: ["Substance Recovery", "12-Step", "Global Fellowship", "Peer Support"],
    keyAspects: [
      {
        title: "Meetings",
        description:
          "Regular free meetings provide peer support for anyone struggling with substance use.",
        icon: Users,
      },
      {
        title: "12 Steps",
        description:
          "Structured recovery path emphasizing accountability, amends, and growth.",
        icon: Sparkles,
      },
      {
        title: "Anonymity",
        description:
          "Members share openly with safety and privacy.",
        icon: Shield,
      },
      {
        title: "Sponsorship",
        description:
          "Guidance from experienced members supports long-term recovery.",
        icon: HandHeart,
      },
    ],
    corePrinciples: [
      { label: "Journey", icon: Heart },
      { label: "Higher Power", icon: Sparkles },
      { label: "Sponsorship", icon: HandHeart },
      { label: "Anonymity", icon: Shield },
    ],
    meetings: [
      { day: "Monday", time: "8:00 PM - 9:30 PM", location: "Room B", type: "Open" },
      { day: "Thursday", time: "6:30 PM - 8:00 PM", location: "Room B", type: "Open" },
    ],
    resourceLink: "https://na.org",
  },
  ca: {
    id: 6,
    name: "CA",
    fullName: "Cocaine Anonymous",
    logo: caLogo,
    description:
      "Cocaine Anonymous is a fellowship for people seeking freedom from cocaine and all other mind-altering substances.",
    history:
      "The name Cocaine Anonymous dates back to 1979; the program is a 12-step fellowship open to anyone with a desire for freedom from mind-altering substances.",
    philosophy:
      "CA emphasizes powerlessness over addiction, spirituality, honesty, personal responsibility, unity, service, and continuous growth.",
    principles:
      "Anonymity, sponsorship, inclusivity, literature, and service to others support sustained recovery.",
    focus: ["Cocaine + All Mind-Altering Substances", "Service", "Spiritual Growth", "Sponsorship"],
    recoveryTypes: ["Substance Recovery", "12-Step", "Service", "Community"],
    keyAspects: [
      {
        title: "Fellowship",
        description:
          "Members share experience, strength, and hope to help one another recover.",
        icon: Users,
      },
      {
        title: "Service to Others",
        description:
          "Helping others reinforces personal recovery and community strength.",
        icon: HandHeart,
      },
      {
        title: "Spirituality",
        description:
          "Members seek a higher power as they understand it.",
        icon: Sparkles,
      },
      {
        title: "Personal Responsibility",
        description:
          "Recovery includes accountability, honesty, and growth.",
        icon: Shield,
      },
    ],
    corePrinciples: [
      { label: "Powerlessness", icon: Shield },
      { label: "Service", icon: HandHeart },
      { label: "Spirituality", icon: Sparkles },
      { label: "Unity", icon: Users },
    ],
    meetings: [],
    resourceLink: "https://ca.org",
  },
  ga: {
    id: 7,
    name: "GA",
    fullName: "Gamblers Anonymous",
    logo: gaLogo,
    description:
      "GA is a fellowship for people who want to stop gambling and help others recover from compulsive gambling.",
    history:
      "GA was founded in 1957 by Jim W. with the first meeting on September 13, 1957 in Los Angeles. Members use the 20 Questions guide.",
    philosophy:
      "GA emphasizes surrender, acceptance, and personal responsibility. Members acknowledge powerlessness over gambling and work toward stable, healthy lives.",
    principles:
      "Anonymity, confidentiality, fellowship, accountability, spiritual growth, and making amends are key elements.",
    focus: ["20 Questions", "Personal Responsibility", "Surrender", "Making Amends"],
    recoveryTypes: ["Behavioral Recovery", "12-Step", "Peer Fellowship", "Accountability"],
    keyAspects: [
      {
        title: "Peer Support",
        description:
          "Members share struggles and successes in a community that understands gambling addiction.",
        icon: Users,
      },
      {
        title: "Anonymity & Confidentiality",
        description:
          "What is shared in meetings stays in meetings to protect trust.",
        icon: Shield,
      },
      {
        title: "Step One Acceptance",
        description:
          "Admitting powerlessness over gambling is the start of recovery.",
        icon: Sparkles,
      },
      {
        title: "Personal Responsibility",
        description:
          "Members make amends and build healthier coping strategies.",
        icon: HandHeart,
      },
    ],
    corePrinciples: [
      { label: "20 Questions", icon: BookOpen },
      { label: "Surrender", icon: Sparkles },
      { label: "Responsibility", icon: HandHeart },
      { label: "Anonymity", icon: Shield },
    ],
    meetings: [],
    resourceLink: "https://gamblersanonymous.org",
  },
  sa: {
    id: 8,
    name: "SA",
    fullName: "Sexaholics Anonymous",
    logo: saLogo,
    description:
      "Sexaholics Anonymous is a fellowship for people who desire to stop lusting and become sexually sober.",
    history:
      "SA grew as a 12-step recovery fellowship centered on sexual sobriety, mutual support, and anonymity.",
    philosophy:
      "Recovery through fellowship, personal responsibility, spiritual growth, and continuous improvement.",
    principles:
      "Anonymity, acceptance, service to others, integrity, honesty, humility, and spiritual principles such as love, forgiveness, and compassion.",
    focus: ["Sexual Sobriety", "Integrity/Honesty", "Inventory", "Spiritual Growth"],
    recoveryTypes: ["Behavioral Recovery", "12-Step", "Integrity", "Peer Support"],
    keyAspects: [
      {
        title: "12-Step Framework",
        description:
          "Personal growth, accountability, and recovery support through the steps.",
        icon: Sparkles,
      },
      {
        title: "Anonymity",
        description:
          "Confidential sharing enables honesty without fear of judgment.",
        icon: Shield,
      },
      {
        title: "Sponsorship & Meetings",
        description:
          "Regular meetings and sponsor relationships support sobriety.",
        icon: Users,
      },
      {
        title: "Personal Inventory",
        description:
          "Moral inventory builds insight, honesty, and behavior change.",
        icon: BookOpen,
      },
    ],
    corePrinciples: [
      { label: "Sobriety", icon: Heart },
      { label: "Integrity", icon: Shield },
      { label: "Service", icon: HandHeart },
      { label: "Growth", icon: Sparkles },
    ],
    meetings: [],
    resourceLink: "https://saa-recovery.org",
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

type ProgramReview = { id: number; username: string; rating: number; comment: string; timestamp?: string };
type BulletinNote = { id: number; username: string; message: string; color: string; timestamp?: string };

const fallbackBulletinNotes: Record<string, BulletinNote[]> = {
  aa: [
    { id: 1, username: "Guide", message: "One day at a time!", color: "#fef08a" },
    { id: 2, username: "Guide", message: "Keep growing!", color: "#bbf7d0" },
  ],
  default: [
    { id: 3, username: "Guide", message: "Progress over perfection.", color: "#bfdbfe" },
    { id: 4, username: "Guide", message: "You’re not alone.", color: "#fbcfe8" },
  ],
};

function BulletinBoard({ programId, userId, username, isJoined }: { programId: string; userId?: number; username?: string; isJoined: boolean }) {
  const [notes, setNotes] = useState<BulletinNote[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [isStamping, setIsStamping] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${pythonURI}/get-program-bulletin-notes?program_id=${programId}`, fetchOptions);
        if (res.ok) { setNotes(await res.json()); return; }
      } catch (error) { console.error("Error fetching bulletin notes:", error); }
      setNotes(fallbackBulletinNotes[programId] || fallbackBulletinNotes.default);
    };
    fetchNotes();
  }, [programId]);

  const addNote = async () => {
    if (!draftMessage.trim() || !isJoined) return;
    setIsStamping(true);
    const payload = { program_id: programId, user_id: userId, username: username || "Anonymous", message: draftMessage.trim(), color: ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8"][Math.floor(Math.random() * 4)] };
    setTimeout(async () => {
      try {
        const response = await fetch(`${pythonURI}/add-program-bulletin-note`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (response.ok) {
          const newNote = await response.json();
          setNotes((prev) => [newNote, ...prev]);
        } else { setNotes((prev) => [{ id: Date.now(), ...payload }, ...prev]); }
      } catch { setNotes((prev) => [{ id: Date.now(), ...payload }, ...prev]); }
      setDraftMessage(""); setShowInput(false); setIsStamping(false);
    }, 600);
  };

  return (
    <Card className="border-[#4a3728] bg-[#5d4037] shadow-xl overflow-hidden relative">
      <CardHeader className="pb-3 border-b-4 border-[#3e2723] bg-[#6d4c41]"><CardTitle className="text-[#fdf5e6] flex items-center gap-2"><Pin className="w-5 h-5 text-red-600 fill-red-600" />Community Bulletin Board</CardTitle></CardHeader>
      <CardContent className="p-0 relative group">
        <div className={`min-h-[350px] p-6 transition-all duration-500 ease-in-out bg-[#dcb382] ${showInput ? "blur-[2px]" : "group-hover:blur-[1px]"} [background-image:radial-gradient(#c4a484_1px,transparent_0)] [background-size:16px_16px]`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {notes.map((note, idx) => (
              <div key={note.id} className="relative p-4 pt-6 shadow-lg border-t border-black/5 min-h-[120px] transition-transform hover:scale-105 hover:z-10" style={{ backgroundColor: note.color || "#fef08a", transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (idx % 3 + 1)}deg)` }}>
                <div className="absolute top-1 left-1/2 -translate-x-1/2"><div className="w-3 h-3 rounded-full bg-red-600 shadow-sm border border-red-800" /></div>
                <p className="mb-1 line-clamp-4 text-xs font-semibold text-slate-800 italic">"{note.message}"</p>
                <p className="text-[10px] text-slate-500 text-right font-bold uppercase tracking-wider">- {note.username}</p>
              </div>
            ))}
          </div>
        </div>
        {!showInput && isJoined && (
          <div onClick={() => setShowInput(true)} className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-black/10">
            <div className="bg-white/90 p-4 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300"><Plus className="w-8 h-8 text-[#5d4037]" /></div>
            <span className="mt-2 text-white font-bold text-lg drop-shadow-md">Add a Note</span>
          </div>
        )}
        {showInput && isJoined && (
           <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40">
                <div className={`w-full max-w-[300px] aspect-square bg-[#fff9c4] shadow-2xl p-6 relative transition-all duration-500 ${isStamping ? "scale-90 translate-y-4 rotate-3 opacity-0" : "scale-100 rotate-0 opacity-100"}`}>
                <button onClick={() => setShowInput(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                <div className="w-full h-full flex flex-col"><label className="text-xs font-bold text-slate-400 uppercase mb-2">New Note</label><Textarea autoFocus rows={4} value={draftMessage} onChange={(e) => setDraftMessage(e.target.value)} placeholder="Write something encouraging..." className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 text-lg text-slate-800 p-0 placeholder:text-slate-300" /><Button onClick={addNote} disabled={!draftMessage.trim() || isStamping} className="mt-4 bg-[#5d4037] hover:bg-[#3e2723] text-white rounded-none w-full shadow-md">{isStamping ? "Stamping..." : <><Send className="w-4 h-4 mr-2" /> Pin Note</>}</Button></div>
                </div>
            </div>
        )}
      </CardContent>
      <div className="h-4 bg-[#4a3728] border-t border-[#3e2723]" />
    </Card>
  );
}

export function ProgramDetail({ programIdOverride, embeddedModal = false, viewMode }: { programIdOverride?: string; embeddedModal?: boolean; viewMode?: "dashboard" | "programs" | null }) {
  const { programId: routeProgramId } = useParams<{ programId: string }>();
  const { user, updateJoinedProgram } = useAuth();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<ProgramReview[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoinHovered, setIsJoinHovered] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeProgramIdRaw = programIdOverride || routeProgramId || "";
  const activeProgramId = activeProgramIdRaw === "alanon" ? "al-anon" : activeProgramIdRaw;
  const program = activeProgramId ? programsData[activeProgramId] : null;

  useEffect(() => { if (program?.meetings.length) setSelectedMeeting(program.meetings[0]); }, [activeProgramId, program]);
  useEffect(() => {
    const fetchJoinedStatus = async () => {
      if (!activeProgramId || !user?.id) { setIsJoined(false); return; }
      try {
        const response = await fetch(`${pythonURI}/get-user-details?user_id=${user.id}`, fetchOptions);
        if (!response.ok) { setIsJoined(false); return; }
        const data = await response.json();
        const joinedIds = String(data?.joined_program || "").split(",").map(v => v.trim()).filter(Boolean).map(v => (v === "alanon" ? "al-anon" : v));
        setIsJoined(joinedIds.includes(activeProgramId));
      } catch (error) { console.error("Error verifying status:", error); setIsJoined(false); }
    };
    fetchJoinedStatus();
  }, [activeProgramId, user?.id]);

  const fetchChatHistory = async () => {
    if (!activeProgramId) return;
    try {
      const response = await fetch(`${pythonURI}/get-chat-history/${activeProgramId}`, fetchOptions);
      if (response.ok) setChatMessages(await response.json());
    } catch (err) { console.error("Error fetching chat:", err); }
  };

  useEffect(() => { fetchChatHistory(); const interval = setInterval(fetchChatHistory, 5000); return () => clearInterval(interval); }, [activeProgramId]);
  useEffect(() => {
    if (!activeProgramId) return;
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${pythonURI}/get-program-reviews?program_id=${activeProgramId}`, fetchOptions);
        if (response.ok) { setReviews(await response.json()); return; }
      } catch (error) { console.error("Error fetching reviews:", error); }
      setReviews([{ id: 9001, username: "RecoveryMember", rating: 5, comment: "This program gave me structure and community when I needed it most." }]);
    };
    fetchReviews();
  }, [activeProgramId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;
    try {
      const response = await fetch(`${pythonURI}/send-chat-message`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ program_id: activeProgramId, user_id: user.id, username: user.username || "Anonymous", message: message.trim() }) });
      if (response.ok) { setMessage(""); fetchChatHistory(); }
    } catch (err) { console.error("Send Error:", err); }
  };

  const handleAddToCalendar = async (meeting?: Meeting) => {
    if (!user?.id) return alert("Please log in first!");
    const targetMeeting = meeting || selectedMeeting || program?.meetings?.[0];
    if (!targetMeeting) return alert("No meeting available.");
    try {
      const response = await fetch(`${pythonURI}/add-meeting`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.id, name: `${program?.name} Meeting`, date: getNextDateForDay(targetMeeting.day), time: extractStartTime(targetMeeting.time), location: targetMeeting.location, type: targetMeeting.type }) });
      alert(response.ok ? `✅ saved!` : "❌ Failed.");
    } catch (err) { console.error(err); }
  };

  const handleJoin = async () => {
    if (!activeProgramId || !user?.id) return alert("Please log in first!");
    try {
      const response = await fetch(`${pythonURI}/join-program`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.id, program_id: activeProgramId }) });
      if (response.ok) { const updated = await response.json(); updateJoinedProgram(updated.joined_program || activeProgramId); setIsJoined(true); }
    } catch (err) { console.error(err); }
  };

  const handleLeave = async () => {
    if (!activeProgramId || !user?.id) return;
    if (!window.confirm("Are you sure you want to leave?")) return;
    try {
      const response = await fetch(`${pythonURI}/leave-program`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.id, program_id: activeProgramId }) });
      if (response.ok) { const updated = await response.json(); updateJoinedProgram(updated.joined_program || null); setIsJoined(false); }
    } catch (err) { console.error(err); }
  };

  const handleAddReview = async () => {
    if (!user?.id || !activeProgramId || !reviewComment.trim()) return;
    const payload = { program_id: activeProgramId, user_id: user.id, username: user.username || "Anonymous", rating: reviewRating, comment: reviewComment.trim() };
    try {
      const response = await fetch(`${pythonURI}/add-program-review`, { ...fetchOptions, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [newReview, ...prev]);
      } else { setReviews((prev) => [{ id: Date.now(), ...payload }, ...prev]); }
    } catch { setReviews((prev) => [{ id: Date.now(), ...payload }, ...prev]); }
    setReviewComment(""); setReviewRating(5);
  };

  if (!program) return <div className="min-h-screen flex items-center justify-center"><Link to="/programs"><Button>Back</Button></Link></div>;

  const actionButtonClass = isJoined ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white text-[#005A2C] hover:bg-[#E8F5E9]";

  return (
    <div className={embeddedModal ? "h-full overflow-y-auto bg-white" : "min-h-screen bg-gradient-to-b from-[#F8FAF5] to-[#E8F5E9]"}>
      <div className={embeddedModal ? "mx-auto max-w-6xl px-4 py-4" : "max-w-7xl mx-auto px-4 py-4"}>
        
        {/* Header Card */}
        <Card className="mb-8 overflow-hidden shadow-lg border-none">
          <div className="bg-gradient-to-r from-[#76B82A] to-[#005A2C] p-4 md:p-6 text-white">
            {/* Change to flex-col for mobile, flex-row for desktop */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img 
                  src={program.logo} 
                  alt={program.name} 
                  className="w-16 h-16 md:w-24 md:h-24 object-contain bg-white/20 rounded-2xl p-2 shadow-inner shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-4xl font-bold tracking-tight leading-tight">{program.fullName}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {program.focus.map((item, idx) => (
                      <Badge key={idx} className="bg-white/20 text-[10px] md:text-sm text-white border-white/40 px-2 py-0.5 font-medium">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons: Full width on mobile, auto on desktop */}
              <div className="flex flex-row w-full md:w-auto gap-2 md:gap-3">
                <Button 
                  onClick={isJoined ? handleLeave : handleJoin} 
                  className={`${actionButtonClass} flex-1 md:flex-none rounded-xl px-4 h-11 md:h-12 text-sm md:text-base font-bold shadow-md`}
                >
                  {isJoined ? <Check className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isJoined ? (isJoinHovered ? "Leave" : "Joined") : "Join"}
                </Button>
                
                {program.resourceLink && (
                  <Button asChild className={`${actionButtonClass} flex-1 md:flex-none rounded-xl px-4 h-11 md:h-12 text-sm md:text-base font-bold shadow-md`}>
                    <a href={program.resourceLink} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4 mr-2" />Site</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className={`${viewMode === "programs" ? "lg:col-span-3" : "lg:col-span-2"} space-y-8`}>
            
            {/* ABOUT THE PROGRAM SECTION - ONLY SHOWN IN PROGRAMS TAB */}
            {(!viewMode || viewMode === "programs") && (
              <Card className="shadow-sm border-[#E0EADD] overflow-hidden">
                <CardHeader className="bg-slate-50/80 border-b border-[#E0EADD]"><CardTitle className="text-[#173723] text-xl font-bold">About the Program</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="overview">
                    <div className="border-b border-[#E0EADD] bg-white px-2 md:px-6">
                      {/* Added overflow-x-auto and custom-scrollbar to allow swiping tabs on iPhone */}
                      <TabsList className="h-12 md:h-14 bg-transparent p-0 flex justify-start md:justify-start gap-4 md:gap-8 overflow-x-auto overflow-y-hidden custom-scrollbar">
                        {["overview", "history", "philosophy"].map((tab) => (
                          <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="flex-shrink-0 h-12 md:h-14 bg-transparent px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#005A2C] data-[state=active]:text-[#005A2C] font-bold text-slate-500 uppercase tracking-wider text-[10px] md:text-xs transition-all"
                          >
                            {tab === "philosophy" ? "Philosophy" : tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>                    <div className="p-6">
                      <TabsContent value="overview" className="mt-0 space-y-8">
                        <p className="text-[#2D5138] leading-relaxed text-base italic mb-10">{program.description}</p>
                        
                        {/* FEATURE LIST (Replacing Cards with Informative Points) */}
                        <div className="space-y-6">
                          {program.keyAspects.map((aspect) => { 
                            const Icon = aspect.icon; 
                            return (
                              <div key={aspect.title} className="flex items-start gap-4 p-2 border-l-4 border-[#76B82A] bg-slate-50/30 rounded-r-xl">
                                <div className="mt-1 p-2 bg-white rounded-full shadow-sm">
                                  <Icon className="w-4 h-4 text-[#005A2C]" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#173723] text-sm">{aspect.title}</h4>
                                  <p className="text-xs text-[#5A7462] leading-relaxed mt-0.5">{aspect.description}</p>
                                </div>
                              </div>
                            ); 
                          })}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="history" className="mt-0"><div className="prose prose-slate max-w-none"><p className="text-[#2D5138] whitespace-pre-line leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">{program.history}</p></div></TabsContent>
                      <TabsContent value="philosophy" className="mt-0 space-y-6"><div className="space-y-4"><h4 className="font-bold text-[#173723]">Core Values</h4><p className="text-[#2D5138] whitespace-pre-line leading-relaxed text-sm">{program.philosophy}</p><div className="h-px bg-slate-100 w-full" /><h4 className="font-bold text-[#173723]">Operating Principles</h4><p className="text-[#2D5138] whitespace-pre-line leading-relaxed text-sm">{program.principles}</p></div></TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* SCHEDULE & BULLETIN SECTION */}
            {(!viewMode || viewMode === "dashboard") && isJoined && (
              <>
                <Card className="shadow-sm border-[#E0EADD]">
                  <CardHeader className="border-b border-[#E0EADD] bg-slate-50/80"><CardTitle className="text-[#173723] text-xl font-bold">Meeting Schedule</CardTitle></CardHeader>
                  <CardContent className="p-6">{program.meetings.length === 0 ? (<p className="text-[#6B7F70]">No scheduled meetings.</p>) : (<div className="space-y-3">{program.meetings.map((meeting, idx) => (<div key={idx} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedMeeting === meeting ? "bg-[#F1F8EB] border-[#76B82A] shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"} cursor-pointer`} onClick={() => setSelectedMeeting(meeting)}><div className="flex items-center gap-6 flex-wrap"><div className="font-bold text-[#173723] min-w-[100px]">{meeting.day}</div><div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-4 h-4 text-[#005A2C]" />{meeting.time}</div><div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-[#005A2C]" />{meeting.location}</div></div><div className="flex items-center gap-3"><Badge className="bg-[#E8F5E9] text-[#005A2C] border-none px-3">{meeting.type}</Badge><Button size="sm" variant="outline" className="rounded-lg border-slate-200" onClick={(e) => { e.stopPropagation(); handleAddToCalendar(meeting); }}><Calendar className="w-4 h-4 mr-2" />Add</Button></div></div>))}</div>)}<Button onClick={() => handleAddToCalendar(selectedMeeting || undefined)} className="w-full mt-6 bg-[#005A2C] hover:bg-[#124627] text-white h-12 font-bold rounded-xl shadow-sm" disabled={!selectedMeeting}><Calendar className="w-5 h-5 mr-2" />{selectedMeeting ? `Save ${selectedMeeting.day} Meeting to Calendar` : "Select a Meeting Above"}</Button></CardContent>
                </Card>
                <BulletinBoard programId={activeProgramId} userId={user?.id} username={user?.username} isJoined={isJoined} />
              </>
            )}

            {/* MEMBER REVIEWS SECTION */}
            <Card className="shadow-sm border-[#E0EADD]">
              <CardHeader className="border-b border-[#E0EADD] bg-slate-50/80"><CardTitle className="text-[#173723] text-xl font-bold">Member Feedback</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-6"><div className="space-y-4">{reviews.length > 0 ? (reviews.map((review) => (<div key={review.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-bold text-[#173723]">{review.username}</p><div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<span key={i} className={`text-sm ${i < Math.round(review.rating) ? "text-yellow-400" : "text-slate-200"}`}>★</span>))}</div></div><p className="text-sm text-[#2D5138] leading-relaxed">"{review.comment}"</p></div>))) : (<p className="text-[#6B7F70] italic">No reviews yet.</p>)}</div><div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6"><p className="mb-4 text-sm font-bold text-[#173723]">Share your experience</p><div className="grid sm:grid-cols-4 gap-4 mb-4"><div className="sm:col-span-1"><label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Rating</label><select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#005A2C]/20" value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>{[5, 4, 3, 2, 1].map((value) => (<option key={value} value={value}>{value} Star{value > 1 ? "s" : ""}</option>))}</select></div><div className="sm:col-span-3"><label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Your Comment</label><Textarea rows={2} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder={user ? "What has this program meant to you?" : "Log in to leave a review"} className="rounded-xl border-slate-200 resize-none" disabled={!user} /></div></div><Button onClick={handleAddReview} disabled={!user || !reviewComment.trim()} className="w-full bg-[#005A2C] text-white hover:bg-[#124627] font-bold rounded-xl h-11">Post Review</Button></div></CardContent>
            </Card>
          </div>

          {/* LIVE CHAT COLUMN */}
          {(!viewMode || viewMode === "dashboard") && isJoined && (
            <div className="space-y-6">
              <Card className="h-[600px] xl:h-[700px] flex flex-col shadow-lg border-[#E0EADD] overflow-hidden sticky top-4">
                <CardHeader className="bg-[#005A2C] text-white py-4"><CardTitle className="flex items-center gap-3 text-lg font-bold"><Users className="w-5 h-5" />Live Fellowship Chat</CardTitle></CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                  <div className="flex-1 overflow-y-auto space-y-4 p-5 [scrollbar-width:thin]">{chatMessages.length === 0 ? (<div className="flex flex-col items-center justify-center h-full opacity-40"><Send className="w-12 h-12 mb-2" /><p className="text-sm font-medium">No messages yet</p></div>) : (chatMessages.map((msg) => { const isOwn = user && msg.user_id === user.id; return (<div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>{!isOwn && (<span className="text-[10px] font-bold mb-1 ml-1 text-slate-400 uppercase tracking-tight">{msg.username}</span>)}<div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${isOwn ? "bg-[#005A2C] text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}><p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p></div></div>); }))}<div ref={chatEndRef} /></div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100"><div className="flex gap-2 bg-white rounded-xl p-2 shadow-inner border border-slate-200"><Textarea placeholder={user ? "Send a message..." : "Log in to chat"} value={message} onChange={(e) => setMessage(e.target.value)} className="resize-none border-none focus-visible:ring-0 min-h-[44px] max-h-[120px] p-2 text-sm" rows={1} disabled={!user} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} /><Button onClick={handleSendMessage} className="bg-[#005A2C] hover:bg-[#124627] text-white rounded-lg w-10 h-10 p-0 flex-shrink-0 self-end transition-transform active:scale-95" disabled={!message.trim() || !user}><Send className="w-4 h-4" /></Button></div></div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}