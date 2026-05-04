import { describe, expect, it } from "vitest";
import type { RoleplayScenario } from "@/lib/types";
import { evaluateScriptedReply, getNextRoleplayTurn } from "@/lib/roleplay";

const scenario: RoleplayScenario = {
  id: "dojo-repair-fast-kannada",
  track: "repair",
  title: "Fast apartment reply",
  setting: "Apartment gate",
  difficulty: 2,
  npcPersona: "security guard speaking quickly but politely",
  goals: ["ask for slow speech", "continue the conversation"],
  turns: [
    {
      npcLine: "Flat number yenu saar?",
      expectedIntent: "give flat number or ask to repeat slowly",
      simpleReply: "Swalpa slow aagi maatadi.",
      naturalReply: "Saar, swalpa slow aagi repeat maadi.",
      reusablePattern: "Swalpa ___ maadi",
      nextNpcLine: "Sari saar, flat number heli.",
      acceptedKeywords: ["slow", "repeat", "flat", "swalpa"],
    },
  ],
  tags: ["repair", "apartment"],
};

describe("scripted roleplay", () => {
  it("evaluates repair intent without over-penalizing imperfect grammar", () => {
    const evaluation = evaluateScriptedReply(
      scenario.turns[0],
      "swalpa repeat maadi saar",
    );

    expect(evaluation.intentMatch).toBeGreaterThanOrEqual(4);
    expect(evaluation.respectTone).toBeGreaterThanOrEqual(4);
    expect(evaluation.betterSimpleVersion).toBe("Swalpa slow aagi maatadi.");
    expect(evaluation.nextNpcLine).toBe("Sari saar, flat number heli.");
  });

  it("advances through scripted turns offline", () => {
    expect(getNextRoleplayTurn(scenario, 0)?.npcLine).toBe("Flat number yenu saar?");
    expect(getNextRoleplayTurn(scenario, 1)).toBeNull();
  });
});
