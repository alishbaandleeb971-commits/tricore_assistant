export interface ExceptionResponse {
  handled: boolean;
  userMessage: string;
  developerAlertQueued: boolean;
  circuitState?: "closed" | "open" | "half_open";
}

export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half_open" = "closed";
  private readonly threshold: number;
  private readonly resetTimeoutMs: number;

  constructor(threshold = 5, resetTimeoutMs = 30000) {
    this.threshold = threshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = "closed";
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = "open";
    }
  }

  canExecute(): boolean {
    if (this.state === "closed") return true;
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = "half_open";
        return true;
      }
      return false;
    }
    return true; // half_open
  }

  getState(): "closed" | "open" | "half_open" {
    return this.state;
  }
}

export function handleExceptionScenario(
  scenarioCode: string,
  _context?: Record<string, unknown>
): ExceptionResponse {
  switch (scenarioCode) {
    case "EXC-001": // AI provider timeout/failure
      return {
        handled: true,
        userMessage:
          "I am taking a little longer than usual to retrieve that information. Would you like to leave your email so our team can follow up directly?",
        developerAlertQueued: true
      };

    case "EXC-002": // Circuit breaker trip
      return {
        handled: true,
        userMessage:
          "Our automated assistant is temporarily resting. Please leave your contact details or reach us at contact@tricoredigitaltech.com.",
        developerAlertQueued: true,
        circuitState: "open"
      };

    case "EXC-003": // D1 database read failure
      return {
        handled: true,
        userMessage:
          "We are experiencing high traffic right now. Please leave your message and our team will get back to you shortly.",
        developerAlertQueued: true
      };

    default:
      return {
        handled: true,
        userMessage:
          "An unexpected error occurred. Please refresh or try again in a moment.",
        developerAlertQueued: true
      };
  }
}
