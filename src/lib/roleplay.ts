import type { RoleplayEvaluation, RoleplayScenario, RoleplayTurn } from "@/lib/types";

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function evaluateScriptedReply(turn: RoleplayTurn, reply: string): RoleplayEvaluation {
  const tokens = tokenize(reply);
  const keywordHits = turn.acceptedKeywords.filter((keyword) =>
    tokens.includes(keyword.toLowerCase()),
  ).length;
  const hasRespect = tokens.some((token) => ["saar", "sir", "madam", "maadi"].includes(token));
  const hasRepair = tokens.some((token) => ["repeat", "slow", "artha", "simple", "swalpa"].includes(token));
  const intentScore = Math.min(5, 2 + keywordHits);

  return {
    intentMatch: intentScore,
    understandableKannada: Math.min(5, Math.max(2, tokens.length >= 2 ? 4 : 2)),
    respectTone: hasRespect ? 5 : 3,
    continuation: intentScore >= 3 ? 4 : 2,
    repairStrategy: hasRepair ? 5 : 2,
    naturalness: keywordHits >= 2 ? 4 : 3,
    confidence: tokens.length >= 4 ? 4 : 3,
    whatWasGood: hasRepair
      ? "You kept the conversation alive with a repair move."
      : "You attempted the intent and stayed in the conversation.",
    whatWasUnclear: intentScore < 4 ? "Add one clear keyword from the situation." : "Meaning is clear enough.",
    betterSimpleVersion: turn.simpleReply,
    betterNaturalVersion: turn.naturalReply,
    reusablePattern: turn.reusablePattern,
    nextNpcLine: turn.nextNpcLine,
  };
}

export function getNextRoleplayTurn(scenario: RoleplayScenario, currentIndex: number) {
  return scenario.turns[currentIndex] ?? null;
}
