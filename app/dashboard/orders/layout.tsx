import DashboardNavbar from "../navbar";
import { AuthOptions } from '@/services/NextAuth/AuthOptions'
import { Metadata } from "next";
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
export const metadata: Metadata = {
    title: "Bean Cafe - Orders",
    description: 'Bean Cafe'
}
export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(AuthOptions)
    if (session?.user.role !== "admin") redirect("/home")
    return (
        <main className='h-full z-10 overflow-auto  w-full left-0 top-0 fixed bg-brand-white dark:bg-brand-secondary/20'>
            <DashboardNavbar />
            {children}
        </main>
    )
}