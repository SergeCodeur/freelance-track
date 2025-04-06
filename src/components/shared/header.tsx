'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from '@/store/user-store';
import { LogOut, Menu, User } from 'lucide-react'; // Import Settings
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';

interface HeaderProps {
	setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
	// Fetch user data directly from Zustand store after it's populated in the layout
	const user = useUserStore((state) => state.user);

	const getInitials = (name?: string | null) => {
		if (!name) return 'U'; // Default initial
		return name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2) // Max 2 initials
			.join('')
			.toUpperCase();
	};

	return (
		<header className="sticky top-0 z-30 flex py-4 h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
			{/* Mobile Menu Button */}
			<Button
				variant="ghost"
				size="icon"
				className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
				onClick={() => setSidebarOpen(true)}
			>
				<span className="sr-only">Ouvrir la sidebar</span>
				<Menu className="h-6 w-6" aria-hidden="true" />
			</Button>

			{/* Separator */}
			<div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

			{/* Spacer */}
			<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
				{/* Header Actions (e.g., Theme Toggle, Notifications) */}
				<div className="flex items-center gap-x-4">
					<ThemeToggle />
					{/* Add Notification Bell here if needed */}
				</div>


				{/* Profile dropdown */}
				{user && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="flex items-center gap-x-2 p-1.5 rounded-full">
								<span className="sr-only">Ouvrir le menu utilisateur</span>
								<Avatar className="h-8 w-8">
									{/* Assuming NextAuth provides user.image */}
									<AvatarImage src={user.image ?? undefined} alt={user.name ?? "Utilisateur"} />
									<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
								</Avatar>
								<span className="hidden lg:flex lg:items-center">
									<span className="ml-2 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
										{user.name ?? user.email}
									</span>
									{/* <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								<p className="text-sm font-medium">{user.name}</p>
								<p className="text-xs text-muted-foreground truncate">{user.email}</p>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/profile">
									<User className="mr-2 h-4 w-4" />
									<span>Profil</span>
								</Link>
							</DropdownMenuItem>
							{/* <DropdownMenuItem asChild>
                    <Link href="/settings"> Settings Link example
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Paramètres</span>
                    </Link>
                 </DropdownMenuItem> */}
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => signOut({ callbackUrl: '/signin' })}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Déconnexion</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}