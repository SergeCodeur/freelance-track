import Providers from "@/components/providers/providers"; // Wrapper for all providers
import { Toaster } from "@/components/ui/sonner"; // Use Sonner
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FreelanceTrack",
  description: "Suivez vos missions, revenus et clients freelance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.variable
        )}
      >
        {/* Wrap with AuthProvider and other global providers */}
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}