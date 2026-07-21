import { Resend } from "resend";

let client: Resend | null = null;

// Instancié à la demande (pas au chargement du module) pour que build/tests
// ne plantent pas quand RESEND_API_KEY est absente — seul l'envoi d'un email
// échoue alors, pas tout le build.
export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY manquant : les emails ne peuvent pas être envoyés.");
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "SwiftSaaS <no-reply@votredomaine.com>";
