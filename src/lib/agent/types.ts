// Shared contract between the AI providers, the agent loop, tools, and the API layer.
// Every provider (Claude, OpenAI, ...) normalizes its native response shape into this
// vendor-neutral form so the agent loop never has to know which provider is behind it.

export type Role = "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface Message {
  role: Role;
  content: string;
  /** Present on assistant messages that requested tool calls. */
  toolCalls?: ToolCall[];
  /** Present on role: "tool" messages, links the result back to its call. */
  toolCallId?: string;
  /** Present on role: "tool" messages, the tool name (some providers require it). */
  toolName?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  /** JSON Schema for the tool's input. */
  inputSchema: Record<string, unknown>;
}

export type StopReason = "tool_use" | "end_turn" | "max_tokens";

export interface ProviderResponse {
  /** Assistant text for this turn, if any (can be empty when the turn is pure tool use). */
  content: string;
  toolCalls: ToolCall[];
  stopReason: StopReason;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIProvider {
  /** Machine-readable id, e.g. "claude" or "openai". */
  readonly id: string;
  chat(
    messages: Message[],
    tools: ToolDefinition[],
    options?: { systemPrompt?: string }
  ): Promise<ProviderResponse>;
}

export interface AgentTool {
  definition: ToolDefinition;
  execute(input: Record<string, unknown>): Promise<string>;
}
