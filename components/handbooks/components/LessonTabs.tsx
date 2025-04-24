import { motion, AnimatePresence } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChessLesson } from "../ChessLessonTypes";
import OverviewTab from "./OverviewTabs";
import VariationsTab from "./VariationTabs";
import PatternsTab from "./PatternTabs";

interface LessonTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabOptions: Array<{
    id: string;
    label: string | React.ReactNode;
  }>;
  lesson: ChessLesson;
  router: AppRouterInstance;
  basePath: string;
}

const LessonTabs: React.FC<LessonTabsProps> = ({
  activeTab,
  setActiveTab,
  tabOptions,
  lesson,
  router,
  basePath,
}) => {
  // Check if the variations property exists on the lesson
  const hasVariations =
    "variations" in lesson && Array.isArray(lesson.variations);

  return (
    <div className="overflow-hidden flex flex-col gap-6">
      <div className="p-2 flex bg-[#F9FAFC] rounded-lg border h-auto items-center">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 p-[10px] font-medium text-center rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white shadow-md text-black font-bold"
                : "text-gray-600 font-normal hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab.id as string)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 bg-white">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <OverviewTab
              key="overview"
              lesson={lesson}
              router={router}
              basePath={basePath}
            />
          ) : activeTab === "variations" && hasVariations ? (
            <VariationsTab
              key="variations"
              variations={(lesson as any).variations}
            />
          ) : activeTab === "patterns" ? (
            <PatternsTab key="patterns" lesson={lesson} />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="col-span-1 md:col-span-3 text-gray-600 p-4 border rounded-lg"
            >
              <p>No data available for this tab.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonTabs;
