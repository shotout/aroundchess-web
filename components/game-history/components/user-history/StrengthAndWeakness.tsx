import React from "react";
import { Target, BookOpen, Clock, Swords } from "lucide-react";
import { Card } from "@/components/ui/card";

type SkillStrengthItem = {
  name: string;
  value: number;
  iconType: string;
};

type SkillWeaknessItem = {
  name: string;
  value: number;
};

interface StrengthsWeaknessesSectionProps {
  strengthsData: SkillStrengthItem[];
  weaknessesData: SkillWeaknessItem[];
}

// Helper to get appropriate icon based on skill type
const getIconForSkillType = (iconType: string) => {
  switch (iconType) {
    case "Calculation":
    case "Tactical":
      return <Target className="text-game-green" size={24} />;
    case "Opening Knowledge":
      return <BookOpen className="text-blue-base" size={24} />;
    case "Time Management":
      return <Clock className="text-yellow-500" size={24} />;
    default:
      return <Target className="text-game-green" size={24} />;
  }
};

// Strength card component
const StrengthCard: React.FC<{ item: SkillStrengthItem }> = ({ item }) => {
  const icon = getIconForSkillType(item.iconType);

  return (
    <Card className="bg-white rounded-lg p-3 flex items-center">
      <div className="mr-3 bg-gray-100 rounded-full h-10 w-10 min-w-10 flex justify-center items-center">
        {icon}
      </div>

      <div className="flex flex-col items-center justify-between mb-2 w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <h1 className="font-semibold">{item.name}</h1>
          <h1 className="font-extralight">{item.value}%</h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-base h-2.5 rounded-full"
            style={{ width: `${item.value}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

// Weakness card component
const WeaknessCard: React.FC<{ item: SkillWeaknessItem }> = ({ item }) => {
  return (
    <Card className="bg-white rounded-lg p-3 flex items-center">
      <div className="mr-3 bg-gray-100 rounded-full h-10 w-10 min-w-10 flex justify-center items-center">
        <Swords className="text-purple-500" size={24} fill="#a855f7" />
      </div>

      <div className="flex flex-col items-center justify-between mb-2 w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <h1 className="font-semibold">{item.name}</h1>
          <h1 className="font-extralight">{item.value}%</h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-base h-2.5 rounded-full"
            style={{ width: `${item.value}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

// Main component
const StrengthsWeaknessesSection: React.FC<StrengthsWeaknessesSectionProps> = ({
  strengthsData,
  weaknessesData,
}) => {
  return (
    <div className="lg:p-4 rounded-lg">
      <h1 className="mb-2 font-bold text-base">Strength and weakness</h1>

      <div className="mb-4">
        <h1 className="text-sm font-medium mb-3">Strengths</h1>
        <div className="space-y-3">
          {strengthsData.map((item, index) => (
            <StrengthCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h1 className="text-sm font-medium mb-3">Areas for Improvement</h1>
        <div className="space-y-3">
          {weaknessesData.map((item, index) => (
            <WeaknessCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknessesSection;
