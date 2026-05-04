import type { UserProgress } from "@/lib/types";
import { content } from "@/lib/content";
import { seedSrsState } from "@/lib/srs";

const STORAGE_KEY = "kannada-comfort-sprint-progress";

export function createInitialProgress(nowIso = new Date().toISOString()): UserProgress {
  return {
    startedAt: nowIso,
    currentDay: 1,
    completedDays: [],
    completedSprints: [],
    minutes: {
      listening: 0,
      speaking: 0,
      shadowing: 0,
    },
    scores: {
      conversationReadiness: 12,
      fieldBusinessComfort: 5,
    },
    weakGrammarPatterns: ["beku / beda", "ide / illa"],
    weakListeningAreas: ["fast replies", "mixed Kannada-English"],
    weakRealLifeScenarios: ["apartment gate", "shop counter"],
    srsItems: seedSrsState(content.srsItems, new Date(nowIso)),
    missionLogs: [],
    radioSelfRatings: {},
  };
}

export function loadProgress(): UserProgress | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProgress;
  } catch {
    return null;
  }
}

export function saveProgress(progress: UserProgress) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getOrCreateProgress() {
  return loadProgress() ?? createInitialProgress();
}

export function resetProgress() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return createInitialProgress();
}
