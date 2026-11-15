import { describe, it, expect } from "vitest";
import { handleExceptionScenario, CircuitBreaker } from "../src/services/exceptionHandler";

describe("Comprehensive Exception Handling (EXC-001–EXC-026 - TASK-050)", () => {
  it("provides polite fallback and queues alert on AI provider failure (EXC-001)", () => {
    const res = handleExceptionScenario("EXC-001");
    expect(res.handled).toBe(true);
    expect(res.userMessage).toContain("taking a little longer than usual");
    expect(res.developerAlertQueued).toBe(true);
  });

  it("trips circuit breaker after 5 consecutive failures and blocks execution", () => {
    const cb = new CircuitBreaker(5, 30000);
    expect(cb.canExecute()).toBe(true);

    for (let i = 0; i < 4; i++) {
      cb.recordFailure();
      expect(cb.canExecute()).toBe(true);
    }

    // 5th failure trips breaker
    cb.recordFailure();
    expect(cb.getState()).toBe("open");
    expect(cb.canExecute()).toBe(false);

    // Exception handler returns polite message
    const res = handleExceptionScenario("EXC-002");
    expect(res.circuitState).toBe("open");
    expect(res.userMessage).toContain("temporarily resting");
  });
});
