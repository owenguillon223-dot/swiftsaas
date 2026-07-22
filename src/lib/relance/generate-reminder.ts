import { getProvider } from "@/lib/ai";

export interface InvoiceForReminder {
  clientName: string;
  amountCents: number;
  currency: string;
  dueDate: Date;
}

export type ReminderTone = "amical" | "ferme" | "formel";

const SUJETS: Record<ReminderTone, string> = {
  amical: "Petit rappel concernant votre facture",
  ferme: "Relance : facture en attente de paiement",
  formel: "Mise en demeure : facture impayée",
};

// Le ton s'durcit avec le retard : rappel amical d'abord, jamais agressif
// dès le premier message — c'est contre-productif pour la relation client.
export function determinerTon(joursDeRetard: number): ReminderTone {
  if (joursDeRetard <= 7) return "amical";
  if (joursDeRetard <= 30) return "ferme";
  return "formel";
}

export async function genererEmailRelance(params: {
  facture: InvoiceForReminder;
  ton: ReminderTone;
  joursDeRetard: number;
  provider?: string;
}): Promise<{ subject: string; content: string }> {
  const { facture, ton, joursDeRetard } = params;
  const provider = getProvider(params.provider);

  const montant = (facture.amountCents / 100).toFixed(2);
  const echeance = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(facture.dueDate);

  const consignesParTon: Record<ReminderTone, string> = {
    amical: "Ton amical et décontracté, comme si tu envoyais un simple rappel à quelqu'un que tu apprécies. Suppose un oubli, pas une mauvaise foi.",
    ferme: "Ton professionnel et ferme, sans être agressif. Rappelle poliment mais clairement que le paiement est en retard et demande une régularisation sous 8 jours.",
    formel: "Ton formel et sérieux, dernier rappel avant action. Mentionne que sans régularisation sous 8 jours, des pénalités de retard légales pourront s'appliquer (conformément à l'article L441-10 du Code de commerce) et qu'une procédure de recouvrement pourra être engagée.",
  };

  const systemPrompt = `Tu rédiges des emails de relance de factures impayées pour des freelances/auto-entrepreneurs français. Réponds UNIQUEMENT avec le corps de l'email (pas d'objet, pas de balises, pas de guillemets autour), en français, signé de manière neutre par "[Votre nom]" à la fin. ${consignesParTon[ton]}`;

  const userMessage = `Rédige un email de relance pour :
- Client : ${facture.clientName}
- Montant dû : ${montant} ${facture.currency.toUpperCase()}
- Date d'échéance dépassée : ${echeance}
- Jours de retard : ${joursDeRetard}`;

  const response = await provider.chat([{ role: "user", content: userMessage }], [], { systemPrompt });

  return { subject: SUJETS[ton], content: response.content.trim() };
}
