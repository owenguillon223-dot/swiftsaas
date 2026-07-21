import type { AgentTool } from "@/lib/agent/types";

// Restricts input to digits/operators before evaluating, so Function() below
// can never see anything but arithmetic — no identifiers, no global access.
const SAFE_EXPRESSION = /^[0-9+\-*/().\s]+$/;

export const calculatorTool: AgentTool = {
  definition: {
    name: "calculator",
    description:
      "Evaluates a basic arithmetic expression (+, -, *, /, parentheses). Use this whenever the user asks for a numeric calculation instead of computing it yourself.",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: 'Arithmetic expression, e.g. "(12 + 30) * 2"',
        },
      },
      required: ["expression"],
    },
  },
  async execute(input) {
    const expression = String(input.expression ?? "");
    if (!SAFE_EXPRESSION.test(expression)) {
      return `Error: expression contains unsupported characters: "${expression}"`;
    }
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expression});`)();
      if (typeof result !== "number" || !Number.isFinite(result)) {
        return `Error: expression did not evaluate to a finite number.`;
      }
      return String(result);
    } catch {
      return `Error: could not evaluate expression "${expression}".`;
    }
  },
};

export const defaultTools: AgentTool[] = [calculatorTool];
