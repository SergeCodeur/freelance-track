import React from 'react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-secondary p-4">
			<div className="w-full max-w-md">
				{children}
			</div>
		</div>
	);
}