import React from "react";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { isEndgameLesson, isMiddlegameLesson } from "../ChessLessonTypes";
interface OverviewTabProps {
  lesson: any;
  router: AppRouterInstance;
  basePath: string;
}

interface LearningObjective {
  objective: string;
}

interface Prerequisite {
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
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col xl:flex-row xl:gap-6">
        <div className="border p-4 xl:w-[70%]">
          <h3 className="font-semibold mb-2">Learning Objectives:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {lesson.overview?.learningObjectives &&
                lesson.overview.learningObjectives.length > 0 ? (
                  lesson.overview.learningObjectives
                    .slice(
                      0,
                      Math.ceil(lesson.overview.learningObjectives.length / 2)
                    )
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
                {lesson.overview?.learningObjectives &&
                lesson.overview.learningObjectives.length > 0
                  ? lesson.overview.learningObjectives
                      .slice(
                        Math.ceil(lesson.overview.learningObjectives.length / 2)
                      )
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

        <div className="border p-4 mt-6 xl:mt-0 xl:w-[30%]">
          <h3 className="font-semibold mb-2">Prerequisites:</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.overview?.prerequisites &&
            lesson.overview.prerequisites.length > 0 ? (
              lesson.overview.prerequisites.map((prereq: Prerequisite) => (
                <span
                  key={prereq.prerequisite}
                  className="py-1 text-blue-base border px-1 border-blue-base text-sm cursor-pointer"
                  onClick={() =>
                    router.push(`${basePath}/${prereq.prerequisite}`)
                  }
                >
                  {prereq.prerequisite
                    .split("-")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
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

      {/* Show strategic concepts for middlegame */}
      {isMiddlegameLesson(lesson) && lesson.overview?.strategicConcepts && (
        <div className="border p-4 mt-6">
          <h3 className="font-semibold mb-2">Strategic Concepts:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {lesson.overview.strategicConcepts &&
                lesson.overview.strategicConcepts.length > 0 ? (
                  lesson.overview.strategicConcepts
                    .slice(
                      0,
                      Math.ceil(lesson.overview.strategicConcepts.length / 2)
                    )
                    .map((concept: StrategicConcept, index: number) => (
                      <li key={index} className="text-xs">
                        {concept.concept}
                      </li>
                    ))
                ) : (
                  <li className="text-xs">Concepts coming soon</li>
                )}
              </ul>
            </div>
            <div className="w-1/2 pl-2">
              <ul className="space-y-2 list-disc pl-5">
                {lesson.overview.strategicConcepts &&
                lesson.overview.strategicConcepts.length > 0
                  ? lesson.overview.strategicConcepts
                      .slice(
                        Math.ceil(lesson.overview.strategicConcepts.length / 2)
                      )
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

      {/* Show theoretical knowledge for endgame */}
      {isEndgameLesson(lesson) && lesson.overview?.theoreticalKnowledge && (
        <div className="border p-4 mt-6">
          <h3 className="font-semibold mb-2">Theoretical Knowledge:</h3>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <ul className="space-y-2 list-disc pl-5">
                {lesson.overview.theoreticalKnowledge &&
                lesson.overview.theoreticalKnowledge.length > 0 ? (
                  lesson.overview.theoreticalKnowledge
                    .slice(
                      0,
                      Math.ceil(lesson.overview.theoreticalKnowledge.length / 2)
                    )
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
                {lesson.overview.theoreticalKnowledge &&
                lesson.overview.theoreticalKnowledge.length > 0
                  ? lesson.overview.theoreticalKnowledge
                      .slice(
                        Math.ceil(
                          lesson.overview.theoreticalKnowledge.length / 2
                        )
                      )
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
