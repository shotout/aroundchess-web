// Flattened copy of the AI opponent roster defined in components/modal/StartPlayVSAI.tsx.
// Duplicated (not imported) deliberately -- StartPlayVSAI.tsx is a large, unaudited modal
// and this feature must not risk changing its behavior.

export interface AiRosterOpponent {
  id: number;
  name: string;
  elo: number;
  img: string;
}

/** How many ELO steps below the user's own the recommended list starts. */
const RECOMMENDED_BELOW = 1;
/** How many opponents a recommended list holds. */
const RECOMMENDED_TOTAL = 4;

const RAW_ROSTER: AiRosterOpponent[] = [
  { id: 0, name: "Thomas", elo: 250, img: "/images/v2/AI avatar/Beginner/Thomas.png" },
  { id: 1, name: "Sofia", elo: 250, img: "/images/v2/AI avatar/Beginner/Sofia.png" },
  { id: 2, name: "Pierre", elo: 400, img: "/images/v2/AI avatar/Beginner/Pierre.png" },
  { id: 30, name: "Lieke", elo: 400, img: "/images/v2/AI avatar/Beginner/Lieke.png" },
  { id: 3, name: "Ana", elo: 400, img: "/images/v2/AI avatar/Beginner/Ana.png" },
  { id: 4, name: "Carlos", elo: 500, img: "/images/v2/AI avatar/Beginner/Carlos.png" },
  { id: 5, name: "Lana", elo: 500, img: "/images/v2/AI avatar/Beginner/Lana.png" },
  { id: 6, name: "Dimitri", elo: 500, img: "/images/v2/AI avatar/Beginner/Dimitri.png" },
  { id: 7, name: "Marco", elo: 600, img: "/images/v2/AI avatar/Beginner/Marco.png" },
  { id: 8, name: "Marie", elo: 600, img: "/images/v2/AI avatar/Beginner/Marie.png" },
  { id: 9, name: "Elena", elo: 600, img: "/images/v2/AI avatar/Beginner/Elena.png" },
  { id: 10, name: "Viktor", elo: 700, img: "/images/v2/AI avatar/Beginner/Victor.png" },
  { id: 11, name: "Delia", elo: 700, img: "/images/v2/AI avatar/Beginner/Delia.png" },
  { id: 12, name: "Hans", elo: 700, img: "/images/v2/AI avatar/Beginner/Hans.png" },
  { id: 13, name: "Igor", elo: 800, img: "/images/v2/AI avatar/Beginner/Igor.png" },
  { id: 14, name: "Amel", elo: 800, img: "/images/v2/AI avatar/Beginner/Amel.png" },
  { id: 15, name: "Lisa", elo: 800, img: "/images/v2/AI avatar/Beginner/Lisa.png" },
  { id: 16, name: "Andreas", elo: 850, img: "/images/v2/AI avatar/Beginner/Andreas.png" },
  { id: 17, name: "Astrid", elo: 850, img: "/images/v2/AI avatar/Beginner/Astrid.png" },
  { id: 18, name: "Ingrid", elo: 850, img: "/images/v2/AI avatar/Beginner/Ingrid.png" },
  { id: 100, name: "Naomi", elo: 900, img: "/images/v2/AI avatar/Intermediate/Naomi.png" },
  { id: 101, name: "Tobias", elo: 900, img: "/images/v2/AI avatar/Intermediate/Tobias.png" },
  { id: 102, name: "Mei Lin", elo: 950, img: "/images/v2/AI avatar/Intermediate/Mei Lin.png" },
  { id: 103, name: "Aleksandr", elo: 950, img: "/images/v2/AI avatar/Intermediate/Aleksandr.png" },
  { id: 104, name: "Priya", elo: 1000, img: "/images/v2/AI avatar/Intermediate/Priya.png" },
  { id: 105, name: "Oscar", elo: 1000, img: "/images/v2/AI avatar/Intermediate/Oscar.png" },
  { id: 106, name: "Linnea", elo: 1050, img: "/images/v2/AI avatar/Intermediate/Linnea.png" },
  { id: 107, name: "Kwame", elo: 1050, img: "/images/v2/AI avatar/Intermediate/Kwame.png" },
  { id: 108, name: "Yuki", elo: 1100, img: "/images/v2/AI avatar/Intermediate/Yuki.png" },
  { id: 109, name: "Henrik", elo: 1100, img: "/images/v2/AI avatar/Intermediate/Henrik.png" },
  { id: 110, name: "Fatima", elo: 1150, img: "/images/v2/AI avatar/Intermediate/Fatima.png" },
  { id: 111, name: "Lukas", elo: 1150, img: "/images/v2/AI avatar/Intermediate/Lukas.png" },
  { id: 112, name: "Anya", elo: 1200, img: "/images/v2/AI avatar/Intermediate/Anya.png" },
  { id: 113, name: "Rashid", elo: 1200, img: "/images/v2/AI avatar/Intermediate/Rashid.png" },
  { id: 114, name: "Camille", elo: 1250, img: "/images/v2/AI avatar/Intermediate/Camille.png" },
  { id: 115, name: "Jin", elo: 1250, img: "/images/v2/AI avatar/Intermediate/Jin.png" },
  { id: 116, name: "Zara", elo: 1300, img: "/images/v2/AI avatar/Intermediate/Zara.png" },
  { id: 117, name: "Mateo", elo: 1300, img: "/images/v2/AI avatar/Intermediate/Mateo.png" },
  { id: 118, name: "Ingeborg", elo: 1350, img: "/images/v2/AI avatar/Intermediate/Ingebong.png" },
  { id: 119, name: "Chen Wei", elo: 1350, img: "/images/v2/AI avatar/Intermediate/Chen Wei.png" },
  { id: 200, name: "Katarina", elo: 1500, img: "/images/v2/AI avatar/Advanced/Katarina.png" },
  { id: 201, name: "Magnuson", elo: 1500, img: "/images/v2/AI avatar/Advanced/Magnuson.png" },
  { id: 202, name: "Adaeze", elo: 1550, img: "/images/v2/AI avatar/Advanced/Adaeze.png" },
  { id: 203, name: "Vladimir", elo: 1550, img: "/images/v2/AI avatar/Advanced/Vladimir.png" },
  { id: 204, name: "Sakura", elo: 1600, img: "/images/v2/AI avatar/Advanced/Sakura.png" },
  { id: 205, name: "Erik", elo: 1600, img: "/images/v2/AI avatar/Advanced/Erik.png" },
  { id: 206, name: "Isabella", elo: 1650, img: "/images/v2/AI avatar/Advanced/Isabella.png" },
  { id: 207, name: "Bjorn", elo: 1650, img: "/images/v2/AI avatar/Advanced/Bjorn.png" },
  { id: 208, name: "Amara", elo: 1700, img: "/images/v2/AI avatar/Advanced/Amara.png" },
  { id: 209, name: "Sergei", elo: 1700, img: "/images/v2/AI avatar/Advanced/Sergei.png" },
  { id: 210, name: "Lucia", elo: 1750, img: "/images/v2/AI avatar/Advanced/Lucia.png" },
  { id: 211, name: "Nikolai", elo: 1750, img: "/images/v2/AI avatar/Advanced/Nikolai.png" },
  { id: 212, name: "Sun-Hee", elo: 1800, img: "/images/v2/AI avatar/Advanced/Sun-Hee.png" },
  { id: 213, name: "Dominik", elo: 1800, img: "/images/v2/AI avatar/Advanced/Dominik.png" },
  { id: 214, name: "Nadia", elo: 1850, img: "/images/v2/AI avatar/Advanced/Nadia.png" },
  { id: 215, name: "Andrei", elo: 1850, img: "/images/v2/AI avatar/Advanced/Andrei.png" },
  { id: 216, name: "Olivia", elo: 1900, img: "/images/v2/AI avatar/Advanced/Olivia.png" },
  { id: 217, name: "Hassan", elo: 1900, img: "/images/v2/AI avatar/Advanced/Hassan.png" },
  { id: 218, name: "Elise", elo: 1950, img: "/images/v2/AI avatar/Advanced/Elise.png" },
  { id: 219, name: "Sven", elo: 1950, img: "/images/v2/AI avatar/Advanced/Sven.png" },
  { id: 300, name: "Anastasia", elo: 2200, img: "/images/v2/AI avatar/Master/Anastasia.png" },
  { id: 301, name: "Maxim", elo: 2200, img: "/images/v2/AI avatar/Master/Maxim.png" },
  { id: 302, name: "Ximena", elo: 2250, img: "/images/v2/AI avatar/Master/Ximena.png" },
  { id: 303, name: "Gari", elo: 2250, img: "/images/v2/AI avatar/Master/Gari.png" },
  { id: 304, name: "Hiroshi", elo: 2300, img: "/images/v2/AI avatar/Master/Hiroshi.png" },
  { id: 305, name: "Svetlana", elo: 2300, img: "/images/v2/AI avatar/Master/Svetlana.png" },
  { id: 306, name: "Friedrich", elo: 2350, img: "/images/v2/AI avatar/Master/Friedrich.png" },
  { id: 307, name: "Miriam", elo: 2350, img: "/images/v2/AI avatar/Master/Miriam.png" },
  { id: 308, name: "Rajiv", elo: 2400, img: "/images/v2/AI avatar/Master/Rajiv.png" },
  { id: 309, name: "Natasha", elo: 2400, img: "/images/v2/AI avatar/Master/Natasha.png" },
  { id: 310, name: "Boris", elo: 2450, img: "/images/v2/AI avatar/Master/Boris.png" },
  { id: 311, name: "Lei", elo: 2450, img: "/images/v2/AI avatar/Master/Lei.png" },
  { id: 312, name: "Mikhail", elo: 2500, img: "/images/v2/AI avatar/Master/Mikhail.png" },
  { id: 313, name: "Valentina", elo: 2500, img: "/images/v2/AI avatar/Master/Valentina.png" },
  { id: 314, name: "Karlson", elo: 2550, img: "/images/v2/AI avatar/Master/Karlson.png" },
  { id: 315, name: "Diana", elo: 2550, img: "/images/v2/AI avatar/Master/Diana.png" },
  { id: 316, name: "Tigran", elo: 2600, img: "/images/v2/AI avatar/Master/Tigran.png" },
  { id: 317, name: "Aleksandra", elo: 2600, img: "/images/v2/AI avatar/Master/Aleksandra.png" },
  { id: 318, name: "Ivan", elo: 2650, img: "/images/v2/AI avatar/Master/Ivan.png" },
  { id: 319, name: "Grandmaster", elo: 2700, img: "/images/v2/AI avatar/Master/Grandmaster.png" },
];

