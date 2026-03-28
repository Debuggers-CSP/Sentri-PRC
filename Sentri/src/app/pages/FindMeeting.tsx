import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserProfile } from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

// Meeting data with program types and open/closed designation
const allMeetings = [
  // Monday
  { id: 1, day: 1, time: "7:00 AM - 8:00 AM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 2, day: 1, time: "12:00 PM - 1:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 3, day: 1, time: "5:00 PM - 6:00 PM", name: "AL-ANON, CLOSED", program: "alanon", type: "closed" },
  { id: 4, day: 1, time: "6:30 PM - 7:30 PM", name: "MONDAY NIGHT MENS, CLOSED", program: "aa", type: "closed" },
  { id: 5, day: 1, time: "7:00 PM - 8:00 PM", name: "GA DISCUSSION, OPEN", program: "ga", type: "open" },
  
  // Tuesday
  { id: 6, day: 2, time: "7:00 AM - 8:00 AM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 7, day: 2, time: "12:00 PM - 1:00 PM", name: "AL-ANON DISCUSSION, CLOSED", program: "alanon", type: "closed" },
  { id: 8, day: 2, time: "5:00 PM - 6:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 9, day: 2, time: "6:00 PM - 7:00 PM", name: "ACR LAUNDRY LIST WORKSHOP, OPEN", program: "aca", type: "open" },
  { id: 10, day: 2, time: "7:00 PM - 8:00 PM", name: "CA DISCUSSION, OPEN", program: "ca", type: "open" },
  
  // Wednesday
  { id: 11, day: 3, time: "7:00 AM - 8:00 AM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 12, day: 3, time: "12:00 PM - 1:00 PM", name: "SOLUTION SEEKERS WINNERS WAY, OPEN", program: "na", type: "open" },
  { id: 13, day: 3, time: "5:00 PM - 6:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 14, day: 3, time: "6:00 PM - 7:00 PM", name: "AA DISCUSSION, CANDLE-TALK OPEN", program: "aa", type: "open" },
  { id: 15, day: 3, time: "6:00 PM - 7:00 PM", name: "NA DISCUSSION, OPEN", program: "na", type: "open" },
  { id: 16, day: 3, time: "7:00 PM - 8:00 PM", name: "ALATEEN SUPPORT, CLOSED", program: "alateen", type: "closed" },
  
  // Thursday
  { id: 17, day: 4, time: "7:00 AM - 8:00 AM", name: "AA BIG BOOK STUDY, OPEN", program: "aa", type: "open" },
  { id: 18, day: 4, time: "12:00 PM - 1:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 19, day: 4, time: "5:00 PM - 6:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 20, day: 4, time: "7:00 PM - 8:00 PM", name: "AA WOMEN'S STUDY GROUP, CLOSED", program: "aa", type: "closed" },
  { id: 21, day: 4, time: "7:30 PM - 8:30 PM", name: "SA MEETING, CLOSED", program: "sa", type: "closed" },
  { id: 22, day: 4, time: "8:30 PM - 9:30 PM", name: "AA STEP STUDY, BACK TO BASICS, OPEN", program: "aa", type: "open" },
  
  // Friday
  { id: 23, day: 5, time: "7:00 AM - 8:00 AM", name: "AA 12+12 STUDY, OPEN", program: "aa", type: "open" },
  { id: 24, day: 5, time: "12:00 PM - 1:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 25, day: 5, time: "5:00 PM - 6:00 PM", name: "SENIORS IN RECOVERY, OPEN", program: "aa", type: "open" },
  { id: 26, day: 5, time: "7:30 PM - 8:30 PM", name: "SPIRITUAL LINES, CLOSED", program: "aa", type: "closed" },
  { id: 27, day: 5, time: "7:30 PM - 8:30 PM", name: "GA FRIDAY NIGHT, OPEN", program: "ga", type: "open" },
  
  // Saturday
  { id: 28, day: 6, time: "7:00 AM - 8:00 AM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 29, day: 6, time: "10:00 AM - 11:00 AM", name: "AA WOMEN'S, CLOSED", program: "aa", type: "closed" },
  { id: 30, day: 6, time: "5:00 PM - 6:00 PM", name: "CAN/CAN NOT, OPEN", program: "aa", type: "open" },
  { id: 31, day: 6, time: "7:30 PM - 8:30 PM", name: "AA SPEAKER, OPEN", program: "aa", type: "open" },
  { id: 32, day: 6, time: "6:00 PM - 7:00 PM", name: "ACA DISCUSSION, OPEN", program: "aca", type: "open" },
  
  // Sunday
  { id: 33, day: 0, time: "7:00 AM - 8:00 AM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 34, day: 0, time: "9:00 AM - 10:15 AM", name: "NA DISCUSSION, CLOSED, MENS", program: "na", type: "closed" },
  { id: 35, day: 0, time: "12:00 PM - 1:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 36, day: 0, time: "5:00 PM - 6:00 PM", name: "AA DISCUSSION, OPEN", program: "aa", type: "open" },
  { id: 37, day: 0, time: "6:00 PM - 7:00 PM", name: "AL-ANON FAMILY GROUP, OPEN", program: "alanon", type: "open" },
];

// Get current week dates
function getCurrentWeekDates(baseDate: Date = new Date()) {
  const currentDay = baseDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay); // Start on Sunday
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateRange(dates: Date[]) {
  const start = dates[0];
  const end = dates[6];
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function FindMeeting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  const [filteredMeetings, setFilteredMeetings] = useState(allMeetings);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login", { state: { from: "/meetings" } });
      return;
    }

    // Check if this is the first visit to meetings page
    const hasVisitedMeetings = localStorage.getItem("hasVisitedMeetings");
    if (!hasVisitedMeetings) {
      // Redirect to meeting recommender on first visit
      localStorage.setItem("hasVisitedMeetings", "true");
      navigate("/meeting-recommender");
      return;
    }

    // Filter meetings based on preferences if they exist
    const preferences = JSON.parse(localStorage.getItem("meetingPreferences") || "{}");
    if (preferences.meetingType && preferences.programs) {
      const filtered = allMeetings.filter(meeting =>
        meeting.type === preferences.meetingType &&
        preferences.programs.includes(meeting.program)
      );
      setFilteredMeetings(filtered);
    } else {
      // Show all meetings if no preferences set
      setFilteredMeetings(allMeetings);
    }
  }, [user, navigate]);

  useEffect(() => {
    setWeekDates(getCurrentWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  if (!user) {
    return null;
  }

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    setCurrentWeekStart(new Date());
  };

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl text-gray-900">Meeting Calendar</h1>
              <p className="text-gray-600 mt-1">Your personalized meeting schedule</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900">
                {formatDateRange(weekDates)}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Today
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  className="p-4 text-center border-r border-gray-200 last:border-r-0"
                >
                  <div className="text-sm font-medium text-gray-600">
                    {dayNames[date.getDay()]}
                  </div>
                  <div
                    className={`text-2xl mt-1 ${
                      isToday
                        ? "bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                        : "text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Meeting Grid */}
          <div className="grid grid-cols-7 min-h-[500px]">
            {weekDates.map((date, dayIndex) => {
              const dayOfWeek = date.getDay();
              const dayMeetings = filteredMeetings.filter(m => m.day === dayOfWeek);
              
              return (
                <div
                  key={dayIndex}
                  className="border-r border-gray-200 last:border-r-0 p-2 bg-white"
                >
                  <div className="space-y-2">
                    {dayMeetings.map((meeting) => (
                      <Card
                        key={meeting.id}
                        className="bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer border-0"
                      >
                        <CardContent className="p-2">
                          <div className="text-xs font-medium mb-1">
                            {meeting.time}
                          </div>
                          <div className="text-xs leading-tight">
                            {meeting.name}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Open meetings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Anyone interested in the program can attend</li>
                <li>• Includes potential new members, family, and friends</li>
                <li>• Great for learning about the program</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Closed meetings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Only for individuals who identify with the group's struggle</li>
                <li>• More personal and intimate environment</li>
                <li>• Members share openly about recovery and challenges</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Update Preferences */}
        <div className="mt-6 text-center">
          <Link
            to="/meeting-recommender"
            className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
          >
            Update Meeting Preferences
          </Link>
        </div>
      </section>
    </div>
  );
}