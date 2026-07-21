import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/ai";
import { runAgent } from "@/lib/agent/loop";
import { defaultTools } from "@/lib/tools/example-tool";
import { reportAgentRunUsage } from "@/lib/billing-meter";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { prompt?: unknown; provider?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: '"prompt" est requis.' }, { status: 400 });
  }

  const providerId = typeof body.provider === "string" ? body.provider : undefined;
  let provider;
  try {
    provider = getProvider(providerId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Provider inconnu." },
      { status: 400 }
    );
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Récupère ou crée le client Stripe associé à l'utilisateur, comme le fait
  // la route de checkout — un seul et même client Stripe sert abonnements et
  // facturation à l'usage de l'agent.
  let stripeCustomerId = utilisateur.stripeCustomerId;
  if (!stripeCustomerId) {
    const client = await stripe.customers.create({
      email: utilisateur.email,
      name: utilisateur.name ?? undefined,
      metadata: { userId: utilisateur.id },
    });
    stripeCustomerId = client.id;
    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { stripeCustomerId },
    });
  }

  let result;
  try {
    result = await runAgent({
      provider,
      tools: defaultTools,
      userMessage: prompt,
      systemPrompt: "Tu es un agent utile. Utilise les outils disponibles quand ils t'aident à répondre avec précision.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "L'exécution de l'agent a échoué." },
      { status: 500 }
    );
  }

  const { reported } = await reportAgentRunUsage({ customerId: stripeCustomerId });

  await prisma.agentRun.create({
    data: {
      userId: utilisateur.id,
      provider: provider.id,
      prompt,
      finalAnswer: result.finalAnswer,
      iterations: result.iterations,
      billed: reported,
    },
  });

  return NextResponse.json({
    finalAnswer: result.finalAnswer,
    iterations: result.iterations,
    trace: result.trace,
    billing: { reported, customerId: stripeCustomerId },
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const runs = await prisma.agentRun.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ runs });
}
