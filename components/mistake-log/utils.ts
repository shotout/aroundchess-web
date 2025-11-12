type ThreatAnalysis = {
  moveNumber: number;
  move: string;
  threatType?: string;
  explanation: string;
  solution?: string;
};

type PhaseBadMove = {
  moveNumber: number;
  move: string;
  classification?: string;
  evaluation?: number;
  analysis: string;
};

type PhaseBestMove = {
  moveNumber: number;
  move: string;
  classification?: string;
  evaluation?: number;
  analysis: string;
  bestMove?: string;
  recommendation?: string;
};

type AnalyzeSections = {
  threats: ThreatAnalysis[];
  middleGame: { badMoves: PhaseBadMove[]; bestMoves?: PhaseBestMove[] };
  endGame: { badMoves: PhaseBadMove[]; bestMoves?: PhaseBestMove[] };
};

const normalizeMove = (m?: string) =>
  (m || "")
    .replace(/[+#?!]/g, "")
    .replace(/\s/g, "")
    .trim();

const toNumber = (v: any) => {
  const n = typeof v === "number" ? v : parseInt(v || "", 10);
  return Number.isFinite(n) ? n : undefined;
};

function findExplanationForItem(
  item: any,
  sections: AnalyzeSections
): string | null {
  // Hide Opening entirely
  if (item?.gamePhase === "Opening") return null;

  const moveNumber = toNumber(item?.moveNumber);
  const moveNorm = normalizeMove(item?.move);

  if (!moveNumber) return null;

  if (item?.type === "Threats") {
    const t =
      sections.threats.find(
        (x) =>
          toNumber(x.moveNumber) === moveNumber &&
          (normalizeMove(x.move) === moveNorm || !x.move)
      ) ||
      sections.threats.find(
        (x) => toNumber(x.moveNumber) === moveNumber
      );
    return t?.explanation || null;
  }

  const phase =
    item?.gamePhase === "Middle Game"
      ? "middleGame"
      : item?.gamePhase === "End Game"
      ? "endGame"
      : null;
  if (!phase) return null;

  const list =
    phase === "middleGame"
      ? sections.middleGame?.badMoves || []
      : sections.endGame?.badMoves || [];

  const found =
    list.find(
      (x) =>
        toNumber(x.moveNumber) === moveNumber &&
        normalizeMove(x.move) === moveNorm
    ) ||
    list.find((x) => toNumber(x.moveNumber) === moveNumber);

  return found?.analysis || null;
}

function findRecommendationForItem(
  item: any,
  sections: AnalyzeSections
): string {
  if (item?.gamePhase === "Opening") return "";
  const moveNumber = toNumber(item?.moveNumber);
  const moveNorm = normalizeMove(item?.move);
  if (!moveNumber) return "";

  if (item?.type === "Threats") {
    const t =
      sections.threats.find(
        (x) =>
          toNumber(x.moveNumber) === moveNumber &&
          (normalizeMove(x.move) === moveNorm || !x.move)
      ) ||
      sections.threats.find((x) => toNumber(x.moveNumber) === moveNumber);
    return (t?.solution || "").toString();
  }

  const phase =
    item?.gamePhase === "Middle Game"
      ? "middleGame"
      : item?.gamePhase === "End Game"
      ? "endGame"
      : null;
  if (!phase) return "";

  const bestList =
    phase === "middleGame"
      ? sections.middleGame?.bestMoves || []
      : sections.endGame?.bestMoves || [];
  const badList =
    phase === "middleGame"
      ? sections.middleGame?.badMoves || []
      : sections.endGame?.badMoves || [];

  // Prefer concrete guidance tied to the mistake itself
  const badMatch =
    badList.find(
      (x) =>
        toNumber(x.moveNumber) === moveNumber &&
        normalizeMove(x.move) === moveNorm
    ) || badList.find((x) => toNumber(x.moveNumber) === moveNumber);
  if (badMatch && (badMatch as any).explanation) {
    return ((badMatch as any).explanation || "").toString();
  }
  const bestMatch =
    bestList.find(
      (x) =>
        toNumber(x.moveNumber) === moveNumber &&
        normalizeMove(x.move) === moveNorm
    ) || bestList.find((x) => toNumber(x.moveNumber) === moveNumber);

  return (bestMatch?.recommendation || "").toString();
}

export function enrichMistakeLogsWithAnalyzeSections(
  mistakeLogs: any,
  sections: AnalyzeSections
) {
  const mapCategory = (arr: any[]) =>
    (arr || [])
      .filter((it) => it?.gamePhase !== "Opening")
      .map((it) => {
        const explanation = findExplanationForItem(it, sections);
        if (!explanation) return null;
        const recommendation = findRecommendationForItem(it, sections);
        return {
          ...it,
          analysis: explanation,
          recommendation,
        };
      })
      .filter(Boolean);

  return {
    criticalMistakes: mapCategory(mistakeLogs?.criticalMistakes || []),
    weaknessIdentification: mapCategory(
      mistakeLogs?.weaknessIdentification || []
    ),
    badMoves: mapCategory(mistakeLogs?.badMoves || []),
    threats: mapCategory(mistakeLogs?.threats || []),
  };
}


