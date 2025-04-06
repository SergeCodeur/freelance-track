// src/lib/auth.config.ts
import type { NextAuthConfig } from "next-auth";

// Notice this is only imports and exports configs
// We'll use this for middleware, and import it in our main auth.ts
export const authConfig = {
  pages: {
    signIn: "/signin", // Redirect to custom signin page
  },
  providers: [
    // Add providers here later if needed, but Credentials must be in the main auth.ts
    // due to reliance on Node.js APIs. For middleware, providers isn't strictly needed
    // unless you have specific logic tied to provider types here.
  ],
  // Required for middleware JWT validation
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthRoute = ["/signin", "/signup"].some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      const isOnPublicApi = nextUrl.pathname.startsWith("/api/public"); // Add public API routes if any
      const isOnRegisterApi = nextUrl.pathname.startsWith("/api/auth/register");

      if (isOnAuthRoute) {
        if (isLoggedIn) {
          // Redirect logged-in users from auth pages to dashboard
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true; // Allow access to auth routes if not logged in
      }

      // Allow access to registration API and any designated public API routes
      if (isOnRegisterApi || isOnPublicApi) {
        return true;
      }

      // For all other routes, user must be logged in
      if (!isLoggedIn) {
        // Redirect unauthenticated users to signin page, preserving the return URL
        const redirectUrl = nextUrl.pathname + nextUrl.search;
        const signInUrl = new URL("/signin", nextUrl);
        if (redirectUrl && redirectUrl !== "/") {
          signInUrl.searchParams.set("callbackUrl", redirectUrl);
        }
        return Response.redirect(signInUrl);
      }

      // Allow access if logged in and not on an auth route
      return true;
    },
    // Add other callbacks like jwt, session if needed for middleware/shared logic
    // But keep DB interactions in the main auth.ts callbacks
    jwt({ token, user }) {
      if (user) {
        // On sign in, add custom properties to the JWT token
        token.id = (user as { id: string }).id;
        token.name = user.name;
        token.email = user.email;
        token.country = user.country;
        token.currency = user.currency;
        token.freelancerType = user.freelancerType;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      // Add custom properties to the session object
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string;
        session.user.country = token.country as string | null;
        session.user.currency = token.currency as string | null;
        session.user.freelancerType = token.freelancerType as string | null;
        session.user.phone = token.phone as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
