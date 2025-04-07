'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // For mobile
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Briefcase, LayoutDashboard, User, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Missions', href: '/missions', icon: Briefcase },
	{ name: 'Clients', href: '/clients', icon: Users },
	{ name: 'Profil', href: '/profile', icon: User },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
	const pathname = usePathname();
	const { theme } = useTheme();

	const content = (
		<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 border-r border-border">
			<div className="flex h-16 shrink-0 items-center justify-start mt-2">
				{/* Replace with your logo */}
				<Link href="/dashboard" className='text-primary font-bold text-xl'>
					<Image src={theme === "light" ? "/freelance-track-logo-black.webp" : "/freelance-track-logo-white.webp"} alt="FreelanceTrack Logo" width={171} height={46} priority />
				</Link>
			</div>
			<nav className="flex flex-1 flex-col">
				<ul role="list" className="flex flex-1 flex-col gap-y-7">
					<li>
						<ul role="list" className="-mx-2 space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className={cn(
											pathname.startsWith(item.href) // Check if current path starts with the item href
												? 'bg-primary/10 text-primary'
												: 'text-muted-foreground hover:text-primary hover:bg-primary/5',
											'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold items-center'
										)}
										onClick={() => setSidebarOpen(false)} // Close sidebar on mobile click
									>
										<item.icon
											className={cn(
												pathname.startsWith(item.href) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
												'h-4 w-4 shrink-0'
											)}
											aria-hidden="true"
										/>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</li>
					{/* Add Sign Out button or other elements at the bottom if desired */}
					{/* <li className="mt-auto"> ... </li> */}
				</ul>
			</nav>
		</div>
	);

	return (
		<>
			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
				{content}
			</div>

			{/* Mobile sidebar */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="w-64 p-0">
					<SheetHeader>
						<SheetTitle>
							<VisuallyHidden>Menu de navigation</VisuallyHidden>
						</SheetTitle>
					</SheetHeader>
					<SheetDescription>
						<VisuallyHidden>Description de la sidebar</VisuallyHidden>
					</SheetDescription>
					{content}
				</SheetContent>
			</Sheet>
		</>
	);
}