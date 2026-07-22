"use client";

import { useEffect, useState } from "react";
// Composant client : gestion des factures et relances. Le contrôle d'abonnement
// se fait dans page.tsx (server component) avant que ce composant ne soit rendu.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Send } from "lucide-react";

interface Reminder {
  id: string;
  tone: string;
  subject: string;
  content: string;
  sent: boolean;
  createdAt: string;
}

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  reminders: Reminder[];
}

const STATUT_LABELS: Record<Invoice["status"], string> = {
  PENDING: "En attente",
  PAID: "Payée",
  OVERDUE: "En retard",
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadInvoices() {
    const response = await fetch("/api/relance/invoices");
    if (response.ok) {
      const data = await response.json();
      setInvoices(data.invoices as Invoice[]);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function ajouterFacture(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/relance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          amountCents: Math.round(parseFloat(amount) * 100),
          dueDate,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Erreur lors de l'ajout.");
        return;
      }
      setClientName("");
      setClientEmail("");
      setAmount("");
      setDueDate("");
      loadInvoices();
    } finally {
      setLoading(false);
    }
  }

  async function envoyerRelance(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/relance/invoices/${id}/remind`, { method: "POST" });
      loadInvoices();
    } finally {
      setBusyId(null);
    }
  }

  async function marquerPayee(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/relance/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      loadInvoices();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">RelanceIA</h1>
          <p className="text-muted-foreground">Ajoute une facture impayée, l&apos;IA rédige et envoie la relance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajouter une facture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={ajouterFacture} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input id="clientName" required value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email du client</Label>
              <Input id="clientEmail" type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input id="amount" type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d&apos;échéance</Label>
              <Input id="dueDate" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="sm:col-span-2 w-fit">
              {loading ? "Ajout..." : "Ajouter la facture"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mes factures</CardTitle>
          <CardDescription>{invoices.length} facture(s) suivie(s).</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune facture pour l&apos;instant.</p>
          ) : (
            <div className="space-y-4">
              {invoices.map((facture) => (
                <div key={facture.id} className="rounded-lg border border-input p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{facture.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {(facture.amountCents / 100).toFixed(2)} {facture.currency.toUpperCase()} — échéance{" "}
                        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(facture.dueDate))}
                      </p>
                    </div>
                    <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {STATUT_LABELS[facture.status]}
                    </span>
                  </div>
                  {facture.status !== "PAID" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" disabled={busyId === facture.id} onClick={() => envoyerRelance(facture.id)}>
                        <Send className="h-3.5 w-3.5" />
                        {busyId === facture.id ? "Envoi..." : "Générer et envoyer une relance"}
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === facture.id} onClick={() => marquerPayee(facture.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Marquer payée
                      </Button>
                    </div>
                  )}
                  {facture.reminders.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-input pt-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        {facture.reminders.length} relance(s) envoyée(s)
                      </p>
                      {facture.reminders.map((r) => (
                        <div key={r.id} className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{r.subject}</span> — ton {r.tone} —{" "}
                          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(r.createdAt))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
