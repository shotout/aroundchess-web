import React from 'react';

// Basic types
export interface UserProfile {
  username?: string;
  level?: string;
  currentElo?: number;
  targetElo?: number;
  avatar?: string;
}

export interface TrainingTopic {
  id: string;
  title: string;
  level?: string;
  difficulty?: string;
  category?: string;
  forColor?: string;
}

export interface WeekDay {
  id: string;
  date: string;
  name: string;
}

// Component props
export interface UserProfileCardProps {
  userProfile?: UserProfile;
  avatar?: string;
  skillLevels?: any[];
  goals?: { id: string; text: string }[];
  duration?: { text: string; value: string };
  hasPlan?: boolean;
}

export interface SkillProgressTrackProps {
  skillLevels?: any[];
  currentElo: number;
}

export interface GoalsSectionProps {
  goals: { id: string; text: string }[];
  duration: { text: string; value: string };
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
  onPlanCreated: () => void;
  
  skillLevels?: any[];
  trainingTopics?: TrainingTopic[];
  topicCategoryInfo?: Array<{
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
  keyInfo?: {
    keyToReachNextLevel: string;
    approximateDuration: string;
  };
}

export interface DialogLevelProgressProps {
  skillLevels?: any[];
  currentElo: number;
}

export interface DialogUserInfoProps {
  username: string;
  keyInfo: {
    keyToReachNextLevel: string;
    approximateDuration: string;
  };
}

export interface DaySelectorProps {
  day: WeekDay;
  isActive: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export interface TrainingTopicCardProps {
  topic: TrainingTopic;
  icon: React.ReactNode | string;
}

export interface TrainingSectionProps {
  icon: React.ReactNode | string;
  title: string;
  duration: string;
  instruction: string;
  topics: TrainingTopic[];
}

export interface TrainingPlanDisplayProps {
  schedule?: any;
  isLoading?: boolean;
  error?: string | null;
}

// Progress-related types
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
  currentLevel?: string;
  currentElo?: number;
  accuracyPercentage?: number;
  accuracyImprovement?: number;
}