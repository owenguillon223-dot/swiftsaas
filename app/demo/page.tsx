"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";

type Provider = "claude" | "openai";

interface AgentSuccessResponse {
  finalAnswer: string;
  iterations: number;
  trace: Message[];
  billing: { reported: boolean; customerId: string | null };
}

interface AgentErrorResponse {
  error: string;
}

function isErrorResponse(
  body: AgentSuccessResponse | AgentErrorResponse
): body is AgentErrorResponse {
  return "error" in body;
}

function TraceStep({ message }: { message: Message }) {
  if (message.toolCalls && message.toolCalls.length > 0) {
    return (
      <li>
        <strong>assistant</strong> called{" "}
        {message.toolCalls.map((call) => (
          <code key={call.id} style={{ marginRight: "0.5em" }}>
            {call.name}({JSON.stringify(call.input)})
          </code>
        ))}
        {message.content ? <div>{message.content}</div> : null}
      </li>
    );
  }

  if (message.role === "tool") {
    return (
      <li>
        <strong>tool</strong>
        {message.toolName ? ` (${message.toolName})` : ""} result:{" "}
        {message.content}
      </li>
    );
  }

  return (
    <li>
      <strong>{message.role}</strong>: {message.content}
    </li>
  );
}

export default function DemoPage() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<Provider>("claude");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAgent() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider }),
      });

      const body = (await res.json()) as AgentSuccessResponse | AgentErrorResponse;

      if (!res.ok || isErrorResponse(body)) {
        setError(isErrorResponse(body) ? body.error : "Request failed.");
        return;
      }

      setResult(body);
    } catch {
      setError("Network error — could not reach the agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1>Agent demo</h1>
      <p style={{ color: "var(--muted)" }}>
        Send a prompt to the live agent loop and watch it think, call tools,
        and answer — one Stripe-billable run per click.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something that needs a calculation, e.g. what is (48 + 17) * 3?"
          rows={4}
        />

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
          >
            <option value="claude">Claude</option>
            <option value="openai">OpenAI</option>
          </select>

          <button onClick={runAgent} disabled={loading || prompt.trim().length === 0}>
            {loading ? "Running..." : "Run agent"}
          </button>
        </div>
      </div>

      {error ? (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #dc2626",
            borderRadius: 6,
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      ) : null}

      {result ? (
        <div style={{ marginTop: "2rem" }}>
          <h2>Answer</h2>
          <p style={{ fontSize: "1.15rem" }}>{result.finalAnswer}</p>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            {result.iterations} iteration{result.iterations === 1 ? "" : "s"} &middot;{" "}
            {result.billing.reported
              ? "Billed to Stripe"
              : "Not billed (no Stripe key configured)"}
          </p>

          <h3>Trace</h3>
          <ol style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {result.trace.map((message, index) => (
              <TraceStep key={index} message={message} />
            ))}
          </ol>
        </div>
      ) : null}
    </main>
  );
}
