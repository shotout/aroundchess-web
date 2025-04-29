// mockData.ts
import React from 'react';

export interface SkillLevel {
  id: string;
  title: string;
  elo: number;
  completed: boolean;
  current: boolean;
  icon: React.ReactNode;
}

export interface UserProfile {
  username?: string;
  level?: string;
  currentElo?: number;
  targetElo?: number;
  avatar?: React.ReactNode;
}

export interface Goal {
  id: string;
  text: string;
}

export interface Duration {
  text: string;
  value: string;
}

export interface TrainingTopic {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'whiteOpening' | 'blackOpening' | 'middlegame' | 'endgame';
}

export interface WeekDay {
  id: string;
  date: string;
  name: string;
}

// User profile data
export const userProfileData: UserProfile = {
  username: "Blitzmystic",
  level: "Beginner",
  currentElo: 900,
  targetElo: 1200,
  avatar: null, 
};

// Skill levels data
export const skillLevelsData: SkillLevel[] = [
  {
    id: "novice",
    title: "Novice",
    elo: 0,
    completed: true,
    current: false,
    icon: null,
  },
  {
    id: "beginner",
    title: "Beginner",
    elo: 800,
    completed: false,
    current: true,
    icon: null,
  },
  {
    id: "intermediate",
    title: "Intermediate",
    elo: 1200,
    completed: false,
    current: false,
    icon: null,
  },
  {
    id: "expert",
    title: "Expert",
    elo: 1600,
    completed: false,
    current: false,
    icon: null,
  },
  {
    id: "master",
    title: "Master",
    elo: 2000,
    completed: false,
    current: false,
    icon: null,
  },
  {
    id: "grandmaster",
    title: "Grand Master",
    elo: 2400,
    completed: false,
    current: false,
    icon: null,
  },
];

// Goals data
export const goalsData: Goal[] = [
  {
    id: "goal1",
    text: "Build consistency and expand basic knowledge."
  },
  {
    id: "goal2",
    text: "Begin refining tactical patterns."
  }
];

// Duration data
export const durationData: Duration = {
  text: "Avg. Time to Invest Daily:",
  value: "~80 mins"
};

// Training Plan Key Info
export const trainingPlanKeyInfo = {
  keyToReachNextLevel: "Continued practice with improved openings and deeper study of middlegame and endgame concepts will gradually raise your play.",
  approximateDuration: "6-9 Months"
};

// Topic Category Info
export const topicCategoryInfo = [
  {
    id: "opening",
    title: "Opening Topics",
    icon: "/training-plan/oc.png",
    description: "Select 1 White and 2 Black Opening Topic:",
    subcategories: [
      {
        id: "whiteOpening",
        title: "White Opening",
        selectionCount: 1
      },
      {
        id: "blackOpening",
        title: "Black Opening",
        selectionCount: 2
      }
    ]
  },
  {
    id: "middlegame",
    title: "Middlegame Concepts",
    icon: "/training-plan/mc.png",
    description: "Select 5-7 Middlegame Topics:",
    subcategories: []
  },
  {
    id: "endgame",
    title: "Endgame Concepts",
    icon: "/training-plan/ec.png",
    description: "Select 3-4 Endgame Topics:",
    subcategories: []
  }
];



// Sample training plan data
export const trainingPlanData = {
  openingTopics: [
    {
      id: "white-opening-1",
      title: "[White Opening Training topic 1]",
      level: "Beginner",
      category: "whiteOpening"
    },
    {
      id: "black-opening-1",
      title: "[Black Opening Training topic 2]",
      level: "Beginner",
      category: "blackOpening"
    }
  ],
  middlegameTopics: [
    {
      id: "middlegame-1",
      title: "[Middlegame Training topic 1]",
      level: "Beginner",
      category: "middlegame"
    },
    {
      id: "middlegame-2",
      title: "[Middlegame Training topic 2]",
      level: "Beginner",
      category: "middlegame"
    },
    {
      id: "middlegame-3",
      title: "[Middlegame Training topic 3]",
      level: "Beginner",
      category: "middlegame"
    },
    {
      id: "middlegame-4",
      title: "[Middlegame Training topic 4]",
      level: "Intermediate",
      category: "middlegame"
    },
    {
      id: "middlegame-5",
      title: "[Middlegame Training topic 5]",
      level: "Intermediate",
      category: "middlegame"
    }
  ],
  endgameTopics: [
    {
      id: "endgame-1",
      title: "[Endgame Training topic 1]",
      level: "Beginner",
      category: "endgame"
    },
    {
      id: "endgame-2",
      title: "[Endgame Training topic 2]",
      level: "Beginner",
      category: "endgame"
    },
    {
      id: "endgame-3",
      title: "[Endgame Training topic 3]",
      level: "Beginner",
      category: "endgame"
    }
  ]
};

// Fallback progress data (now coming from API, but kept for compatibility)
export const progressData = {
  currentLevel: "Beginner",
  currentElo: 1000,
  accuracyPercentage: 85,
  accuracyImprovement: 5
};