"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChessLessonState {
  completedLessons: string[]; // Array of completed lesson slugs
  progressByLesson: Record<string, number>; // Progress percentage by lesson slug
  completedLessonCount: number;
  totalLessonCount: number;
  completeLesson: (slug: string) => void;
  resetLesson: (slug: string) => void;
  setProgress: (slug: string, progress: number) => void;
  isLessonCompleted: (slug: string) => boolean;
  getLessonProgress: (slug: string) => number;
  initializeLessonsCount: (count: number) => void;
}

export const useChessLessonStore = create<ChessLessonState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      progressByLesson: {},
      completedLessonCount: 0,
      totalLessonCount: 0,

      completeLesson: (slug) => {
        set((state) => {
          // Only add lesson if it's not already completed
          if (!state.completedLessons.includes(slug)) {
            return {
              completedLessons: [...state.completedLessons, slug],
              progressByLesson: {
                ...state.progressByLesson,
                [slug]: 100
              },
              completedLessonCount: state.completedLessonCount + 1
            };
          }
          return state;
        });
      },

      resetLesson: (slug) => {
        set((state) => {
          const newCompletedLessons = state.completedLessons.filter(
            (lessonSlug) => lessonSlug !== slug
          );
          
          const newProgressByLesson = { ...state.progressByLesson };
          newProgressByLesson[slug] = 0;

          return {
            completedLessons: newCompletedLessons,
            progressByLesson: newProgressByLesson,
            completedLessonCount: state.completedLessonCount - 1
          };
        });
      },

      setProgress: (slug, progress) => {
        set((state) => ({
          progressByLesson: {
            ...state.progressByLesson,
            [slug]: progress
          }
        }));
      },

      isLessonCompleted: (slug) => {
        return get().completedLessons.includes(slug);
      },

      getLessonProgress: (slug) => {
        return get().progressByLesson[slug] || 0;
      },

      initializeLessonsCount: (count) => {
        set({ totalLessonCount: count });
      }
    }),
    {
      name: 'chess-lessons-storage',
    }
  )
);