import { describe, expect, it } from "vitest";
import { content, requiredContentCounts, validateContent } from "@/lib/content";

describe("seed content contract", () => {
  it("meets every requested minimum content count", () => {
    const report = validateContent(content);

    expect(report.ok).toBe(true);
    expect(report.counts.curriculumDays).toBe(requiredContentCounts.curriculumDays);
    expect(report.counts.patterns).toBeGreaterThanOrEqual(requiredContentCounts.patterns);
    expect(report.counts.productionPrompts).toBeGreaterThanOrEqual(
      requiredContentCounts.productionPrompts,
    );
    expect(report.counts.generalDialogues).toBeGreaterThanOrEqual(
      requiredContentCounts.generalDialogues,
    );
    expect(report.counts.businessDialogues).toBeGreaterThanOrEqual(
      requiredContentCounts.businessDialogues,
    );
    expect(report.counts.srsItems).toBeGreaterThanOrEqual(requiredContentCounts.srsItems);
    expect(report.counts.gymScripts).toBe(requiredContentCounts.gymScripts);
    expect(report.counts.runningScripts).toBe(requiredContentCounts.runningScripts);
    expect(report.counts.commuteScripts).toBe(requiredContentCounts.commuteScripts);
  });

  it("contains named Bangalore and business-context coverage", () => {
    const allText = JSON.stringify(content).toLowerCase();

    for (const term of [
      "whitefield",
      "hoskote",
      "peenya",
      "bommasandra",
      "tally",
      "whatsapp",
      "workshop",
      "dispatch",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("does not ship placeholder-only content", () => {
    const report = validateContent(content);

    expect(report.placeholderHits).toEqual([]);
  });

  it("gives every day clear intent, goals, instructions, and real-world milestones", () => {
    const report = validateContent(content);
    const requiredModes = ["commute", "running-walking", "gym", "review", "mission"];

    expect(report.ok).toBe(true);
    for (const day of content.curriculumDays) {
      expect(day.intent.length).toBeGreaterThan(40);
      expect(day.goals.length).toBeGreaterThanOrEqual(3);
      expect(day.dailyInstruction.length).toBeGreaterThan(80);
      expect(day.dailyInstruction.toLowerCase()).toContain("gym");
      expect(day.dailyInstruction.toLowerCase()).toContain("commute");
      expect(day.milestones.map((milestone) => milestone.mode)).toEqual(
        expect.arrayContaining(requiredModes),
      );
      expect(day.milestones.every((milestone) => milestone.instruction.length > 30)).toBe(true);
    }
  });
});
