"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChessLessonState {
  completedLessons: string[]; // Array of completed lesson slugs
  progressByLesson: Record<string, number>; // Progress percentage by lesson slug
  completedLessonCount: number;
  totalLessonCount: number;
  lastActivity: number; // Timestamp to track user activity
  
  // Actions
  completeLesson: (slug: string) => void;
  resetLesson: (slug: string) => void;
  setProgress: (slug: string, progress: number) => void;
  
  // Selectors
  isLessonCompleted: (slug: string) => boolean;
  getLessonProgress: (slug: string) => number;
  getCompletionPercentage: () => number;
  initializeLessonsCount: (count: number) => void;
}

export const useMiddlegameClearStore = create<ChessLessonState>()(
  persist(
    (set, get) => ({
      // Core state
      completedLessons: [],
      progressByLesson: {},
      completedLessonCount: 0,
      totalLessonCount: 0,
      lastActivity: Date.now(),

      // Complete a lesson - optimized to avoid unnecessary rerenders
      completeLesson: (slug: string) => {
        set((state) => {
          // Early return if already completed - prevents unnecessary state updates
          if (state.completedLessons.includes(slug)) {
            return state;
          }
          
          return {
            completedLessons: [...state.completedLessons, slug],
            progressByLesson: {
              ...state.progressByLesson,
              [slug]: 100
            },
            completedLessonCount: state.completedLessonCount + 1,
            lastActivity: Date.now(),
          };
        });
      },

      // Reset a lesson's progress
      resetLesson: (slug: string) => {
        set((state) => {
          // Check if lesson was actually completed to avoid incorrect count decrement
          const wasCompleted = state.completedLessons.includes(slug);
          
          const newCompletedLessons = state.completedLessons.filter(
            (lessonSlug) => lessonSlug !== slug
          );
          
          const newProgressByLesson = { ...state.progressByLesson };
          newProgressByLesson[slug] = 0;

          return {
            completedLessons: newCompletedLessons,
            progressByLesson: newProgressByLesson,
            completedLessonCount: wasCompleted 
              ? state.completedLessonCount - 1 
              : state.completedLessonCount,
            lastActivity: Date.now(),
          };
        });
      },

      // Set progress for a lesson with validation and optimization
      setProgress: (slug: string, progress: number) => {
        // Validate and normalize progress value
        const validProgress = Math.max(0, Math.min(100, progress));
        
        set((state) => {
          // Skip update if progress hasn't changed
          if (state.progressByLesson[slug] === validProgress) {
            return state;
          }
          
          // Check if this update completes the lesson
          const isNewlyCompleted = 
            validProgress === 100 && 
            !state.completedLessons.includes(slug);
          
          // Update progress
          const newProgressByLesson = {
            ...state.progressByLesson,
            [slug]: validProgress
          };
          
          // If newly completed, also update completedLessons
          if (isNewlyCompleted) {
            return {
              progressByLesson: newProgressByLesson,
              completedLessons: [...state.completedLessons, slug],
              completedLessonCount: state.completedLessonCount + 1,
              lastActivity: Date.now(),
            };
          }
          
          // Just update progress (partial state update)
          return {
            progressByLesson: newProgressByLesson,
            lastActivity: Date.now(),
          };
        });
      },

      // Check if a lesson is completed
      isLessonCompleted: (slug: string) => {
        return get().completedLessons.includes(slug);
      },

      // Get progress for a lesson with default fallback
      getLessonProgress: (slug: string) => {
        return get().progressByLesson[slug] || 0;
      },
      
      // Calculate overall completion percentage
      getCompletionPercentage: () => {
        const { completedLessonCount, totalLessonCount } = get();
        if (totalLessonCount === 0) return 0;
        return Math.round((completedLessonCount / totalLessonCount) * 100);
      },

      // Initialize total lessons count with validation
      initializeLessonsCount: (count: number) => {
        // Validate count
        if (count <= 0) {
          console.warn('Invalid lesson count provided:', count);
          return;
        }
        
        set((state) => {
          // Only update if different to avoid unnecessary rerenders
          if (state.totalLessonCount !== count) {
            return { totalLessonCount: count };
          }
          return state;
        });
      }
    }),
    {
      name: 'middlegame-lessons-storage',
      // Only persist necessary data
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        progressByLesson: state.progressByLesson,
        completedLessonCount: state.completedLessonCount,
        totalLessonCount: state.totalLessonCount,
        // Don't persist the timestamp
      }),
    }
  )
);