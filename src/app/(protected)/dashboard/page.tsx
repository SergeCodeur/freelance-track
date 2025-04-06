'use client';

import {
	Alert,
	AlertDescription,
	AlertTitle
} from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { AlertCircle, Briefcase, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useMemo } from 'react';

import RecentMissions from '@/components/dashboard/recent-missions';
import RevenueChart from '@/components/dashboard/revenue-chart';
import TotalMissions from '@/components/dashboard/total-missions';
import TotalRevenue from '@/components/dashboard/total-revenue';

import { useMissionStore } from '@/store/mission-store';
import { useUserStore } from '@/store/user-store';

export default function DashboardPage() {
	const user = useUserStore((state) => state.user);
	const {
		missions,
		loading: missionsLoading,
		error: missionsError,
		fetchMissions
	} = useMissionStore();

	const currency = user?.currency ?? 'EUR';

	const totalRevenue = useMemo(() => (
		missions.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0)
	), [missions]);

	const totalMissionsCount = useMemo(() => missions.length, [missions]);
	const pendingMissionsCount = useMemo(() =>
		missions.filter(m => m.status === 'pending').length
		, [missions]);

	const paidMissionsCount = useMemo(() =>
		missions.filter(m => m.status === 'paid').length
		, [missions]);

	const recentMissions = useMemo(() =>
		[...missions].sort((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		).slice(0, 3)
		, [missions]);

	if (missionsLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	if (missionsError) {
		return (
			<Alert variant="destructive" className="max-w-xl mx-auto mt-8">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger les missions. {missionsError}
					<button onClick={fetchMissions} className="ml-2 underline">Réessayer</button>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
				<p className="text-muted-foreground text-sm">
					Visualisez vos revenus et suivez vos missions.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				<TotalRevenue amount={totalRevenue} currency={currency} />
				<TotalMissions
					total={totalMissionsCount}
					pending={pendingMissionsCount}
					paid={paidMissionsCount}
				/>
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Statut des missions
						</CardTitle>
						<Briefcase className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalMissionsCount} <span className="text-sm text-muted-foreground font-normal">missions</span>
						</div>
						<div className="flex items-center text-xs text-muted-foreground mt-1">
							<CheckCircle className="w-4 h-4 mr-1 text-green-500" />
							{paidMissionsCount} payées
							<Clock className="w-4 h-4 ml-4 mr-1 text-yellow-500" />
							{pendingMissionsCount} en attente
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
				<div className="xl:col-span-3">
					<RevenueChart missions={missions} currency={currency} />
				</div>
				<div className="xl:col-span-2">
					<RecentMissions missions={recentMissions} currency={currency} />
				</div>
			</div>
		</div>
	);
}