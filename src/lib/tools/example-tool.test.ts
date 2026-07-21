import { describe, expect, it } from "vitest";
import { calculatorTool } from "./example-tool";

describe("calculatorTool", () => {
  it("evaluates a valid arithmetic expression", async () => {
    const result = await calculatorTool.execute({ expression: "(48 + 17) * 3" });
    expect(result).toBe("195");
  });

  it("rejects expressions with unsupported characters", async () => {
    const result = await calculatorTool.execute({ expression: "process.exit(1)" });
    expect(result).toMatch(/^Error:/);
  });

  it("rejects expressions that don't evaluate to a finite number", async () => {
    const result = await calculatorTool.execute({ expression: "1 / 0" });
    expect(result).toMatch(/^Error:/);
  });

  it("handles a missing expression gracefully", async () => {
    const result = await calculatorTool.execute({});
    expect(result).toMatch(/^Error:/);
  });
});
