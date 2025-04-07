import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type SkillData = {
  subject: string;
  A: number;
  fullMark: number;
};

type SkillAnalysisRadarProps = {
  radarData: SkillData[];
};

const SkillAnalysisRadar: React.FC<SkillAnalysisRadarProps> = ({
  radarData,
}) => {
  return (
    <div className="lg:p-4 rounded-lg">
      <h1 className="text-base font-bold">Skill Analysis</h1>
      <div className="h-80 w-full flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="90%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              width={"50px"}
              className="text-xs"
              orientation="outer"
              textAnchor="middle"
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
