'use client'
import LoginForm from "@/components/auth/login-form";
import SuspenseLoader from "@/components/auth/suspense-loader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Suspense } from "react";

export default function SignInPage() {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold tracking-tight">Connexion</CardTitle>
				<CardDescription>Accédez à votre espace FreelanceTrack</CardDescription>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<SuspenseLoader />}>
					<LoginForm />
				</Suspense>
			</CardContent>
			<CardFooter className="flex justify-center text-sm">
				<p className="text-muted-foreground">
					Pas encore de compte ?{' '}
					<Link href="/signup" className="font-medium text-primary hover:underline">
						Inscrivez-vous
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}