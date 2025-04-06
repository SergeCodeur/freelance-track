'use client';

import { DataTable } from '@/components/shared/data-table'; // Import generic DataTable
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { missionStatuses } from '@/lib/schemas'; // Import statuses
import { cn, formatCurrency, formatDate, getStatusBadgeColor, getStatusText } from '@/lib/utils';
import { MissionWithClient, useMissionStore } from '@/store/mission-store';
import { useUserStore } from '@/store/user-store';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ban, CheckCircle, CircleDollarSign, Clock, MoreHorizontal, Pencil, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { toast } from "sonner";


const StatusIcon = ({ status }: { status: string }) => {
	const lowerStatus = status?.toLowerCase();
	switch (lowerStatus) {
		case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
		case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
		case 'partial': return <CircleDollarSign className="h-4 w-4 text-blue-500" />;
		case 'cancelled': return <Ban className="h-4 w-4 text-red-500" />; // Or XCircle
		default: return <Clock className="h-4 w-4 text-gray-500" />;
	}
};

// Define the columns for the missions table
const getColumns = (
	currency: string,
	onDelete: (missionId: string) => void // Function to handle deletion
): ColumnDef<MissionWithClient>[] => [
		// Optional: Select column
		//    {
		//         id: 'select',
		//         header: ({ table }) => (
		//           <Checkbox
		//             checked={
		//               table.getIsAllPageRowsSelected() ||
		//               (table.getIsSomePageRowsSelected() && 'indeterminate')
		//             }
		//             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
		//             aria-label="Select all"
		//           />
		//         ),
		//         cell: ({ row }) => (
		//           <Checkbox
		//             checked={row.getIsSelected()}
		//             onCheckedChange={(value) => row.toggleSelected(!!value)}
		//             aria-label="Select row"
		//           />
		//         ),
		//         enableSorting: false,
		//         enableHiding: false,
		//      },
		{
			accessorKey: 'title',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Titre
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
		},
		{
			accessorKey: 'client.name', // Access nested data
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Client
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => row.original.client?.name ?? 'N/A',
			filterFn: (row, id, value) => { // Custom filter for nested object
				return row.original.client?.name?.toLowerCase().includes(value.toLowerCase());
			},
		},
		{
			accessorKey: 'amount',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className="text-right w-full justify-end"
					>
						Montant
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue('amount'));
				// Use the currency from the specific mission, fallback to user's default
				const missionCurrency = row.original.currency || currency || 'EUR';

				return <div className="text-right font-medium">{formatCurrency(amount, missionCurrency)}</div>;
			},
		},
		{
			accessorKey: 'date',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Date Limite
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div>{formatDate(row.getValue('date'), 'P')}</div>, // Short date format
		},
		{
			accessorKey: 'status',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Statut
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				return (
					<Badge variant="outline" className={cn("capitalize", getStatusBadgeColor(status))}>
						<StatusIcon status={status} />
						<span className='ml-1.5'>{getStatusText(status)}</span>
					</Badge>
				);
			},
			// Add filtering for status
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id)); // Check if status is in the selected filter values
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const mission = row.original;

				return (
					<AlertDialog> {/* Wrap DropdownMenu trigger in AlertDialogTrigger if needed for delete confirm */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Ouvrir menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem asChild>
									<Link href={`/missions/${mission.id}/edit`}>
										<Pencil className="mr-2 h-4 w-4" /> Modifier
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<AlertDialogTrigger asChild>
									<DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/50 dark:text-red-500 dark:focus:text-red-400" >
										<Trash2 className="mr-2 h-4 w-4" /> Supprimer
									</DropdownMenuItem>
								</AlertDialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Delete Confirmation Dialog */}
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action est irréversible. La mission &quot;{mission.title}&quot; sera définitivement supprimée.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								{/* Use the onDelete function passed via props */}
								<AlertDialogAction
									className="bg-destructive hover:bg-destructive/90"
									onClick={(e) => {
										e.preventDefault(); // Prevent default dialog closing if async op fails
										onDelete(mission.id);
									}}
								>
									Supprimer
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				);
			},
			enableSorting: false,
			enableHiding: false,
		},
	];


// The main component using the DataTable
export default function MissionsDataTable() {
	const { missions, loading, error, fetchMissions, removeMission } = useMissionStore();
	const userCurrency = useUserStore((state) => state.user?.currency) ?? 'EUR'; // Get user currency

	// Memoize columns to prevent recreation on every render
	// Pass delete handler to columns
	const handleDeleteMission = React.useCallback(async (missionId: string) => {
		const originalMissions = [...missions]; // Keep a copy for potential revert
		removeMission(missionId);

		try {
			const response = await fetch(`/api/missions/${missionId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete mission');
			}

			toast.success("Mission supprimée avec succès.");
		} catch (err) {
			const error = err instanceof Error ? err.message : 'An unknown error occurred';
			console.error("Failed to delete mission:", error);
			toast.error(`Erreur lors de la suppression: ${error}`);
			useMissionStore.setState({ missions: originalMissions });
		}
	}, [missions, removeMission]);


	const columns = useMemo(() => getColumns(userCurrency, handleDeleteMission), [userCurrency, handleDeleteMission]);

	// State for filtering
	const [statusFilter, setStatusFilter] = React.useState<string[]>([]);


	const filteredData = useMemo(() => {
		if (statusFilter.length === 0) return missions;
		return missions.filter(mission => statusFilter.includes(mission.status));
	}, [missions, statusFilter]);


	// Optionally reload data if an error occurred previously
	const handleRetry = () => {
		fetchMissions();
	};


	if (error) {
		return (
			<div className="text-center py-10">
				<XCircle className="mx-auto h-12 w-12 text-destructive" />
				<h3 className="mt-2 text-sm font-semibold text-destructive">Erreur de chargement des missions</h3>
				<p className="mt-1 text-sm text-muted-foreground">{error}</p>
				<div className="mt-6">
					<Button onClick={handleRetry}>
						Réessayer
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Status Filter Buttons */}
			<div className="flex flex-wrap gap-2 items-center">
				<span className="text-sm font-medium mr-2">Filtrer par statut:</span>
				<Button
					variant={statusFilter.length === 0 ? 'default' : 'outline'}
					size="sm"
					onClick={() => setStatusFilter([])}
				>
					Tous
				</Button>
				{missionStatuses.map((status) => (
					<Button
						key={status.value}
						variant={statusFilter.includes(status.value) ? 'secondary' : 'outline'}
						size="sm"
						onClick={() => {
							setStatusFilter(prev =>
								prev.includes(status.value)
									? prev.filter(s => s !== status.value) // Remove if exists
									: [...prev, status.value] // Add if not exists
							)
						}}
						className={cn(
							statusFilter.includes(status.value) && getStatusBadgeColor(status.value),
							"border" // ensure border consistency
						)}
					>
						<StatusIcon status={status.value} /> <span className='ml-1.5'>{status.label}</span>
					</Button>
				))}
			</div>

			{/* Pass memoized columns and filtered data */}
			<DataTable
				columns={columns}
				data={filteredData} // Use filtered data
				filterInputPlaceholder="Filtrer par titre..."
				filterColumnId="title" // Column ID to use for the main text filter
				isLoading={loading}
				loadingRowsCount={8} // Adjust skeleton row count if needed
			/>
		</div>
	);
}