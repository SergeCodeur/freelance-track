'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { MissionSchema, MissionStatus, missionStatuses } from '@/lib/schemas';
import { cn, formatDate } from "@/lib/utils";
import { useClientStore } from '@/store/client-store'; // Import client store
import { MissionWithClient, useMissionStore } from '@/store/mission-store';
import { useUserStore } from '@/store/user-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client, Mission } from '@prisma/client';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type MissionFormValues = z.infer<typeof MissionSchema>;

interface MissionFormProps {
	initialData: (Mission & { client: Client }) | null; // Null for create, object for edit
}

export default function MissionForm({ initialData }: MissionFormProps) {
	const router = useRouter();
	const { clients, loading: clientsLoading, fetchClients } = useClientStore();
	const { addMission, updateMission } = useMissionStore();
	const userCurrency = useUserStore((state) => state.user?.currency) ?? 'EUR';
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!initialData;

	// Fetch clients if not already loaded (e.g., on direct page access)
	useEffect(() => {
		if (clients.length === 0 && !clientsLoading) {
			fetchClients();
		}
	}, [clients, clientsLoading, fetchClients]);


	const form = useForm<MissionFormValues>({
		resolver: zodResolver(MissionSchema),
		defaultValues: initialData ? {
			title: initialData.title,
			clientId: initialData.clientId,
			amount: initialData.amount,
			// Ensure date is a Date object for the calendar
			date: initialData.date ? new Date(initialData.date) : new Date(),
			status: initialData.status as MissionStatus, // Cast to enum type
			comment: initialData.comment ?? '',
		} : {
			title: '',
			clientId: '',
			amount: undefined, // Use undefined for number inputs initially
			date: new Date(),
			status: 'pending', // Default status
			comment: '',
		},
	});

	const onSubmit = async (values: MissionFormValues) => {
		setIsSubmitting(true);
		try {
			const method = isEditing ? 'PUT' : 'POST';
			const url = isEditing ? `/api/missions/${initialData?.id}` : '/api/missions';

			// Ensure amount is a number before sending
			const dataToSend = {
				...values,
				amount: Number(values.amount),
				// Optionally add user's currency if not set on backend
				// currency: userCurrency // Already handled by backend using user session
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
			if (isEditing) {
				// We need client data to update the store correctly
				const updatedMissionWithClient = { ...initialData, ...result.mission }; // Merge result with potentially existing client data
				updateMission(updatedMissionWithClient as MissionWithClient); // Adjust type if needed based on API response
				toast.success("Mission mise à jour avec succès !");
			} else {
				// Fetch the newly created mission with client details for the store
				// Assuming the API returns the full mission object with the client nested
				const newMissionWithClient = result.mission as MissionWithClient; // Adjust type as per API response
				addMission(newMissionWithClient);
				useClientStore.getState().addMissionToClient(newMissionWithClient.clientId, newMissionWithClient);
				toast.success("Mission créée avec succès !");
			}

			// Redirect back to the missions list
			router.push('/missions');
			router.refresh(); // Refresh server components if needed

		} catch (error) {
			console.error("Mission form error:", error);
			toast.error((error as Error).message || "Une erreur s'est produite.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Titre de la mission</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Développement landing page" {...field} disabled={isSubmitting} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="clientId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Client</FormLabel>
							{clientsLoading ? (
								<div className="flex items-center space-x-2">
									<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Chargement des clients...</span>
								</div>
							) : (
								<Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionnez un client" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{clients.length === 0 && <SelectItem value="" disabled>Aucun client trouvé</SelectItem>}
										{clients.map((client) => (
											<SelectItem key={client.id} value={client.id}>
												{client.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<FormDescription>
								<Button type="button" variant="link" className="p-0 h-auto text-xs" onClick={() => router.push('/clients/new')}>
									Nouveau client ?
								</Button>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Montant ({userCurrency})</FormLabel>
								<FormControl>
									{/* Use type="number" but handle potential string values */}
									<Input
										type="number"
										step="0.01" // Allow decimals
										placeholder="1200.50"
										{...field}
										// Ensure value passed to input is string or number, handle undefined
										value={field.value === undefined ? '' : field.value}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))
										}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel className='mb-[10px]'>Date de livraison / fin</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
												disabled={isSubmitting}
											>
												{field.value ? (
													formatDate(field.value, 'PPP') // Long date format
												) : (
													<span>Choisir une date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value ? new Date(field.value) : undefined} // Ensure Date object
											onSelect={(date: Date | undefined) => field.onChange(date)} // Fix type here
											disabled={(date: Date) => date < new Date("1900-01-01") || isSubmitting}
											initialFocus
											locale={fr} // Use French locale for calendar
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Statut du paiement</FormLabel>
							<Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez un statut" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{missionStatuses.map(status => (
										<SelectItem key={status.value} value={status.value} className="capitalize">
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Commentaire (Optionnel)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Ajoutez une note ou un détail sur la mission..."
									className="resize-none"
									{...field}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>


				<div className="flex justify-end space-x-2 pt-4">
					<Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
						Annuler
					</Button>
					<Button type="submit" disabled={isSubmitting || clientsLoading}>
						{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Mettre à jour' : 'Ajouter la mission')}
					</Button>
				</div>
			</form>
		</Form>
	);
}