"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, History, CheckCircle2, XCircle, Bot } from "lucide-react";
import type { Message } from "@/lib/agent/types";

interface AgentResponse {
  finalAnswer: string;
  iterations: number;
  trace: Message[];
  billing: { reported: boolean; customerId: string | null };
}

interface AgentRunSummary {
  id: string;
  provider: string;
  prompt: string;
  iterations: number;
  billed: boolean;
  createdAt: string;
}

const fieldClass =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export default function AgentPage() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<"claude" | "openai">("claude");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AgentRunSummary[]>([]);

  async function loadHistory() {
    const response = await fetch("/api/agent");
    if (response.ok) {
      const data = await response.json();
      setHistory(data.runs as AgentRunSummary[]);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function runAgent() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setResult(data as AgentResponse);
      loadHistory();
    } catch {
      setError("Impossible de contacter l'agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Agent IA</h1>
          <p className="text-muted-foreground">
            Boucle d&apos;agent multi-provider (Claude / OpenAI) avec appel d&apos;outils, facturée à
            l&apos;usage via Stripe Meters — un événement par run.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Lancer un run
          </CardTitle>
          <CardDescription>
            Exemple : « Combien font (48 + 17) * 3 ? » pour observer l&apos;agent appeler l&apos;outil
            calculatrice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Message</Label>
            <textarea
              id="prompt"
              className={`${fieldClass} min-h-24`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Demande quelque chose qui nécessite un calcul, ex : combien font (48 + 17) * 3 ?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <select
              id="provider"
              className={fieldClass}
              value={provider}
              onChange={(e) => setProvider(e.target.value as "claude" | "openai")}
            >
              <option value="claude">Claude</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <Button onClick={runAgent} disabled={loading || !prompt.trim()}>
            {loading ? "Exécution en cours..." : "Lancer l'agent"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Réponse finale</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              {result.iterations} itération{result.iterations > 1 ? "s" : ""} ·{" "}
              {result.billing.reported ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Facturé sur Stripe
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Non facturé (Meter indisponible)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-sm">{result.finalAnswer}</p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Trace d&apos;exécution</p>
              <ol className="space-y-2 text-sm">
                {result.trace.map((message, index) => (
                  <li key={index} className="rounded-md border border-input p-3">
                    <span className="font-medium">{message.role}</span>
                    {message.toolCalls && message.toolCalls.length > 0 ? (
                      <div className="mt-1 text-muted-foreground">
                        {message.toolCalls.map((call) => (
                          <div key={call.id}>
                            appelle <code>{call.name}</code>({JSON.stringify(call.input)})
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {message.content && (
                      <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                        {message.toolName ? `résultat de ${message.toolName} : ` : ""}
                        {message.content}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            Historique des runs
          </CardTitle>
          <CardDescription>
            Les {history.length} derniers runs de ton compte, avec leur statut de facturation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun run pour l&apos;instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-input text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Provider</th>
                    <th className="py-2 pr-4 font-medium">Prompt</th>
                    <th className="py-2 pr-4 font-medium">Itérations</th>
                    <th className="py-2 font-medium">Facturé</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((run) => (
                    <tr key={run.id} className="border-b border-input last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(run.createdAt))}
                      </td>
                      <td className="py-2 pr-4 capitalize">{run.provider}</td>
                      <td className="max-w-xs truncate py-2 pr-4">{run.prompt}</td>
                      <td className="py-2 pr-4">{run.iterations}</td>
                      <td className="py-2">
                        {run.billed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Facturé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Non facturé
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
