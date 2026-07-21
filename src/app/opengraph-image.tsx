import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(99,91,255,0.18), transparent 55%), radial-gradient(circle at 85% 10%, rgba(168,85,247,0.16), transparent 50%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 36,
            fontWeight: 700,
            color: "#0a0a0f",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#615fff",
              color: "#fff",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            S
          </div>
          SwiftSaaS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 800,
            color: "#0a0a0f",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Boilerplate SaaS + Agent IA facturé à l&apos;usage
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#52525b",
            maxWidth: 850,
          }}
        >
          Auth, Stripe, dashboard, et un agent multi-provider (Claude / OpenAI) prêt pour production.
        </div>
      </div>
    ),
    { ...size }
  );
}
