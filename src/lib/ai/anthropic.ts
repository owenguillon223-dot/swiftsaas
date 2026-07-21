import Anthropic from "@anthropic-ai/sdk";
import type {
  AIProvider,
  Message,
  ProviderResponse,
  StopReason,
  ToolCall,
  ToolDefinition,
} from "@/lib/agent/types";

type CreateParams = Anthropic.MessageCreateParamsNonStreaming;
type AnthropicMessage = CreateParams["messages"][number];
type AnthropicTool = NonNullable<CreateParams["tools"]>[number];

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Set it in your environment to use the Claude provider."
    );
  }
  return new Anthropic({ apiKey });
}

function toAnthropicMessages(messages: Message[]): AnthropicMessage[] {
  const result: AnthropicMessage[] = [];

  for (const message of messages) {
    if (message.role === "user") {
      result.push({ role: "user", content: message.content });
      continue;
    }

    if (message.role === "assistant") {
      const content: Array<Record<string, unknown>> = [];
      if (message.content) {
        content.push({ type: "text", text: message.content });
      }
      for (const toolCall of message.toolCalls ?? []) {
        content.push({
          type: "tool_use",
          id: toolCall.id,
          name: toolCall.name,
          input: toolCall.input,
        });
      }
      result.push({
        role: "assistant",
        content: content as unknown as AnthropicMessage["content"],
      });
      continue;
    }

    // role: "tool" — Anthropic expects this as a user message containing a
    // tool_result content block.
    result.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: message.toolCallId ?? "",
          content: message.content,
        },
      ] as unknown as AnthropicMessage["content"],
    });
  }

  return result;
}

function toAnthropicTools(tools: ToolDefinition[]): AnthropicTool[] {
  return tools.map(
    (tool) =>
      ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      }) as unknown as AnthropicTool
  );
}

function mapStopReason(stopReason: string | null): StopReason {
  switch (stopReason) {
    case "tool_use":
      return "tool_use";
    case "max_tokens":
      return "max_tokens";
    case "end_turn":
    default:
      return "end_turn";
  }
}

export const anthropicProvider: AIProvider = {
  id: "claude",
  async chat(
    messages: Message[],
    tools: ToolDefinition[],
    options?: { systemPrompt?: string }
  ): Promise<ProviderResponse> {
    const client = getClient();

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: options?.systemPrompt,
      messages: toAnthropicMessages(messages),
      tools: tools.length > 0 ? toAnthropicTools(tools) : undefined,
    });

    let content = "";
    const toolCalls: ToolCall[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        content += block.text;
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: (block.input ?? {}) as Record<string, unknown>,
        });
      }
    }

    return {
      content,
      toolCalls,
      stopReason: mapStopReason(response.stop_reason),
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  },
};
