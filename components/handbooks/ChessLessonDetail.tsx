"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
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
import { useProfileStore } from "@/app/store/profile";
import { Chess } from "chess.js";

interface NextTopicItem {
  id: string;
  title: string;
  difficulty: string;
  eloRange: string[];
  moves: string;
}

interface ChessLessonDetailProps<T extends ChessLesson> {
  params: { slug: string };
  lessonType: LessonType;
  lessonStore: ChessLessonState<T> & {
    readStatusMap?: Record<string, boolean>;
    checkReadStatus?: (id: string, sessionId?: string) => Promise<boolean>;
    markLessonAsRead?: (id: string, sessionId?: string) => Promise<boolean>;
    markLessonAsUnread?: (id: string, sessionId?: string) => Promise<boolean>;
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
  const tabOptions = getLessonTabOptions(lessonType);
  const { sessionId } = useProfileStore();

  const [activeTab, setActiveTab] = useState<string>(tabOptions[0].id);
  const [lessonFinished, setLessonFinished] = useState<boolean>(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState<boolean>(false);
  const [isMarkingAsUnread, setIsMarkingAsUnread] = useState<boolean>(false);

  const game = useMemo(() => new Chess(), []);
  const [position, setPosition] = useState<string>("");
  const [initialFen, setInitialFen] = useState<string>("");
  const [boardKey, setBoardKey] = useState<string>("initial");

  const sections = ["Online Materials", "Video Explanations", "Puzzles"];
  const [sectionName, setSectionName] = useState<string>(sections[0]);

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

  const transformNextTopicToLesson = (nextTopic: NextTopicItem): T => {
    return {
      id: nextTopic.id,
      title: nextTopic.title,
      difficulty: nextTopic.difficulty,
      eloRange: nextTopic.eloRange,
      moves: nextTopic.moves,
      description: "",
      estimatedTime: "",
      notes: "",
      relatedTopics: [],
      strategicIdeas: [],
      tacticalIdeas: [],
      resources: [],
      forColor: "both",
    } as unknown as T;
  };

  const relatedLessons: T[] =
    (lesson as any)?.nextTopic && (lesson as any).nextTopic.length > 0
      ? (lesson as any).nextTopic.map(transformNextTopicToLesson)
      : allLessons.length > 0
      ? allLessons.filter((l: T) => l.id !== lessonId).slice(0, 3)
      : [];

  useEffect(() => {
    if (lesson && lesson.moves) {
      const fenPosition = getFenFromMoves(lesson.moves);
      try {
        game.load(fenPosition);
        setPosition(fenPosition);
        setInitialFen(fenPosition);
      } catch (e) {
        console.error("Invalid FEN position:", e);
      }
    }
  }, [lesson, game]);

  useEffect(() => {
    if (readStatusMap && readStatusMap.hasOwnProperty(lessonId)) {
      setLessonFinished(readStatusMap[lessonId]);
    }
  }, [readStatusMap, lessonId]);

  useEffect(() => {
    if (lesson && lesson.readStatus !== undefined) {
      setLessonFinished(lesson.readStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.readStatus]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        if (!lesson) {
          await fetchLessonDetails(lessonId, sessionId || undefined);
        }

        if (!initialized) {
          await fetchAllLessons(sessionId || undefined);
        }
      } catch (error) {
        console.error("Error loading lesson data:", error);
      }
    };

    loadData();
  }, [
    lessonId,
    lesson,
    initialized,
    sessionId,
    fetchLessonDetails,
    fetchAllLessons,
  ]);

  useEffect(() => {
    const checkReadStatusAsync = async () => {
      if (!lesson || !checkReadStatus || !sessionId) {
        return;
      }

      if (readStatusMap && readStatusMap.hasOwnProperty(lessonId)) {
        return;
      }

      if (lesson.readStatus !== undefined) {
        return;
      }

      try {
        const isRead = await checkReadStatus(lessonId, sessionId);
        setLessonFinished(isRead);
      } catch (error) {
        console.error("Error checking read status:", error);
      }
    };

    checkReadStatusAsync();
  }, [checkReadStatus, lesson, lessonId, sessionId, readStatusMap]);

  const handleLessonNavigation = (slug: string): void => {
    const navigateToLesson = (): void => {
      router.push(`${basePath}/${slug}`);
    };
    setTimeout(navigateToLesson, 200);
  };

  const handleResetPosition = (): void => {
    if (initialFen) {
      try {
        game.load(initialFen);
        setPosition(initialFen);
        setBoardKey(`reset-${Date.now()}`);
      } catch (e) {
        console.error("Error resetting position:", e);
      }
    }
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
        return false;
      }
    } catch (error) {
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
        console.error("Error marking lesson as read:", error);
      } finally {
        setIsMarkingAsRead(false);
      }
    }
  };

  const handleMarkAsUnread = async (): Promise<void> => {
    if (lesson && lessonFinished && sessionId) {
      setIsMarkingAsUnread(true);
      try {
        if (lessonStore.markLessonAsUnread) {
          const success = await lessonStore.markLessonAsUnread(
            lessonId,
            sessionId
          );
          if (success) {
            setLessonFinished(false);
          }
        }
      } catch (error) {
        console.error("Error marking lesson as unread:", error);
      } finally {
        setIsMarkingAsUnread(false);
      }
    }
  };

  if (isLoading && !lesson) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <DotSpinner />
      </div>
    );
  }

  if (lesson && (!lesson.title || typeof lesson.title !== "string")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Error: Invalid lesson data</h2>
        <Button onClick={() => router.push(basePath)}>
          Back to {lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <DotSpinner />
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
            <div className="xl:col-span-7 2xl:col-span-7 3xl:col-span-8 flex flex-col gap-6 xl:border xl:p-4 xl:rounded-md xl:mb-6">
              <div className="flex justify-center">
                <Button
                  onClick={handleResetPosition}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Position
                </Button>
              </div>

              <div key={boardKey}>
                <ChessboardDisplay slug={params.slug} fenPosition={position} />
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

              <div className="overflow-hidden flex flex-col gap-6">
                <div className="p-2 flex bg-[#F9FAFC] rounded-lg border h-auto items-center">
                  {sections.map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 p-[10px] text-[14px] --xs lg:text-base font-medium text-center rounded-lg transition-all ${
                        sectionName === tab
                          ? "bg-white shadow-md text-black font-bold"
                          : "text-gray-600 font-normal hover:bg-gray-100"
                      }`}
                      onClick={() => setSectionName(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {sectionName === "Online Materials" && (
                <PracticeSection
                  resources={lesson.resources}
                  title={"Practice your Learnings to finish this Lesson"}
                />
              )}
              {sectionName === "Video Explanations" && (
                <PracticeSection
                  resources={(lesson as any).video ?? []}
                  title={"Watch Videos to get a deeper understanding"}
                />
              )}
              {sectionName === "Puzzles" && (
                <PracticeSection
                  resources={(lesson as any).puzzle ?? []}
                  title={"Practice your Learnings with Puzzles"}
                />
              )}

              <div className="flex flex-col gap-4">
                {!lessonFinished ? (
                  <Button
                    className="w-full py-3 text-white rounded-full bg-blue-base"
                    onClick={handleFinishLesson}
                    disabled={isMarkingAsRead}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    {isMarkingAsRead ? "Saving..." : "Finish Lesson"}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 py-3 text-white rounded-full btn-secondary cursor-default"
                      disabled
                    >
                      <Check className="mr-2 h-5 w-5" />
                      <h1 className="text-blue-base font-semibold">
                        Lesson Finished
                      </h1>
                    </Button>
                    <Button
                      className="flex-1 py-3 text-white rounded-full bg-gray-500 hover:bg-gray-600"
                      onClick={handleMarkAsUnread}
                      disabled={isMarkingAsUnread}
                    >
                      <X className="mr-2 h-5 w-5" />
                      {isMarkingAsUnread ? "Updating..." : "Unread The Lesson"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {relatedLessons.length > 0 ? (
              <RelatedLessons
                relatedLessons={relatedLessons}
                lessonType={lessonType}
                handleLessonNavigation={handleLessonNavigation}
                getFenFromMoves={getFenFromMoves}
                getSlugFromId={getSlugFromId}
              />
            ) : (
              <div className="hidden xl:block xl:col-span-3 2xl:col-span-3">
                <div className="border rounded-md p-4 h-full">
                  <h2 className="text-lg font-semibold mb-4">
                    Related Lessons
                  </h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-gray-100 rounded-md animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
