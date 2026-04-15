import { Heart, Phone } from "lucide-react";
import { Link } from "react-router";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import logo from "../../assets/PRC.png";


export function Navbar() {
  const { user } = useAuth();

  const getProgramLink = () => {
    return "/programs";
  };

  const getMeetingLink = () => {
    return "/meetings";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Poway Recovery Center Logo" className="w-15 h-15 object-contain"/>
            <div>
              <h1 className="text-3xl font-semibold text-[#1F3B2B] leading-none">Poway Recovery Center</h1>
              <p className="text-[10px] text-[#6B7F70] mt-1 uppercase tracking-wider">Your journey to wellness starts here</p>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" className="text-[#2D5138] hover:text-[#005A2C] font-semibold px-2">
                <Link to={getProgramLink()}>Find Program</Link>
              </Button>
              <Button asChild variant="ghost" className="text-[#2D5138] hover:text-[#005A2C] font-semibold px-2">
                <Link to={getMeetingLink()}>Find Meeting</Link>
              </Button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-[#5A7462] border-l pl-4 ml-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">(858) 555-0123</span>
            </div>

            {!user ? (
              <Button asChild variant="outline" className="border-[#76B82A] text-[#005A2C] hover:bg-[#F1F8EB]">
                <Link to="/login">Sign In</Link>
              </Button>
            ) : (
              <UserProfile />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}