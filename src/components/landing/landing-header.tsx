'use client';

import ThemeToggle from '@/components/shared/theme-toggle'; // Réutilise ton ThemeToggle existant
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react'; // Import icons
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	onClick?: () => void; // Pour fermer le sheet mobile
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
	<Link
		href={href}
		className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		onClick={onClick}
	>
		{children}
	</Link>
);


export default function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10); // Devient vrai après 10px de scroll
		};

		window.addEventListener('scroll', handleScroll);
		// Appel initial pour vérifier la position au chargement
		handleScroll();

		// Nettoyage de l'écouteur
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	// Définir les liens de navigation
	const navItems = [
		{ href: "#features", label: "Fonctionnalités" },
		{ href: "#audience", label: "Pour Qui ?" },
		{ href: "#preview", label: "Aperçu" },
		{ href: "#testimonials", label: "Avis" },
	];

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 transition-all duration-300",
				isScrolled ? "border-b border-border/40 bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent border-transparent"
			)}
		>
			<div className="container mx-auto flex h-18 max-w-screen-lg items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo / Nom de l'app */}
				<Link href="/" className="flex items-center space-x-2 mr-6">
					<Image src={theme === "light" ? "/freelance-track-logo-black.webp" : "/freelance-track-logo-white.webp"} alt="FreelanceTrack Logo" width={171} height={46} priority />
				</Link>

				{/* Navigation Desktop */}
				<nav className="hidden md:flex items-center gap-6">
					{navItems.map(item => (
						<NavLink key={item.href} href={item.href}>
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Actions Desktop & Theme Toggle */}
				<div className="hidden md:flex items-center gap-x-3 ml-auto">
					<ThemeToggle />
					<Button variant="ghost" size="sm" asChild>
						<Link href="/signin">Se connecter</Link>
					</Button>
					<Button size="sm" asChild>
						<Link href="/signup">S'inscrire</Link>
					</Button>
				</div>

				{/* Mobile Menu Trigger & Theme Toggle */}
				<div className="flex items-center gap-x-2 md:hidden ml-auto">
					<ThemeToggle />
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Ouvrir le menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[280px] p-6">
							<SheetHeader>
								<SheetTitle>
									<VisuallyHidden>Menu de navigation</VisuallyHidden>
								</SheetTitle>
								<SheetDescription>
									<VisuallyHidden>Description de la sidebar</VisuallyHidden>
								</SheetDescription>
							</SheetHeader>
							{/* Navigation Mobile */}
							<nav className="flex flex-col space-y-4 mb-8">
								{navItems.map(item => (
									<SheetClose key={item.href} asChild>
										<NavLink href={item.href} onClick={closeMobileMenu}>
											{item.label}
										</NavLink>
									</SheetClose>
								))}
							</nav>

							{/* Actions Mobile */}
							<div className="flex flex-col space-y-3">
								<SheetClose asChild>
									<Button variant="outline" asChild>
										<Link href="/signin">Se connecter</Link>
									</Button>
								</SheetClose>
								<SheetClose asChild>
									<Button asChild>
										<Link href="/signup">S'inscrire gratuitement</Link>
									</Button>
								</SheetClose>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}