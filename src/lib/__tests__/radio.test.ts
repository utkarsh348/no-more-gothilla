import { describe, expect, it } from "vitest";
import type { RadioScript } from "@/lib/types";
import { buildRadioQueue } from "@/lib/radio";

const script: RadioScript = {
  id: "radio-gym-1",
  day: 1,
  mode: "gym",
  title: "Need and repair between sets",
  description: "Short recall drills.",
  estimatedMinutes: 6,
  audioPath: "/audio/day-1-gym.mp3",
  steps: [
    { kind: "english-prompt", text: "Say: I need water." },
    { kind: "pause", seconds: 4 },
    { kind: "kannada-answer", text: "Nanage neeru beku." },
  ],
};

describe("radio queue", () => {
  it("preserves gym prompt, pause, answer structure and MP3 path", () => {
    const queue = buildRadioQueue(script);

    expect(queue.audioPath).toBe("/audio/day-1-gym.mp3");
    expect(queue.steps.map((step) => step.kind)).toEqual([
      "english-prompt",
      "pause",
      "kannada-answer",
    ]);
    expect(queue.steps[1]).toMatchObject({ seconds: 4 });
  });
});
