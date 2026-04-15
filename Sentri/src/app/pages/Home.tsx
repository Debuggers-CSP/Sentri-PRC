import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Search, Users, Heart, Phone, MapPin, Clock, Leaf, Sparkles, Wind, Star } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const getProgramLink = () => "/programs";
  const getMeetingLink = () => "/meetings";

  // --- SCRATCH CARD LOGIC ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dailyQuotes = [
    "One day at a time.",
    "Your past does not define your future.",
    "Progress, not perfection.",
    "Believe you can and you're halfway there.",
    "Recovery is a journey, not a destination.",
    "Small steps lead to big changes."
  ];
  const dailyQuote = dailyQuotes[new Date().getDate() % dailyQuotes.length];

  // --- IDEA #10: AESTHETIC GRATITUDE JAR LOGIC ---
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeText, setGratitudeText] = useState("");
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Audio setup
  const playChime = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3");
    audio.volume = 0.5;
    audio.play();
  };

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;

    setIsAnimating(true);
    playChime();

    // Wait for the star to "fall" before updating count and closing
    setTimeout(() => {
      setGratitudeCount(prev => prev + 1);
      setIsAnimating(false);
      setGratitudeText("");
      setIsJarOpen(false);
    }, 1000);
  };

  // Scratch Card Canvas Init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#124627");
    gradient.addColorStop(0.5, "#005A2C");
    gradient.addColorStop(1, "#124627");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(232, 245, 233, 0.6)";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MOUSE OVER TO SCRATCH", canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_45%,#E8F5E9_100%)] text-[#1F3B2B] overflow-x-hidden">
      
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.6); opacity: 0.1; } }
        
        @keyframes dropStar {
          0% { transform: translateY(-300px) scale(0) rotate(0deg); opacity: 0; filter: blur(5px); }
          30% { transform: translateY(-150px) scale(1.5) rotate(180deg); opacity: 1; filter: blur(0px); }
          100% { transform: translateY(20px) scale(0.5) rotate(360deg); opacity: 0; }
        }

        @keyframes jarJiggle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
      `}</style>

      {/* --- IDEA #8: THE BREATH PULSE --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full bg-[#76B82A] animate-[breathe_4s_infinite_ease-in-out]" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#005A2C] text-white shadow-lg"><Wind className="h-5 w-5" /></div>
        </div>
      </div>

      {/* --- IDEA #10: THE AESTHETIC MASON JAR WIDGET --- */}
      <div className="fixed left-10 bottom-10 z-50">
        
        {/* The Falling Star Animation */}
        {isAnimating && (
          <div className="absolute left-1/2 -translate-x-1/2 z-[60] text-yellow-300 animate-[dropStar_1s_ease-in-out] pointer-events-none">
            <Star className="h-10 w-10 fill-current shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
          </div>
        )}

        <div className="group relative">
          {/* Tooltip Label */}
          <div className="absolute -top-14 left-0 w-max scale-0 rounded-lg bg-[#005A2C] px-3 py-1.5 text-xs font-bold text-white shadow-xl transition-all group-hover:scale-100">
            Gratitude Jar: {gratitudeCount} stars
          </div>
          
          {/* THE MASON JAR UI */}
          <div 
            onClick={() => setIsJarOpen(!isJarOpen)}
            className={`relative w-20 h-28 cursor-pointer transition-all hover:brightness-110 active:scale-95
              ${isAnimating ? "animate-[jarJiggle_0.5s_ease-in-out_0.8s]" : ""}`}
          >
            {/* Wooden Lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#8B4513] rounded-t-md border-b-2 border-black/20 z-20 shadow-sm" />
            
            {/* Glass Body */}
            <div className="absolute inset-0 top-3 rounded-b-[2rem] rounded-t-lg border-2 border-white/60 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
              
              {/* Glass Reflection Shine */}
              <div className="absolute top-2 left-2 w-4 h-16 bg-white/20 rounded-full blur-[2px] -rotate-12" />

              {/* Glowing Stars Inside */}
              <div className="flex h-full w-full flex-wrap-reverse content-start justify-center gap-1 p-3 pt-6 overflow-hidden">
                {[...Array(Math.min(gratitudeCount, 15))].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-3 w-3 text-yellow-300 fill-current animate-pulse" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Paper Label on the Jar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 bg-[#F5F5DC] border border-[#D2B48C] rotate-1 shadow-sm px-1 py-0.5">
               <p className="text-[7px] font-bold text-[#5D4037] text-center uppercase tracking-tighter">My Gratitude</p>
            </div>
          </div>

          {/* Gratitude Input Popover */}
          {isJarOpen && (
            <div className="absolute bottom-32 left-0 w-72 rounded-[28px] border border-[#E0EADD] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-6 duration-500 z-[70]">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-[#76B82A] fill-current" />
                <h4 className="text-sm font-bold text-[#005A2C]">Capture a moment of joy</h4>
              </div>
              <form onSubmit={handleAddGratitude} className="flex flex-col gap-3">
                <textarea 
                  autoFocus
                  value={gratitudeText}
                  onChange={(e) => setGratitudeText(e.target.value)}
                  className="w-full rounded-2xl border-none bg-[#F8FAF5] p-3 text-sm text-[#43624D] placeholder-[#A5B9AD] focus:ring-2 focus:ring-[#76B82A] outline-none transition-all"
                  placeholder="What are you thankful for today?"
                  rows={3}
                />
                <Button type="submit" className="bg-[#005A2C] hover:bg-[#124627] text-white rounded-xl h-10 font-bold shadow-lg shadow-[#005A2C]/20">
                  Drop into Jar
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1586974175094-0a7259238613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHRoZXJhcHklMjByZWNvdmVyeSUyMGNlbnRlcnxlbnwxfHx8fDE3NzQwMzM2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Peaceful recovery center environment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,90,44,0.86)_0%,rgba(118,184,42,0.72)_100%)]" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Digital Wellness Sanctuary</span>
            </div>
            <h2 className="mb-6 text-5xl leading-tight">Hope. Healing. Recovery.</h2>
            <p className="mb-8 text-xl text-[#E8F5E9]">
              At Poway Recovery Center, we provide compassionate, evidence-based care to support
              your journey toward lasting recovery and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Focus Scratch-Off Module */}
      <section className="relative z-20 mx-auto -mt-12 mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Daily Focus Check-in</h3>
          </div>
          
          <div className="relative h-32 w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl transition-transform hover:scale-[1.01]">
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center select-none">
              <p className="text-xl font-medium italic text-[#005A2C]">"{dailyQuote}"</p>
            </div>
            <canvas ref={canvasRef} onMouseMove={handleScratch} className="absolute inset-0 z-10 cursor-crosshair" />
            <div className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-white/20 z-20"></div>
          </div>
        </div>
      </section>

      {/* Main CTA Cards */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Link to={getProgramLink()} className="group block">
            <Card className="overflow-hidden rounded-[28px] border border-[#E0EADD] bg-white shadow-[0_14px_34px_rgba(0,90,44,0.11)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(0,90,44,0.16)]">
              <div className="h-52 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1722094250550-4993fa28a51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VsbG5lc3MlMjBtZWRpdGF0aW9uJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzM5ODM5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Wellness programs"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-[20px] bg-[#E8F5E9] p-2">
                    <Search className="h-6 w-6 text-[#005A2C]" />
                  </div>
                  <h3 className="text-2xl text-[#005A2C]">Find a Program</h3>
                </div>
                <p className="mb-4 text-[#43624D]">
                  Explore treatment options tailored to your needs, from outpatient services to
                  intensive rehabilitation pathways.
                </p>
                <div className="font-semibold text-[#005A2C]">Learn more →</div>
              </CardContent>
            </Card>
          </Link>

          <Link to={getMeetingLink()} className="group block">
            <Card className="overflow-hidden rounded-[28px] border border-[#E0EADD] bg-white shadow-[0_14px_34px_rgba(0,90,44,0.11)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(0,90,44,0.16)]">
              <div className="h-52 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0JTIwZ3JvdXAlMjBtZWV0aW5nJTIwY2lyY2xlfGVufDF8fHx8MTc3Mzk0NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Support group meetings"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-[20px] bg-[#E8F5E9] p-2">
                    <Users className="h-6 w-6 text-[#005A2C]" />
                  </div>
                  <h3 className="text-2xl text-[#005A2C]">Find a Meeting</h3>
                </div>
                <p className="mb-4 text-[#43624D]">
                  Join supportive community meetings and connect with others on their recovery
                  journey in a safe, welcoming space.
                </p>
                <div className="font-semibold text-[#005A2C]">View schedule →</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl text-[#005A2C]">Why Choose Poway Recovery Center</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#E0EADD] bg-white p-8 text-center shadow-[0_12px_26px_rgba(0,90,44,0.08)]">
            <div className="mb-4 inline-flex rounded-full bg-[#E8F5E9] p-4">
              <Heart className="h-8 w-8 text-[#005A2C]" />
            </div>
            <h3 className="mb-3 text-xl text-[#005A2C]">Compassionate Care</h3>
            <p className="text-[#43624D]">Personalized, empathetic support through every stage of recovery.</p>
          </div>
          <div className="rounded-[28px] border border-[#E0EADD] bg-white p-8 text-center shadow-[0_12px_26px_rgba(0,90,44,0.08)]">
            <div className="mb-4 inline-flex rounded-full bg-[#E8F5E9] p-4">
              <Users className="h-8 w-8 text-[#005A2C]" />
            </div>
            <h3 className="mb-3 text-xl text-[#005A2C]">Community Support</h3>
            <p className="text-[#43624D]">Build meaningful relationships in a judgment-free, healing environment.</p>
          </div>
          <div className="rounded-[28px] border border-[#E0EADD] bg-white p-8 text-center shadow-[0_12px_26px_rgba(0,90,44,0.08)]">
            <div className="mb-4 inline-flex rounded-full bg-[#E8F5E9] p-4">
              <Clock className="h-8 w-8 text-[#005A2C]" />
            </div>
            <h3 className="mb-3 text-xl text-[#005A2C]">24/7 Availability</h3>
            <p className="text-[#43624D]">Round-the-clock support and crisis intervention when you need it most.</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#124627] py-8 text-center text-[#E8F5E9]">
        <p>&copy; 2026 Poway Recovery Center. All rights reserved.</p>
        <p className="mt-2 text-sm text-[#CDE6B7]">Confidential and HIPAA-compliant care</p>
      </footer>
    </div>
  );
}