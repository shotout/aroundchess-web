import React from "react";
import {
  Target,
  Calendar,
  Brain,
  BarChart,
  CheckCircle,
  Puzzle,
  Trophy,
  AlignJustify,
  Settings,
} from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  switch (name) {
    case "Target":
      return <Target className={className} />;
    case "Calendar":
      return <Calendar className={className} />;
    case "BarChart":
      return <BarChart className={className} />;
    case "CheckCircle":
      return <CheckCircle className={className} />;
    case "Puzzle":
      return <Puzzle className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "Trophy":
      return <Trophy className={className} />;
    case "AlignJustify":
      return <AlignJustify className={className} />;
    case "Settings":
      return <Settings className={className} />;
    default:
      return <Settings className={className} />; // Default icon
  }
};

export default DynamicIcon;
