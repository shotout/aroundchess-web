"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import DotSpinner from "../game-history/Spinner";
import {
  ChessLesson,
  ChessLessonState,
  LessonType,
  getLessonBasePath,
  getLessonTabOptions,
} from "./ChessLessonTypes";
import {
  getFenFromMoves,
  getIdFromSlug,
  getSlugFromId,
} from "./ChessLessonUtils";
import LessonHeader from "./components/LessonHeader";
import ChessboardDisplay from "./components/ChessboardDisplay";
import FinishedBanner from "./components/FinishedBanner";
import LessonInfoSection from "./components/LessonInfoSection";
import LessonTabs from "./components/LessonTabs";
import PracticeSection from "./components/PracticeSection";
import RelatedLessons from "./components/RelatedLesson";

interface ChessLessonDetailProps<T extends ChessLesson> {
  params: { slug: string };
  lessonType: LessonType;
  lessonStore: ChessLessonState<T> & {
    readStatusMap?: Record<string, boolean>;
    checkReadStatus?: (id: string, sessionId?: string) => Promise<boolean>;
    markLessonAsRead?: (id: string, sessionId?: string) => Promise<boolean>;
    set?: (
      updater: (
        state: any
      ) => Partial<
        ChessLessonState<T> & { readStatusMap?: Record<string, boolean> }
      >
    ) => void;
  };
}

export default function ChessLessonDetail<T extends ChessLesson>({
  params,
  lessonType,
  lessonStore,
}: ChessLessonDetailProps<T>) {
  const router = useRouter();
  const basePath = getLessonBasePath(lessonType);
  const tabOptions: any = getLessonTabOptions(lessonType);
  const { sessionId } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(tabOptions[0].id);
  const [lessonFinished, setLessonFinished] = useState<boolean>(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState<boolean>(false);

  const {
    allLessons,
    lessonDetails,
    isLoading,
    initialized,
    fetchAllLessons,
    fetchLessonDetails,
    readStatusMap,
    checkReadStatus,
  } = lessonStore;

  const lessonId: string = getIdFromSlug(params.slug, lessonType);
  const lesson: T | undefined = lessonDetails[lessonId];
  const relatedLessons: T[] = allLessons
    .filter((l: T) => l.id !== lessonId)
    .slice(0, 3);

  const isBookRead: boolean = readStatusMap ? readStatusMap[lessonId] : false;

  useEffect(() => {
    if (isBookRead) {
      setLessonFinished(true);
    }
  }, [isBookRead]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        if (!initialized) {
          await fetchAllLessons(sessionId || undefined);
        }

        if (!lesson) {
          await fetchLessonDetails(lessonId, sessionId || undefined);
        }

        if (checkReadStatus && sessionId) {
          const isRead = await checkReadStatus(lessonId, sessionId);
          if (isRead) {
            setLessonFinished(true);
          }
        }
      } catch (error) {
        console.error("Error loading lesson details:", error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, initialized, sessionId]);

  const handleLessonNavigation = (slug: string): void => {
    const navigateToLesson = (): void => {
      router.push(`${basePath}/${slug}`);
    };
    setTimeout(navigateToLesson, 200);
  };

  const markLessonAsRead = async (
    id: string,
    sessionId?: string
  ): Promise<boolean> => {
    if (!sessionId) {
      return false;
    }

    try {
      const apiBaseUrl = process.env.BASE_URL;
      const apiUrl = `${apiBaseUrl}/handbooks/read/`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        await response.json();

        if (lessonStore && typeof lessonStore.set === "function") {
          lessonStore.set((state: any) => ({
            readStatusMap: {
              ...state.readStatusMap,
              [id]: true,
            },
          }));
        }

        return true;
      } else {
        const errorData = await response.json();
        console.error("Failed to mark lesson as read:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error marking lesson as read:", error);
      return false;
    }
  };

  const handleFinishLesson = async (): Promise<void> => {
    if (lesson && !lessonFinished && sessionId) {
      setIsMarkingAsRead(true);
      try {
        if (lessonStore.markLessonAsRead) {
          const success = await lessonStore.markLessonAsRead(
            lessonId,
            sessionId
          );
          if (success) {
            setLessonFinished(true);
          }
        } else {
          const success = await markLessonAsRead(lessonId, sessionId);
          if (success) {
            setLessonFinished(true);
          }
        }
      } catch (error) {
        console.error("Error finishing lesson:", error);
      } finally {
        setIsMarkingAsRead(false);
      }
    } else if (!sessionId) {
      console.warn("Cannot mark lesson as read: User not authenticated");
    }
  };

  if (isLoading || !lesson) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <DotSpinner />
      </div>
    );
  }

  if (!lesson.title || typeof lesson.title !== "string") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Error: Invalid lesson data</h2>
        <Button onClick={() => router.push(basePath)}>
          Back to {lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={params.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col"
      >
        <LessonHeader
          title={lesson.title}
          description={lesson.description}
          basePath={basePath}
          router={router}
        />

        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-10 2xl:grid-cols-10 gap-6">
            <div className="xl:col-span-7 2xl:col-span-7 flex flex-col gap-6 xl:border xl:p-4 xl:rounded-md xl:mb-6">
              <ChessboardDisplay
                slug={params.slug}
                fenPosition={getFenFromMoves(lesson.moves)}
              />

              <div className="w-full flex justify-center items-center gap-x-3">
                <span className="inline-block text-xs px-2 py-1 rounded-[2px] border border-blue-base text-blue-base">
                  {lesson.difficulty || "Not specified"}
                </span>
              </div>

              {lessonFinished && <FinishedBanner />}

              <LessonInfoSection lesson={lesson} lessonType={lessonType} />

              <LessonTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabOptions={tabOptions}
                lesson={lesson}
                router={router}
                basePath={basePath}
              />

              <PracticeSection resources={lesson.resources} />

              <div className="flex flex-col gap-4">
                <Button
                  className={`w-full py-3 text-white rounded-full ${
                    lessonFinished ? "bg-green-500" : "bg-blue-base"
                  }`}
                  onClick={handleFinishLesson}
                  disabled={lessonFinished || isMarkingAsRead}
                >
                  <Check className="mr-2 h-5 w-5" />
                  {lessonFinished
                    ? "Lesson Finished"
                    : isMarkingAsRead
                    ? "Saving..."
                    : "Finish Lesson"}
                </Button>
              </div>
            </div>

            <RelatedLessons
              relatedLessons={relatedLessons}
              lessonType={lessonType}
              handleLessonNavigation={handleLessonNavigation}
              getFenFromMoves={getFenFromMoves}
              getSlugFromId={getSlugFromId}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
