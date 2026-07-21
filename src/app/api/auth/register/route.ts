import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import WelcomeEmail from "@/emails/welcome";

const schemaInscription = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(request: Request) {
  try {
    const corps = await request.json();
    const donnees = schemaInscription.parse(corps);

    const utilisateurExistant = await prisma.user.findUnique({
      where: { email: donnees.email },
    });

    if (utilisateurExistant) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const motDePasseHache = await bcrypt.hash(donnees.password, 10);

    const utilisateur = await prisma.user.create({
      data: {
        name: donnees.name,
        email: donnees.email,
        password: motDePasseHache,
      },
    });

    // Envoi de l'email de bienvenue (non bloquant en cas d'échec)
    try {
      await getResend().emails.send({
        from: EMAIL_FROM,
        to: utilisateur.email,
        subject: "Bienvenue sur SwiftSaaS 🎉",
        react: WelcomeEmail({ nom: utilisateur.name ?? "" }),
      });
    } catch (erreurEmail) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue :", erreurEmail);
    }

    return NextResponse.json(
      { id: utilisateur.id, email: utilisateur.email },
      { status: 201 }
    );
  } catch (erreur) {
    if (erreur instanceof z.ZodError) {
      return NextResponse.json(
        { error: erreur.errors[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    console.error("Erreur lors de l'inscription :", erreur);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez plus tard." },
      { status: 500 }
    );
  }
}
