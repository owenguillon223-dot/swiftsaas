import { describe, expect, it, vi } from "vitest";
import { runAgent } from "./loop";
import type { AgentTool, AIProvider, ProviderResponse } from "./types";

function mockProvider(responses: ProviderResponse[]): AIProvider {
  let call = 0;
  return {
    id: "mock",
    chat: vi.fn(async () => {
      const response = responses[call];
      call += 1;
      if (!response) throw new Error("mockProvider ran out of scripted responses");
      return response;
    }),
  };
}

const echoTool: AgentTool = {
  definition: { name: "echo", description: "Echoes its input", inputSchema: {} },
  execute: vi.fn(async (input) => `echoed:${JSON.stringify(input)}`),
};

describe("runAgent", () => {
  it("returns immediately when the first response needs no tools", async () => {
    const provider = mockProvider([
      { content: "Bonjour !", toolCalls: [], stopReason: "end_turn" },
    ]);

    const result = await runAgent({ provider, tools: [], userMessage: "Salut" });

    expect(result.finalAnswer).toBe("Bonjour !");
    expect(result.iterations).toBe(1);
    expect(result.trace).toHaveLength(2); // user + assistant
  });

  it("executes requested tool calls and feeds results back before finishing", async () => {
    const provider = mockProvider([
      {
        content: "",
        toolCalls: [{ id: "call_1", name: "echo", input: { x: 1 } }],
        stopReason: "tool_use",
      },
      { content: "Fini.", toolCalls: [], stopReason: "end_turn" },
    ]);

    const result = await runAgent({ provider, tools: [echoTool], userMessage: "Utilise l'outil" });

    expect(result.finalAnswer).toBe("Fini.");
    expect(result.iterations).toBe(2);
    const toolMessage = result.trace.find((m) => m.role === "tool");
    expect(toolMessage?.content).toBe('echoed:{"x":1}');
    expect(toolMessage?.toolCallId).toBe("call_1");
  });

  it("reports an error result for an unknown tool instead of throwing", async () => {
    const provider = mockProvider([
      {
        content: "",
        toolCalls: [{ id: "call_1", name: "does_not_exist", input: {} }],
        stopReason: "tool_use",
      },
      { content: "Fini.", toolCalls: [], stopReason: "end_turn" },
    ]);

    const result = await runAgent({ provider, tools: [], userMessage: "..." });

    const toolMessage = result.trace.find((m) => m.role === "tool");
    expect(toolMessage?.content).toMatch(/unknown tool/);
  });

  it("stops after maxIterations instead of looping forever", async () => {
    const provider = mockProvider(
      Array.from({ length: 10 }, () => ({
        content: "",
        toolCalls: [{ id: "call_1", name: "echo", input: {} }],
        stopReason: "tool_use" as const,
      }))
    );

    const result = await runAgent({
      provider,
      tools: [echoTool],
      userMessage: "boucle",
      maxIterations: 3,
    });

    expect(result.iterations).toBe(3);
    expect(result.finalAnswer).toMatch(/maximum number of iterations/);
  });
});
