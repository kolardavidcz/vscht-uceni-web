import { describe, expect, it, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  clearMemoryRateLimits,
} from "./rateLimit";

describe("rateLimiter (in-memory & header handling)", () => {
  beforeEach(() => {
    clearMemoryRateLimits();
  });

  it("extracts IP correctly from x-forwarded-for string", () => {
    const ip = getClientIp({ "x-forwarded-for": "198.51.100.42, 10.0.0.1" });
    expect(ip).toBe("198.51.100.42");
  });

  it("extracts IP from x-forwarded-for array", () => {
    const ip = getClientIp({ "x-forwarded-for": ["203.0.113.19", "10.0.0.1"] });
    expect(ip).toBe("203.0.113.19");
  });

  it("extracts IP from x-real-ip when forwarded-for is absent", () => {
    const ip = getClientIp({ "x-real-ip": "192.0.2.1" });
    expect(ip).toBe("192.0.2.1");
  });

  it("falls back to 127.0.0.1 when headers are missing", () => {
    const ip = getClientIp({});
    expect(ip).toBe("127.0.0.1");
  });

  it("permits requests within quota and blocks when limit is exceeded", async () => {
    const id = "test-client-1";
    const action = "test-action";

    // 3 requests allowed in 60s
    const r1 = await checkRateLimit(id, action, 3, 60);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await checkRateLimit(id, action, 3, 60);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await checkRateLimit(id, action, 3, 60);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request must be blocked
    const r4 = await checkRateLimit(id, action, 3, 60);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it("isolates different actions and different identifiers", async () => {
    const r1 = await checkRateLimit("user-a", "action-1", 1, 60);
    expect(r1.allowed).toBe(true);

    // Exceeded for user-a on action-1
    const r2 = await checkRateLimit("user-a", "action-1", 1, 60);
    expect(r2.allowed).toBe(false);

    // user-b still has quota
    const r3 = await checkRateLimit("user-b", "action-1", 1, 60);
    expect(r3.allowed).toBe(true);

    // user-a has quota on action-2
    const r4 = await checkRateLimit("user-a", "action-2", 1, 60);
    expect(r4.allowed).toBe(true);
  });
});
