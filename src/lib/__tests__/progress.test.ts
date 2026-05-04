import { describe, expect, it, vi } from "vitest";
import { createInitialProgress, loadProgress, saveProgress } from "@/lib/progress";

describe("local progress persistence", () => {
  it("saves and loads progress from browser localStorage", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    });

    const progress = createInitialProgress("2026-05-04T10:00:00.000Z");
    progress.minutes.listening = 12;
    progress.completedDays = [1, 2];

    saveProgress(progress);

    expect(loadProgress()?.minutes.listening).toBe(12);
    expect(loadProgress()?.completedDays).toEqual([1, 2]);
    vi.unstubAllGlobals();
  });
});
