import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import TrainingSection from "./TrainingSection";
import Image from "next/image";
import { motion } from "framer-motion";

interface TrainingTopic {
  id: string;
  title: string;
  difficulty: string;
}

interface ScheduleDate {
  date: number;
  month: number;
  year: number;
  day: string;
}

interface TrainingScheduleResponse {
  eloRange: string;
  userProfile: {
    username: string;
    elo: number;
    avatar: string;
  };
  schedule: {
    startDate: string;
    startDay: string;
    trainingScheduleDates: ScheduleDate[];
    todayScheduleDate: ScheduleDate;
  };
  durations: {
    avgMinutesDaily: number;
    openingTime: number;
    tacticsTime: number;
    middlegameTime: number;
    endgameTime: number;
  };
  topics: {
    openings: TrainingTopic[];
    middlegames: TrainingTopic[];
    endgames: TrainingTopic[];
    tactics: boolean;
  };
}

interface TrainingPlanDisplayProps {
  schedule?: TrainingScheduleResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({
  schedule,
  isLoading,
  error,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log(schedule);

  if (isLoading) {
    return (
      <Card className="xl:border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <div className="text-center py-8">Loading your training plan...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="xl:border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <div className="text-center py-8 text-red-500">
            Error loading your training plan. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!schedule || !schedule.topics) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <div className="text-center py-8">No training plan available.</div>
        </CardContent>
      </Card>
    );
  }

  // Get the days from the API response if available
  const apiDays = schedule.schedule?.trainingScheduleDates || [];

  // Map API days to the format expected by DaySelector
  const mappedDays = apiDays.map((scheduleDate) => ({
    id: scheduleDate.day.toLowerCase(),
    date: scheduleDate.date.toString(),
    name: scheduleDate.day.slice(0, 3), // Take first 3 letters (Mon, Tue, etc.)
  }));

  // Use API days if available, otherwise generate days
  const weekDays = mappedDays.length === 7 ? mappedDays : generateWeekDays();

  // Get today's date from API if available
  const todayDate = schedule.schedule?.todayScheduleDate;
  const todayId = todayDate ? todayDate.day.toLowerCase() : getTodayId();

  // Get durations from API
  const openingDuration = `~${schedule.durations?.openingTime || 50} minutes`;
  const middlegameDuration = `~${
    schedule.durations?.middlegameTime || 50
  } minutes`;
  const endgameDuration = `~${schedule.durations?.endgameTime || 50} minutes`;
  const tacticsDuration = `~${schedule.durations?.tacticsTime || 50} minutes`;

  // Get topics from API
  const openingTopics = schedule.topics.openings || [];
  const middlegameTopics = schedule.topics.middlegames || [];
  const endgameTopics = schedule.topics.endgames || [];
  const showTactics =
    schedule.topics.tactics !== undefined ? schedule.topics.tactics : true;

  return (
    <div className="xl:border xl:border-gray-200 p-4 rounded-lg shadow-sm overflow-hidden">
      <div className="flex w-full flex-col gap-y-4">
        {/* Week day selector */}
        <h1 className="font-bold text-lg">Your Training Plan</h1>

        {/* Scrollable container for days with drag functionality */}
        <div className="overflow-hidden">
          <motion.div
            ref={scrollRef}
            className="flex gap-2 w-full no-scrollbar cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            onDrag={(_, info) => {
              // Manually scroll the container when dragging
              if (scrollRef.current) {
                scrollRef.current.scrollLeft -= info.delta.x;
              }
            }}
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
            }}
          >
            {weekDays.map((day) => (
              <div key={day.id} className="flex-1 flex-shrink-0 min-w-[100px]">
                <DaySelector
                  day={day}
                  isActive={day.id === todayId} // Make today's day active
                  onSelect={() => {}} // No-op since all days except today are disabled
                  disabled={day.id !== todayId} // Disable all days except today
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Opening Concepts Section */}
        <TrainingSection
          icon="/training-plan/oc.png"
          title="Opening Concepts"
          duration={openingDuration}
          instruction={`For today's practice, select one of your selected Opening Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Opening Concepts regularly until you can apply them perfectly.`}
          topics={openingTopics}
        />

        {/* Middlegame Concepts Section */}
        <TrainingSection
          icon="/training-plan/mc.png"
          title="Middlegame Concepts"
          duration={middlegameDuration}
          instruction={`For today's practice, select one of your selected Middlegame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Middlegame Concepts regularly until you can apply them perfectly.`}
          topics={middlegameTopics}
        />

        {/* Endgame Concepts Section */}
        <TrainingSection
          icon="/training-plan/ec.png"
          title="Endgame Concepts"
          duration={endgameDuration}
          instruction={`For today's practice, select one of your selected Endgame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Endgame Concepts regularly until you can apply them perfectly.`}
          topics={endgameTopics}
        />

        {/* Tactical Training Section */}
        {showTactics && (
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={"/training-plan/tt.png"}
                  alt=""
                  width={50}
                  height={50}
                />
                <h3 className="text-lg font-semibold">Tactical Training</h3>
              </div>
              <div className="text-blue-700 text-sm font-medium">
                Estimated total duration per day:{" "}
                <span className="text-blue-800 font-bold">
                  {schedule.durations.avgMinutesDaily}
                </span>
              </div>
            </div>

            <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-3 rounded-lg mb-4 text-gray-800">
              For today's practice, <strong>solve 10 Puzzles</strong>.
            </div>

            <div className="flex justify-center">
              <Button className="btn-primary rounded-full py-2 px-6 w-full">
                Start Puzzles
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate week days
function generateWeekDays() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - currentDayIndex + index); // Adjust to get correct day

    return {
      id: dayNames[index].toLowerCase(),
      date: dayDate.getDate().toString(),
      name: dayNames[index],
    };
  });
}

// Helper function to get today's day ID
function getTodayId() {
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = new Date();
  return dayNames[today.getDay()];
}

export default TrainingPlanDisplay;
