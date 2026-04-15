import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Search, Users, Heart, Phone, MapPin, Clock, Leaf, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const getProgramLink = () => "/programs";
  const getMeetingLink = () => "/meetings";

  // --- SCRATCH CARD LOGIC ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const dailyQuotes = [
    "One day at a time.",
    "Your past does not define your future.",
    "Progress, not perfection.",
    "Believe you can and you're halfway there.",
    "Recovery is a journey, not a destination.",
    "The secret of getting ahead is getting started.",
    "Small steps lead to big changes."
  ];

  const dailyQuote = dailyQuotes[new Date().getDate() % dailyQuotes.length];

  // Initialize the Canvas "Paint" layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas internal resolution to match displayed size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw the green gradient "foil"
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#124627"); // Teammate's dark green
    gradient.addColorStop(0.5, "#005A2C"); // Middle green
    gradient.addColorStop(1, "#124627");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add instruction text directly to the canvas so it gets scratched away
    ctx.fillStyle = "rgba(232, 245, 233, 0.6)"; // Light green text
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

    // This is the magic: 'destination-out' erases whatever is already drawn
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // 25 is the size of the "scratch" brush
    ctx.fill();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_45%,#E8F5E9_100%)] text-[#1F3B2B]">
      
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
          
          {/* Card Container */}
          <div className="relative h-32 w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl transition-transform hover:scale-[1.01]">
            
            {/* BOTTOM LAYER: The Revealed Quote */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center select-none">
              <p className="text-xl font-medium italic text-[#005A2C]">
                "{dailyQuote}"
              </p>
            </div>

            {/* TOP LAYER: The Interactive Canvas */}
            <canvas 
              ref={canvasRef}
              onMouseMove={handleScratch}
              className="absolute inset-0 z-10 cursor-crosshair"
            />
            
            {/* Shiny border overlay to make it look premium */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-white/20 z-20"></div>
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-[#43624D] opacity-60 font-bold">
            Interact to reveal your supportive message
          </p>
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

      {/* Contact Section */}
      <section className="bg-[linear-gradient(135deg,#005A2C_0%,#76B82A_100%)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl">Get Help Today</h2>
              <p className="mb-8 text-[#E8F5E9]">
                Taking the first step is often the hardest. Our admissions team is here to guide you
                and answer any questions you may have.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Phone className="h-5 w-5" /><span className="text-lg">(858) 555-0123</span></div>
                <div className="flex items-center gap-3"><MapPin className="h-5 w-5" /><span>12345 Community Drive, Poway, CA 92064</span></div>
                <div className="flex items-center gap-3"><Clock className="h-5 w-5" /><span>Open 24/7 for admissions</span></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full rounded-[28px] border border-white/25 bg-white/12 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-xl">Need Immediate Help?</h3>
                <p className="mb-6 text-[#E8F5E9]">If you're in crisis, don't wait. Call our 24-hour hotline now.</p>
                <Button size="lg" className="w-full bg-white text-[#005A2C]">Call Crisis Line: (858) 555-9999</Button>
              </div>
            </div>
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