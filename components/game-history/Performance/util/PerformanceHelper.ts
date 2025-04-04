
export const API_BASE_URL = process.env.BASE_URL;
export const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export type SkillIconType = "Tactical" | "Calculation" | "Opening Knowledge" | "Time Management" | "Other";

// Return only the skill type, actual icon creation happens in the component
export const getSkillIconType = (skillName: string): SkillIconType => {
  switch (skillName) {
    case "Tactical":
    case "Calculation":
      return "Calculation";
    case "Opening Knowledge":
      return "Opening Knowledge";
    case "Time Management":
      return "Time Management";
    default:
      return "Other";
  }
};

export const recommendationMap = {
  Endgame: "Practice endgame positions with rook and pawn",
  Positional: "Study positional pawn sacrifices",
  "Time Management": "Practice playing with incremental time controls",
  Calculation: "Work on calculation exercises and visualization",
  Tactical: "Solve tactical puzzles daily",
  "Opening Knowledge": "Study main lines of your opening repertoire",
} as const;

export const defaultGoals = [
  "Work on defensive techniques",
  "Analyze your losses for patterns",
  "Practice endgames against an engine",
];

export type ProcessedPerformanceData = {
  barData: Array<{
    name: string;
    performance: number;
    average: number;
  }>;
  radarData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
  strengthsData: Array<{
    name: string;
    value: number;
    iconType: SkillIconType;
  }>;
  weaknessesData: Array<{
    name: string;
    value: number;
  }>;
  shortTermGoals: string[];
  trainingFocus: string[];
};

export const processPerformanceData = (apiData: any): ProcessedPerformanceData | null => {
  if (!apiData) return null;

  const accuracy = apiData.performanceInsights?.accuracy || 0;
  const blunderRate = parseFloat(apiData.blunderRate) || 0;
  const timeManagement = apiData.timeManagement?.efficiency || 0;
  const averageRating = apiData.keyStatistics?.averageRating || 0;

  const normalizedRating = Math.min(100, averageRating / 20 + 50);
  const middlegameScore = Math.max(50, 100 - blunderRate * 5);

  const openingStats = apiData.openingStatistics || [];
  const openingWinRates = openingStats.map(
    (opening: { winRate: any }) => opening.winRate
  );
  const averageOpeningWinRate =
    openingWinRates.length > 0
      ? openingWinRates.reduce((sum: any, rate: any) => sum + rate, 0) /
        openingWinRates.length
      : 75;

  const calculationScore = 100 - blunderRate * 4;
  const positionalScore = normalizedRating;
  const tacticalScore = accuracy;
  const endgameScore = Math.max(50, accuracy - 15);
  const timeManagementScore = timeManagement;
  const openingKnowledgeScore = Math.min(100, averageOpeningWinRate + 10);

  const radarData = [
    {
      subject: "Calculation",
      A: Math.round(calculationScore),
      fullMark: 100,
    },
    { subject: "Positional", A: Math.round(positionalScore), fullMark: 100 },
    { subject: "Tactical", A: Math.round(tacticalScore), fullMark: 100 },
    { subject: "Endgame", A: Math.round(endgameScore), fullMark: 100 },
    {
      subject: "Time Management",
      A: Math.round(timeManagementScore),
      fullMark: 100,
    },
    {
      subject: "Opening Knowledge",
      A: Math.round(openingKnowledgeScore),
      fullMark: 100,
    },
  ];

  const sortedSkills = [...radarData].sort((a, b) => b.A - a.A);
  const topStrengths = sortedSkills.slice(0, 3);
  const bottomWeaknesses = [...sortedSkills].reverse().slice(0, 3);

  const strengthsData = topStrengths.map((item) => ({
    name: item.subject,
    value: item.A,
    iconType: getSkillIconType(item.subject),
  }));

  const weaknessesData = bottomWeaknesses.map((item) => ({
    name: item.subject,
    value: item.A,
  }));

  type RecommendationKey = keyof typeof recommendationMap;

  let shortTermGoals: string[] = bottomWeaknesses
    .map((w) => recommendationMap[w.subject as RecommendationKey])
    .filter(Boolean) as string[];

  for (let i = 0; shortTermGoals.length < 3 && i < defaultGoals.length; i++) {
    if (!shortTermGoals.includes(defaultGoals[i])) {
      shortTermGoals.push(defaultGoals[i]);
    }
  }

  shortTermGoals = shortTermGoals.slice(0, 3);

  const totalWeaknessScore = bottomWeaknesses.reduce(
    (sum, item) => sum + (100 - item.A),
    0
  );

  const trainingFocus = bottomWeaknesses.map((item) => {
    const percentage = Math.round(
      ((100 - item.A) / totalWeaknessScore) * 100
    );
    return `${item.subject} training (${percentage}%)`;
  });

  const barData = [
    {
      name: "Opening",
      performance: Math.round(averageOpeningWinRate),
      average: 75,
    },
    {
      name: "Middlegame",
      performance: Math.round(middlegameScore),
      average: 75,
    },
    { name: "Endgame", performance: Math.round(accuracy - 5), average: 75 },
    { name: "Tactics", performance: Math.round(accuracy), average: 75 },
    {
      name: "Strategy",
      performance: Math.round(normalizedRating),
      average: 75,
    },
  ];

  return {
    barData,
    radarData,
    strengthsData,
    weaknessesData,
    shortTermGoals,
    trainingFocus,
  };
};