import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes protégées : accessibles uniquement aux utilisateurs connectés
const ROUTES_PROTEGEES = ["/dashboard"];

export default auth((req) => {
  const estConnecte = !!req.auth;
  const cheminActuel = req.nextUrl.pathname;

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
  matcher: ["/dashboard/:path*"],
};
