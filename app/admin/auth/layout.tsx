import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "Bean Cafe - Admin Authentication",
    description: 'Bean Cafe'
}
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-full z-10 overflow-hidden flex justify-center items-center w-full left-0 top-0 fixed bg-brand-white dark:bg-brand-secondary/20' >
            {children}
        </main>
    )
}