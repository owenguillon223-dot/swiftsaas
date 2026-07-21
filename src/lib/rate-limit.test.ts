import { describe, expect, it } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests up to the limit then blocks", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    expect(rateLimit(keyA, 1, 60_000).allowed).toBe(true);
    expect(rateLimit(keyA, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(keyB, 1, 60_000).allowed).toBe(true);
  });

  it("resets the window after it expires", async () => {
    const key = `expiring-${Math.random()}`;
    expect(rateLimit(key, 1, 10).allowed).toBe(true);
    expect(rateLimit(key, 1, 10).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(rateLimit(key, 1, 10).allowed).toBe(true);
  });
});
