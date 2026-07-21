import { NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Lien de parrainage court (/r/CODE) : pose un cookie 30 jours puis redirige
// vers l'inscription. Le code n'est validé qu'à l'inscription, pas ici —
// un code invalide redirige simplement sans attribuer de parrainage.
export async function GET(request: Request, { params }: { params: { code: string } }) {
  const response = NextResponse.redirect(new URL("/register", APP_URL));
  response.cookies.set("referral_code", params.code, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
