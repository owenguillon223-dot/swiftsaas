import OpenAI from "openai";
import type {
  AIProvider,
  Message,
  ProviderResponse,
  StopReason,
  ToolCall,
  ToolDefinition,
} from "@/lib/agent/types";

type CreateParams =
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
type OpenAIMessage = CreateParams["messages"][number];
type OpenAITool = NonNullable<CreateParams["tools"]>[number];

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Set it in your environment to use the OpenAI provider."
    );
  }
  return new OpenAI({ apiKey });
}

function toOpenAIMessages(
  messages: Message[],
  systemPrompt?: string
): OpenAIMessage[] {
  const result: OpenAIMessage[] = [];

  if (systemPrompt) {
    result.push({
      role: "system",
      content: systemPrompt,
    } as unknown as OpenAIMessage);
  }

  for (const message of messages) {
    if (message.role === "user") {
      result.push({
        role: "user",
        content: message.content,
      } as unknown as OpenAIMessage);
      continue;
    }

    if (message.role === "assistant") {
      const base: Record<string, unknown> = {
        role: "assistant",
        content: message.content,
      };
      if (message.toolCalls && message.toolCalls.length > 0) {
        base.tool_calls = message.toolCalls.map((toolCall) => ({
          id: toolCall.id,
          type: "function",
          function: {
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.input),
          },
        }));
      }
      result.push(base as unknown as OpenAIMessage);
      continue;
    }

    // role: "tool"
    result.push({
      role: "tool",
      tool_call_id: message.toolCallId ?? "",
      content: message.content,
    } as unknown as OpenAIMessage);
  }

  return result;
}

function toOpenAITools(tools: ToolDefinition[]): OpenAITool[] {
  return tools.map(
    (tool) =>
      ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      }) as unknown as OpenAITool
  );
}

function mapFinishReason(
  finishReason: string | null | undefined
): StopReason {
  switch (finishReason) {
    case "tool_calls":
      return "tool_use";
    case "length":
      return "max_tokens";
    case "stop":
    default:
      return "end_turn";
  }
}

export const openaiProvider: AIProvider = {
  id: "openai",
  async chat(
    messages: Message[],
    tools: ToolDefinition[],
    options?: { systemPrompt?: string }
  ): Promise<ProviderResponse> {
    const client = getClient();

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1",
      messages: toOpenAIMessages(messages, options?.systemPrompt),
      tools: tools.length > 0 ? toOpenAITools(tools) : undefined,
    });

    const choice = response.choices[0];
    if (!choice) {
      throw new Error("OpenAI response contained no choices.");
    }

    let content = choice.message.content ?? "";
    const toolCalls: ToolCall[] = [];

    for (const toolCall of choice.message.tool_calls ?? []) {
      if (toolCall.type !== "function") continue;

      let input: Record<string, unknown> = {};
      try {
        const parsed: unknown = JSON.parse(toolCall.function.arguments);
        if (parsed && typeof parsed === "object") {
          input = parsed as Record<string, unknown>;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        content += `\n[Failed to parse arguments for tool "${toolCall.function.name}": ${message}]`;
      }

      toolCalls.push({
        id: toolCall.id,
        name: toolCall.function.name,
        input,
      });
    }

    const usage: ProviderResponse["usage"] = response.usage
      ? {
          inputTokens: response.usage.prompt_tokens,
          outputTokens: response.usage.completion_tokens,
        }
      : undefined;

    return {
      content,
      toolCalls,
      stopReason: mapFinishReason(choice.finish_reason),
      usage,
    };
  },
};
