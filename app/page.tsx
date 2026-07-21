import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "4rem 1.5rem",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>SwiftSaaS</h1>
      <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
        Ship an AI agent product, not a chatbot demo — real tool-calling loop,
        multi-provider, billed per run via Stripe Meters.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/demo">Try the live demo &rarr;</Link>
      </p>
    </main>
  );
}
