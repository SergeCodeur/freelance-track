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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { countries } from '@/constants/constants';
import { freelancerTypes, getCurrencyFromCountry } from '@/lib/location';
import { ProfileSchema } from '@/lib/schemas';
import { useUserStore } from '@/store/user-store'; // Import user store
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type ProfileFormValues = z.infer<typeof ProfileSchema>;

interface ProfileFormProps {
	initialData: { // Pass necessary fields from profile page
		name: string;
		email: string; // Display only
		phone: string;
		country: string;
		currency: string;
		freelancerType: string;
	};
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
	const { updateUser } = useUserStore(); // Get user and update action from store
	const [isPending, startTransition] = useTransition();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: initialData.name || '',
			phone: initialData.phone || '',
			country: initialData.country || '',
			currency: initialData.currency || '', // Store currency for potential validation, but derive from country
			freelancerType: initialData.freelancerType || '',
		},
		mode: 'onChange',
	});

	// --- Auto-update Currency based on Country ---
	const selectedCountry = form.watch('country');
	React.useEffect(() => {
		if (selectedCountry) {
			const derivedCurrency = getCurrencyFromCountry(selectedCountry);
			if (derivedCurrency && derivedCurrency !== form.getValues('currency')) {
				form.setValue('currency', derivedCurrency, { shouldValidate: true });
			}
		}
		// Only trigger when selectedCountry changes
	}, [selectedCountry, form]);


	const onSubmit = (values: ProfileFormValues) => {
		startTransition(async () => {
			try {
				// Prepare data for API, ensure derived currency is included
				const dataToUpdate = {
					...values,
					currency: getCurrencyFromCountry(values.country || ''), // Recalculate just in case
				};


				const response = await fetch('/api/user/profile', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(dataToUpdate),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.message || "Échec de la mise à jour du profil");
				}

				// Update Zustand store with the data returned from the API
				updateUser(result.user); // Assuming API returns the updated user object

				toast.success("Profil mis à jour avec succès !");
				// No redirection needed, stay on profile page
				// form.reset(result.user); // Optionally reset form with updated data

			} catch (error) {
				console.error("Profile update error:", error);
				toast.error((error as Error).message || "Une erreur s'est produite.");
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Display Email (Read Only) */}
				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input value={initialData.email} readOnly disabled className='bg-muted/50 cursor-not-allowed' />
					</FormControl>
					<FormDescription>L&apos;adresse e-mail ne peut pas être modifiée ici.</FormDescription>
				</FormItem>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nom complet</FormLabel>
							<FormControl>
								<Input placeholder="Jean Dupont" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pays</FormLabel>
							<Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez votre pays" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{countries.map((country) => (
										<SelectItem key={country.code} value={country.code}>
											{country.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Display Derived Currency (Read Only) */}
				<FormField
					control={form.control}
					name="currency" // Keep it in the form state for validation if needed
					render={({ field }) => (
						<FormItem>
							<FormLabel>Devise</FormLabel>
							<FormControl>
								<Input placeholder="Devise (auto)" {...field} readOnly disabled className='bg-muted/50 cursor-not-allowed' />
							</FormControl>
							<FormDescription>Définie automatiquement selon le pays.</FormDescription>
							<FormMessage /> {/* Show validation errors if schema requires it */}
						</FormItem>
					)}
				/>


				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Téléphone (Optionnel)</FormLabel>
							<FormControl>
								<Input placeholder="+33 6 12 34 56 78" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="freelancerType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type de freelance</FormLabel>
							<Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez votre domaine" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{freelancerTypes.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>


				<div className="flex justify-end pt-4">
					<Button type="submit" disabled={isPending || !form.formState.isDirty}> {/* Disable if no changes */}
						{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Enregistrer les modifications'}
					</Button>
				</div>
			</form>
		</Form>
	);
}