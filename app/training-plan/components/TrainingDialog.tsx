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
import Image from "next/image";
import DotSpinner from "@/components/game-history/Spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTrainingPlanStore } from "../store";
import { useProfileStore } from "@/app/store/profile";
import WhiteSpinner from "@/components/SpinnerWhite";

interface ChessTrainingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: {
    username?: string;
    currentElo?: number;
    avatar?: string;
  };
  onPlanCreated: () => void;
}

const defaultCategoryInfo = [
  {
    id: "opening",
    title: "Opening Topics",
    icon: "/training-plan/oc.png",
    description: "Select Opening Topics:",
    subcategories: [
      {
        id: "whiteOpening",
        title: "White Opening",
        selectionCount: 1,
      },
      {
        id: "blackOpening",
        title: "Black Opening",
        selectionCount: 1,
      },
    ],
  },
  {
    id: "middlegame",
    title: "Middlegame Concepts",
    icon: "/training-plan/mc.png",
    description: "Select Middlegame Topics:",
    subcategories: [],
  },
  {
    id: "endgame",
    title: "Endgame Concepts",
    icon: "/training-plan/ec.png",
    description: "Select Endgame Topics:",
    subcategories: [],
  },
];

const ChessTrainingPlanDialog: React.FC<ChessTrainingPlanDialogProps> = ({
  open,
  onOpenChange,
  userProfile,
  onPlanCreated,
}) => {
  const { sessionId } = useProfileStore();
  const {
    userProfile: storeUserProfile,
    config,
    topics,
    selectedWhiteOpenings,
    selectedBlackOpenings,
    selectedMiddlegames,
    selectedEndgames,
    isLoading,
    error,
    fetchTopics,
    toggleTopic,
    createTrainingPlan,
    reset,
  } = useTrainingPlanStore();

  const [activeCategory, setActiveCategory] = useState("opening");
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const categories = ["opening", "middlegame", "endgame"];

  const selectedTopics = [
    ...selectedWhiteOpenings,
    ...selectedBlackOpenings,
    ...selectedMiddlegames,
    ...selectedEndgames,
  ];

  useEffect(() => {
    if (open && sessionId) {
      fetchTopics(sessionId);
    }

    return () => {
      if (!open) {
        reset();
      }
    };
  }, [open, sessionId, fetchTopics, reset]);

  const transformTopics = () => {
    if (!topics) return [];

    const transformed: any[] = [];

    if (topics.openings?.white) {
      topics.openings.white.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "whiteOpening",
          level: topic.difficulty,
        });
      });
    }

    if (topics.openings?.black) {
      topics.openings.black.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "blackOpening",
          level: topic.difficulty,
        });
      });
    }

    if (topics.middlegames && topics.middlegames.length > 0) {
      topics.middlegames.forEach((topic: any) => {
        transformed.push({
          ...topic,
          category: "middlegame",
          level: topic.difficulty,
        });
      });
    }

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

  const transformCategoryInfo = () => {
    if (!config?.requirements) return defaultCategoryInfo;

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
    if (sessionId != "") {
      setIsCreatingPlan(true);
      try {
        const success = await createTrainingPlan(sessionId);

        if (success) {
          onOpenChange(false);
          onPlanCreated();
        }
      } finally {
        setIsCreatingPlan(false);
      }
    }
  };

  const displayUserProfile = storeUserProfile || userProfile;
  const keyInfo = {
    keyToReachNextLevel: config?.eloRange
      ? `Continued practice with improved openings and deeper study of middlegame and endgame concepts for ${config.eloRange} ELO range.`
      : "Improve your skills with focused training.",
    approximateDuration: "6-9 Months",
  };

  if (error) {
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
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                if (sessionId) fetchTopics(sessionId);
              }}
              className="btn-primary"
            >
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl rounded-md max-h-[95vh] overflow-y-auto [&>button]:hidden">
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
          <div className="p-4 flex items-center justify-center">
            <DotSpinner />
          </div>
        ) : (
          <div className="p-0 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">
              Rise to the next Level
            </h2>

            <div className="bg-[#F6F9FF] rounded-lg border border-gray-200 p-2 lg:p-4 mb-6">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
                <div className="w-full lg:w-2/5">
                  <DialogUserInfo
                    username={displayUserProfile?.username || "User"}
                    keyInfo={keyInfo}
                  />
                </div>

                <div className="w-full lg:w-3/5">
                  <DialogLevelProgress
                    currentElo={
                      (displayUserProfile as any)?.currentElo ??
                      userProfile?.currentElo ??
                      0
                    }
                  />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Select your primary topics to improve your Skills
            </h2>

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
              <button
                className="btn-primary rounded-full px-8 py-2 h-12 w-full sm:w-96 text-lg flex justify-center items-center"
                onClick={handleCreatePlan}
                disabled={isLoading || isCreatingPlan}
              >
                <div className="min-h-6 min-w-52 flex justify-center items-center">
                  {isCreatingPlan ? <WhiteSpinner /> : "Create Training Plan"}
                </div>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChessTrainingPlanDialog;
