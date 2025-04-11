// types/ChessLessonTypes.ts
export type LessonType = 'opening' | 'middlegame' | 'endgame';
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type DifficultyFilter = DifficultyLevel | null;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Resource {
  id: number;
  handbookId: string;
  title: string;
  url: string;
  platform: string;
  description: string;
}

export interface Objective {
  id: number;
  handbookId: string;
  objective: string;
}

export interface Prerequisite {
  id: number;
  handbookId: string;
  prerequisite: string;
}

export interface BaseLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  forColor: string;
  popularityLevel: number;
  recommendedFor: string[];
  relatedTopics: string[];
  eco: string | null;
  moves: string | null;
  prerequisites: Prerequisite[];
  objectives: Objective[];
  resources: Resource[];
}

// Opening-specific interfaces
export interface KeyIdea {
  id: number;
  variationId: number;
  idea: string;
}

export interface Variation {
  id: number;
  handbookId: string;
  name: string;
  moves: string | null;
  description: string;
  keyIdeas: KeyIdea[];
}

export interface OpeningLesson extends BaseLesson {
  variations: Variation[];
}

// Middlegame-specific interfaces
export interface Pattern {
  id: number;
  handbookId: string;
  pattern: string;
}

export interface CommonTheme {
  id: number;
  handbookId: string;
  theme: string;
}

export interface TacticalMotif {
  id: number;
  handbookId: string;
  motif: string;
}

export interface StrategicConcept {
  id: number;
  handbookId: string;
  concept: string;
}

export interface MiddlegameLesson extends BaseLesson {
  patterns: Pattern[];
  commonThemes: CommonTheme[];
  tacticalMotifs: TacticalMotif[];
  strategicConcepts: StrategicConcept[];
}

// Endgame-specific interfaces
export interface WinningTechnique {
  id: number;
  handbookId: string;
  technique: string;
}

export interface FundamentalPosition {
  id: number;
  handbookId: string;
  position: string;
}

export interface TheoreticalKnowledge {
  id: number;
  handbookId: string;
  knowledge: string;
}

export interface PracticalTip {
  id: number;
  handbookId: string;
  tip: string;
}

export interface CommonMistake {
  id: number;
  handbookId: string;
  mistake: string;
}

export interface DrawingTechnique {
  id: number;
  handbookId: string;
  technique: string;
}

export interface EndgameLesson extends BaseLesson {
  winningTechniques: WinningTechnique[];
  fundamentalPositions: FundamentalPosition[];
  theoreticalKnowledge: TheoreticalKnowledge[];
  practicalTips: PracticalTip[];
  commonMistakes: CommonMistake[];
  drawingTechniques: DrawingTechnique[];
}

// Generic lesson type that can be any of the three
export type ChessLesson = OpeningLesson | MiddlegameLesson | EndgameLesson;

// Store state interface that works with any lesson type
export interface ChessLessonState<T extends ChessLesson> {
  // Data
  allLessons: T[];
  filteredLessons: T[];
  lessonDetails: Record<string, T>;
  pagination: Pagination | null;

  // Filter states
  difficultyFilter: DifficultyFilter;
  searchTerm: string;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  fetchAllLessons: (sessionId?: string) => Promise<void>;
  fetchLessonDetails: (id: string, sessionId?: string) => Promise<T | null>;
  setDifficultyFilter: (difficulty: DifficultyFilter) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
  applyFilters: () => void;
}

// Type guard functions to differentiate between lesson types
export function isOpeningLesson(lesson: ChessLesson): lesson is OpeningLesson {
  return lesson.category === 'opening' && 'variations' in lesson;
}

export function isMiddlegameLesson(lesson: ChessLesson): lesson is MiddlegameLesson {
  return lesson.category === 'middlegame' && 'tacticalMotifs' in lesson;
}

export function isEndgameLesson(lesson: ChessLesson): lesson is EndgameLesson {
  return lesson.category === 'endgame' && ('winningTechniques' in lesson || 'fundamentalPositions' in lesson);
}

// Helper function to get the appropriate base URL path based on lesson type
export function getLessonBasePath(lessonType: LessonType): string {
  switch (lessonType) {
    case 'opening':
      return '/opening-theory';
    case 'middlegame':
      return '/middlegame-strategy';
    case 'endgame':
      return '/endgame-mastery';
    default:
      return '/';
  }
}

// Helper function to get appropriate tab options based on lesson type
export function getLessonTabOptions(lessonType: LessonType): { id: string, label: string }[] {
  switch (lessonType) {
    case 'opening':
      return [
        { id: "overview", label: "Overview" },
        { id: "variations", label: "Variations" }
      ];
    case 'middlegame':
      return [
        { id: "overview", label: "Overview" },
        { id: "patterns", label: "Patterns" }
      ];
    case 'endgame':
      return [
        { id: "overview", label: "Overview" },
        { id: "patterns", label: "Patterns" }
      ];
    default:
      return [
        { id: "overview", label: "Overview" }
      ];
  }
}