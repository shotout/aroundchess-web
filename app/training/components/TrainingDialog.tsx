import React, { useState, useEffect } from "react";
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
import { useAuth } from "@clerk/nextjs";
import useTrainingPlanStore from "../service/TrainingPlanStore";
import DotSpinner from "@/components/game-history/Spinner";

const ChessTrainingPlanDialog: React.FC<ChessTrainingPlanDialogProps> = ({
  open,
  onOpenChange,
  userProfile,
  skillLevels,
  topicCategoryInfo: mockTopicCategoryInfo,
  keyInfo,
  onPlanCreated,
}) => {
  const { sessionId } = useAuth();
  const {
    // State from the store
    userProfile: storeUserProfile,
    config,
    topics,
    selectedWhiteOpenings,
    selectedBlackOpenings,
    selectedMiddlegames,
    selectedEndgames,
    isLoading,
    error,

    // Actions from the store
    fetchTopics,
    toggleTopic,
    createTrainingPlan,
    reset,
  } = useTrainingPlanStore();

  // Combine all selected topics from the store
  const selectedTopics = [
    ...selectedWhiteOpenings,
    ...selectedBlackOpenings,
    ...selectedMiddlegames,
    ...selectedEndgames,
  ];

  // Fetch topics when dialog opens
  useEffect(() => {
    if (open && sessionId) {
      fetchTopics(sessionId);
    }

    // Reset selections when dialog closes
    return () => {
      if (!open) {
        reset();
      }
    };
  }, [open, sessionId, fetchTopics, reset]);

  // Transform the API topics into the format expected by TopicSelectionSection
  const transformTopics = () => {
    if (!topics) return [];

    const transformed: any[] = [];

    // Add white openings
    if (topics.openings?.white) {
      topics.openings.white.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "whiteOpening",
          level: topic.difficulty,
        });
      });
    }

    // Add black openings
    if (topics.openings?.black) {
      topics.openings.black.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "blackOpening",
          level: topic.difficulty,
        });
      });
    }

    // Add middlegames
    if (topics.middlegames && topics.middlegames.length > 0) {
      topics.middlegames.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "middlegame",
          level: topic.difficulty,
        });
      });
    }

    // Add endgames
    if (topics.endgames && topics.endgames.length > 0) {
      topics.endgames.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "endgame",
          level: topic.difficulty,
        });
      });
    }

    return transformed;
  };

  // Generate category info based on API data
  const transformCategoryInfo = () => {
    if (!config?.requirements) return mockTopicCategoryInfo;

    const requirements = config.requirements;

    return [
      {
        id: "opening",
        title: "Opening Topics",
        icon: "/training-plan/oc.png",
        description: `Select ${requirements.opening.white} White and ${requirements.opening.black} Black Opening Topic:`,
        subcategories: [
          {
            id: "whiteOpening",
            title: "White Opening",
            selectionCount: requirements.opening.white,
          },
          {
            id: "blackOpening",
            title: "Black Opening",
            selectionCount: requirements.opening.black,
          },
        ],
      },
      {
        id: "middlegame",
        title: "Middlegame Concepts",
        icon: "/training-plan/mc.png",
        description: `Select ${requirements.middlegame.min}-${requirements.middlegame.max} Middlegame Topics:`,
        subcategories: [],
      },
      {
        id: "endgame",
        title: "Endgame Concepts",
        icon: "/training-plan/ec.png",
        description: `Select ${requirements.endgame.min}-${requirements.endgame.max} Endgame Topics:`,
        subcategories: [],
      },
    ];
  };

  // Handle topic selection through the store
  const handleToggleTopic = (topicId: string) => {
    // Determine category from the topic id or structure
    const transformedTopics = transformTopics();
    const topic = transformedTopics.find((t) => t.id === topicId);

    if (topic) {
      toggleTopic(topicId, topic.category);
    }
  };

  // Filter topics by category
  const getTopicsByCategory = (categoryId: string) => {
    const transformedTopics = transformTopics();
    const category = transformCategoryInfo().find(
      (cat) => cat.id === categoryId
    );

    if (
      category &&
      category.subcategories &&
      category.subcategories.length > 0
    ) {
      const subcategoryIds = category.subcategories.map((sub) => sub.id);
      return transformedTopics.filter((topic) =>
        subcategoryIds.includes(topic.category)
      );
    }

    return transformedTopics.filter((topic) => topic.category === categoryId);
  };

  // Handle creating the training plan
  const handleCreatePlan = async () => {
    if (sessionId) {
      const success = await createTrainingPlan(sessionId);

      if (success) {
        onOpenChange(false);
        onPlanCreated();
      }
    }
  };

  // Use user profile from API if available, otherwise use passed props
  const displayUserProfile = storeUserProfile || userProfile;

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

        {isLoading ? (
          <div className="p-6 flex items-center justify-center">
            <DotSpinner />
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">
            <p>Error loading training topics: {error}</p>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Rise to the next Level
            </h2>

            <div className="bg-[#F6F9FF] rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-start gap-4">
                <DialogUserInfo
                  username={displayUserProfile?.username || "User"}
                  keyInfo={keyInfo}
                />

                <DialogLevelProgress
                  skillLevels={skillLevels}
                  currentElo={
                    storeUserProfile?.elo || userProfile?.currentElo || 0
                  }
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Select your primary topics to improve your Skills
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {transformCategoryInfo().map((category) => (
                <TopicSelectionSection
                  key={category.id}
                  categoryId={category.id}
                  title={category.title}
                  icon={category.icon}
                  description={category.description}
                  subcategories={category.subcategories}
                  topics={getTopicsByCategory(category.id)}
                  selectedTopics={selectedTopics}
                  onToggleTopic={handleToggleTopic}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                className="btn-primary rounded-full px-8 py-2 h-auto w-96 text-lg"
                onClick={handleCreatePlan}
                disabled={isLoading}
              >
                Create Training Plan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChessTrainingPlanDialog;
