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
          "**Calculation:** Your tactical skill based on win rate and performance in tactical situations",
          "**Positional:** Your positional play ability based on middlegame and strategic performance",
          "**Tactical:** Your tactical chess skill based on win rate and performance in tactical phases",
          "**Endgame:** Your endgame skill based on win rate and performance in endgame scenarios",
          "**Opening Knowledge:** Your opening knowledge based on win rate, performance, and variety of openings used",
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
              className="text-[14px] --xs"
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