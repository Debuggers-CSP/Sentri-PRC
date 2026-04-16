import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Search, Users, Heart, Phone, MapPin, Clock, Leaf, Sparkles, Wind, Star } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import HeroSection from "../components/HeroSection";

export function Home() {
  const getProgramLink = () => "/programs";
  const getMeetingLink = () => "/meetings";

  // --- SCRATCH CARD LOGIC ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dailyQuotes = ["One day at a time.", "Progress, not perfection.", "Belief creates the actual fact.", "Recovery is a journey, not a destination.", "Small steps lead to big changes."];
  const dailyQuote = dailyQuotes[new Date().getDate() % dailyQuotes.length];

  // --- IDEA #10: ENHANCED GRATITUDE JAR LOGIC ---
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeText, setGratitudeText] = useState("");
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const playMagicSound = () => {
    // A high-quality "magic sparkle" sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3");
    audio.volume = 0.4;
    audio.play();
  };

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;

    // 1. Close modal immediately
    setIsJarOpen(false);
    
    // 2. Start the animation sequence
    setIsAnimating(true);
    playMagicSound();

    // 3. Wait for the star to "land" before updating jar total
    setTimeout(() => {
      setGratitudeCount(prev => prev + 1);
      setIsAnimating(false);
      setGratitudeText("");
    }, 1200); // Sequence takes 1.2s
  };

 // --- SCRATCH CARD SCRATCHING LOGIC ---
  const handleScratch = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Support for both Mouse and Touch
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); 
    ctx.fill();
  };

 // --- INITIALIZE CANVAS (The Green Layer + Instructions) ---
  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. FIX: Reset the composite operation to "source-over" (Normal Drawing)
      // If we don't do this, the canvas might still be in "destination-out" (Erase mode)
      ctx.globalCompositeOperation = "source-over";

      // 2. Sizing logic
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return; // Prevent drawing if not ready

      canvas.width = rect.width;
      canvas.height = rect.height;

      // 3. Draw the Brand Green Gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#064e3b"); 
      gradient.addColorStop(0.5, "#005A2C"); 
      gradient.addColorStop(1, "#064e3b");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Draw the Instruction Text
      // Increased font size slightly and used a standard system stack
      ctx.fillStyle = "#FFFFFF"; // Pure white for max visibility
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 14px sans-serif"; // Heavier weight
      
      const text = "MOUSE OVER TO SCRATCH";
      
      // Draw text exactly in the center
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // 5. Subtle shimmer border
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    };

    // Run initialization
    initCanvas();

    // Use a ResizeObserver to re-draw if the window changes size
    const resizeObserver = new ResizeObserver(() => initCanvas());
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    return () => resizeObserver.disconnect();
  }, [dailyQuote]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_45%,#E8F5E9_100%)] text-[#1F3B2B] overflow-x-hidden">
      
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.6); opacity: 0.1; } }
        
        /* The Star "Pop and Drop" Sequence */
        @keyframes starHeroAction {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30% { transform: scale(1.5) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 20px #fbbf24); }
          50% { transform: scale(1.2) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 30px #fbbf24); }
          100% { transform: translateY(400px) scale(0.2) rotate(20deg); opacity: 0; }
        }

        @keyframes jarImpact {
          0%, 100% { transform: scale(1) translateY(0); }
          80% { transform: scale(1) translateY(0); }
          90% { transform: scale(1.1) translateY(5px); }
        }
      `}</style>

      {/* --- BREATH PULSE WIDGET (Bottom Right) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full bg-[#76B82A] animate-[breathe_4s_infinite_ease-in-out]" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#005A2C] text-white shadow-lg"><Wind className="h-5 w-5" /></div>
        </div>
      </div>

      {/* --- GRATITUDE JAR WIDGET (Bottom Left) --- */}
      <div className="fixed left-10 bottom-10 z-50">
        
        {/* THE HERO STAR: Popping into existence above the jar */}
        {isAnimating && (
          <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 z-[100] text-yellow-400 animate-[starHeroAction_1.2s_ease-in-out] pointer-events-none">
            <Star className="h-16 w-16 fill-current" />
          </div>
        )}

        <div className="group relative">
          <div className="absolute -top-14 left-0 w-max scale-0 rounded-lg bg-[#005A2C] px-3 py-1.5 text-xs font-bold text-white shadow-xl transition-all group-hover:scale-100">
            Gratitude Jar: {gratitudeCount} stars
          </div>
          
          {/* THE MASON JAR */}
          <div 
            onClick={() => setIsJarOpen(!isJarOpen)}
            className={`relative w-20 h-28 cursor-pointer transition-all hover:brightness-110 active:scale-95
              ${isAnimating ? "animate-[jarImpact_1.2s_ease-in-out]" : ""}`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#8B4513] rounded-t-md border-b-2 border-black/20 z-20" />
            <div className="absolute inset-0 top-3 rounded-b-[2rem] rounded-t-lg border-2 border-white/60 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute top-2 left-2 w-4 h-16 bg-white/20 rounded-full blur-[2px] -rotate-12" />
              <div className="flex h-full w-full flex-wrap-reverse content-start justify-center gap-1 p-3 pt-6">
                {[...Array(Math.min(gratitudeCount, 15))].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-300 fill-current animate-pulse" />
                ))}
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 bg-[#F5F5DC] border border-[#D2B48C] rotate-1 px-1 py-0.5 shadow-sm">
               <p className="text-[7px] font-bold text-[#5D4037] text-center uppercase tracking-tighter">Gratitude</p>
            </div>
          </div>

          {/* INPUT MODAL */}
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
                  className="w-full rounded-2xl border-none bg-[#F8FAF5] p-3 text-sm text-[#43624D] placeholder-[#A5B9AD] outline-none"
                  placeholder="What are you thankful for today?"
                  rows={3}
                />
                <Button type="submit" className="bg-[#005A2C] hover:bg-[#124627] text-white rounded-xl h-10 font-bold">
                  Drop into Jar
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <HeroSection />

      {/* DAILY FOCUS SCRATCH CARD - GREEN ELEGANT VERSION */}
      <section className="relative z-30 mx-auto -mt-10 mb-20 max-w-7xl px-4 flex flex-col items-center">
        {/* Minimalist Label */}
        <div className="mb-4 flex items-center gap-3 opacity-40">
          <div className="h-[1px] w-8 bg-[#005A2C]/30" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#005A2C]">
            daily focus
          </span>
          <div className="h-[1px] w-8 bg-[#005A2C]/30" />
        </div>
        
        {/* Elegant Pill Shape */}
        <div className="relative h-12 w-full max-w-sm overflow-hidden rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-2 border-white transition-all hover:scale-[1.01]">
          
          {/* Revealed Content (The Quote underneath) */}
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center select-none">
            <p className="text-sm font-medium tracking-tight text-[#005A2C]">
              "{dailyQuote}"
            </p>
          </div>

          {/* Scratch Layer (The Green Canvas) */}
          <canvas 
            ref={canvasRef} 
            onMouseMove={handleScratch} 
            onTouchMove={handleScratch}
            className="absolute inset-0 z-10 cursor-crosshair touch-none w-full h-full" 
          />

          {/* Subtle Glass Highlight on top */}
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/20 z-20 shadow-inner"></div>
        </div>
      </section>

      {/* CTA CARDS */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Link to={getProgramLink()} className="group block">
            <Card className="rounded-[28px] border border-[#E0EADD] bg-white shadow-lg transition-all hover:-translate-y-1">
              <div className="h-52 overflow-hidden bg-gray-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1722094250550-4993fa28a51b?fit=max&w=1080" alt="Wellness" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-[20px] bg-[#E8F5E9] p-2"><Search className="h-6 w-6 text-[#005A2C]" /></div>
                  <h3 className="text-2xl text-[#005A2C] font-bold">Find a Program</h3>
                </div>
                <p className="mb-4 text-[#43624D]">Explore options tailored to your needs.</p>
                <div className="font-semibold text-[#005A2C]">Learn more →</div>
              </CardContent>
            </Card>
          </Link>

          <Link to={getMeetingLink()} className="group block">
            <Card className="rounded-[28px] border border-[#E0EADD] bg-white shadow-lg transition-all hover:-translate-y-1">
              <div className="h-52 overflow-hidden bg-gray-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?fit=max&w=1080" alt="Meetings" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-[20px] bg-[#E8F5E9] p-2"><Users className="h-6 w-6 text-[#005A2C]" /></div>
                  <h3 className="text-2xl text-[#005A2C] font-bold">Find a Meeting</h3>
                </div>
                <p className="mb-4 text-[#43624D]">Connect with others in a safe space.</p>
                <div className="font-semibold text-[#005A2C]">View schedule →</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl text-[#005A2C] font-bold">Why Choose Poway Recovery Center</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Heart, title: "Compassionate Care", desc: "Empathetic support through every stage." },
            { icon: Users, title: "Community Support", desc: "Meaningful relationships in a healing space." },
            { icon: Clock, title: "24/7 Availability", desc: "Crisis intervention when you need it most." }
          ].map((item, i) => (
            <div key={i} className="rounded-[28px] border border-[#E0EADD] bg-white p-8 text-center shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-[#E8F5E9] p-4"><item.icon className="h-8 w-8 text-[#005A2C]" /></div>
              <h3 className="mb-3 text-xl text-[#005A2C] font-bold">{item.title}</h3>
              <p className="text-[#43624D]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-[linear-gradient(135deg,#005A2C_0%,#76B82A_100%)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Get Help Today</h2>
            <p className="mb-8 text-[#E8F5E9]">Our admissions team is here to guide you.</p>
            <div className="space-y-4 font-semibold">
              <div className="flex items-center gap-3"><Phone className="h-5 w-5" /><span>(858) 555-0123</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5" /><span>12345 Community Drive, Poway, CA 92064</span></div>
              <div className="flex items-center gap-3"><Clock className="h-5 w-5" /><span>Open 24/7 for admissions</span></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full rounded-[28px] border border-white/25 bg-white/12 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-bold">Need Immediate Help?</h3>
              <p className="mb-6 text-[#E8F5E9]">If you're in crisis, don't wait. Call now.</p>
              <Button size="lg" className="w-full bg-white text-[#005A2C] font-bold">Call Crisis Line: (858) 555-9999</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#124627] py-8 text-center text-[#E8F5E9]">
        <p>&copy; 2026 Poway Recovery Center. All rights reserved.</p>
      </footer>
    </div>
  );
}