'use client';
import ClientsDataTable from '@/components/clients/clients-data-table'; // Create this
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import Link from "next/link";

export default function ClientsListPage() {
	// Fetching logic handled by store, triggered in layout
	// Data accessed within ClientsDataTable

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Clients</h1>
				<Button asChild>
					<Link href="/clients/new">
						<UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
					</Link>
				</Button>
			</div>

			{/* The DataTable will fetch and display data */}
			<ClientsDataTable />
		</div>
	);
}