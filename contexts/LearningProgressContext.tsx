"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Section = {
  id: string;
  completed: boolean;
};

type LearningProgressContextType = {
  sections: Section[];
  progress: number;
  toggleSectionCompletion: (sectionId: string) => void;
  isCompleted: (sectionId: string) => boolean;
  completeLesson: (sectionId: string) => void;
};

const defaultSections: Section[] = [
  { id: "rules", completed: false },
  { id: "board-setup", completed: false },
  { id: "piece-values", completed: false },
  { id: "checkmate", completed: false },
  { id: "pawn-structure", completed: false },
  { id: "game-phases", completed: false },
  { id: "terminology", completed: false },
  { id: "notation", completed: false },
];

const LearningProgressContext = createContext<
  LearningProgressContextType | undefined
>(undefined);

export function LearningProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage after initial render
  useEffect(() => {
    const savedSections = localStorage.getItem("chessFundamentalsProgress");
    const savedProgress = localStorage.getItem(
      "chessFundamentalsOverallProgress"
    );

    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10));
    }
    setIsInitialized(true);
  }, []);

  // Update localStorage when sections change, but only after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const completedCount = sections.filter(
      (section) => section.completed
    ).length;
    const newProgress = Math.round((completedCount / sections.length) * 100);
    setProgress(newProgress);

    localStorage.setItem("chessFundamentalsProgress", JSON.stringify(sections));
    localStorage.setItem(
      "chessFundamentalsOverallProgress",
      newProgress.toString()
    );
  }, [sections, isInitialized]);

  const toggleSectionCompletion = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, completed: !section.completed }
          : section
      )
    );
  };

  const isCompleted = (sectionId: string) => {
    return (
      sections.find((section) => section.id === sectionId)?.completed || false
    );
  };

  const completeLesson = (sectionId: string) => {
    toggleSectionCompletion(sectionId);
  };

  return (
    <LearningProgressContext.Provider
      value={{
        sections,
        progress,
        toggleSectionCompletion,
        isCompleted,
        completeLesson,
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);
  if (context === undefined) {
    throw new Error(
      "useLearningProgress must be used within a LearningProgressProvider"
    );
  }
  return context;
}
