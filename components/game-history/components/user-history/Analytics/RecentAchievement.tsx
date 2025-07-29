import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Swords, Timer, Info } from "lucide-react";
import { getAchievementDetails } from "@/components/game-history/hooks/useAnalyticsData";
import { MobileTooltip } from "../Analytics";

interface RecentAchievementsProps {
  achievements: string[];
}

// Helper component for achievement icons
const AchievementIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "trophy":
      return <Trophy className="h-6 w-6 text-yellow-500" fill="#eab308" />;
    case "swords":
      return <Swords className="h-6 w-6 text-blue-500" fill="#3b82f6" />;
    default:
      return <Timer className="h-6 w-6 text-green-500" />;
  }
};

const RecentAchievements: React.FC<RecentAchievementsProps> = ({
  achievements,
}) => {
  return (
    <div className="md:p-4 rounded-lg">
     <div className="flex items-center justify-between">
        <h1 className="text-base font-medium mb-3">Recent Achievements</h1>
        <MobileTooltip
         content={[
          "To analyze chess game data and return a maximum of 3 top achievements by the player. These achievements can include:",
            "The longest winning streak (if it's at least 3 consecutive wins).",
            "The highest ELO rating that reaches certain milestones (such as 1200, 1400, etc.).",
            "The number of wins in Bullet mode (fast games).",
            "The fastest win based on the fewest number of moves." 
          ]}
          side="left"
        >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
      </div>
      <div className="space-y-3">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => {
            const { icon, title, description } =
              getAchievementDetails(achievement);

            return (
              <Card
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white"
              >
                <div className="h-12 w-12 flex justify-center items-center bg-yellow-100 rounded-full">
                  <AchievementIcon type={icon} />
                </div>
                <div className="space-y-1">
                  <h1 className="font-bold">{title}</h1>
                  <p className="text-xs">{description}</p>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center text-gray-500 p-4">
            No achievements yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAchievements;
