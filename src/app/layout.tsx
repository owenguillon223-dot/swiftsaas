import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwiftSaaS — Lancez votre SaaS en quelques jours",
  description:
    "Boilerplate SaaS clé en main en français : authentification, paiements Stripe, dashboard, tout est prêt pour production.",
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
