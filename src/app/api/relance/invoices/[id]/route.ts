import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const invoice = await prisma.invoice.findUnique({ where: { id: params.id } });
  if (!invoice || invoice.userId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.status !== "PAID") {
    return NextResponse.json({ error: "Seul le passage à PAID est supporté ici." }, { status: 400 });
  }

  const updated = await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "PAID" } });
  return NextResponse.json({ invoice: updated });
}
