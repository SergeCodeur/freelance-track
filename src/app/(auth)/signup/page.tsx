import MultiStepSignupForm from "@/components/auth/multi-step-signup-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold tracking-tight">Inscription</CardTitle>
				<CardDescription>Créez votre compte FreelanceTrack</CardDescription>
			</CardHeader>
			<CardContent>
				<MultiStepSignupForm />
			</CardContent>
			<CardFooter className="flex justify-center text-sm">
				<p className="text-muted-foreground">
					Déjà un compte ?{' '}
					<Link href="/signin" className="font-medium text-primary hover:underline">
						Connectez-vous
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}