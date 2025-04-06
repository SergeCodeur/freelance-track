'use client';
import MissionsDataTable from '@/components/missions/missions-data-table'; // Create this
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import Link from "next/link";

export default function MissionsListPage() {
	// Fetching logic is now handled by the store and triggered in layout
	// Data will be accessed within MissionsDataTable via useMissionStore

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Missions</h1>
				<Button asChild>
					<Link href="/missions/new">
						<PlusCircle className="mr-2 h-4 w-4" /> Ajouter une mission
					</Link>
				</Button>
			</div>

			{/* The DataTable will fetch and display data */}
			<MissionsDataTable />
		</div>
	);
}