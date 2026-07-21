import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";
import { runAgent } from "@/lib/agent/loop";
import { defaultTools } from "@/lib/tools/example-tool";
import { reportAgentRunUsage } from "@/lib/stripe/meter";

export async function POST(request: NextRequest) {
  let body: { prompt?: unknown; provider?: unknown; customerId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: '"prompt" is required.' }, { status: 400 });
  }

  const providerId = typeof body.provider === "string" ? body.provider : undefined;
  const customerId =
    typeof body.customerId === "string" && body.customerId
      ? body.customerId
      : process.env.STRIPE_DEFAULT_CUSTOMER_ID || null;

  let provider;
  try {
    provider = getProvider(providerId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown provider." },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await runAgent({
      provider,
      tools: defaultTools,
      userMessage: prompt,
      systemPrompt: "You are a helpful agent. Use tools when they help you answer accurately.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent run failed." },
      { status: 500 }
    );
  }

  let billing = { reported: false, customerId };
  if (customerId) {
    const { reported } = await reportAgentRunUsage({ customerId });
    billing = { reported, customerId };
  }

  return NextResponse.json({
    finalAnswer: result.finalAnswer,
    iterations: result.iterations,
    trace: result.trace,
    billing,
  });
}
