// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID. */
      id: string;
      /** The user's name. */
      name?: string | null;
      /** The user's email address. */
      email?: string | null;
      /** User's country code */
      country?: string | null;
      /** User's currency code */
      currency?: string | null;
      /** User's phone number */
      phone?: string | null;
      /** User's freelancer type */
      freelancerType?: string | null;
      // Add other properties you want accessible in the session
    } & DefaultSession["user"]; // Keep default properties like image
  }

  /** The shape of the user object returned in the OAuth provider profile */
  interface User {
    id: string; // Must match the database user ID type
    name?: string | null;
    email?: string | null;
    image?: string | null; // Default NextAuth field
    country?: string | null;
    currency?: string | null;
    phone?: string | null;
    freelancerType?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** User ID */
    id: string;
    /** User's name. */
    name?: string | null;
    /** User's email address. */
    email?: string | null;
    /** User's country code */
    country?: string | null;
    /** User's currency code */
    currency?: string | null;
    /** User's phone number */
    phone?: string | null;
    /** User's freelancer type */
    freelancerType?: string | null;
    /** OpenID ID Token */
    idToken?: string;
    picture?: string | null; // Keep default properties
    sub?: string; // Keep default properties
  }
}
