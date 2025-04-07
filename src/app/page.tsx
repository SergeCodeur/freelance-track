"use client";

import FeatureCard from "@/components/landing/feature-card";
import LandingHeader from "@/components/landing/landing-header";
import TargetProfile from "@/components/landing/target-profil";
import Testimonial from "@/components/landing/testimonial";
import { Button } from "@/components/ui/button";
import { BarChart2, Brain, CheckCircle, Code, CreditCard, Mic, PenTool, Presentation, Target, Users } from 'lucide-react';
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const appName = "FreelanceTrack";
  const { theme } = useTheme()

  return (
    <>
      <LandingHeader />
      <div className="pt-16 bg-background text-foreground ">
        {/* Hero Section */}
        <section id="hero" className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30 px-4 py-20 text-center sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="w-full max-w-screen-md">
            <h1 className="scroll-m-20 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Gérez Vos Missions Freelance Sans Effort<span className="text-primary">.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              De la prospection au paiement, {appName} centralise le suivi de vos projets, revenus et clients pour vous libérer l&apos;esprit.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/signup">Commencer gratuitement</Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 flow-root">
            <div className="-m-2 rounded-xl bg-muted/20 p-2 ring-1 ring-inset ring-muted/30 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src={theme === "light" ? "/dashboard-view.png" : "/dashboard-view-black.webp"}
                alt={`${appName} application preview`}
                width={1200}
                height={605}
                className="rounded-md shadow-2xl ring-1 ring-muted/20 aspect-video object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 sm:py-24">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Tout ce dont vous avez besoin pour vous organiser</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">Simplifiez votre quotidien de freelance avec des outils conçus pour vous.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:gap-8 md:grid-cols-3">
              <FeatureCard icon={Target} title="Suivi des Missions" description="Organisez vos projets, deadlines et statuts en un seul endroit clair et accessible." />
              <FeatureCard icon={BarChart2} title="Gestion des Revenus" description="Visualisez vos gains passés et prévisionnels, filtrez par mois ou année." />
              <FeatureCard icon={Users} title="Centralisation Clients" description="Gardez une trace de vos contacts, projets associés et historique de paiements." />
              <FeatureCard icon={CreditCard} title="Suivi des Paiements" description="Ne manquez plus aucun paiement grâce au suivi des statuts (payé, en attente, partiel)." />
              <FeatureCard icon={Presentation} title="Statistiques Utiles" description="Obtenez une vue d'ensemble de votre activité avec des indicateurs clés." />
              <FeatureCard icon={CheckCircle} title="Simple et Intuitif" description="Une interface épurée pour vous concentrer sur l'essentiel, sans superflu." />
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section id="audience" className="w-full bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Conçu pour les indépendants exigeants</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">Que vous soyez développeur, designer, rédacteur ou consultant, {appName} s&apos;adapte à vous.</p>
            </div>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
              <TargetProfile icon={Code} label="Développeurs" />
              <TargetProfile icon={PenTool} label="Designers UI/UX" />
              <TargetProfile icon={Mic} label="Rédacteurs & SEO" />
              <TargetProfile icon={Brain} label="Consultants" />
              <TargetProfile icon={Users} label="Autres Créatifs" />
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section id="preview" className="w-full py-16 sm:py-24">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Une interface claire, des résultats immédiats</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">Visualisez l'état de votre activité en un clin d&apos;œil.</p>
            </div>
            <div className="rounded-xl bg-muted/20 p-2 ring-1 ring-inset ring-muted/30 lg:p-4">
              <Image
                src={theme === "light" ? "/dashboard-view.png" : "/dashboard-view-black.webp"}
                alt={`${appName} Dashboard View`}
                width={1200}
                height={750}
                className="rounded-md shadow-xl ring-1 ring-muted/20 aspect-video object-contain"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full bg-gradient-to-b from-secondary/30 via-background to-background py-16 sm:py-24">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Ce qu&apos;ils pensent de {appName}</h2>
            </div>
            <Testimonial />
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="w-full py-16 sm:py-24 text-center bg-gradient-to-t from-primary/10 via-background to-background">
          <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Prêt à reprendre le contrôle de votre activité freelance ?
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Créez votre compte gratuitement dès aujourd&apos;hui et découvrez comment {appName} peut simplifier votre gestion administrative.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild className="text-base sm:text-lg px-8 py-3">
                <Link href="/signup">Créer mon compte gratuit</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer Simple */}
        <footer className="py-8 border-t border-border/50">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {appName}. Tous droits réservés.
          </div>
        </footer>

      </div>
    </>
  );
}
