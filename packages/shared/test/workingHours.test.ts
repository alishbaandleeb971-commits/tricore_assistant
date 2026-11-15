import { describe, it, expect } from "vitest";
import { isWithinPktWorkingHours } from "../src/workingHours";

describe("Working Hours Evaluator (PKT Timezone Math - TASK-026)", () => {
  it("evaluates true on Wednesday at 11:00 AM PKT", () => {
    // 11:00 AM PKT is 06:00 AM UTC
    const date = new Date("2026-11-18T06:00:00Z"); // Wednesday
    const res = isWithinPktWorkingHours(date);

    expect(res.isWithinWorkingHours).toBe(true);
    expect(res.pktHour).toBe(11);
    expect(res.reason).toBe("within_hours");
  });

  it("evaluates false on Sunday evening (weekend)", () => {
    const date = new Date("2026-11-15T14:00:00Z"); // Sunday 7:00 PM PKT
    const res = isWithinPktWorkingHours(date);

    expect(res.isWithinWorkingHours).toBe(false);
    expect(res.reason).toBe("weekend");
  });

  it("evaluates false on Tuesday at 8:00 PM PKT (outside hours)", () => {
    const date = new Date("2026-11-17T15:00:00Z"); // Tuesday 8:00 PM PKT
    const res = isWithinPktWorkingHours(date);

    expect(res.isWithinWorkingHours).toBe(false);
    expect(res.reason).toBe("outside_hours");
  });
});
