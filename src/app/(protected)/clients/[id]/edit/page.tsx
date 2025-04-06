'use client';

import ClientForm from '@/components/clients/client-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from '@/lib/utils';
import { ClientWithMissions, useClientStore } from '@/store/client-store';
import { ArrowLeft, Terminal } from "lucide-react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditClientPage() {
	const params = useParams();
	const clientId = params.id as string;
	const clients = useClientStore((state) => state.clients);
	const fetchClients = useClientStore((state) => state.fetchClients);
	const storeLoading = useClientStore((state) => state.loading);
	const storeError = useClientStore((state) => state.error);

	const [clientData, setClientData] = useState<ClientWithMissions | null | undefined>(undefined); // undefined=loading, null=not found/error

	useEffect(() => {
		if (!storeLoading && clients.length > 0) {
			const foundClient = clients.find(c => c.id === clientId);
			setClientData(foundClient || null);
		} else if (!storeLoading && clients.length === 0 && !storeError) {
			console.log("Clients store empty, fetching...");
			fetchClients();
		} else if (storeLoading) {
			setClientData(undefined);
		} else if (storeError) {
			console.error("Error fetching clients from store:", storeError);
			setClientData(null);
		}
	}, [clientId, clients, storeLoading, storeError, fetchClients]);

	if (clientData === undefined) { // Loading state
		return (
			<div className="space-y-6 max-w-lg mx-auto">
				<Skeleton className="h-8 w-1/2" />
				<Card>
					<CardContent className="pt-6 space-y-4">
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<div className="flex justify-end space-x-2 pt-4">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (clientData === null) { // Not Found or Error state
		return (
			<div className="space-y-6 max-w-lg mx-auto text-center">
				<Alert variant="destructive">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Client Non Trouvé</AlertTitle>
					<AlertDescription>
						{storeError ? `Erreur lors du chargement des clients: ${storeError}` : `Le client avec l'ID ${clientId} n'a pas été trouvé.`}
					</AlertDescription>
				</Alert>
				<Button variant="outline" asChild>
					<Link href="/clients">
						<ArrowLeft className="mr-2 h-4 w-4" /> Retour aux clients
					</Link>
				</Button>
			</div>
		);
	}

	// Client found, render the form
	return (
		<div className="space-y-6 max-w-lg mx-auto">
			<h1 className="text-3xl font-bold tracking-tight">Modifier le Client</h1>
			<Card>
				<CardContent className="pt-6">
					<ClientForm initialData={clientData} />
				</CardContent>
			</Card>
			{/* Optionally, display associated missions here */}
			<AssociatedMissions client={clientData} />
		</div>
	);
}

// Optional component to display missions associated with the client on the edit page
const AssociatedMissions = ({ client }: { client: ClientWithMissions }) => {
	// You might need the mission store here as well, or pass missions through props
	// Filter missions based on client.id
	return (
		<Card>
			<CardHeader>
				<CardTitle>Missions Associées</CardTitle>
			</CardHeader>
			<CardContent>
				{client.missions && client.missions.length > 0 ? (
					<ul>
						{client.missions.map(mission => (
							<li key={mission.id}>{mission.title} - {formatCurrency(mission.amount, mission.currency)}</li>
						))}
					</ul>
				) : (
					<p className="text-muted-foreground">Aucune mission associée à ce client.</p>
				)}
			</CardContent>
		</Card>
	);
}