"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/agent/types";

interface AgentResponse {
  finalAnswer: string;
  iterations: number;
  trace: Message[];
  billing: { reported: boolean; customerId: string | null };
}

const fieldClass =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export default function AgentPage() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<"claude" | "openai">("claude");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch {
      setError("Impossible de contacter l'agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent IA</h1>
        <p className="text-muted-foreground">
          Boucle d&apos;agent multi-provider (Claude / OpenAI) avec appel d&apos;outils, facturée à
          l&apos;usage via Stripe Meters — un événement par run.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lancer un run</CardTitle>
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
            <CardDescription>
              {result.iterations} itération{result.iterations > 1 ? "s" : ""} ·{" "}
              {result.billing.reported ? "Facturé sur Stripe" : "Non facturé (Meter indisponible)"}
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
    </div>
  );
}
