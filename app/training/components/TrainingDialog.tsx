import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogUserInfo from "./DialogUserInfo";
import DialogLevelProgress from "./DialogLevelProgress";
import TopicSelectionSection from "./TopicSelectionSection";
import { ChessTrainingPlanDialogProps } from "./types";
import Image from "next/image";

const ChessTrainingPlanDialog: React.FC<ChessTrainingPlanDialogProps> = ({
  open,
  onOpenChange,
  userProfile,
  skillLevels,
  trainingTopics,
  topicCategoryInfo,
  keyInfo,
  onPlanCreated,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getTopicsByCategory = (categoryId: string) => {
    return trainingTopics.filter((topic) => topic.category === categoryId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div></div>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Image
              src={"/training-plan/checklist.png"}
              alt=""
              width={30}
              height={30}
            />
            Create Training Plan
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="border"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Rise to the next Level</h2>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-start gap-4">
              <DialogUserInfo
                username={userProfile.username}
                keyInfo={keyInfo}
              />

              <DialogLevelProgress
                skillLevels={skillLevels}
                currentElo={userProfile.currentElo}
              />
            </div>
          </div>

          {/* Topic selection section */}
          <h2 className="text-lg font-semibold mb-4">
            Select your primary topics to improve your Skills
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {topicCategoryInfo.map((category) => (
              <TopicSelectionSection
                key={category.id}
                categoryId={category.id}
                title={category.title}
                icon={category.icon}
                description={category.description}
                subcategories={category.subcategories}
                topics={getTopicsByCategory(category.id)}
                selectedTopics={selectedTopics}
                onToggleTopic={toggleTopic}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="btn-primary rounded-full px-8 py-2 h-auto w-96 text-lg"
              onClick={() => {
                onOpenChange(false);
                onPlanCreated();
              }}
            >
              Create Training Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChessTrainingPlanDialog;
