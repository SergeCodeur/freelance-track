'use client'; // Need client for fetching specific mission

import MissionForm from '@/components/missions/mission-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { MissionWithClient, useMissionStore } from '@/store/mission-store'; // Adjust path if needed
import { ArrowLeft, Terminal } from "lucide-react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditMissionPage() {
	const params = useParams();
	const missionId = params.id as string;
	const missions = useMissionStore((state) => state.missions);
	const fetchMissions = useMissionStore((state) => state.fetchMissions);
	const storeLoading = useMissionStore((state) => state.loading);
	const storeError = useMissionStore((state) => state.error);

	const [missionData, setMissionData] = useState<MissionWithClient | null | undefined>(undefined); // undefined = loading, null = not found

	useEffect(() => {
		// If missions are already loaded, find the specific one
		if (!storeLoading && missions.length > 0) {
			const foundMission = missions.find(m => m.id === missionId);
			setMissionData(foundMission || null);
		} else if (!storeLoading && missions.length === 0 && !storeError) {
			// If loading finished but missions are empty (e.g., page reload), trigger fetch
			console.log("Missions store empty, fetching...");
			fetchMissions();
		}
		// If still loading, missionData remains undefined
		else if (storeLoading) {
			setMissionData(undefined);
		}
		else if (storeError) {
			// Handle the case where fetching failed globally
			console.error("Error fetching missions from store:", storeError);
			setMissionData(null); // Indicate error state
		}

	}, [missionId, missions, storeLoading, storeError, fetchMissions]);


	if (missionData === undefined) { // Loading state
		return (
			<div className="space-y-6 max-w-2xl mx-auto">
				<Skeleton className="h-8 w-1/2" />
				<Card>
					<CardContent className="pt-6 space-y-4">
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-20 w-full" />
						<div className="flex justify-end space-x-2 pt-4">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (missionData === null) { // Not Found or Error state
		return (
			<div className="space-y-6 max-w-2xl mx-auto text-center">
				<Alert variant="destructive">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Mission Non Trouvée</AlertTitle>
					<AlertDescription>
						{storeError ? `Erreur lors du chargement des missions: ${storeError}` : `La mission avec l'ID ${missionId} n'a pas été trouvée.`}
					</AlertDescription>
				</Alert>
				<Button variant="outline" asChild>
					<Link href="/missions">
						<ArrowLeft className="mr-2 h-4 w-4" /> Retour aux missions
					</Link>
				</Button>
			</div>
		);
	}

	// Mission found, render the form
	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold tracking-tight">Modifier la Mission</h1>
			<Card>
				{/* <CardHeader>
                     <CardTitle>Détails de la mission</CardTitle>
                     <CardDescription>Mettez à jour les informations de la mission.</CardDescription>
                 </CardHeader> */}
				<CardContent className="pt-6">
					<MissionForm initialData={missionData} />
				</CardContent>
			</Card>
		</div>
	);
}