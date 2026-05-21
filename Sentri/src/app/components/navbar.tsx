import { Phone } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import logo from "../../assets/PRC.png";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={logo} 
              alt="Poway Recovery Center Logo" 
              className="w-10 h-10 md:w-15 md:h-15 object-contain"
            />
            <div>
              {/* text-lg on mobile, text-3xl on desktop ensures it doesn't squash the dashboard */}
              <h1 className="text-lg md:text-3xl font-semibold text-[#1F3B2B] leading-none">
                Poway Recovery Center
              </h1>
              <p className="text-[9px] md:text-[10px] text-[#6B7F70] mt-0.5 md:mt-1 uppercase tracking-wider">
                Your journey to wellness starts here
              </p>
            </div>
          </Link>

          {/* Right Side Actions - Hidden on small mobile screens to save space */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" className="text-[#2D5138] hover:text-[#005A2C] font-semibold px-2">
                <Link to="/programs">Find Program</Link>
              </Button>
              <Button asChild variant="ghost" className="text-[#2D5138] hover:text-[#005A2C] font-semibold px-2">
                <Link to="/meetings">Find Meeting</Link>
              </Button>
            </nav>

            {/* Phone hidden on very small phones, shown on tablets/desktop */}
            <div className="hidden sm:flex items-center gap-2 text-[#5A7462] border-l pl-4 ml-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">(858) 555-0123</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}