export const AI_OPPONENT_ROSTER: AiRosterOpponent[] = [...RAW_ROSTER].sort(
  (a, b) => a.elo - b.elo
);

/** Strips a trailing "(AI)" marker from an opponent username, for display only. */
export function stripAiSuffix(username: string): string {
  return username.replace(/\s*\(AI\)\s*$/i, "").trim();
}

/** Finds the roster entry (with the original bot image) matching an API username like "Sofia (AI)". */
export function findRosterOpponentByName(username: string): AiRosterOpponent | undefined {
  const clean = stripAiSuffix(username).toLowerCase();
  return AI_OPPONENT_ROSTER.find((o) => o.name.toLowerCase() === clean);
}

/** The distinct ELO steps the roster actually offers, ascending. */
const ELO_RUNGS: number[] = Array.from(
  new Set(RAW_ROSTER.map((o) => o.elo))
).sort((a, b) => a - b);

/**
 * The ELO steps to recommend for a player: one rung below their nearest rung,
 * that rung, then upward — always `total` distinct steps.
 *
 * Deliberately walks the rungs the roster has rather than fixed ±50 targets.
 * The ladder is not evenly spaced: Beginner jumps 250/400/500/600/700/800/850
 * while Intermediate and up move in clean 50s. Targeting "userElo + 50" landed
 * between rungs in the Beginner range and resolved by nearest-with-ties, which
 * produced duplicate ELOs (a 691 player was offered 700/700/800/800), while the
 * same code looked correct above 900 where every target hit a rung exactly.
 */
