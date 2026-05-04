import type { MissionLog, SrsItem } from "@/lib/types";

function itemFromFailure(
  log: MissionLog,
  idSuffix: string,
  prompt: string,
  answer: string,
  now: Date,
): SrsItem {
  return {
    id: `mission-${log.missionId}-${idSuffix}-${now.getTime()}`,
    type: "repair-move",
    prompt,
    answer,
    acceptedVariants: [answer.replace("maadi", "madi")],
    literalMeaning: answer,
    naturalMeaning: answer,
    audioScript: [prompt, answer],
    context: `${log.person} on day ${log.day}`,
    tags: ["mission-generated", "repair", "audio-review", `scenario:${log.person.toLowerCase()}`],
    firstSeenDay: log.day,
    dueAt: now.toISOString(),
    interval: 0,
    ease: 2.3,
    successScore: null,
    failCount: 0,
    lastReviewedAt: null,
  };
}

export function missionLogToSrsItems(log: MissionLog, now: Date): SrsItem[] {
  const items: SrsItem[] = [];
  if (log.frozeAt.trim()) {
    items.push(
      itemFromFailure(
        log,
        "freeze",
        `In a ${log.person} conversation, repair this freeze: ${log.frozeAt}`,
        "Swalpa slow aagi repeat maadi.",
        now,
      ),
    );
  }
  if (log.failedToSay.trim()) {
    items.push(
      itemFromFailure(
        log,
        "failed-line",
        `Say the line you missed with ${log.person}: ${log.failedToSay}`,
        log.tomorrowReview.trim() || "Naanu check maadi helthini.",
        now,
      ),
    );
  }
  if (log.tomorrowReview.trim()) {
    items.push(
      itemFromFailure(
        log,
        "tomorrow",
        `Bring this back tomorrow from the ${log.person} mission.`,
        log.tomorrowReview,
        now,
      ),
    );
  }
  return items;
}
