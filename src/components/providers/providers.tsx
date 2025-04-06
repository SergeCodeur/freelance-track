'use client';

import React from 'react';
import AuthProvider from './auth-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
	children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<AuthProvider>
			{/* Add ThemeProvider or other global providers here */}
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</AuthProvider>
	);
}