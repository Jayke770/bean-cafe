import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { redirect } from 'next/navigation'
export const metadata: Metadata = {
    title: "Bean Cafe - Admin Authentication",
    description: 'Bean Cafe'
}
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(AuthOptions)
    if (session) redirect("/dashboard")
    return (
        <main className='h-full z-10 overflow-hidden flex justify-center items-center w-full left-0 top-0 fixed bg-brand-white dark:bg-brand-secondary/20' >
            {children}
        </main>
    )
}