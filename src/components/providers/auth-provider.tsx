'use client'; // SessionProvider requires client component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
	children: React.ReactNode;
}

// This component solely wraps its children with NextAuth's SessionProvider.
// It doesn't contain the Zustand logic anymore, which is now in ProtectedLayout.
export default function AuthProvider({ children }: AuthProviderProps) {
	return (
		<SessionProvider>
			{children}
		</SessionProvider>
	);
}