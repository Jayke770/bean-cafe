import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "Bean Cafe",
    description: 'Bean Cafe'
}
export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-full z-5 w-full left-0 top-0 overflow-auto absolute bg-brand-white dark:bg-brand-secondary/20 pb-20-safe'>
            {children}
        </main>
    )
}