import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const corps = await request.json();
    const { token, password } = schema.parse(corps);

    const tokenEnBase = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (
      !tokenEnBase ||
      tokenEnBase.usedAt ||
      tokenEnBase.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Ce lien est invalide ou a expiré." },
        { status: 400 }
      );
    }

    const motDePasseHache = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenEnBase.userId },
        data: { password: motDePasseHache },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenEnBase.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (erreur) {
    if (erreur instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
