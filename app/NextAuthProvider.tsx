'use client'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
export default function NextAuthSessionProvider({ children, session }: { session: SessionProviderProps['session'], children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}