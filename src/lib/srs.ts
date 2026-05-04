import type { SrsItem } from "@/lib/types";

const REVIEW_LADDER_DAYS = [0, 0.25, 1, 2, 4, 7, 10];

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags));
}

export function reviewSrsItem(item: SrsItem, score: number, reviewedAt: Date): SrsItem {
  const boundedScore = Math.max(0, Math.min(5, Math.round(score)));
  const next: SrsItem = {
    ...item,
    successScore: boundedScore,
    lastReviewedAt: reviewedAt.toISOString(),
  };

  if (boundedScore <= 2) {
    return {
      ...next,
      failCount: item.failCount + 1,
      interval: 0,
      ease: Math.max(1.3, item.ease - 0.2),
      dueAt: addHours(reviewedAt, 3).toISOString(),
      tags: uniqueTags([...item.tags, "audio-review", "simplify"]),
    };
  }

  if (boundedScore === 3) {
    return {
      ...next,
      interval: 1,
      ease: item.ease,
      dueAt: addDays(reviewedAt, 1).toISOString(),
      tags: item.tags.filter((tag) => tag !== "simplify"),
    };
  }

  const currentIndex = REVIEW_LADDER_DAYS.findIndex((days) => days >= item.interval);
  const nextLadderValue = REVIEW_LADDER_DAYS[Math.min(currentIndex + 1, REVIEW_LADDER_DAYS.length - 1)] ?? 4;
  const nextInterval = Math.max(nextLadderValue, item.interval === 0 ? 2 : item.interval * 2);

  return {
    ...next,
    interval: nextInterval,
    ease: Number((item.ease + (boundedScore === 5 ? 0.15 : 0.05)).toFixed(2)),
    dueAt: addDays(reviewedAt, nextInterval).toISOString(),
    tags: item.tags.filter((tag) => tag !== "simplify"),
  };
}

export function getDueItems(items: SrsItem[], now: Date) {
  return items
    .filter((item) => new Date(item.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function seedSrsState(items: SrsItem[], now: Date): SrsItem[] {
  return items.map((item) => ({
    ...item,
    dueAt: now.toISOString(),
    tags: [...item.tags],
    audioScript: [...item.audioScript],
    acceptedVariants: [...item.acceptedVariants],
  }));
}

export function calculateWeakTags(items: SrsItem[], tagPrefix?: string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    if ((item.successScore ?? 5) > 2 && item.failCount === 0) continue;
    for (const tag of item.tags) {
      if (!tagPrefix || tag.startsWith(tagPrefix)) {
        counts.set(tag, (counts.get(tag) ?? 0) + item.failCount + 1);
      }
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag.replace(`${tagPrefix ?? ""}`, ""));
}
