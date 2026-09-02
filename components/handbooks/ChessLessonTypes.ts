export type LessonType = "opening" | "middlegame" | "endgame";
export type DifficultyLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";
export type DifficultyFilter = DifficultyLevel | null;

export interface Pagination {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentPage?: number;
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

export interface StrategicIdea {
  id: number;
  handbookId: string;
  idea: string;
}

export interface TacticalIdea {
  id: number;
  handbookId: string;
  idea: string;
}

export interface BaseLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  forColor: string | null;
  popularityLevel: number;
  recommendedFor: string[];
  relatedTopics: string[];
  eco: string | null;
  moves: string | null;
  prerequisites: Prerequisite[];
  objectives: Objective[];
  resources: Resource[];
  strategicIdeas: StrategicIdea[];
  tacticalIdeas: TacticalIdea[];
  readStatus?: boolean;
}

// Common overview structure for all lesson types
export interface LessonOverview {
  learningObjectives: Objective[];
  prerequisites: Prerequisite[];
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

export interface OpeningOverview extends LessonOverview {
  // No additional fields for opening overview
}

export interface OpeningLesson extends BaseLesson {
  variations: Variation[];
  overview?: OpeningOverview;
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

export interface MiddlegameOverview extends LessonOverview {
  strategicConcepts: StrategicConcept[];
}

export interface MiddlegamePatterns {
  commonPatterns: Pattern[];
  tacticalMotifs: TacticalMotif[];
}

export interface MiddlegameLesson extends BaseLesson {
  patterns?: MiddlegamePatterns;
  overview?: MiddlegameOverview;
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

export interface EndgameOverview extends LessonOverview {
  theoreticalKnowledge: TheoreticalKnowledge[];
}

export interface EndgamePatterns {
  winningTechniques: WinningTechnique[];
  fundamentalPositions: FundamentalPosition[];
  practicalTips?: PracticalTip[];
  commonMistakes?: CommonMistake[];
  drawingTechniques?: DrawingTechnique[];
}

export interface EndgameLesson extends BaseLesson {
  patterns?: EndgamePatterns;
  overview?: EndgameOverview;
}

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

// Extended interface for stores that support read/unread functionality
export interface ExtendedChessLessonState<T extends ChessLesson>
  extends ChessLessonState<T> {
  readStatusMap: Record<string, boolean>;
  checkReadStatus: (id: string, sessionId?: string) => Promise<boolean>;
  markLessonAsRead: (id: string, sessionId?: string) => Promise<boolean>;
  markLessonAsUnread: (id: string, sessionId?: string) => Promise<boolean>;
  isLoadingDetails: Record<string, boolean>;
  isCheckingReadStatus: boolean;
  fetchReadStatuses: (sessionId?: string) => Promise<void>;
}

// Type guard functions to differentiate between lesson types
export function isOpeningLesson(lesson: ChessLesson): lesson is OpeningLesson {
  return lesson.category === "opening" && "variations" in lesson;
}

export function isMiddlegameLesson(
  lesson: ChessLesson
): lesson is MiddlegameLesson {
  return lesson.category === "middlegame";
}

export function isEndgameLesson(lesson: ChessLesson): lesson is EndgameLesson {
  return lesson.category === "endgame";
}

// Helper function to get the appropriate base URL path based on lesson type
export function getLessonBasePath(lessonType: LessonType): string {
  switch (lessonType) {
    case "opening":
      return "/opening-theory";
    case "middlegame":
      return "/middlegame-strategy";
    case "endgame":
      return "/endgame-mastery";
    default:
      return "/";
  }
}

// Helper function to get appropriate tab options based on lesson type
export function getLessonTabOptions(
  lessonType: LessonType
): { id: string; label: string }[] {
  switch (lessonType) {
    case "opening":
      return [
        { id: "overview", label: "Overview" },
        { id: "variations", label: "Variations" },
      ];
    case "middlegame":
      return [
        { id: "overview", label: "Overview" },
        { id: "patterns", label: "Patterns" },
      ];
    case "endgame":
      return [
        { id: "overview", label: "Overview" },
        { id: "patterns", label: "Patterns" },
      ];
    default:
      return [{ id: "overview", label: "Overview" }];
  }
}
