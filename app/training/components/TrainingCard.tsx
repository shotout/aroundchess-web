import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingPlanCardProps } from "./types";

const TrainingPlanCard: React.FC<TrainingPlanCardProps> = ({
  onCreatePlan,
  hasPlan,
}) => {
  if (hasPlan) {
    return null;
  }

  return (
    <Card className="border border-gray-100 bg-white">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Create your Training Plan</h2>
        <p className="text-gray-600 mb-6">
          You have not set your Training Plan yet. Click the Button below to
          create your Training Plan.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto"
          onClick={onCreatePlan}
        >
          Create Training Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainingPlanCard;
