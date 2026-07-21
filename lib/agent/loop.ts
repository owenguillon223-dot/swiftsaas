import type { AgentTool, AIProvider, Message, ToolDefinition } from "@/lib/types";

export interface AgentRunResult {
  finalAnswer: string;
  trace: Message[];
  iterations: number;
}

/**
 * The real agent loop: ask the provider for the next step, run whatever tools
 * it requested, feed the results back, and repeat until it stops asking for
 * tools (or we hit maxIterations as a runaway-loop guard).
 */
export async function runAgent(params: {
  provider: AIProvider;
  tools: AgentTool[];
  userMessage: string;
  systemPrompt?: string;
  maxIterations?: number;
}): Promise<AgentRunResult> {
  const { provider, tools, userMessage, systemPrompt, maxIterations = 8 } = params;
  const toolByName = new Map(tools.map((t) => [t.definition.name, t]));
  const toolDefinitions: ToolDefinition[] = tools.map((t) => t.definition);

  const messages: Message[] = [{ role: "user", content: userMessage }];

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const response = await provider.chat(messages, toolDefinitions, { systemPrompt });

    messages.push({
      role: "assistant",
      content: response.content,
      toolCalls: response.toolCalls.length > 0 ? response.toolCalls : undefined,
    });

    if (response.stopReason !== "tool_use" || response.toolCalls.length === 0) {
      return { finalAnswer: response.content, trace: messages, iterations: iteration };
    }

    for (const call of response.toolCalls) {
      const tool = toolByName.get(call.name);
      const result = tool
        ? await tool
            .execute(call.input)
            .catch((err: unknown) => `Error: ${err instanceof Error ? err.message : String(err)}`)
        : `Error: unknown tool "${call.name}"`;

      messages.push({
        role: "tool",
        content: result,
        toolCallId: call.id,
        toolName: call.name,
      });
    }
  }

  return {
    finalAnswer: "Agent stopped: reached the maximum number of iterations without a final answer.",
    trace: messages,
    iterations: maxIterations,
  };
}
