import { describe, expect, it } from "vitest";
import { missionLogToSrsItems } from "@/lib/mission";

describe("mission review generation", () => {
  it("turns mission failures into personalized SRS repair items", () => {
    const items = missionLogToSrsItems(
      {
        missionId: "mission-day-7",
        day: 7,
        person: "apartment security",
        said: "Swalpa slow aagi maatadi",
        reply: "Avaru location helidru",
        frozeAt: "when he answered quickly",
        understood: "he was asking for flat number",
        failedToSay: "Please send it on WhatsApp",
        switchedToEnglish: "yes, after the fast reply",
        tomorrowReview: "WhatsApp alli kalisi",
        createdAt: "2026-05-04T10:00:00.000Z",
      },
      new Date("2026-05-04T10:00:00.000Z"),
    );

    expect(items).toHaveLength(3);
    expect(items[0].type).toBe("repair-move");
    expect(items.map((item) => item.prompt).join(" ")).toContain(
      "apartment security",
    );
    expect(items.some((item) => item.answer.includes("WhatsApp alli kalisi"))).toBe(
      true,
    );
  });
});
