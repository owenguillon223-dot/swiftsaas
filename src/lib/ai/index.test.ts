import { describe, expect, it } from "vitest";
import { getProvider, anthropicProvider, openaiProvider } from "./index";

describe("getProvider", () => {
  it("returns the Claude provider by default", () => {
    expect(getProvider()).toBe(anthropicProvider);
  });

  it("returns the requested provider by id", () => {
    expect(getProvider("claude")).toBe(anthropicProvider);
    expect(getProvider("openai")).toBe(openaiProvider);
  });

  it("throws a clear error for an unknown provider id", () => {
    expect(() => getProvider("mistral")).toThrow(/Unknown AI provider/);
  });
});
