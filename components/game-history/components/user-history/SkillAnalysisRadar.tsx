import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { MobileTooltip } from "./Analytics";
import { Info } from "lucide-react";

type SkillData = {
  subject: string;
  A: number;
  fullMark: number;
};

interface SkillAnalysisRadarProps {
  radarData: SkillData[];
}

const SkillAnalysisRadar: React.FC<SkillAnalysisRadarProps> = ({
  radarData,
}) => {
  return (
    <div className="lg:p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">Skill Analysis</h1>
        <MobileTooltip
        content={[
          "**Calculation:** The score is determined based on the following data: ",
          "• tacticWinRate: win rate in tactical situations",
          "• tacticsPerformance: the player's performance in tactical phases",
          "• averageRating: the average rating of opponents",
          "**Endgame:** The variable endgameScore stores the player's skill score in the endgame phase. It is calculated using:",
          "• endgameWinRate: win percentage in endgame scenarios",
          "• endgamePerformance: the player's performance in the endgame",
          "• averageRating: the average rating of opponents",
          "**Opening Knowledge:** The variable openingKnowledgeScore represents the player’s knowledge of chess openings. It is calculated using:",
          "• openingWinRate: win percentage during the opening phase",
          "• performanceByGamePhase.opening: the player's performance in the opening",
          "• averageRating: the average rating of opponents",
          "• additionalFactor: an extra factor based on the variety of openings used, calculated from openingVarietyRatio * 20",
          "**Positional:** The variable positionalScore stores the player’s ability in positional play, which usually occurs during the middlegame. It is calculated using:",
          "• endgameWinRate: overall win percentage up to the endgame",
          "• strategyPerformance: the player's performance in strategic (positional) play",
          "• averageRating: the average rating of opponents",
          "**Tactical:** The variable tacticalScore represents the player’s tactical skill in chess. It is calculated using:",
          "• tacticWinRate: win percentage in tactical situations",
          "• tacticsPerformance: the player's performance in tactical phases",
          "• averageRating: the average rating of opponents"
          ]}
          side="left"
        >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
      </div>
      <div className="h-80 lg:h-[90%] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              className="text-xs"
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#C4CDF9"
              fill="#3A54E8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillAnalysisRadar;