import type { RadioScript } from "@/lib/types";

export function buildRadioQueue(script: RadioScript): RadioScript {
  return {
    ...script,
    steps: script.steps.map((step) => ({ ...step })),
  };
}

export function scriptToSpeakableText(script: RadioScript) {
  return script.steps
    .filter((step) => step.kind !== "pause")
    .map((step) => step.text)
    .filter(Boolean)
    .join(". ");
}
