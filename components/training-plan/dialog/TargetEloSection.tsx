import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

interface TargetEloSectionProps {
  targetElo: string;
  setTargetElo: (value: string) => void;
  currentElo: string;
}

const TargetEloSection: React.FC<TargetEloSectionProps> = ({
  targetElo,
  setTargetElo,
  currentElo,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
          4
        </div>
        <Label htmlFor="target-elo" className="font-medium">
          Target
        </Label>
      </div>
      <div className="w-full flex items-center justify-between border rounded-md px-2">
        <Input
          id="target-elo"
          value={targetElo}
          onChange={(e) => setTargetElo(e.target.value)}
          className="w-[80%] border-none bg-transparent"
        />
        <div className="text-xs border border-blue-base rounded-[4px] py-1 px-[6px] text-nowrap">
          ELO Rating
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Info className="text-blue-600" />
        <span>
          Your current ELO Rating:{" "}
          <span className="font-medium">{currentElo}</span>
        </span>
      </div>
    </div>
  );
};

export default TargetEloSection;
