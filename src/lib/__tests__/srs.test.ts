import { describe, expect, it } from "vitest";
import type { SrsItem } from "@/lib/types";
import {
  getDueItems,
  reviewSrsItem,
  seedSrsState,
} from "@/lib/srs";

const baseItem: SrsItem = {
  id: "srs-test",
  type: "spoken-production",
  prompt: "Say: I need coffee.",
  answer: "Nanage coffee beku.",
  acceptedVariants: ["Nanage kaapi beku"],
  literalMeaning: "To me coffee need.",
  naturalMeaning: "I need coffee.",
  audioScript: ["Nanage coffee beku"],
  context: "tea stall",
  tags: ["need", "everyday"],
  firstSeenDay: 1,
  dueAt: "2026-05-04T09:00:00.000Z",
  interval: 0,
  ease: 2.5,
  successScore: null,
  failCount: 0,
  lastReviewedAt: null,
};

describe("SRS scheduling", () => {
  it("brings low scores back later the same day and marks them for audio review", () => {
    const reviewed = reviewSrsItem(
      baseItem,
      2,
      new Date("2026-05-04T10:00:00.000Z"),
    );

    expect(reviewed.failCount).toBe(1);
    expect(reviewed.successScore).toBe(2);
    expect(reviewed.tags).toContain("audio-review");
    expect(reviewed.tags).toContain("simplify");
    expect(reviewed.dueAt).toBe("2026-05-04T13:00:00.000Z");
  });

  it("schedules understandable slow production for the next day", () => {
    const reviewed = reviewSrsItem(
      { ...baseItem, interval: 0 },
      3,
      new Date("2026-05-04T10:00:00.000Z"),
    );

    expect(reviewed.successScore).toBe(3);
    expect(reviewed.interval).toBe(1);
    expect(reviewed.dueAt).toBe("2026-05-05T10:00:00.000Z");
  });

  it("expands confident answers through the 10-day review ladder", () => {
    const reviewed = reviewSrsItem(
      { ...baseItem, interval: 2, ease: 2.5 },
      5,
      new Date("2026-05-04T10:00:00.000Z"),
    );

    expect(reviewed.interval).toBe(4);
    expect(reviewed.ease).toBeGreaterThan(2.5);
    expect(reviewed.dueAt).toBe("2026-05-08T10:00:00.000Z");
  });

  it("returns only due items ordered by due time", () => {
    const due = getDueItems(
      [
        { ...baseItem, id: "later", dueAt: "2026-05-04T12:00:00.000Z" },
        { ...baseItem, id: "not-yet", dueAt: "2026-05-05T12:00:00.000Z" },
        { ...baseItem, id: "first", dueAt: "2026-05-04T08:00:00.000Z" },
      ],
      new Date("2026-05-04T13:00:00.000Z"),
    );

    expect(due.map((item) => item.id)).toEqual(["first", "later"]);
  });

  it("initializes seed state without mutating bundled seed items", () => {
    const seeded = seedSrsState([baseItem], new Date("2026-05-04T10:00:00.000Z"));

    expect(seeded[0]).not.toBe(baseItem);
    expect(seeded[0].dueAt).toBe("2026-05-04T10:00:00.000Z");
    expect(baseItem.dueAt).toBe("2026-05-04T09:00:00.000Z");
  });
});
