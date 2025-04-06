'use client';

import PasswordChangeForm from '@/components/profile/password-change-form';
import ProfileForm from '@/components/profile/profile-form';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from '@/store/user-store';

export default function ProfilePage() {
	const user = useUserStore((state) => state.user);

	if (!user) {
		return (
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="space-y-2">
					<Skeleton className="h-8 w-1/3" />
					<Skeleton className="h-5 w-1/2" />
				</div>

				<div className="space-y-6 bg-muted/30 p-6 rounded-xl shadow-sm">
					<Skeleton className="h-6 w-1/4" />
					<Skeleton className="h-4 w-1/2 mb-4" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>

				<div className="space-y-6 bg-muted/30 p-6 rounded-xl shadow-sm">
					<Skeleton className="h-6 w-1/4" />
					<Skeleton className="h-4 w-1/2 mb-4" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		);
	}

	const profileInitialData = {
		name: user.name ?? '',
		email: user.email ?? '',
		phone: user.phone ?? '',
		country: user.country ?? '',
		currency: user.currency ?? '',
		freelancerType: user.freelancerType ?? '',
	};

	return (
		<div className="max-w-3xl mx-auto space-y-10">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
				<p className="text-muted-foreground text-sm">
					Visualisez et modifiez les informations de votre compte.
				</p>
			</div>

			<div className="space-y-8">
				{/* Informations du compte */}
				<div className="bg-muted/30 rounded-xl p-6 shadow-sm">
					<h2 className="text-lg font-semibold mb-1">Informations du compte</h2>
					<p className="text-muted-foreground text-sm mb-6">
						Mettez à jour vos données personnelles et professionnelles.
					</p>
					<ProfileForm initialData={profileInitialData} />
				</div>

				<Separator />

				{/* Mot de passe */}
				<div className="bg-muted/30 rounded-xl p-6 shadow-sm">
					<h2 className="text-lg font-semibold mb-1">Changer le mot de passe</h2>
					<p className="text-muted-foreground text-sm mb-6">
						Choisissez un mot de passe sécurisé et facile à retenir.
					</p>
					<PasswordChangeForm />
				</div>
			</div>
		</div>
	);
}
