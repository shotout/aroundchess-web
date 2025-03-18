"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, BookOpen, Info, CheckCircle2 } from "lucide-react";
import {
  getOpeningBySlug,
  getRelatedOpenings,
  Opening,
} from "@/components/opening-theory/lib/openings";

export default function OpeningDetailPage({
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

  useEffect(() => {
    console.log("Params received:", params);
    console.log("Slug value:", params.slug);

    const currentOpening = getOpeningBySlug(params.slug);
    console.log("Opening found:", currentOpening);

    if (currentOpening) {
      setOpening(currentOpening);
      setRelatedOpenings(getRelatedOpenings(params.slug));
    } else {
      // Handle not found
      console.log("Opening not found for slug:", params.slug);
      // Uncomment this if you want to redirect on not found
      // router.push("/opening-theory");
    }
  }, [params.slug, router]);

  if (!opening) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/opening-theory")}
          className="flex items-center text-gray-700 hover:text-blue-600 mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back to openings</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900">{opening.title}</h1>
        <p className="text-gray-600 mt-2">{opening.description}</p>

        <div className="mt-2">
          <span
            className={`inline-block text-xs px-2 py-1 rounded 
            ${
              opening.difficulty === "Beginner"
                ? "bg-blue-100 text-blue-600"
                : opening.difficulty === "Intermediate"
                ? "bg-indigo-100 text-indigo-600"
                : opening.difficulty === "Advanced"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {opening.difficulty}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Chessboard */}
          <div className="border rounded-lg p-4 mb-6 bg-white">
            <div className="w-full max-w-md mx-auto">
              <Chessboard
                id={`board-${opening.slug}`}
                position={opening.fen}
                arePiecesDraggable={false}
                customDarkSquareStyle={{ backgroundColor: "#5C9DFF" }}
                customLightSquareStyle={{ backgroundColor: "#fff" }}
              />
            </div>
          </div>

          {/* Opening Analysis */}
          <div className="border rounded-lg p-6 mb-6 bg-white">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold">Opening Analysis</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Key strategic and tactical ideas in this opening
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Strategic Ideas:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {opening.strategicIdeas.map((idea, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2"></span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tactical Ideas:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {opening.tacticalIdeas.map((idea, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2"></span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border rounded-lg overflow-hidden mb-6 bg-white">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 px-4 font-medium text-center ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`flex-1 py-3 px-4 font-medium text-center ${
                  activeTab === "variations"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("variations")}
              >
                Variations
              </button>
            </div>

            <div className="p-6">
              {activeTab === "overview" ? (
                <div>
                  <h3 className="font-semibold mb-4">Learning Objectives:</h3>
                  <ul className="space-y-2 mb-6">
                    {opening.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-semibold mb-4">Prerequisites:</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
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
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">No prerequisites</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p>
                    Common variations and alternative move orders for this
                    opening will be displayed here.
                  </p>
                  {/* You can add variations content here */}
                </div>
              )}
            </div>
          </div>

          {/* Practice */}
          <div className="border rounded-lg p-6 mb-6 bg-white">
            <h3 className="font-semibold mb-4">
              Practice your Learnings to finish this Lesson:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {opening.externalResources.map((resource, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">{resource.title}</h4>
                  <p className="text-xs text-gray-600 mb-4">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Visit {resource.siteName}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Finish Lesson */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-white rounded-lg"
            onClick={() => router.push("/opening-theory")}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Finish Lesson
          </Button>
        </div>
      </div>
    </div>
  );
}
