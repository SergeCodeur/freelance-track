// src/lib/auth.ts
import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config"; // Import shared config

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Spread the shared config
  providers: [
    Credentials({
      // You can leave the `credentials` object empty if using a custom login form
      // credentials: {
      //   email: { label: "Email", type: "email" },
      //   password: { label: "Password", type: "password" }
      // },
      async authorize(credentials) {
        const parsedCredentials = CredentialsSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            console.log(
              "Authorize failed: User not found or no password set for",
              email
            );
            return null; // User not found or password not set
          }

          const passwordsMatch = await comparePassword(password, user.password);

          if (passwordsMatch) {
            console.log("Authorize success for", email);
            // Return the user object, ensuring sensitive data like password is not included
            // NextAuth automatically handles creating the session/JWT based on this user object
            const { password: _, ...userWithoutPassword } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
            // Ensure all required fields for the session/token are present
            return {
              id: userWithoutPassword.id,
              name: userWithoutPassword.name,
              email: userWithoutPassword.email,
              // Add other fields needed in session/token defined in callbacks
              country: userWithoutPassword.country,
              currency: userWithoutPassword.currency,
              freelancerType: userWithoutPassword.freelancerType,
              phone: userWithoutPassword.phone,
            };
          } else {
            console.log("Authorize failed: Password mismatch for", email);
          }
        } else {
          console.log(
            "Authorize failed: Invalid credentials format",
            parsedCredentials.error
          );
        }

        return null; // Return null if authentication fails
      },
    }),
    // Add other providers like Google, GitHub here if needed in the future
  ],
  // Callbacks are already defined in authConfig, no need to repeat unless overriding
  // callbacks: { ...authConfig.callbacks } // Can potentially override here if needed
  // Database Adapter (Optional for Credentials, but good practice if you add other providers)
  // adapter: PrismaAdapter(prisma), // Requires installing @auth/prisma-adapter
  session: { strategy: "jwt" }, // Explicitly state JWT strategy is often clearer
  secret: process.env.NEXTAUTH_SECRET, // Ensure secret is loaded
  // debug: process.env.NODE_ENV === 'development', // Optional debugging
});
