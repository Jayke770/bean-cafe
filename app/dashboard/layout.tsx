import { Metadata } from 'next'
import DashboardNavbar from './navbar'
export const metadata: Metadata = {
    title: "Bean Cafe - Admin Dashboard",
    description: 'Bean Cafe'
}
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-full z-10 overflow-auto  w-full left-0 top-0 fixed bg-brand-white dark:bg-brand-secondary/20'>
            <DashboardNavbar />
            {children}
        </main>
    )
}