// types.ts
import React from 'react';
import { SkillLevel, TrainingTopic, UserProfile, Goal, Duration, WeekDay } from './mockData';

// Props for components
export interface UserProfileCardProps {
  userProfile: UserProfile;
  skillLevels: SkillLevel[];
  goals: Goal[];
  duration: Duration;
}

export interface SkillProgressTrackProps {
  skillLevels: SkillLevel[];
  currentElo: number;
}

export interface GoalsSectionProps {
  goals: Goal[];
  duration: Duration;
}

export interface TrainingPlanCardProps {
  onCreatePlan: () => void;
  hasPlan: boolean;
}

export interface IndividualTrainingTopicProps {
  topic: TrainingTopic;
  isSelected: boolean;
  onSelect: (topicId: string) => void;
}

// New interfaces for progress display
export interface ProgressData {
  currentLevel: string;
  currentElo: number;
  accuracyPercentage: number;
  accuracyImprovement: number;
  winRate: number;
  winRateImprovement: number;
  movesAccuracy: number;
  movesAccuracyImprovement: number;
  tacticalAwareness: number;
  tacticalAwarenessImprovement: number;
}

// New interfaces for progress display
export interface ProgressData {
  currentLevel: string;
  currentElo: number;
  accuracyPercentage: number;
  accuracyImprovement: number;
  winRate: number;
  winRateImprovement: number;
  movesAccuracy: number;
  movesAccuracyImprovement: number;
  tacticalAwareness: number;
  tacticalAwarenessImprovement: number;
}

export interface KeyStat {
  title: string;
  value: string;
  trend: string;
  trendColor: string;
  icon: string;
}

export interface RatingChartData {
  month: string;
  rating: number;
  accuracy: number;
}

export interface RecentGame {
  date: string;
  opponent: string;
  rating: number;
  result: string;
  opening: string;
  accuracy: number;
  brilliant: number;
  mistakes: string;
}

export interface ProgressDisplayProps {
  currentLevel: string;
  currentElo: number;
  accuracyPercentage: number;
  accuracyImprovement: number;
}

export interface ProgressDisplayProps {
  currentLevel: string;
  currentElo: number;
  accuracyPercentage: number;
  accuracyImprovement: number;
}

export interface TopicSelectionSectionProps {
  categoryId: string;
  title: string;
  icon: string;
  description: string;
  subcategories?: Array<{
    id: string;
    title: string;
    selectionCount: number;
  }>;
  topics: TrainingTopic[];
  selectedTopics: string[];
  onToggleTopic: (topicId: string) => void;
}

export interface ChessTrainingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile;
  skillLevels: SkillLevel[];
  trainingTopics: TrainingTopic[];
  topicCategoryInfo: Array<{
    id: string;
    title: string;
    icon: string;
    description: string;
    subcategories: Array<{
      id: string;
      title: string;
      selectionCount: number;
    }>;
  }>;
  keyInfo: {
    keyToReachNextLevel: string;
    approximateDuration: string;
  };
  onPlanCreated: () => void;
}

export interface DialogLevelProgressProps {
  skillLevels: SkillLevel[];
  currentElo: number;
}

export interface DialogUserInfoProps {
  username: string;
  keyInfo: {
    keyToReachNextLevel: string;
    approximateDuration: string;
  };
}

// New interfaces for training plan display
export interface DaySelectorProps {
  day: WeekDay;
  isActive: boolean;
  onSelect: () => void;
}

export interface TrainingTopicCardProps {
  topic: TrainingTopic;
  icon: React.ReactNode;
}

export interface TrainingSectionProps {
  icon: React.ReactNode;
  title: string;
  duration: string;
  instruction: string;
  topics: TrainingTopic[];
}

export interface TrainingPlan {
  openingTopics: TrainingTopic[];
  middlegameTopics: TrainingTopic[];
  endgameTopics: TrainingTopic[];
}

export interface TrainingPlanDisplayProps {
  weekDays: WeekDay[];
  activeDay: string;
  onDaySelect: (dayId: string) => void;
  trainingPlan: TrainingPlan;
}