"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Info,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Responsive from "../game-history/Responsive";
import {
  useOpeningsStore,
  getFenFromMoves,
  getIdFromSlug,
  getSlugFromId,
} from "./lib/openingMapper";
import { useChessLessonStore } from "./store/OpeningStore";
import DotSpinner from "../game-history/Spinner";

export default function OpeningDetailWithNextTopics({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "variations">(
    "overview"
  );

  const { completeLesson, isLessonCompleted } = useChessLessonStore();
  const {
    allOpenings,
    openingDetails,
    isLoading,
    error,
    initialized,
    fetchAllOpenings,
    fetchOpeningDetails,
  } = useOpeningsStore();

  const [lessonFinished, setLessonFinished] = useState(false);

  const openingId = getIdFromSlug(params.slug);
  const opening = openingDetails[openingId];
  const relatedOpenings = allOpenings
    .filter((o) => o.id !== openingId)
    .slice(0, 3);

  useEffect(() => {
    const loadData = async () => {
      if (!initialized) {
        await fetchAllOpenings();
      }
      await fetchOpeningDetails(openingId);
    };

    loadData();
  }, [openingId, fetchOpeningDetails, initialized, fetchAllOpenings]);

  useEffect(() => {
    if (opening) {
      setLessonFinished(isLessonCompleted(params.slug));
    }
  }, [opening, isLessonCompleted, params.slug]);

  const handleOpeningNavigation = (slug: string) => {
    const navigateToOpening = () => {
      router.push(`/opening-theory/${slug}`);
    };
    setTimeout(navigateToOpening, 200);
  };

  const handleFinishLesson = () => {
    if (opening) {
      completeLesson(params.slug);
      setLessonFinished(true);
    }
  };

  if (isLoading || !opening) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Error Loading Opening</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/opening-theory")}>
          Back to Opening Theory
        </Button>
      </div>
    );
  }

  const strategicIdeas =
    opening.variations && opening.variations.length > 0
      ? opening.variations[0].keyIdeas.map((ki) => ki.idea)
      : ["Strategic analysis coming soon"];

  const tacticalIdeas =
    opening.variations && opening.variations.length > 1
      ? opening.variations[1].keyIdeas.map((ki) => ki.idea)
      : ["Tactical analysis coming soon"];

  return (
    <AnimatePresence mode="wait">
      <Responsive />
      <motion.div
        key={params.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col"
      >
        <div className="mb-4">
          <div className="px-4 pt-20 pb-3 md:px-6 md:pt-24 md:pb-4 lg:pt-28 xl:pt-6">
            <div className="flex">
              <div className="flex items-center">
                <button
                  onClick={() => router.push("/opening-theory")}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-6 w-6 mr-2 font-bold" />
                </button>
                <h1 className="font-bold text-lg">{opening.title}</h1>
              </div>

              <div className="hidden"></div>
            </div>

            <p className="text-gray-600 text-xs text-justify md:text-sm md:text-left md:mt-1 ml-8">
              {opening.description}
            </p>
          </div>
          <div className="border-b xl:border-b-0"></div>
        </div>
        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-10 2xl:grid-cols-10 gap-6">
            <div className="xl:col-span-7 2xl:col-span-7 flex flex-col gap-6 xl:border xl:p-4 xl:rounded-md xl:mb-6">
              <div className="rounded-lg p-2">
                <div className="w-full max-w-md mx-auto">
                  <Chessboard
                    id={`board-${params.slug}`}
                    position={getFenFromMoves(opening.variations?.[0]?.moves)}
                    customDarkSquareStyle={{ backgroundColor: "#5C9DFF" }}
                    customLightSquareStyle={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-x-3">
                <span className="inline-block text-xs px-2 py-1 rounded-[2px] border border-blue-base text-blue-base">
                  {opening.difficulty}
                </span>
                <div className="flex justify-center items-center px-2 py-1 text-xs rounded-[2px] border border-blue-base text-blue-base">
                  <Clock className="w-3 h-3 mr-1" />
                  <h1>{opening.estimatedTime} learning</h1>
                </div>
              </div>

              {lessonFinished && (
                <div className="bg-green-100 border-green-300 border rounded-lg p-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-800 font-medium">
                    Great, you finished this exercise! Make sure you use your
                    Learnings in your next Game.
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="border border-blue-base border-l-4 rounded-lg p-4 flex flex-col h-[71px]">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    <h2 className="text-sm font-semibold">Opening Analysis</h2>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Key strategic and tactical ideas in this opening
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Strategic Ideas:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-4">
                        {strategicIdeas.map((idea, index) => (
                          <li key={index} className="text-xs">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tactical Ideas:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-4">
                        {tacticalIdeas.map((idea, index) => (
                          <li key={index} className="text-xs">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="overflow-hidden bg-white flex flex-col gap-6">
                <div className="p-2 flex bg-gray-200 rounded-lg border h-[52px] items-center">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "variations", label: "Variations" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex-1 p-2 font-medium text-center rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-white shadow-sm text-black"
                          : "text-gray-600"
                      }`}
                      onClick={() =>
                        setActiveTab(tab.id as "overview" | "variations")
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" ? (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex flex-col xl:flex-row xl:gap-6">
                          <div className="border p-4 xl:w-[70%]">
                            <h3 className="font-semibold mb-2">
                              Learning Objectives:
                            </h3>
                            <div className="flex">
                              <div className="w-1/2 pr-2">
                                <ul className="space-y-2 list-disc pl-5">
                                  {opening.objectives
                                    .slice(
                                      0,
                                      Math.ceil(opening.objectives.length / 2)
                                    )
                                    .map((objective, index) => (
                                      <li key={index} className="text-xs">
                                        {objective.objective}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                              <div className="w-1/2 pl-2">
                                <ul className="space-y-2 list-disc pl-5">
                                  {opening.objectives
                                    .slice(
                                      Math.ceil(opening.objectives.length / 2)
                                    )
                                    .map((objective, index) => (
                                      <li
                                        key={`additional-${index}`}
                                        className="text-xs"
                                      >
                                        {objective.objective}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="border p-4 mt-6 xl:mt-0 xl:w-[30%]">
                            <h3 className="font-semibold mb-2">
                              Prerequisites:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {opening.prerequisites.length > 0 ? (
                                opening.prerequisites.map((prereq) => (
                                  <span
                                    key={prereq.prerequisite}
                                    className="py-1 text-blue-base border px-1 border-blue-base text-sm cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/opening-theory/${prereq.prerequisite}`
                                      )
                                    }
                                  >
                                    {prereq.prerequisite
                                      .split("-")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </span>
                                ))
                              ) : (
                                <div className="text-blue-base border px-1 border-blue-base">
                                  No prerequisites
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="variations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {opening.variations &&
                          opening.variations.length > 0 ? (
                            opening.variations.map((variation, index) => (
                              <div
                                key={index}
                                className="border rounded-lg shadow-sm overflow-hidden"
                              >
                                <div className="p-4 pb-2">
                                  <h3 className="text-sm md:text-base font-bold">
                                    {variation.name}
                                  </h3>
                                  <p className="text-xs text-gray-600">
                                    {variation.description}
                                  </p>
                                </div>
                                <div className="p-4 pt-2">
                                  <ul className="space-y-2">
                                    {variation.keyIdeas.map(
                                      (keyIdea, pointIndex) => (
                                        <li
                                          key={pointIndex}
                                          className="flex items-start gap-2"
                                        >
                                          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-base text-white flex items-center justify-center text-xs">
                                            ✓
                                          </div>
                                          <span className="text-xs md:text-sm">
                                            {keyIdea.idea}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border">
                              <p>
                                No variations data available for this opening.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-sm mb-4">
                  Practice your Learnings to finish this Lesson:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opening.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 flex flex-col h-40"
                    >
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                        {resource.description}
                      </p>
                      <div className="flex justify-center items-center w-full mt-auto pt-4">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-base text-sm hover:underline block btn-tertiary w-full rounded-full"
                        >
                          <h1 className="text-center">
                            Visit {resource.platform.replace("_", ".")}
                          </h1>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  className={`w-full py-3 text-white rounded-full ${
                    lessonFinished ? "bg-green-500" : "bg-blue-base"
                  }`}
                  onClick={handleFinishLesson}
                  disabled={lessonFinished}
                >
                  <Check className="mr-2 h-5 w-5" />
                  {lessonFinished ? "Lesson Finished" : "Finish Lesson"}
                </Button>
              </div>
            </div>

            <div className="xl:col-span-3 2xl:col-span-3 xl:border xl:rounded-md">
              <div className="xl:hidden -mx-4 md:-mx-6 w-screen">
                <div className="border-t w-full"></div>
              </div>

              <div className="p-4">
                <div className="rounded-lg">
                  <div>
                    <h2 className="text-xl font-bold">Next Topics</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Discover other lessons now!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 mt-4">
                    {relatedOpenings.map((topic, index) => {
                      const topicSlug = getSlugFromId(topic.id);
                      const isTopicCompleted = isLessonCompleted(topicSlug);

                      return (
                        <div
                          key={index}
                          onClick={() => handleOpeningNavigation(topicSlug)}
                          className="cursor-pointer w-full xl:mx-auto"
                        >
                          <Card className="border rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
                            <div className="relative">
                              <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full p-2 md:p-3 xl:p-4">
                                  <Chessboard
                                    id={`next-topic-${topicSlug}`}
                                    position={getFenFromMoves(
                                      topic.variations?.[0]?.moves
                                    )}
                                    arePiecesDraggable={false}
                                    customDarkSquareStyle={{
                                      backgroundColor: "#5C9DFF",
                                    }}
                                    customLightSquareStyle={{
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-md">
                                Opening
                              </span>
                              <span className="absolute top-2 right-2 bg-white p-1 rounded-md">
                                {isTopicCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <BookOpen className="h-5 w-5 text-blue-base" />
                                )}
                              </span>
                            </div>

                            <div className="p-4 flex flex-col flex-grow space-y-3">
                              <span className="text-xs border border-blue-base text-blue-base inline-block px-2 py-1 w-fit">
                                {topic.difficulty}
                              </span>
                              <h3 className="font-medium text-gray-900 text-xs h-8 line-clamp-2">
                                {topic.title}
                              </h3>
                              <div
                                className={`w-full flex items-center justify-center space-x-2 rounded-full px-4 py-2 cursor-pointer mt-auto ${
                                  isTopicCompleted
                                    ? "btn-tertiary text-green-500 border border-green-500"
                                    : "btn-primary"
                                }`}
                              >
                                {isTopicCompleted ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs md:text-sm">
                                      Continue Learning
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="h-4 w-4" />
                                    <span className="text-xs md:text-sm">
                                      Start Learning
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="xl:hidden -mx-4 md:-mx-6 w-screen">
                <div className="border-b w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
