'use client'; // This layout needs client-side interactivity for sidebar/state

import Header from '@/components/shared/header';
import Sidebar from '@/components/shared/sidebar';
import { useClientStore } from '@/store/client-store';
import { useMissionStore } from '@/store/mission-store';
import { useUserStore } from '@/store/user-store';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { data: session, status } = useSession();
	const { setUser, user: zustandUser } = useUserStore();
	const fetchMissions = useMissionStore((state) => state.fetchMissions);
	const fetchClients = useClientStore((state) => state.fetchClients);


	useEffect(() => {
		if (session?.user && !zustandUser) {
			console.log("Setting user in Zustand store:", session.user);
			setUser(session.user);
			// Initial data fetching when user is available
			fetchMissions();
			fetchClients();
		}
	}, [session, zustandUser, setUser, fetchMissions, fetchClients]);

	if (status === 'loading') {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-16 w-16 animate-spin text-primary" />
			</div>
		);
	}

	if (status === 'unauthenticated' || !session?.user) {
		// This should technically be handled by middleware, but serves as a fallback.
		// In a real app, you might redirect here or show an access denied message.
		console.error("Access denied in ProtectedLayout: User not authenticated.");
		// router.push('/signin'); // Or handle appropriately
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Accès non autorisé. Redirection...</p>
				{/* Consider adding a redirect effect here */}
			</div>
		);
	}


	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Content area */}
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
				{/* Site header */}
				<Header setSidebarOpen={setSidebarOpen} />

				<main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:pl-64">
					<div className="mx-auto w-full max-w-7xls">{children}</div>
				</main>
			</div>
		</div>
	);
}