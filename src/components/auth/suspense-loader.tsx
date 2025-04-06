'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function SuspenseLoader({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm h-[200px]",
				className
			)}
		>
			<Loader2 className="h-6 w-6 animate-spin text-primary" />
			<span>Chargement du formulaire...</span>
		</div>
	);
}
