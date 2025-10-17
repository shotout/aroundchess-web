"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import tutorials from "../tutorials/steps";
import MinimalTour, { MinimalStep } from "./MinimalTour";

type TutorialContextType = {
  startTutorial: (id?: string) => void;
  stopTutorial: () => void;
  isRunning: boolean;
  currentTourId?: string;
  stepFocused: number;
  setStepFocused: (step: any) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
);

export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used within TutorialProvider");
  return ctx;
};

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<MinimalStep[]>([]);
  const [stepFocused, setStepFocused] = useState<number>(0);
  const [currentTourId, setCurrentTourId] = useState<string | undefined>(
    undefined
  );

  const [JoyrideComponent, setJoyrideComponent] = useState<any>(null);

  // Load steps for current route (or for a requested tour id)
  useEffect(() => {
    const tour = tutorials[pathname] as MinimalStep[] | undefined;
    if (tour && tour.length > 0) {
      setSteps(tour);
    } else {
      setSteps([]);
    }
  }, [pathname]);

  // Example: start tutorial if ?tutorial=true in url
  useEffect(() => {
    try {
      if (search?.get("tutorial") === "true") {
        setIsRunning(true);
      }
    } catch (e) {
      // noop
    }
  }, [search]);

  const startTutorial = useCallback((id?: string) => {
    setCurrentTourId(id);
    setIsRunning(true);
  }, []);

  const stopTutorial = useCallback(() => {
    setIsRunning(false);
    setCurrentTourId(undefined);
  }, []);

  const handleJoyrideCallback = () => {
    setIsRunning(false);
  };

  const value = useMemo(
    () => ({
      startTutorial,
      stopTutorial,
      isRunning,
      currentTourId,
      stepFocused,
      setStepFocused,
    }),
    [
      startTutorial,
      stopTutorial,
      isRunning,
      currentTourId,
      stepFocused,
      setStepFocused,
    ]
  );

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {/* Render a minimal in-house tour to avoid react-joyride/react-dom issues */}
      <MinimalTour
        steps={steps as MinimalStep[]}
        run={isRunning}
        onClose={() => setIsRunning(false)}
      />
    </TutorialContext.Provider>
  );
}

export default TutorialProvider;
