"use client";

import { useComputerChessStore } from "../store/computerChessStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { TournamentModeToggle } from "./tournament-mode-toggle";

export function ELOSelector() {
  const targetELO = useComputerChessStore(state => state.targetELO);
  
  const handleELOChange = useCallback((newELO: number) => {
    useComputerChessStore.getState().updateTargetELO(newELO);
  }, []);

  if (targetELO === undefined) return null;

  const getELODescription = (elo: number) => {
    if (elo < 450) return "Complete Beginner";
    if (elo < 750) return "Learning Basics";
    if (elo < 1100) return "Casual Player";
    if (elo < 1500) return "Club Player";
    if (elo < 1900) return "Expert";
    if (elo < 2300) return "Master";
    if (elo < 2700) return "Grandmaster";
    return "Super GM";
  };

  const getELOColor = (elo: number) => {
    if (elo < 450) return "text-green-600";
    if (elo < 750) return "text-emerald-600";
    if (elo < 1100) return "text-blue-600";
    if (elo < 1500) return "text-yellow-600";
    if (elo < 1900) return "text-orange-600";
    if (elo < 2300) return "text-red-600";
    if (elo < 2700) return "text-purple-600";
    return "text-fuchsia-600";
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">Computer Strength</h3>
          <p className="text-[14px] --sm text-gray-600">
            Adjust the AI difficulty level to match your skill
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={cn(
              "font-medium text-lg",
              getELOColor(targetELO)
            )}>
              {getELODescription(targetELO)}
            </span>
            <span className="text-[14px] --sm font-medium text-gray-600">
              ELO: {targetELO}
            </span>
          </div>
          
          <Slider
            value={[targetELO]}
            onValueChange={(values) => handleELOChange(values[0])}
            min={300}
            max={3200}
            step={50}
            className="w-full"
          />
          
          <div className="flex justify-between text-[14px] --xs text-gray-500">
            <span>Beginner (300)</span>
            <span>Maximum (3200)</span>
          </div>
        </div>

        {/* Add Tournament Mode Toggle */}
        <TournamentModeToggle />
      </div>
    </div>
  );
} 