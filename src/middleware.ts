import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Routes protégées : accessibles uniquement aux utilisateurs connectés
const ROUTES_PROTEGEES = ["/dashboard"];

// Endpoints sensibles au brute force : limite de requêtes par IP
const ROUTES_LIMITEES = [
  { chemin: "/api/auth/register", limite: 5, fenetreMs: 5 * 60 * 1000 },
  { chemin: "/api/auth/callback/credentials", limite: 10, fenetreMs: 5 * 60 * 1000 },
  { chemin: "/api/auth/forgot-password", limite: 5, fenetreMs: 5 * 60 * 1000 },
];

export default auth((req) => {
  const estConnecte = !!req.auth;
  const cheminActuel = req.nextUrl.pathname;

  const routeLimitee = ROUTES_LIMITEES.find((r) => r.chemin === cheminActuel);
  if (routeLimitee && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSeconds } = rateLimit(
      `${routeLimitee.chemin}:${ip}`,
      routeLimitee.limite,
      routeLimitee.fenetreMs
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }
  }

  const estRouteProtegee = ROUTES_PROTEGEES.some((route) =>
    cheminActuel.startsWith(route)
  );

  if (estRouteProtegee && !estConnecte) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", cheminActuel);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/auth/register",
    "/api/auth/callback/credentials",
    "/api/auth/forgot-password",
  ],
};
