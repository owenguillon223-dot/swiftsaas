import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RELANCE_STRIPE_PRICE_ID } from "@/lib/relance/constants";

async function aUnAbonnementActif(userId: string) {
  const abonnement = await prisma.subscription.findFirst({
    where: { userId, stripePriceId: RELANCE_STRIPE_PRICE_ID, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  return Boolean(abonnement);
}

const schemaFacture = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  amountCents: z.number().int().positive(),
  currency: z.string().default("eur"),
  dueDate: z.string(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { userId: (session.user as { id: string }).id },
    include: { reminders: { orderBy: { createdAt: "desc" } } },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  if (!(await aUnAbonnementActif(userId))) {
    return NextResponse.json({ error: "Abonnement RelanceIA requis." }, { status: 402 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const donnees = schemaFacture.safeParse(body);
  if (!donnees.success) {
    return NextResponse.json({ error: donnees.error.errors[0]?.message ?? "Données invalides" }, { status: 400 });
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: (session.user as { id: string }).id,
      clientName: donnees.data.clientName,
      clientEmail: donnees.data.clientEmail,
      amountCents: donnees.data.amountCents,
      currency: donnees.data.currency,
      dueDate: new Date(donnees.data.dueDate),
    },
  });

  return NextResponse.json({ invoice }, { status: 201 });
}
