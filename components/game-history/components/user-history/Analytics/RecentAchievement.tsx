import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Swords, Timer } from "lucide-react";
import { getAchievementDetails } from "@/components/game-history/hooks/useAnalyticsData";

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
      <h1 className="text-base font-medium mb-3">Recent Achievements</h1>
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
