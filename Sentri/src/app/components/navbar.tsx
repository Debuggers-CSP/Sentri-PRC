import { Heart, Phone } from "lucide-react";
import { Link } from "react-router";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import logo from "../../assets/PRC.png";

export function Navbar() {
  const { user } = useAuth();

  const getProgramLink = () => "/programs";
  const getMeetingLink = () => "/meetings";

  return (
    /* 
       On mobile: sticky at the top. 
       On desktop: becomes a side column because of the 'md:flex-row' in Layout.tsx 
    */
    <header className="bg-white shadow-sm border-b md:border-r md:border-b-0 sticky top-0 z-50 w-full md:w-64 lg:w-72 md:h-screen">
      <div className="mx-auto px-4 py-4 h-full flex flex-col justify-between">
        <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
          
          {/* Logo and Title - Scaled for Mobile */}
          <Link to="/" className="flex items-center md:flex-col md:items-start gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={logo} 
              alt="Poway Recovery Center Logo" 
              className="w-10 h-10 md:w-16 md:h-16 object-contain"
            />
            <div>
              {/* text-xl on mobile, text-2xl/3xl on desktop */}
              <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-[#1F3B2B] leading-tight">
                Poway <span className="md:block">Recovery</span>
              </h1>
              <p className="hidden sm:block text-[9px] text-[#6B7F70] mt-1 uppercase tracking-wider">
                Wellness starts here
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links - Stacks on Desktop, Hidden on Mobile */}
          <nav className="hidden md:flex flex-col w-full gap-2 mt-8">
            <Button asChild variant="ghost" className="justify-start text-[#2D5138] hover:text-[#005A2C] font-semibold w-full">
              <Link to={getProgramLink()}>Find Program</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start text-[#2D5138] hover:text-[#005A2C] font-semibold w-full">
              <Link to={getMeetingLink()}>Find Meeting</Link>
            </Button>
          </nav>
        </div>

        {/* Bottom Section: Contact & User (Pushed to bottom on desktop) */}
        <div className="flex md:flex-col items-center md:items-start gap-4 md:mt-auto md:pt-6 md:border-t">
          <div className="flex items-center gap-2 text-[#5A7462]">
            <Phone className="w-4 h-4 text-[#76B82A]" />
            <span className="text-xs lg:text-sm font-medium whitespace-nowrap">(858) 555-0123</span>
          </div>
          
          {/* If you have a UserProfile component, it shows here */}
          {user && <UserProfile user={user} />}
        </div>

      </div>
    </header>
  );
}