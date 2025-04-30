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

  // State for active category on mobile/tablet
  const [activeCategory, setActiveCategory] = useState("opening");

  // Categories for toggling
  const categories = ["opening", "middlegame", "endgame"];

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

  const handleToggleTopic = (topicId: string) => {
    const transformedTopics = transformTopics();
    const topic = transformedTopics.find((t) => t.id === topicId);

    if (topic) {
      toggleTopic(topicId, topic.category);
    }
  };

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

  const handleCreatePlan = async () => {
    if (sessionId) {
      const success = await createTrainingPlan(sessionId);

      if (success) {
        onOpenChange(false);
        onPlanCreated();
      }
    }
  };

  const displayUserProfile = storeUserProfile || userProfile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-6xl rounded-md max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div></div>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Image
              src={"/training-plan/check-small.png"}
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
          <div className=" lg:p-6">
            <h2 className="text-lg font-semibold mb-4">
              Rise to the next Level
            </h2>

            <div className="bg-[#F6F9FF] rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
                <div className="w-full lg:w-2/5">
                  <DialogUserInfo
                    username={displayUserProfile?.username || "User"}
                    keyInfo={keyInfo}
                  />
                </div>
                <div className="w-full lg:w-3/5">
                  <DialogLevelProgress
                    skillLevels={skillLevels}
                    currentElo={
                      storeUserProfile?.elo || userProfile?.currentElo || 0
                    }
                  />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Select your primary topics to improve your Skills
            </h2>

            {/* Category toggle for mobile and tablet */}
            <div className="block lg:hidden mb-4">
              <div className="flex w-full justify-center">
                <div className="p-2 flex-1 flex bg-[#F9FAFC] rounded-lg border h-auto items-center w-full">
                  {categories.map((category, i) => (
                    <button
                      key={i}
                      className={`flex-1 p-[10px] font-medium text-center transition-all ${
                        activeCategory === category
                          ? "bg-white rounded-lg shadow-md text-black font-bold"
                          : "text-gray-600 font-normal hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category === "opening"
                        ? "Opening"
                        : category === "middlegame"
                        ? "Middlegame"
                        : "Endgame"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsive grid that shows only active category on mobile/tablet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {transformCategoryInfo().map((category) => (
                <div
                  key={category.id}
                  className={`${
                    activeCategory === category.id ? "block" : "hidden"
                  } lg:block`}
                >
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
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                className="btn-primary rounded-full px-8 py-2 h-auto w-full sm:w-96 text-lg"
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
