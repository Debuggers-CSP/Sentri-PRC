import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
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
] as const;

const programs = [
  { id: "aa", name: "AA", fullName: "Alcoholics Anonymous" },
  { id: "aca", name: "ACA", fullName: "Adult Children of Alcoholics" },
  { id: "alateen", name: "Alateen", fullName: "Support for Teens" },
  { id: "alanon", name: "Al-Anon", fullName: "Support for Families" },
  { id: "na", name: "NA", fullName: "Narcotics Anonymous" },
  { id: "ca", name: "CA", fullName: "Cocaine Anonymous" },
  { id: "ga", name: "GA", fullName: "Gamblers Anonymous" },
  { id: "sa", name: "SA", fullName: "Sexaholics Anonymous" },
] as const;

const MEETING_PREFERENCE_KEY = "meetingPreferences";

function getCurrentWeekDates(baseDate: Date = new Date()) {
  const currentDay = baseDate.getDay();
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay);

  const weekDates = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
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
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("open");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(() => programs.map((program) => program.id));

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/meetings" } });
    }
  }, [navigate, user]);

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem(MEETING_PREFERENCE_KEY) || "{}");
    if (savedPreferences.meetingType === "open" || savedPreferences.meetingType === "closed") {
      setSelectedMeetingType(savedPreferences.meetingType);
    }

    if (Array.isArray(savedPreferences.programs) && savedPreferences.programs.length > 0) {
      setSelectedPrograms(savedPreferences.programs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      MEETING_PREFERENCE_KEY,
      JSON.stringify({
        meetingType: selectedMeetingType,
        programs: selectedPrograms,
      }),
    );
  }, [selectedMeetingType, selectedPrograms]);

  useEffect(() => {
    setWeekDates(getCurrentWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  const filteredMeetings = useMemo(
    () =>
      allMeetings.filter(
        (meeting) =>
          meeting.type === selectedMeetingType &&
          selectedPrograms.includes(meeting.program),
      ),
    [selectedMeetingType, selectedPrograms],
  );

  if (!user) {
    return null;
  }

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms((previousPrograms) => {
      if (previousPrograms.includes(programId)) {
        return previousPrograms.filter((id) => id !== programId);
}
      return [...previousPrograms, programId];
    });
  };

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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF5] to-[#E8F5E9]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3">
              <div className="bg-white border border-[#E0EADD] rounded-[24px] p-5 sticky top-24 space-y-6 shadow-[0_10px_24px_rgba(0,90,44,0.08)]">
                <div>
                  <h2 className="text-xl text-[#1F3B2B]">Meeting Preferences</h2>
                  <p className="text-sm text-[#5A7462] mt-1">Adjust filters to update the calendar instantly.</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#1F3B2B] mb-3">Meeting Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "open", label: "Open", description: "Anyone interested in recovery can attend, including family and professionals." },
                      { id: "closed", label: "Closed", description: "Only people who identify with the group's struggle should attend." },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedMeetingType(option.id)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                          selectedMeetingType === option.id
                            ? "bg-[#005A2C] text-white border-[#76B82A]"
                            : "bg-white text-[#2D5138] border-gray-300 hover:border-[#A3D977]"
                        }`}
                      >
                        {option.label}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex" onClick={(event) => event.stopPropagation()}>
                              <Info className={`w-3.5 h-3.5 ${selectedMeetingType === option.id ? "text-[#E8F5E9]" : "text-[#6B7F70]"}`} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
                            {option.description}
                          </TooltipContent>
                        </Tooltip>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#1F3B2B] mb-3">Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {programs.map((program) => {
                      const selected = selectedPrograms.includes(program.id);
                      return (
                        <button
                          key={program.id}
                          type="button"
                          onClick={() => handleProgramToggle(program.id)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            selected
                              ? "bg-[#005A2C] text-white border-[#76B82A]"
                              : "bg-white text-[#2D5138] border-gray-300 hover:border-[#A3D977]"
                          }`}
                          title={program.fullName}
                        >
                          {program.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="bg-white rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)] p-4 mb-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={handlePreviousWeek} className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium text-[#1F3B2B]">{formatDateRange(weekDates)}</h2>
                    <Button variant="outline" size="sm" onClick={handleToday} className="bg-[#005A2C] text-white hover:bg-[#124627]">
                      Today
                    </Button>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleNextWeek} className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {filteredMeetings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg border border-dashed border-[#DCEAD8] min-h-[400px] flex items-center justify-center px-6 text-center">
                  <p className="text-[#5A7462]">No meetings match these filters. Try selecting more programs or switching meeting types!</p>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] border border-[#E0EADD] shadow-[0_10px_24px_rgba(0,90,44,0.08)] overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-[#E0EADD] bg-[#F1F8EB]">
                    {weekDates.map((date, index) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div key={index} className="p-4 text-center border-r border-[#E0EADD] last:border-r-0">
                          <div className="text-sm font-medium text-[#5A7462]">{dayNames[date.getDay()]}</div>
                          <div
                            className={`text-2xl mt-1 ${
                              isToday
                                ? "bg-[#76B82A] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                                : "text-[#1F3B2B]"
                            }`}
                          >
                            {date.getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-7 min-h-[500px]">
                    {weekDates.map((date, dayIndex) => {
                      const dayOfWeek = date.getDay();
                      const dayMeetings = filteredMeetings.filter((meeting) => meeting.day === dayOfWeek);

                      return (
                        <div key={dayIndex} className="border-r border-[#E0EADD] last:border-r-0 p-2 bg-white">
                          <div className="space-y-2">
                            {dayMeetings.map((meeting) => (
                              <Card key={meeting.id} className="bg-[#F1F8EB] text-[#1F3B2B] hover:bg-[#E8F5E9] transition-colors cursor-pointer border-0">
                                <CardContent className="p-2">
                                  <div className="text-xs font-medium mb-1">{meeting.time}</div>
                                  <div className="text-xs leading-tight">{meeting.name}</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}