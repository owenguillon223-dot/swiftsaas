import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { determinerTon, genererEmailRelance } from "@/lib/relance/generate-reminder";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { RELANCE_STRIPE_PRICE_ID } from "@/lib/relance/constants";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const abonnement = await prisma.subscription.findFirst({
    where: { userId, stripePriceId: RELANCE_STRIPE_PRICE_ID, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!abonnement) return NextResponse.json({ error: "Abonnement RelanceIA requis." }, { status: 402 });

  const invoice = await prisma.invoice.findUnique({ where: { id: params.id } });
  if (!invoice || invoice.userId !== userId) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const joursDeRetard = Math.max(
    0,
    Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const ton = determinerTon(joursDeRetard);

  let email: { subject: string; content: string };
  try {
    email = await genererEmailRelance({ facture: invoice, ton, joursDeRetard });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Impossible de générer l'email de relance." },
      { status: 500 }
    );
  }

  let sent = false;
  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: invoice.clientEmail,
      subject: email.subject,
      text: email.content,
    });
    sent = true;
  } catch (erreurEmail) {
    console.error("[relance] Échec de l'envoi de l'email :", erreurEmail);
  }

  const [reminder] = await prisma.$transaction([
    prisma.reminderLog.create({
      data: { invoiceId: invoice.id, tone: ton, subject: email.subject, content: email.content, sent },
    }),
    prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: joursDeRetard > 0 ? "OVERDUE" : invoice.status },
    }),
  ]);

  return NextResponse.json({ reminder, sent });
}
