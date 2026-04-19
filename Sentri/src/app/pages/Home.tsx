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

 

  const playMagicSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3");
    audio.volume = 0.4;
    audio.play();
  };



  const handleScratch = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); 
    ctx.fill();
  };

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.globalCompositeOperation = "source-over";
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#064e3b"); 
      gradient.addColorStop(0.5, "#005A2C"); 
      gradient.addColorStop(1, "#064e3b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 14px sans-serif";
      ctx.fillText("MOUSE OVER TO SCRATCH", canvas.width / 2, canvas.height / 2);
    };
    initCanvas();
    const resizeObserver = new ResizeObserver(() => initCanvas());
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => resizeObserver.disconnect();
  }, [dailyQuote]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAF5_0%,#F1F8EB_45%,#E8F5E9_100%)] text-[#1F3B2B] overflow-x-hidden">
      
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.6); opacity: 0.1; } }
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

    

     

      {/* HERO SECTION */}
      <HeroSection />

      

     
   
    </div>
  );
}