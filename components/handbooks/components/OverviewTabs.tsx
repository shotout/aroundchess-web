import React from "react";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface OverviewTabProps {
  lesson: any;
  router: AppRouterInstance;
  basePath: string;
}

interface LearningObjective {
  objective: string;
}

interface Prerequisite {
  id: number;
  handbookId: string;
  prerequisite: string;
}

interface StrategicConcept {
  concept: string;
}

interface TheoreticalKnowledge {
  knowledge: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  lesson,
  router,
  basePath,
}) => {
  const overview = lesson?.overview || {};
  const learningObjectives = overview?.learningObjectives || [];
  const prerequisites = overview?.prerequisites || [];
  const strategicConcepts = overview?.strategicConcepts || [];
  const theoreticalKnowledge = overview?.theoreticalKnowledge || [];

  const hasMiddlegameData = strategicConcepts.length > 0;
  const hasEndgameData = theoreticalKnowledge.length > 0;

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col xl:flex-row xl:gap-6">
        {/* Learning Objectives Section - For all lesson types */}
        <div className="border p-4 xl:w-[70%]">
          <h3 className="font-semibold mb-2">Learning Objectives:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {learningObjectives.length > 0 ? (
                  learningObjectives
                    .slice(0, Math.ceil(learningObjectives.length / 2))
                    .map((objective: LearningObjective, index: number) => (
                      <li key={index} className="text-xs">
                        {objective.objective}
                      </li>
                    ))
                ) : (
                  <li className="text-xs">Learning objectives coming soon</li>
                )}
              </ul>
            </div>
            <div className="w-1/2 pl-2">
              <ul className="space-y-2 list-disc pl-5">
                {learningObjectives.length > 0
                  ? learningObjectives
                      .slice(Math.ceil(learningObjectives.length / 2))
                      .map((objective: LearningObjective, index: number) => (
                        <li key={`additional-${index}`} className="text-xs">
                          {objective.objective}
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </div>

        {/* Prerequisites Section - For all lesson types */}
        <div className="border p-4 mt-6 xl:mt-0 xl:w-[30%]">
          <h3 className="font-semibold mb-2">Prerequisites:</h3>
          <div className="flex flex-wrap gap-2">
            {prerequisites.length > 0 ? (
              prerequisites.map((prereq: Prerequisite) => {
                return (
                  <span
                    key={prereq.prerequisite}
                    className="py-1 text-blue-base border px-1 border-blue-base text-sm"
                  >
                    {prereq.prerequisite
                      .split("-")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                );
              })
            ) : (
              <div className="text-blue-base border px-1 border-blue-base">
                No prerequisites
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Concepts Section - For middlegame lessons */}
      {hasMiddlegameData && (
        <div className="border p-4 mt-6">
          <h3 className="font-semibold mb-2">Strategic Concepts:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {strategicConcepts.length > 0 ? (
                  strategicConcepts
                    .slice(0, Math.ceil(strategicConcepts.length / 2))
                    .map((concept: StrategicConcept, index: number) => (
                      <li key={index} className="text-xs">
                        {concept.concept}
                      </li>
                    ))
                ) : (
                  <li className="text-xs">Strategic concepts coming soon</li>
                )}
              </ul>
            </div>
            <div className="w-1/2 pl-2">
              <ul className="space-y-2 list-disc pl-5">
                {strategicConcepts.length > 0
                  ? strategicConcepts
                      .slice(Math.ceil(strategicConcepts.length / 2))
                      .map((concept: StrategicConcept, index: number) => (
                        <li key={`concept-${index}`} className="text-xs">
                          {concept.concept}
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Knowledge Section - For endgame lessons */}
      {hasEndgameData && (
        <div className="border p-4 mt-6">
          <h3 className="font-semibold mb-2">Theoretical Knowledge:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {theoreticalKnowledge.length > 0 ? (
                  theoreticalKnowledge
                    .slice(0, Math.ceil(theoreticalKnowledge.length / 2))
                    .map((knowledge: TheoreticalKnowledge, index: number) => (
                      <li key={index} className="text-xs">
                        {knowledge.knowledge}
                      </li>
                    ))
                ) : (
                  <li className="text-xs">Theoretical knowledge coming soon</li>
                )}
              </ul>
            </div>
            <div className="w-1/2 pl-2">
              <ul className="space-y-2 list-disc pl-5">
                {theoreticalKnowledge.length > 0
                  ? theoreticalKnowledge
                      .slice(Math.ceil(theoreticalKnowledge.length / 2))
                      .map((knowledge: TheoreticalKnowledge, index: number) => (
                        <li key={`knowledge-${index}`} className="text-xs">
                          {knowledge.knowledge}
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OverviewTab;
