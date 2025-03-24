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

import DotSpinner from "../game-history/Spinner";
import { useMiddlegameClearStore } from "@/components/middlegame-strategy/store/MiddlegameStore";
import {
  useMiddlegameStore,
  getFenFromMoves,
  getIdFromSlug,
  getSlugFromId,
} from "./lib/middlegameMapper2"; // Fixed import path

export default function MiddlegameDetailWithNextTopics({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "patterns">(
    "overview"
  );

  const { completeLesson, isLessonCompleted } = useMiddlegameClearStore();
  const {
    allMiddlegames,
    middlegameDetails,
    isLoading,
    error,
    initialized,
    fetchAllMiddlegames,
    fetchMiddlegameDetails,
  } = useMiddlegameStore();

  const [lessonFinished, setLessonFinished] = useState(false);

  const middlegameId = getIdFromSlug(params.slug);
  const middlegame = middlegameDetails[middlegameId];
  const relatedMiddlegames =
    allMiddlegames && allMiddlegames.length
      ? allMiddlegames.filter((m) => m.id !== middlegameId).slice(0, 3)
      : [];

  useEffect(() => {
    const loadData = async () => {
      if (!initialized) {
        await fetchAllMiddlegames();
      }
      await fetchMiddlegameDetails(middlegameId);
    };

    loadData();
  }, [middlegameId, fetchMiddlegameDetails, initialized, fetchAllMiddlegames]);

  useEffect(() => {
    if (middlegame) {
      setLessonFinished(isLessonCompleted(params.slug));
    }
  }, [middlegame, isLessonCompleted, params.slug]);

  const handleMiddlegameNavigation = (slug: string) => {
    const navigateToMiddlegame = () => {
      router.push(`/middlegame-strategy/${slug}`);
    };
    setTimeout(navigateToMiddlegame, 200);
  };

  const handleFinishLesson = () => {
    if (middlegame) {
      completeLesson(params.slug);
      setLessonFinished(true);
    }
  };

  if (isLoading || !middlegame) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Error Loading Middlegame</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/middlegame-strategy")}>
          Back to Middlegame Strategy
        </Button>
      </div>
    );
  }

  // Ensure properties exist with fallbacks
  const tacticalMotifs =
    middlegame.tacticalMotifs && middlegame.tacticalMotifs.length > 0
      ? middlegame.tacticalMotifs.map((tm) => tm.motif)
      : ["Tactical analysis coming soon"];

  const commonThemes =
    middlegame.commonThemes && middlegame.commonThemes.length > 0
      ? middlegame.commonThemes.map((ct) => ct.theme)
      : ["Common themes coming soon"];

  const strategicConcepts =
    middlegame.strategicConcepts && middlegame.strategicConcepts.length > 0
      ? middlegame.strategicConcepts.map((sc) => sc.concept)
      : ["Strategic concepts coming soon"];

  // Ensure objectives, prerequisites, resources, and patterns have defaults
  const objectives = middlegame.objectives || [];
  const prerequisites = middlegame.prerequisites || [];
  const resources = middlegame.resources || [];
  const patterns = middlegame.patterns || [];

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
                  onClick={() => router.push("/middlegame-strategy")}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-6 w-6 mr-2 font-bold" />
                </button>
                <h1 className="font-bold text-lg">{middlegame.title}</h1>
              </div>

              <div className="hidden"></div>
            </div>

            <p className="text-gray-600 text-xs text-justify md:text-sm md:text-left md:mt-1 ml-8">
              {middlegame.description}
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
                    position={getFenFromMoves(middlegame.moves)}
                    customDarkSquareStyle={{ backgroundColor: "#5C9DFF" }}
                    customLightSquareStyle={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-x-3">
                <span className="inline-block text-xs px-2 py-1 rounded-[2px] border border-blue-base text-blue-base">
                  {middlegame.difficulty}
                </span>
                <div className="flex justify-center items-center px-2 py-1 text-xs rounded-[2px] border border-blue-base text-blue-base">
                  <Clock className="w-3 h-3 mr-1" />
                  <h1>{middlegame.estimatedTime || "15 min"} learning</h1>
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
                    <h2 className="text-sm font-semibold">
                      Middlegame Analysis
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Key strategic and tactical ideas in this middlegame
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Tactical Motifs:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-4">
                        {tacticalMotifs.map((motif, index) => (
                          <li key={index} className="text-xs">
                            {motif}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Common Themes:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-4">
                        {commonThemes.map((theme, index) => (
                          <li key={index} className="text-xs">
                            {theme}
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
                    { id: "patterns", label: "Patterns" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex-1 p-2 font-medium text-center rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-white shadow-sm text-black"
                          : "text-gray-600"
                      }`}
                      onClick={() =>
                        setActiveTab(tab.id as "overview" | "patterns")
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
                                  {objectives
                                    .slice(0, Math.ceil(objectives.length / 2))
                                    .map((objective, index) => (
                                      <li key={index} className="text-xs">
                                        {objective.objective}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                              <div className="w-1/2 pl-2">
                                <ul className="space-y-2 list-disc pl-5">
                                  {objectives
                                    .slice(Math.ceil(objectives.length / 2))
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
                              {prerequisites.length > 0 ? (
                                prerequisites.map((prereq) => (
                                  <span
                                    key={prereq.prerequisite}
                                    className="py-1 text-blue-base border px-1 border-blue-base text-sm cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/middlegame-strategy/${prereq.prerequisite}`
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

                        {/* Strategic Concepts Section */}
                        <div className="border p-4 mt-6">
                          <h3 className="font-semibold mb-2">
                            Strategic Concepts:
                          </h3>
                          <div className="flex">
                            <div className="w-1/2 pr-2">
                              <ul className="space-y-2 list-disc pl-5">
                                {strategicConcepts
                                  .slice(
                                    0,
                                    Math.ceil(strategicConcepts.length / 2)
                                  )
                                  .map((concept, index) => (
                                    <li key={index} className="text-xs">
                                      {concept}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                            <div className="w-1/2 pl-2">
                              <ul className="space-y-2 list-disc pl-5">
                                {strategicConcepts
                                  .slice(
                                    Math.ceil(strategicConcepts.length / 2)
                                  )
                                  .map((concept, index) => (
                                    <li
                                      key={`strategic-${index}`}
                                      className="text-xs"
                                    >
                                      {concept}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="patterns"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {patterns.length > 0 ? (
                            patterns.map((pattern, index) => (
                              <div
                                key={index}
                                className="border rounded-lg shadow-sm overflow-hidden"
                              >
                                <div className="p-4">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-base text-white flex items-center justify-center text-xs">
                                      ✓
                                    </div>
                                    <span className="text-xs md:text-sm">
                                      {pattern.pattern}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-1 md:col-span-3 text-gray-600 p-4 border">
                              <p>
                                No patterns data available for this middlegame.
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
                  {resources.map((resource, index) => (
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
                            Visit{" "}
                            {resource.platform
                              ? resource.platform.replace("_", ".")
                              : "resource"}
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
                    {relatedMiddlegames.map((topic, index) => {
                      const topicSlug = getSlugFromId(topic.id);
                      const isTopicCompleted = isLessonCompleted(topicSlug);

                      return (
                        <div
                          key={index}
                          onClick={() => handleMiddlegameNavigation(topicSlug)}
                          className="cursor-pointer w-full xl:mx-auto"
                        >
                          <Card className="border rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
                            <div className="relative">
                              <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full p-2 md:p-3 xl:p-4">
                                  <Chessboard
                                    id={`next-topic-${topicSlug}`}
                                    position={getFenFromMoves(topic.moves)}
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
                                Strategy
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
