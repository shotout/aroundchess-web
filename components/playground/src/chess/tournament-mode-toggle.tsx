'use client';

import { useCallback } from "react";
import { useComputerChessStore } from "../store/computerChessStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";

export function TournamentModeToggle() {
  const tournamentMode = useComputerChessStore(state => state.tournamentMode);
  const targetELO = useComputerChessStore(state => state.targetELO);
  const toggleTournamentMode = useComputerChessStore(state => state.toggleTournamentMode);

  // Only show for high ELO ratings
  if (targetELO <= 2600) return null;

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-[#FFF6DB] border border-yellow-200">
      <Trophy className="w-5 h-5 text-yellow-600" />
      <div className="flex-1">
        <Label htmlFor="tournament-mode" className="text-sm font-medium text-gray-900">
          Tournament Mode
        </Label>
        <p className="text-xs text-gray-500">
          Maximum strength with longer thinking time
        </p>
      </div>
      <Switch
        id="tournament-mode"
        checked={tournamentMode}
        onCheckedChange={toggleTournamentMode}
        className="data-[state=checked]:bg-yellow-600"
      />
    </div>
  );
}
