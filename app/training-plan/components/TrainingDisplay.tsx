import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import TrainingSection from "./TrainingSection";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DotSpinner from "@/components/game-history/Spinner";
import { TrainingSchedule } from "../store";
import { AlertTriangle, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { toast } from "sonner";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { useLimitPuzzle } from "@/app/store/limitPuzzle";

interface TrainingPlanDisplayProps {
  schedule?: TrainingSchedule | null;
  isLoading?: boolean;
  error?: string | null;
  onAdjustPlan?: () => void;
}

const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({
  schedule,
  isLoading,
  error,
  onAdjustPlan,
}) => {
  const router = useRouter();
  const { isMember , isMemberMonthly} = useProfileStore();
  const { isLoading: loading, getUsagePuzzle } = useApiClient();
  const [remainingPuzzle, setRemainingPuzzle] = React.useState(0);
  const { setOpen } = useLimitPuzzle();

  const nextMonth =
    new Date().getMonth() + 2 > 12
      ? "01." + (new Date().getFullYear() + 1)
      : "01." + (new Date().getMonth() + 2) + "." + new Date().getFullYear();
  const [showPremiumDialog, setShowPremiumDialog] =
    React.useState<boolean>(false);
  useEffect(() => {
    handleGetLog();
  }, []);
  const handleGetLog = async () => {
    await getUsagePuzzle().then((res) => {
      let usage = res.data.totalPuzzlesThisMonth;
      setRemainingPuzzle(usage);
    });
  };
  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
  };
  const handleStartPuzzle = () => {
    if (remainingPuzzle >= 20 &&(!isMember&&!isMemberMonthly)) {
      // toast.error(
      //   `No free puzzles left this month. Free Puzzles reset on ${nextMonth}. Get Unlimited Puzzles now by clicking the button below.`
      // );
      setOpen(true);
      return;
    }
    router.push("/playground/puzzle");
  };

  if (isLoading) {
    return (
      <Card className="xl:border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <DotSpinner />
              <p className="text-gray-600">Loading your training plan...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isExpiredPlanError =
    error && error.includes("training plan has expired");

  if (error && !isExpiredPlanError) {
    return (
      <Card className="xl:border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading your training plan: {error}
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isExpiredPlanError || !schedule || !schedule.topics) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6 flex w-full flex-col gap-y-4">
          <Alert>
            <AlertDescription>
              {isExpiredPlanError
                ? "Your training plan has expired. Please create a new plan to continue your learning journey."
                : "No training plan available. Try creating a new plan."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const apiDays = schedule.schedule?.trainingScheduleDates || [];

  const mappedDays = apiDays.map((scheduleDate: any) => ({
    id: scheduleDate.day.toLowerCase(),
    date: scheduleDate.date.toString(),
    name: scheduleDate.day.slice(0, 3),
  }));

  const weekDays = mappedDays.length === 7 ? mappedDays : generateWeekDays();

  const todayDate = schedule.schedule?.todayScheduleDate;
  const todayId = todayDate ? todayDate.day.toLowerCase() : getTodayId();

  const openingDuration = `~${schedule.durations?.openingTime || 30} minutes`;
  const middlegameDuration = `~${
    schedule.durations?.middlegameTime || 30
  } minutes`;
  const endgameDuration = `~${schedule.durations?.endgameTime || 30} minutes`;
  const tacticsDuration = `~${schedule.durations?.tacticsTime || 30} minutes`;

  const openingTopics = schedule.topics.openings || [];
  const middlegameTopics = schedule.topics.middlegames || [];
  const endgameTopics = schedule.topics.endgames || [];
  const showTactics =
    schedule.topics.tactics !== undefined ? schedule.topics.tactics : true;

  return (
    <div className="xl:border xl:border-gray-200 p-4 rounded-lg shadow-sm overflow-hidden">
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-lg">Your Training Plan</h1>
          <button onClick={onAdjustPlan}>
            <Settings className="w-5 h-5 lg:hidden text-black" />
          </button>
        </div>

        <div
          className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {weekDays.map((day) => (
            <div key={day.id} className="flex-1 flex-shrink-0 min-w-[100px]">
              <DaySelector
                day={day}
                isActive={day.id === todayId}
                onSelect={() => {}}
                disabled={day.id !== todayId}
              />
            </div>
          ))}
        </div>

        {openingTopics.length > 0 && (
          <TrainingSection
            icon="/training-plan/oc.png"
            title="Opening Concepts"
            duration={openingDuration}
            instruction={`For today's practice, select one of your selected Opening Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Opening Concepts regularly until you can apply them perfectly.`}
            topics={openingTopics}
          />
        )}

        {middlegameTopics.length > 0 && (
          <TrainingSection
            icon="/training-plan/mc.png"
            title="Middlegame Concepts"
            duration={middlegameDuration}
            instruction={`For today's practice, select one of your selected Middlegame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Middlegame Concepts regularly until you can apply them perfectly.`}
            topics={middlegameTopics}
          />
        )}

        {endgameTopics.length > 0 && (
          <TrainingSection
            icon="/training-plan/ec.png"
            title="Endgame Concepts"
            duration={endgameDuration}
            instruction={`For today's practice, select one of your selected Endgame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Endgame Concepts regularly until you can apply them perfectly.`}
            topics={endgameTopics}
          />
        )}

        {showTactics && (
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Image
                  src={"/training-plan/tt.png"}
                  alt="Tactical Training"
                  width={34}
                  height={32}
                  className="lg:w-[34px] lg:h-[32px]"
                />
                <h3 className="text-[16px] font-semibold">
                  Tactical Training
                </h3>
              </div>
              <div className="text-black text-xs sm:text-sm font-medium">
                Estimated total duration per day:{" "}
                <span className="text-blue-800 font-bold">
                  {tacticsDuration}
                </span>
              </div>
            </div>

            <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-2 sm:p-3 rounded-lg mb-4 text-gray-800 text-[14px]">
              For today's practice, <span className="font-semibold">solve 10 Puzzles</span>.
            </div>

            <PremiumSubscription
              visible={showPremiumDialog && !isLoading}
              onClose={handleClosePremium}
              onGetPremium={handleGetPremium}
            />
            <div className="flex justify-center">
              <Button
                onClick={handleStartPuzzle}
                className="btn-primary rounded-full py-1.5 sm:py-2 px-4 sm:px-6 w-full text-[14px]"
              >
                Start Puzzles
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function generateWeekDays() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentDayIndex = today.getDay();

  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - currentDayIndex + index);

    return {
      id: dayNames[index].toLowerCase(),
      date: dayDate.getDate().toString(),
      name: dayNames[index],
    };
  });
}

function getTodayId() {
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = new Date();
  return dayNames[today.getDay()];
}

export default TrainingPlanDisplay;
