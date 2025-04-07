import { authConfig } from "@/lib/auth.config";
import NextAuth from "next-auth";
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/clients/:path*",
    "/dashboard/:path*",
    "/clients/:path*",
    "/profile/:path*",
  ],
};
