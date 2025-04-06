import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // Basic landing page content for logged-out users
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-secondary">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl mb-6">
          FreelanceTrack
        </h1>
        <p className="text-lg leading-8 text-muted-foreground mb-8">
          Votre outil simple et efficace pour suivre vos missions, revenus et clients en tant que freelance.
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/signin">Se connecter</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Créer un compte</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}