import { authConfig } from "@/lib/auth.config"; // Separate config for middleware
import NextAuth from "next-auth";
export const { auth: middleware } = NextAuth(authConfig); // Use the auth export directly

export const config = {
  // Match all routes except static files, _next, api/auth, and specific public paths
  matcher: [
    "/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
