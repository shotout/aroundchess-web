// Flattened copy of the AI opponent roster defined in components/modal/StartPlayVSAI.tsx.
// Duplicated (not imported) deliberately -- StartPlayVSAI.tsx is a large, unaudited modal
// and this feature must not risk changing its behavior.

export interface AiRosterOpponent {
  id: number;
  name: string;
  elo: number;
  img: string;
}

interface DifficultyTier {
  key: string;
  min: number;
  max: number;
}

const DIFFICULTY_TIERS: DifficultyTier[] = [
  { key: "beginner", min: 250, max: 850 },
  { key: "intermediate", min: 900, max: 1350 },
  { key: "advanced", min: 1500, max: 1950 },
  { key: "master", min: 2200, max: 2700 },
];

const RAW_ROSTER: AiRosterOpponent[] = [
  { id: 0, name: "Thomas", elo: 250, img: "/play-vs-ai/thomas.png" },
  { id: 1, name: "Sofia", elo: 250, img: "/play-vs-ai/sofia.png" },
  { id: 2, name: "Pierre", elo: 400, img: "/play-vs-ai/pierre.png" },
  { id: 30, name: "Lieke", elo: 400, img: "/play-vs-ai/lieke.png" },
  { id: 3, name: "Ana", elo: 400, img: "/play-vs-ai/ana.png" },
  { id: 4, name: "Carlos", elo: 500, img: "/play-vs-ai/carlos.png" },
  { id: 5, name: "Lana", elo: 500, img: "/play-vs-ai/lana.png" },
  { id: 6, name: "Dimitri", elo: 500, img: "/play-vs-ai/dimitri.png" },
  { id: 7, name: "Marco", elo: 600, img: "/play-vs-ai/marco.png" },
  { id: 8, name: "Marie", elo: 600, img: "/play-vs-ai/marie.png" },
  { id: 9, name: "Elena", elo: 600, img: "/play-vs-ai/elena.png" },
  { id: 10, name: "Viktor", elo: 700, img: "/play-vs-ai/viktor.png" },
  { id: 11, name: "Delia", elo: 700, img: "/play-vs-ai/delia.png" },
  { id: 12, name: "Hans", elo: 700, img: "/play-vs-ai/hans.png" },
  { id: 13, name: "Igor", elo: 800, img: "/play-vs-ai/igor.png" },
  { id: 14, name: "Amel", elo: 800, img: "/play-vs-ai/amel.png" },
  { id: 15, name: "Lisa", elo: 800, img: "/play-vs-ai/lisa.png" },
  { id: 16, name: "Andreas", elo: 850, img: "/play-vs-ai/andreas.png" },
  { id: 17, name: "Astrid", elo: 850, img: "/play-vs-ai/astrid.png" },
  { id: 18, name: "Ingrid", elo: 850, img: "/play-vs-ai/ingrid.png" },
  { id: 100, name: "Naomi", elo: 900, img: "/play-vs-ai/naomi.png" },
  { id: 101, name: "Tobias", elo: 900, img: "/play-vs-ai/tobias.png" },
  { id: 102, name: "Mei Lin", elo: 950, img: "/play-vs-ai/meilin.png" },
  { id: 103, name: "Aleksandr", elo: 950, img: "/play-vs-ai/aleksandr.png" },
  { id: 104, name: "Priya", elo: 1000, img: "/play-vs-ai/priya.png" },
  { id: 105, name: "Oscar", elo: 1000, img: "/play-vs-ai/oscar.png" },
  { id: 106, name: "Linnea", elo: 1050, img: "/play-vs-ai/linnea.png" },
  { id: 107, name: "Kwame", elo: 1050, img: "/play-vs-ai/kwame.png" },
  { id: 108, name: "Yuki", elo: 1100, img: "/play-vs-ai/yuki.png" },
  { id: 109, name: "Henrik", elo: 1100, img: "/play-vs-ai/henrik.png" },
  { id: 110, name: "Fatima", elo: 1150, img: "/play-vs-ai/fatima.png" },
  { id: 111, name: "Lukas", elo: 1150, img: "/play-vs-ai/lukas.png" },
  { id: 112, name: "Anya", elo: 1200, img: "/play-vs-ai/anya.png" },
  { id: 113, name: "Rashid", elo: 1200, img: "/play-vs-ai/rashid.png" },
  { id: 114, name: "Camille", elo: 1250, img: "/play-vs-ai/camille.png" },
  { id: 115, name: "Jin", elo: 1250, img: "/play-vs-ai/jin.png" },
  { id: 116, name: "Zara", elo: 1300, img: "/play-vs-ai/zara.png" },
  { id: 117, name: "Mateo", elo: 1300, img: "/play-vs-ai/mateo.png" },
  { id: 118, name: "Ingeborg", elo: 1350, img: "/play-vs-ai/ingeborg.png" },
  { id: 119, name: "Chen Wei", elo: 1350, img: "/play-vs-ai/chenwei.png" },
  { id: 200, name: "Katarina", elo: 1500, img: "/play-vs-ai/katarina.png" },
  { id: 201, name: "Magnuson", elo: 1500, img: "/play-vs-ai/magnuson.png" },
  { id: 202, name: "Adaeze", elo: 1550, img: "/play-vs-ai/adaeze.png" },
  { id: 203, name: "Vladimir", elo: 1550, img: "/play-vs-ai/vladimir.png" },
  { id: 204, name: "Sakura", elo: 1600, img: "/play-vs-ai/sakura.png" },
  { id: 205, name: "Erik", elo: 1600, img: "/play-vs-ai/erik.png" },
  { id: 206, name: "Isabella", elo: 1650, img: "/play-vs-ai/isabella.png" },
  { id: 207, name: "Bjorn", elo: 1650, img: "/play-vs-ai/bjorn.png" },
  { id: 208, name: "Amara", elo: 1700, img: "/play-vs-ai/amara.png" },
  { id: 209, name: "Sergei", elo: 1700, img: "/play-vs-ai/sergei.png" },
  { id: 210, name: "Lucia", elo: 1750, img: "/play-vs-ai/lucia.png" },
  { id: 211, name: "Nikolai", elo: 1750, img: "/play-vs-ai/nikolai.png" },
  { id: 212, name: "Sun-Hee", elo: 1800, img: "/play-vs-ai/sunhee.png" },
  { id: 213, name: "Dominik", elo: 1800, img: "/play-vs-ai/dominik.png" },
  { id: 214, name: "Nadia", elo: 1850, img: "/play-vs-ai/nadia.png" },
  { id: 215, name: "Andrei", elo: 1850, img: "/play-vs-ai/andrei.png" },
  { id: 216, name: "Olivia", elo: 1900, img: "/play-vs-ai/olivia.png" },
  { id: 217, name: "Hassan", elo: 1900, img: "/play-vs-ai/hassan.png" },
  { id: 218, name: "Elise", elo: 1950, img: "/play-vs-ai/elise.png" },
  { id: 219, name: "Sven", elo: 1950, img: "/play-vs-ai/sven.png" },
  { id: 300, name: "Anastasia", elo: 2200, img: "/play-vs-ai/anastasia.png" },
  { id: 301, name: "Maxim", elo: 2200, img: "/play-vs-ai/maxim.png" },
  { id: 302, name: "Ximena", elo: 2250, img: "/play-vs-ai/ximena.png" },
  { id: 303, name: "Gari", elo: 2250, img: "/play-vs-ai/gari.png" },
  { id: 304, name: "Hiroshi", elo: 2300, img: "/play-vs-ai/hiroshi.png" },
  { id: 305, name: "Svetlana", elo: 2300, img: "/play-vs-ai/svetlana.png" },
  { id: 306, name: "Friedrich", elo: 2350, img: "/play-vs-ai/friedrich.png" },
  { id: 307, name: "Miriam", elo: 2350, img: "/play-vs-ai/miriam.png" },
  { id: 308, name: "Rajiv", elo: 2400, img: "/play-vs-ai/rajiv.png" },
  { id: 309, name: "Natasha", elo: 2400, img: "/play-vs-ai/natasha.png" },
  { id: 310, name: "Boris", elo: 2450, img: "/play-vs-ai/boris.png" },
  { id: 311, name: "Lei", elo: 2450, img: "/play-vs-ai/lei.png" },
  { id: 312, name: "Mikhail", elo: 2500, img: "/play-vs-ai/mikhail.png" },
  { id: 313, name: "Valentina", elo: 2500, img: "/play-vs-ai/valentina.png" },
  { id: 314, name: "Karlson", elo: 2550, img: "/play-vs-ai/karlson.png" },
  { id: 315, name: "Diana", elo: 2550, img: "/play-vs-ai/diana.png" },
  { id: 316, name: "Tigran", elo: 2600, img: "/play-vs-ai/tigran.png" },
  { id: 317, name: "Aleksandra", elo: 2600, img: "/play-vs-ai/aleksandra.png" },
  { id: 318, name: "Ivan", elo: 2650, img: "/play-vs-ai/ivan.png" },
  { id: 319, name: "Grandmaster", elo: 2700, img: "/play-vs-ai/grandmaster.png" },
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

function findTierForElo(elo: number): DifficultyTier {
  const withinRange = DIFFICULTY_TIERS.find((t) => elo >= t.min && elo <= t.max);
  if (withinRange) return withinRange;

  return DIFFICULTY_TIERS.reduce((closest, tier) => {
    const tierDistance = elo < tier.min ? tier.min - elo : elo - tier.max;
    const closestDistance = elo < closest.min ? closest.min - elo : elo - closest.max;
    return tierDistance < closestDistance ? tier : closest;
  });
}

/**
 * Picks up to 4 recommended AI opponents relative to the user's current ELO:
 * 1 nearest below, 1 from the user's own difficulty tier, and 2 nearest above.
 * Mirrors the slot structure of the backend's real /recommended-opponents
 * algorithm, applied to this static bot roster instead of a DB query of users.
 */
export function pickRecommendedOpponents(userElo: number): AiRosterOpponent[] {
  const picked: AiRosterOpponent[] = [];
  const usedIds = new Set<number>();

  const take = (candidate: AiRosterOpponent | undefined) => {
    if (candidate && !usedIds.has(candidate.id)) {
      picked.push(candidate);
      usedIds.add(candidate.id);
    }
  };

  const below = [...AI_OPPONENT_ROSTER]
    .filter((o) => o.elo < userElo)
    .sort((a, b) => b.elo - a.elo)[0];
  take(below);

  const tier = findTierForElo(userElo);
  const sameTier = AI_OPPONENT_ROSTER.filter(
    (o) => o.elo >= tier.min && o.elo <= tier.max && !usedIds.has(o.id)
  ).sort((a, b) => Math.abs(a.elo - userElo) - Math.abs(b.elo - userElo))[0];
  take(sameTier);

  const above = AI_OPPONENT_ROSTER.filter(
    (o) => o.elo > userElo && !usedIds.has(o.id)
  ).sort((a, b) => a.elo - b.elo);
  take(above[0]);
  take(above[1]);

  return picked;
}
