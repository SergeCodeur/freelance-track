'use client';

import { LoginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react'; // Use client-side signIn
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'; // Get return URL
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: LoginFormValues) => {
		setError(null); // Reset error before new attempt
		startTransition(async () => {
			try {
				const result = await signIn('credentials', {
					redirect: false, // Important: Prevent NextAuth default redirect
					email: values.email,
					password: values.password,
					// callbackUrl: callbackUrl, // Pass callbackUrl here if needed, though we handle redirect manually
				});

				if (result?.error) {
					// Handle specific errors from NextAuth authorize function or general errors
					console.error("Sign in error:", result.error);
					if (result.error === "CredentialsSignin") {
						setError("Email ou mot de passe incorrect.");
					} else {
						setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
					}
					toast.error(error || "Échec de la connexion");
				} else if (result?.ok && !result.error) {
					// Sign-in was successful
					toast.success("Connexion réussie ! Redirection...");
					// Use router.push for client-side navigation AFTER successful sign-in
					router.push(callbackUrl); // Redirect to dashboard or intended page
					router.refresh(); // Optional: Force refresh to ensure layout updates
				} else {
					// Handle other unexpected cases
					setError("Une erreur inattendue s'est produite.");
					toast.error("Une erreur inattendue s'est produite.");
				}
			} catch (err) {
				console.error("Caught exception during sign in:", err);
				setError("Une erreur réseau ou serveur s'est produite.");
				toast.error("Erreur réseau ou serveur.");
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="exemple@email.com"
									{...field}
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mot de passe</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{error && (
					<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
						<span className="font-semibold">Erreur:</span> {error}
					</div>
				)}

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{isPending ? "connexion en cours" : "Se connecter"}
				</Button>
			</form>
		</Form>
	);
}