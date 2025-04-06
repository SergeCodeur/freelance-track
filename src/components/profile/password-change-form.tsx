'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordChangeSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type PasswordChangeFormValues = z.infer<typeof PasswordChangeSchema>;

export default function PasswordChangeForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = React.useState<string | null>(null);
	const [success, setSuccess] = React.useState<string | null>(null);

	const form = useForm<PasswordChangeFormValues>({
		resolver: zodResolver(PasswordChangeSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
	});

	const onSubmit = (values: PasswordChangeFormValues) => {
		setError(null);
		setSuccess(null);
		startTransition(async () => {
			try {
				const response = await fetch('/api/user/password', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values), // Send all fields including currentPassword
				});

				const result = await response.json();

				if (!response.ok) {
					setError(result.message || "Échec de la mise à jour du mot de passe");
					toast.error(result.message || "Échec de la mise à jour");
				} else {
					setSuccess("Mot de passe mis à jour avec succès !");
					toast.success("Mot de passe mis à jour !");
					form.reset(); // Clear form on success
				}

			} catch (error) {
				console.error("Password change error:", error);
				setError("Une erreur réseau ou serveur s'est produite.");
				toast.error("Une erreur s'est produite.");
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mot de passe actuel</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nouveau mot de passe</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" {...field} disabled={isPending} />
							</FormControl>
							<FormDescription>Minimum 8 caractères.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmNewPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmer le nouveau mot de passe</FormLabel>
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
				{success && (
					<div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
						<span className="font-semibold">Succès:</span> {success}
					</div>
				)}


				<div className="flex justify-end pt-4">
					<Button type="submit" disabled={isPending}>
						{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Changer le mot de passe'}
					</Button>
				</div>
			</form>
		</Form>
	);
}