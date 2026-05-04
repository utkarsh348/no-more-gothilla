import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { getDayPlan } from "@/lib/day-plan";

describe("day-wise sprint plan", () => {
  it("loads selected day resources independently of progress current day", () => {
    const dayFive = getDayPlan(content, 5);
    const dayTen = getDayPlan(content, 10);

    expect(dayFive.day.day).toBe(5);
    expect(dayTen.day.day).toBe(10);
    expect(dayFive.radioScripts.gym?.day).toBe(5);
    expect(dayFive.radioScripts.running?.day).toBe(5);
    expect(dayFive.radioScripts.commute?.day).toBe(5);
    expect(dayFive.mission.day).toBe(5);
    expect(dayFive.shadowing.id).toBe(dayFive.day.shadowingSessionId);
    expect(dayFive.roleplay.id).toBe(dayFive.day.conversationScenarioId);
    expect(dayFive.businessModule.id).toBe(dayFive.day.businessAddonId);
    expect(dayTen.mission.day).toBe(10);
  });

  it("returns a complete command center model for UI rendering", () => {
    const plan = getDayPlan(content, 1);

    expect(plan.day.intent).toContain("spoken Kannada");
    expect(plan.day.goals.length).toBeGreaterThanOrEqual(3);
    expect(plan.day.dailyInstruction).toContain("commute");
    expect(plan.patterns.length).toBeGreaterThanOrEqual(2);
    expect(plan.dialogues).toHaveLength(2);
    expect(plan.reviewItems.length).toBeGreaterThanOrEqual(3);
  });
});
