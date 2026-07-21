import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const TITRE = "SwiftSaaS — Boilerplate SaaS + Agent IA facturé à l'usage";
const DESCRIPTION =
  "Boilerplate SaaS clé en main en français : authentification, paiements Stripe, dashboard, et un agent IA multi-provider (Claude/OpenAI) facturé à l'usage via Stripe Meters. Prêt pour production.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITRE,
    template: "%s — SwiftSaaS",
  },
  description: DESCRIPTION,
  keywords: [
    "boilerplate SaaS",
    "SaaS Next.js",
    "agent IA",
    "Stripe Meters",
    "facturation à l'usage",
    "Claude API",
    "NextAuth",
  ],
  authors: [{ name: "SwiftSaaS" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "SwiftSaaS",
    title: TITRE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITRE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
