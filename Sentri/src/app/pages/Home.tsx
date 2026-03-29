import { Link } from "react-router";
import { Search, Users, Heart, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user } = useAuth();

  const getProgramLink = () => {
    // Check if this is the first visit to programs page
    const hasVisitedPrograms = localStorage.getItem("hasVisitedPrograms");
    if (!hasVisitedPrograms && user) {
      return "/prc-guide";
    }
    return "/programs";
  };

  const getMeetingLink = () => {
    // Check if this is the first visit to meetings page
    const hasVisitedMeetings = localStorage.getItem("hasVisitedMeetings");
    if (!hasVisitedMeetings && user) {
      return "/meeting-recommender";
    }
    return "/meetings";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Poway Recovery Center</h1>
                <p className="text-sm text-gray-600">Your journey to wellness starts here</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>(858) 555-0123</span>
              </div>
              
  {/* ADDED: Show Login button only if NOT logged in */}
  {!user && (
    <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
      <Link to="/login">Sign In</Link>
    </Button>
  )}
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1586974175094-0a7259238613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHRoZXJhcHklMjByZWNvdmVyeSUyMGNlbnRlcnxlbnwxfHx8fDE3NzQwMzM2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Peaceful recovery center environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h2 className="text-5xl mb-6">Hope. Healing. Recovery.</h2>
            <p className="text-xl mb-8 text-blue-100">
              At Poway Recovery Center, we provide compassionate, evidence-based care to support
              your journey toward lasting recovery and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Main CTA Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to={getProgramLink()} className="block group">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1722094250550-4993fa28a51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzM5ODM5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Wellness programs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl text-gray-900">Find a Program</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Explore our comprehensive treatment programs tailored to your individual needs,
                  from outpatient services to intensive rehabilitation.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={getMeetingLink()} className="block group">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0JTIwZ3JvdXAlMjBtZWV0aW5nJTIwY2lyY2xlfGVufDF8fHx8MTc3Mzk0NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Support group meetings"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl text-gray-900">Find a Meeting</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Join our supportive community meetings. Connect with others on their recovery
                  journey in a safe, welcoming environment.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  <span>View schedule</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl text-center mb-12 text-gray-900">Why Choose Poway Recovery Center</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900">Compassionate Care</h3>
            <p className="text-gray-600">
              Our experienced team provides personalized, empathetic support throughout your recovery journey.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900">Community Support</h3>
            <p className="text-gray-600">
              Connect with peers and build lasting relationships in a supportive, judgment-free environment.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900">24/7 Availability</h3>
            <p className="text-gray-600">
              We're here when you need us most, with round-the-clock support and crisis intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl mb-6">Get Help Today</h2>
              <p className="text-blue-100 mb-8">
                Taking the first step is often the hardest. Our admissions team is here to guide you
                through the process and answer any questions you may have.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">(858) 555-0123</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>12345 Community Drive, Poway, CA 92064</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Open 24/7 for admissions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full">
                <h3 className="text-xl mb-4">Need Immediate Help?</h3>
                <p className="text-blue-100 mb-6">
                  If you're in crisis, don't wait. Call our 24-hour hotline now.
                </p>
                <Button size="lg" className="w-full bg-white text-blue-900 hover:bg-blue-50">
                  Call Crisis Line: (858) 555-9999
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Poway Recovery Center. All rights reserved.</p>
          <p className="text-sm mt-2">Confidential and HIPAA-compliant care</p>
        </div>
      </footer>
    </div>
  );
}