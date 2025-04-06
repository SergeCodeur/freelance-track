'use client';

import { DataTable } from '@/components/shared/data-table';
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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClientWithMissions, useClientStore } from '@/store/client-store';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Briefcase, Eye, MoreHorizontal, Pencil, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';

// Définition des colonnes du tableau clients sans utiliser onViewMissions
const getColumns = (onDelete: (clientId: string) => void): ColumnDef<ClientWithMissions>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Nom du Client
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) =>
			row.getValue('email') || <span className="text-muted-foreground">N/A</span>,
	},
	{
		accessorKey: 'phone',
		header: 'Téléphone',
		cell: ({ row }) =>
			row.getValue('phone') || <span className="text-muted-foreground">N/A</span>,
	},
	{
		id: 'missionCount',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Missions
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const count = row.original.missions?.length ?? 0;
			return (
				<Badge variant={count > 0 ? "secondary" : "outline"}>
					<Briefcase className="mr-1 h-3 w-3" /> {count}
				</Badge>
			);
		},
		sortingFn: (rowA, rowB) => {
			const countA = rowA.original.missions?.length ?? 0;
			const countB = rowB.original.missions?.length ?? 0;
			return countA - countB;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const client = row.original;
			return (
				<AlertDialog>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Ouvrir menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								{/* Trigger pour le dialogue "Voir Missions" */}
								<DialogTrigger asChild>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<Eye className="mr-2 h-4 w-4" /> Voir Missions
									</DropdownMenuItem>
								</DialogTrigger>
								<DropdownMenuItem asChild>
									<Link href={`/clients/${client.id}/edit`}>
										<Pencil className="mr-2 h-4 w-4" /> Modifier
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<AlertDialogTrigger asChild>
									<DropdownMenuItem
										className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/50 dark:text-red-500 dark:focus:text-red-400"
										onSelect={(e) => e.preventDefault()}
									>
										<Trash2 className="mr-2 h-4 w-4" /> Supprimer
									</DropdownMenuItem>
								</AlertDialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Contenu du dialogue "Voir Missions" */}
						<DialogContent className="sm:max-w-[625px]">
							<DialogHeader>
								<DialogTitle>Missions pour {client.name}</DialogTitle>
								<DialogDescription>
									Liste des missions associées à ce client.
								</DialogDescription>
							</DialogHeader>
							<div className="py-4 max-h-[60vh] overflow-y-auto">
								{client.missions && client.missions.length > 0 ? (
									<ul className="space-y-3">
										{client.missions.map(mission => (
											<li
												key={mission.id}
												className="flex justify-between items-center p-3 bg-muted/50 rounded-md text-sm"
											>
												<div>
													<span className="font-medium">{mission.title}</span>
													<span className="text-xs text-muted-foreground ml-2">
														({formatDate(mission.date, 'P')})
													</span>
												</div>
												<span className="font-semibold">
													{formatCurrency(mission.amount, mission.currency)}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground text-center py-4">
										Aucune mission trouvée pour ce client.
									</p>
								)}
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button type="button" variant="outline">
										Fermer
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>

						{/* Contenu du dialogue de confirmation de suppression */}
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action est irréversible. Le client &quot;{client.name}&quot; et toutes ses missions associées seront définitivement supprimés.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<AlertDialogAction
									className="bg-destructive hover:bg-destructive/90"
									onClick={(e) => {
										e.preventDefault();
										onDelete(client.id);
									}}
								>
									Supprimer
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</Dialog>
				</AlertDialog>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];

// Composant principal utilisant DataTable
export default function ClientsDataTable() {
	const { clients, loading, error, fetchClients, removeClient } = useClientStore();

	// Suppression de selectedClientMissions si non utilisé

	// Déclaration de handleDeleteClient avec useCallback pour éviter de le recréer à chaque render
	const handleDeleteClient = useCallback(async (clientId: string) => {
		const originalClients = [...clients];
		// Mise à jour optimiste
		removeClient(clientId);

		try {
			const response = await fetch(`/api/clients/${clientId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Échec de la suppression du client');
			}

			toast.success("Client supprimé avec succès.");
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
			console.error("Échec de la suppression du client:", errorMsg);
			toast.error(`Erreur lors de la suppression: ${errorMsg}`);
			// Rétablir l'état initial en cas d'erreur
			useClientStore.setState({ clients: originalClients });
		}
	}, [clients, removeClient]);

	// On n'utilise plus handleViewMissions, on peut donc le retirer

	// useMemo avec dépendances
	const columns = useMemo(() => getColumns(handleDeleteClient), [handleDeleteClient]);

	const handleRetry = () => {
		fetchClients();
	};

	if (error) {
		return (
			<div className="text-center py-10">
				<XCircle className="mx-auto h-12 w-12 text-destructive" />
				<h3 className="mt-2 text-sm font-semibold text-destructive">
					Erreur de chargement des clients
				</h3>
				<p className="mt-1 text-sm text-muted-foreground">{error}</p>
				<div className="mt-6">
					<Button onClick={handleRetry}>Réessayer</Button>
				</div>
			</div>
		);
	}

	return (
		<>
			<DataTable
				columns={columns}
				data={clients}
				filterInputPlaceholder="Filtrer par nom de client..."
				filterColumnId="name"
				isLoading={loading}
				loadingRowsCount={5}
			/>
		</>
	);
}