export function recommendedEloRungs(
  userElo: number,
  below: number = RECOMMENDED_BELOW,
  total: number = RECOMMENDED_TOTAL
): number[] {
  if (ELO_RUNGS.length === 0) return [];

  // Nearest rung; `<=` makes an exact midpoint round up.
  let closest = 0;
  for (let i = 1; i < ELO_RUNGS.length; i++) {
    if (Math.abs(ELO_RUNGS[i] - userElo) <= Math.abs(ELO_RUNGS[closest] - userElo)) {
      closest = i;
    }
  }

  // Slide the window at either end of the ladder so the row is always full.
  const start = Math.min(
    Math.max(0, closest - below),
    Math.max(0, ELO_RUNGS.length - total)
  );
  return ELO_RUNGS.slice(start, start + total);
}

/**
 * Picks 4 recommended AI opponents around the player's ELO — one step below,
 * their own step, and the two above — one bot per step, so the row never
 * repeats a rating.
 */
export function pickRecommendedOpponents(userElo: number): AiRosterOpponent[] {
  const usedIds = new Set<number>();

  return recommendedEloRungs(userElo).map((elo) => {
    const bot =
      AI_OPPONENT_ROSTER.find((o) => o.elo === elo && !usedIds.has(o.id)) ??
      AI_OPPONENT_ROSTER.find((o) => o.elo === elo)!;
    usedIds.add(bot.id);
    return bot;
  });
}
