import { authConfig } from "@/lib/auth.config"; // Separate config for middleware
import NextAuth from "next-auth";
export const { auth: middleware } = NextAuth(authConfig); // Use the auth export directly

export const config = {
  matcher: [
    // Protéger tout sauf :
    // - `/` (page d’accueil)
    // - `/api/auth` (auth NextAuth)
    // - `/api/public` (ex: assets publics)
    // - `_next` (build Next.js)
    // - `favicon.ico`, fichiers statiques
    "/((?!^$|^/$|api/auth|api/public|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
