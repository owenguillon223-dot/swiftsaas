import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import ResetPasswordEmail from "@/emails/reset-password";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const corps = await request.json();
    const { email } = schema.parse(corps);

    const utilisateur = await prisma.user.findUnique({ where: { email } });

    // Toujours répondre 200, même si l'utilisateur n'existe pas (sécurité)
    if (!utilisateur) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 heure

    await prisma.passwordResetToken.create({
      data: { token, userId: utilisateur.id, expiresAt },
    });

    const lienReinitialisation = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      await getResend().emails.send({
        from: EMAIL_FROM,
        to: utilisateur.email,
        subject: "Réinitialisation de votre mot de passe",
        react: ResetPasswordEmail({ lien: lienReinitialisation }),
      });
    } catch (erreurEmail) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation :", erreurEmail);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
