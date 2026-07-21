import type { AIProvider } from "@/lib/agent/types";
import { anthropicProvider } from "@/lib/ai/anthropic";
import { openaiProvider } from "@/lib/ai/openai";

export { anthropicProvider } from "@/lib/ai/anthropic";
export { openaiProvider } from "@/lib/ai/openai";

export function getProvider(id?: string): AIProvider {
  const resolvedId = id ?? process.env.DEFAULT_AI_PROVIDER ?? "claude";

  switch (resolvedId) {
    case "claude":
      return anthropicProvider;
    case "openai":
      return openaiProvider;
    default:
      throw new Error(
        `Unknown AI provider "${resolvedId}". Expected "claude" or "openai".`
      );
  }
}
