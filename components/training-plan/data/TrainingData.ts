export interface GoalType {
    id: string;
    name: string;
    iconName: string;
  }
  
  export interface TrainingDurationOption {
    id: string;
    name: string;
    iconName: string;
  }
  
  export interface TrainingTopic {
    id: string;
    name: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    description: string;
    category: 'opening' | 'middlegame' | 'endgame';
  }
  
  export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null;
  
  export const goalTypes: GoalType[] = [
    { id: "elo", name: "ELO Rating", iconName: "Target" },
    { id: "topics", name: "Training Topics", iconName: "BarChart" },
    { id: "accuracy", name: "Improve Accuracy", iconName: "CheckCircle" },
    { id: "puzzles", name: "Puzzles", iconName: "Puzzle" },
  ];
  
  export const durationTypes: TrainingDurationOption[] = [
    { id: "target", name: "Target", iconName: "Target" },
    { id: "timeframe", name: "Timeframe", iconName: "Calendar" },
  ];
  
  export const trainingTopics: TrainingTopic[] = [
    {
      id: 'kings-indian-defense-1',
      name: 'King\'s Indian Defense',
      difficulty: 'Beginner',
      description: 'Learn the basics of King\'s Indian Defense',
      category: 'opening'
    },
    {
      id: 'kings-indian-defense-2',
      name: 'King\'s Indian Defense',
      difficulty: 'Intermediate',
      description: 'Intermediate tactics for King\'s Indian Defense',
      category: 'opening'
    },
    {
      id: 'kings-indian-defense-3',
      name: 'King\'s Indian Defense',
      difficulty: 'Advanced',
      description: 'Advanced strategies for King\'s Indian Defense',
      category: 'opening'
    },
    {
      id: 'kings-indian-defense-4',
      name: 'King\'s Indian Defense',
      difficulty: 'Expert',
      description: 'Expert variations of King\'s Indian Defense',
      category: 'opening'
    },
    
    {
      id: 'space-advantage-1',
      name: 'Space Advantage',
      difficulty: 'Beginner',
      description: 'Understanding space advantage in middlegame',
      category: 'middlegame'
    },
    {
      id: 'space-advantage-2',
      name: 'Space Advantage',
      difficulty: 'Intermediate',
      description: 'Exploiting space advantage in middlegame',
      category: 'middlegame'
    },
    {
      id: 'space-advantage-3',
      name: 'Space Advantage',
      difficulty: 'Advanced',
      description: 'Creating and maintaining space advantage',
      category: 'middlegame'
    },
    {
      id: 'space-advantage-4',
      name: 'Space Advantage',
      difficulty: 'Expert',
      description: 'Master-level space advantage tactics',
      category: 'middlegame'
    },
    
    {
      id: 'drawing-techniques-1',
      name: 'Drawing Techniques',
      difficulty: 'Beginner',
      description: 'Basic drawing techniques in endgames',
      category: 'endgame'
    },
    {
      id: 'drawing-techniques-2',
      name: 'Drawing Techniques',
      difficulty: 'Intermediate',
      description: 'Intermediate drawing techniques in difficult positions',
      category: 'endgame'
    },
    {
      id: 'drawing-techniques-3',
      name: 'Drawing Techniques',
      difficulty: 'Advanced',
      description: 'Advanced drawing techniques in complex endgames',
      category: 'endgame'
    },
    {
      id: 'drawing-techniques-4',
      name: 'Drawing Techniques',
      difficulty: 'Expert',
      description: 'Expert-level drawing techniques against strong opponents',
      category: 'endgame'
    },
  ];