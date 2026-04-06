import { Heart, Phone } from "lucide-react";
import { Link } from "react-router";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export function Navbar() {
  const { user } = useAuth();

  // Helper functions for dynamic links
  const getProgramLink = () => {
    const hasVisitedPrograms = localStorage.getItem("hasVisitedPrograms");
    return (!hasVisitedPrograms && user) ? "/prc-guide" : "/programs";
  };

  const getMeetingLink = () => {
    const hasVisitedMeetings = localStorage.getItem("hasVisitedMeetings");
    return (!hasVisitedMeetings && user) ? "/meeting-recommender" : "/meetings";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Heart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 leading-none">Poway Recovery Center</h1>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Your journey to wellness starts here</p>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 font-semibold px-2">
                <Link to={getProgramLink()}>Find Program</Link>
              </Button>
              <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 font-semibold px-2">
                <Link to={getMeetingLink()}>Find Meeting</Link>
              </Button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-gray-600 border-l pl-4 ml-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">(858) 555-0123</span>
            </div>

            {!user ? (
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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