import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import WelcomeEmail from "@/emails/welcome";

const schemaInscription = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

function genererCodeParrainage() {
  return crypto.randomBytes(5).toString("hex");
}

async function creerUtilisateurAvecCodeParrainage(data: {
  name: string;
  email: string;
  password: string;
  referredById?: string;
}) {
  for (let tentative = 0; tentative < 3; tentative++) {
    try {
      return await prisma.user.create({
        data: { ...data, referralCode: genererCodeParrainage() },
      });
    } catch (erreur) {
      const estConflitCode =
        erreur instanceof Prisma.PrismaClientKnownRequestError &&
        erreur.code === "P2002" &&
        (erreur.meta?.target as string[] | undefined)?.includes("referralCode");
      if (!estConflitCode) throw erreur;
    }
  }
  throw new Error("Impossible de générer un code de parrainage unique.");
}

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

    // Attribution du parrainage si un cookie de code valide est présent.
    const codeParrain = cookies().get("referral_code")?.value;
    let referredById: string | undefined;
    if (codeParrain) {
      const parrain = await prisma.user.findUnique({ where: { referralCode: codeParrain } });
      if (parrain) referredById = parrain.id;
    }

    const utilisateur = await creerUtilisateurAvecCodeParrainage({
      name: donnees.name,
      email: donnees.email,
      password: motDePasseHache,
      referredById,
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
