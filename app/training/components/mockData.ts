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
    icon: null, // This will be set in the component
  },
  {
    id: "intermediate",
    title: "Intermediate",
    elo: 1200,
    completed: false,
    current: false,
    icon: null, // This will be set in the component
  },
  {
    id: "expert",
    title: "Expert",
    elo: 1600,
    completed: false,
    current: false,
    icon: null, // This will be set in the component
  },
  {
    id: "master",
    title: "Master",
    elo: 2000,
    completed: false,
    current: false,
    icon: null, // This will be set in the component
  },
  {
    id: "grandmaster",
    title: "Grand Master",
    elo: 2400,
    completed: false,
    current: false,
    icon: null, // This will be set in the component
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

// Training Topics Data
export const trainingTopicsData: TrainingTopic[] = [
  // White Opening Topics
  {
    id: "white-opening-1",
    title: "Italian Game",
    level: "Beginner",
    category: "whiteOpening"
  },
  {
    id: "white-opening-2",
    title: "Queen's Gambit",
    level: "Beginner",
    category: "whiteOpening"
  },
  {
    id: "white-opening-3",
    title: "Spanish Opening",
    level: "Intermediate",
    category: "whiteOpening"
  },
  {
    id: "white-opening-4",
    title: "English Opening",
    level: "Advanced",
    category: "whiteOpening"
  },
  {
    id: "white-opening-5",
    title: "Vienna Game",
    level: "Expert",
    category: "whiteOpening"
  },
  {
    id: "white-opening-6",
    title: "King's Gambit",
    level: "Expert",
    category: "whiteOpening"
  },
  
  // Black Opening Topics
  {
    id: "black-opening-1",
    title: "Sicilian Defense",
    level: "Beginner",
    category: "blackOpening"
  },
  {
    id: "black-opening-2",
    title: "French Defense",
    level: "Intermediate",
    category: "blackOpening"
  },
  {
    id: "black-opening-3",
    title: "Caro-Kann Defense",
    level: "Advanced",
    category: "blackOpening"
  },
  {
    id: "black-opening-4",
    title: "Nimzo-Indian Defense",
    level: "Expert",
    category: "blackOpening"
  },
  {
    id: "black-opening-5",
    title: "King's Indian Defense",
    level: "Expert",
    category: "blackOpening"
  },
  
  // Middlegame Topics
  {
    id: "middlegame-1",
    title: "Pawn Structure Fundamentals",
    level: "Beginner",
    category: "middlegame"
  },
  {
    id: "middlegame-2",
    title: "Basic Tactical Patterns",
    level: "Beginner",
    category: "middlegame"
  },
  {
    id: "middlegame-3",
    title: "Minor Piece Coordination",
    level: "Beginner",
    category: "middlegame"
  },
  {
    id: "middlegame-4",
    title: "Knight vs. Bishop Dynamics",
    level: "Beginner",
    category: "middlegame"
  },
  {
    id: "middlegame-5",
    title: "Attacking the King",
    level: "Beginner",
    category: "middlegame"
  },
  {
    id: "middlegame-6",
    title: "Positional Sacrifice",
    level: "Intermediate",
    category: "middlegame"
  },
  {
    id: "middlegame-7",
    title: "Advanced Pawn Structures",
    level: "Intermediate",
    category: "middlegame"
  },
  {
    id: "middlegame-8",
    title: "Prophylaxis",
    level: "Advanced",
    category: "middlegame"
  },
  {
    id: "middlegame-9",
    title: "Strategic Complexity",
    level: "Advanced",
    category: "middlegame"
  },
  
  // Endgame Topics
  {
    id: "endgame-1",
    title: "Basic King and Pawn Endgames",
    level: "Beginner",
    category: "endgame"
  },
  {
    id: "endgame-2",
    title: "Rook Endgames Fundamentals",
    level: "Beginner",
    category: "endgame"
  },
  {
    id: "endgame-3",
    title: "Bishop vs. Knight Endgames",
    level: "Beginner",
    category: "endgame"
  },
  {
    id: "endgame-4",
    title: "Queen vs. Pawn Endgames",
    level: "Beginner",
    category: "endgame"
  },
  {
    id: "endgame-5",
    title: "Opposite-Colored Bishops",
    level: "Intermediate",
    category: "endgame"
  },
  {
    id: "endgame-6",
    title: "Rook and Pawn vs. Rook",
    level: "Intermediate",
    category: "endgame"
  },
  {
    id: "endgame-7",
    title: "Fortress Positions",
    level: "Advanced",
    category: "endgame"
  },
  {
    id: "endgame-8",
    title: "Queen vs. Rook Endgames",
    level: "Advanced",
    category: "endgame"
  }
];

;

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

// Week days data
export const weekDaysData: WeekDay[] = [
  {
    id: "tue",
    date: "18",
    name: "Tue"
  },
  {
    id: "wed",
    date: "19",
    name: "Wed"
  },
  {
    id: "thu",
    date: "20",
    name: "Thu"
  },
  {
    id: "fri",
    date: "21",
    name: "Fri"
  },
  {
    id: "sat",
    date: "22",
    name: "Sat"
  },
  {
    id: "sun",
    date: "23",
    name: "Sun"
  },
  {
    id: "mon",
    date: "24",
    name: "Mon"
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

// Progress data
export const progressData = {
  currentLevel: "Beginner",
  currentElo: 1000,
  accuracyPercentage: 85,
  accuracyImprovement: 5,
  winRate: 62,
  winRateImprovement: 8,
  movesAccuracy: 76,
  movesAccuracyImprovement: 12,
  tacticalAwareness: 68,
  tacticalAwarenessImprovement: 15
};

// Performance key stats
export const keyStatsData = [
  {
    title: "Total Games",
    value: "1,234",
    trend: "+45 this month",
    trendColor: "text-green-500",
    icon: "trophy"
  },
  {
    title: "Win Rate",
    value: "65%",
    trend: "+5%",
    trendColor: "text-game-green",
    icon: "target"
  },
  {
    title: "Average Rating",
    value: "1,850",
    trend: "+25 points",
    trendColor: "text-green-500",
    icon: "brain"
  },
  {
    title: "Longest Streak",
    value: "8 wins",
    trend: "",
    trendColor: "",
    icon: "trending-up"
  }
];

// Rating chart data
export const ratingChartData = [
  { month: "12/24", rating: 0, accuracy: 1300 },
  { month: "01/25", rating: 1500, accuracy: 100 },
  { month: "02/25", rating: 1420, accuracy: 1100 },
  { month: "03/25", rating: 1820, accuracy: 2000 }
];

// Recent games data
export const recentGamesData = [
  {
    date: "2025-02-27",
    opponent: "IM_Chess Master",
    rating: 2100,
    result: "WIN",
    opening: "Sicilian Defense",
    accuracy: 92,
    brilliant: 4,
    mistakes: "10 + 5"
  },
  {
    date: "2025-02-27",
    opponent: "IM_Chess Master",
    rating: 2100,
    result: "WIN",
    opening: "Sicilian Defense",
    accuracy: 92,
    brilliant: 4,
    mistakes: "10 + 5"
  },
  {
    date: "2025-02-27",
    opponent: "IM_Chess Master",
    rating: 2100,
    result: "WIN",
    opening: "Sicilian Defense",
    accuracy: 92,
    brilliant: 4,
    mistakes: "10 + 5"
  },
  {
    date: "2025-02-27",
    opponent: "IM_Chess Master",
    rating: 2100,
    result: "WIN",
    opening: "Sicilian Defense",
    accuracy: 92,
    brilliant: 4,
    mistakes: "10 + 5"
  },
  {
    date: "2025-02-27",
    opponent: "IM_Chess Master",
    rating: 2100,
    result: "WIN",
    opening: "Sicilian Defense",
    accuracy: 92,
    brilliant: 4,
    mistakes: "10 + 5"
  }
];

// Week days data