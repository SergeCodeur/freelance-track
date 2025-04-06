'use client';

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
import { ClientSchema } from '@/lib/schemas';
import { ClientWithMissions, useClientStore } from '@/store/client-store'; // Import client store
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type ClientFormValues = z.infer<typeof ClientSchema>;

interface ClientFormProps {
	initialData: Client | ClientWithMissions | null; // Null for create, object for edit
}

export default function ClientForm({ initialData }: ClientFormProps) {
	const router = useRouter();
	const { addClient, updateClient } = useClientStore();
	const [isPending, startTransition] = useTransition();
	const isEditing = !!initialData;

	const form = useForm<ClientFormValues>({
		resolver: zodResolver(ClientSchema),
		defaultValues: initialData ? {
			name: initialData.name,
			email: initialData.email ?? '', // Handle null
			phone: initialData.phone ?? '', // Handle null
		} : {
			name: '',
			email: '',
			phone: '',
		},
	});

	const onSubmit = (values: ClientFormValues) => {
		startTransition(async () => {
			try {
				const method = isEditing ? 'PUT' : 'POST';
				const url = isEditing ? `/api/clients/${initialData?.id}` : '/api/clients';

				// Prepare data, ensuring optional fields are null if empty strings
				const dataToSend = {
					...values,
					email: values.email || null,
					phone: values.phone || null,
				};

				const response = await fetch(url, {
					method: method,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(dataToSend),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.message || `Échec de la ${isEditing ? 'mise à jour' : 'création'}`);
				}

				// Update Zustand store
				const savedClient = result.client as ClientWithMissions; // Assume API returns client (maybe with empty missions array for new)

				if (isEditing) {
					// Ensure missions array exists if not returned by API for updates
					const clientToUpdate = {
						...initialData, // Keep existing missions from initialData if editing
						...savedClient // Override with updated fields
					};
					updateClient(clientToUpdate as ClientWithMissions);
					toast.success("Client mis à jour avec succès !");
				} else {
					addClient({ ...savedClient, missions: [] }); // Add new client with empty missions
					toast.success("Client créé avec succès !");
				}


				// Redirect back to the clients list
				router.push('/clients');
				router.refresh(); // Ensure server components update if necessary

			} catch (error) {
				console.error("Client form error:", error);
				toast.error((error as Error).message || "Une erreur s'est produite.");
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nom du client</FormLabel>
							<FormControl>
								<Input placeholder="Nom de l'entreprise ou contact" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email (Optionnel)</FormLabel>
							<FormControl>
								<Input type="email" placeholder="contact@entreprise.com" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
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
								<Input placeholder="+33 1 23 45 67 89" {...field} disabled={isPending} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>


				<div className="flex justify-end space-x-2 pt-4">
					<Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
						Annuler
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Mettre à jour' : 'Ajouter le client')}
					</Button>
				</div>
			</form>
		</Form>
	);
}