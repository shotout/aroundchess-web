import React from "react";
import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "../data/TrainingData";

interface DifficultyFilterProps {
  activeFilter: DifficultyLevel;
  setActiveFilter: (filter: DifficultyLevel) => void;
  className?: string;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  activeFilter,
  setActiveFilter,
  className,
}) => {
  return (
    <div className={`flex gap-2 mb-4 ${className || "border-b pb-4"}`}>
      <Button
        variant={activeFilter === "Beginner" ? "default" : "outline"}
        className={`rounded-md text-xs ${
          activeFilter === "Beginner" ? "bg-blue-600" : ""
        }`}
        onClick={() =>
          setActiveFilter(activeFilter === "Beginner" ? null : "Beginner")
        }
      >
        Beginner
      </Button>
      <Button
        variant={activeFilter === "Intermediate" ? "default" : "outline"}
        className={`rounded-md text-xs ${
          activeFilter === "Intermediate" ? "bg-blue-600" : ""
        }`}
        onClick={() =>
          setActiveFilter(
            activeFilter === "Intermediate" ? null : "Intermediate"
          )
        }
      >
        Intermediate
      </Button>
      <Button
        variant={activeFilter === "Advanced" ? "default" : "outline"}
        className={`rounded-md text-xs ${
          activeFilter === "Advanced" ? "bg-blue-600" : ""
        }`}
        onClick={() =>
          setActiveFilter(activeFilter === "Advanced" ? null : "Advanced")
        }
      >
        Advanced
      </Button>
      <Button
        variant={activeFilter === "Expert" ? "default" : "outline"}
        className={`rounded-md text-xs ${
          activeFilter === "Expert" ? "bg-blue-600" : ""
        }`}
        onClick={() =>
          setActiveFilter(activeFilter === "Expert" ? null : "Expert")
        }
      >
        Expert
      </Button>
    </div>
  );
};

export default DifficultyFilter;
