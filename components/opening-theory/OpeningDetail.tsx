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
import {
  getOpeningBySlug,
  getRelatedOpenings,
  Opening,
  openings,
} from "@/components/opening-theory/lib/openings";
import Responsive from "../game-history/Responsive";
import { motion, AnimatePresence } from "framer-motion";

export default function OpeningDetailWithNextTopics({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [opening, setOpening] = useState<Opening | null>(null);
  const [relatedOpenings, setRelatedOpenings] = useState<Opening[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "variations">(
    "overview"
  );

  // Use the getRelatedOpenings function to dynamically get next topics
  const [nextTopics, setNextTopics] = useState<Opening[]>([]);

  useEffect(() => {
    // When the current opening is loaded, also load related openings
    if (opening) {
      // Get related openings (limited to 3)
      const related = getRelatedOpenings(opening.slug, 3);
      setNextTopics(related);

      // If we don't have enough related openings, add some popular ones
      if (related.length < 3) {
        const popularOpenings = openings
          .filter(
            (o) =>
              o.slug !== opening.slug && !related.some((r) => r.slug === o.slug)
          )
          .slice(0, 3 - related.length);

        setNextTopics([...related, ...popularOpenings]);
      }
    }
  }, [opening]);

  useEffect(() => {
    const currentOpening = getOpeningBySlug(params.slug);

    if (currentOpening) {
      setOpening(currentOpening);
      setRelatedOpenings(getRelatedOpenings(params.slug));
    } else {
      console.log("Opening not found for slug:", params.slug);
    }
  }, [params, params.slug, router]);

  // Function to handle smoother navigation to another opening
  const handleOpeningNavigation = (slug: string) => {
    // Use framer-motion animation before navigation
    const navigateToOpening = () => {
      router.push(`/opening-theory/${slug}`);
    };

    // Delay navigation slightly to allow for animation
    setTimeout(navigateToOpening, 200);
  };

  if (!opening) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Responsive />
      <motion.div
        key={opening.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col"
      >
        {/* Complete fix for full-width border */}
        <div className="mb-4">
          {/* Content with padding */}
          <div className="px-4 pt-6 pb-3 md:px-6 md:pt-6 md:pb-4 lg:pt-28 xl:pt-6">
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

              <div className="hidden">
                {/* This is a placeholder to maintain layout but not display */}
              </div>
            </div>

            {/* Description moved outside the arrow/title container */}
            <p className="text-gray-600 text-xs text-justify md:text-sm md:text-left md:mt-1 ml-8">
              {opening.description}
            </p>
          </div>
          {/* Border outside of padded container */}
          <div className="border-b xl:border-b-0"></div>
        </div>
        <div className="px-4 md:px-6">
          {/* Modified grid layout with new breakpoints */}
          <div className="grid grid-cols-1 xl:grid-cols-5 2xl:grid-cols-10 gap-6 ">
            {/* Main content - full width on mobile/tablet, 3/5 on xl screens, 7/10 on 2xl screens */}
            <div className="xl:col-span-3 2xl:col-span-7 flex flex-col gap-6 xl:border xl:p-4 xl:rounded-md xl:mb-6">
              {/* Chessboard */}
              <div className="rounded-lg p-2 bg-white">
                <div className="w-full max-w-md mx-auto">
                  <Chessboard
                    id={`board-${opening.slug}`}
                    position={opening.fen}
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
                  <Clock className="w-3 h-3" />
                  <h1>3 hours learning</h1>
                </div>
              </div>

              {/* Opening Analysis */}
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
                        {opening.strategicIdeas.map((idea, index) => (
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
                        {opening.tacticalIdeas.map((idea, index) => (
                          <li key={index} className="text-xs">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tabs */}
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
                          : "text-gray-600 hover:bg-gray-100"
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
                        <div className="border p-4">
                          <h3 className="font-semibold mb-2">
                            Learning Objectives:
                          </h3>
                          <div className="flex">
                            <div className="w-1/2 pr-2">
                              <ul className="space-y-2 list-disc pl-5">
                                {opening.learningObjectives
                                  .slice(0, 3)
                                  .map((objective, index) => (
                                    <li key={index} className="text-xs">
                                      {objective}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                            <div className="w-1/2 pl-2">
                              <ul className="space-y-2 list-disc pl-5">
                                {opening.learningObjectives
                                  .slice(3)
                                  .map((objective, index) => (
                                    <li
                                      key={`additional-${index}`}
                                      className="text-xs"
                                    >
                                      {objective}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="border p-4 mt-6">
                          <h3 className="font-semibold mb-2">Prerequisites:</h3>
                          <div className="flex flex-wrap gap-2">
                            {opening.prerequisites.length > 0 ? (
                              opening.prerequisites.map((prereq) => (
                                <span
                                  key={prereq}
                                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                                  onClick={() =>
                                    router.push(`/opening-theory/${prereq}`)
                                  }
                                >
                                  {prereq
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
                      </motion.div>
                    ) : (
                      <motion.div
                        key="variations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-600 p-4 border"
                      >
                        <p>
                          Common variations and alternative move orders for this
                          opening will be displayed here.
                        </p>
                        {/* You can add variations content here */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Practice */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-sm mb-4">
                  Practice your Learnings to finish this Lesson:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opening.externalResources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-600 mt-2">
                        {resource.description}
                      </p>
                      <div className="flex justify-center items-center w-full mt-4">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-base text-sm hover:underline block btn-tertiary w-full rounded-full"
                        >
                          <h1 className="text-center">
                            Visit {resource.siteName}
                          </h1>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finish Lesson Button and Border */}
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full bg-blue-base py-3 text-white rounded-full"
                  onClick={() => router.push("/opening-theory")}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Finish Lesson
                </Button>
              </div>
            </div>

            {/* Next Topics Section - Bottom on all sizes until xl breakpoint, 
                Right side (2/5 width) on xl screens, 3/10 width on 2xl screens */}
            <div className="xl:col-span-2 2xl:col-span-3 xl:border xl:p-4 xl:rounded-md">
              {/* Full-width top border wrapper for mobile and tablet */}
              <div className="xl:hidden -mx-4 md:-mx-6 w-screen">
                <div className="border-t w-full"></div>
              </div>

              <div className="pt-4 xl:pt-0 px-4 md:px-6 xl:px-0">
                <div className="rounded-lg p-4 bg-white xl:sticky xl:top-4">
                  <div>
                    <h2 className="text-xl font-bold">Next Topics</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Discover other lessons now!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 mt-4">
                    {nextTopics.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() => handleOpeningNavigation(topic.slug)}
                        className="cursor-pointer"
                      >
                        <Card className="border rounded-lg overflow-hidden shadow-sm">
                          {/* Chess board visualization with tag */}
                          <div className="relative">
                            {/* For mobile/tablet */}
                            <div className="h-40 xl:h-[332px] bg-white flex items-center justify-center">
                              <div className="w-36 h-36 xl:h-full xl:w-full xl:p-6">
                                <Chessboard
                                  id={`next-topic-${topic.slug}`}
                                  position={topic.fen}
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
                              <BookOpen className="h-5 w-5 text-green-500" />
                            </span>
                          </div>

                          {/* Topic info */}
                          <div className="p-2 flex flex-col justify-between h-28">
                            <div className="flex flex-col gap-2">
                              <span className="text-xs border border-blue-base text-blue-base inline-block px-2 py-1 w-fit">
                                {topic.difficulty || opening.difficulty}
                              </span>
                              <h3 className="font-medium text-gray-900 text-xs md:text-sm lg:text-sm line-clamp-2">
                                {topic.title || opening.title}
                              </h3>
                            </div>
                            <div className="w-full btn-tertiary text-blue-base flex items-center justify-center gap-2 rounded-full h-10 px-4 py-2 cursor-pointer mt-auto">
                              <BookOpen className="h-4 w-4" />
                              <span className="text-xs md:text-sm">
                                Start Learning
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full-width bottom border wrapper for mobile and tablet */}
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
