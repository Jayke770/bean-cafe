import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "Bean Cafe - Admin Panel",
    description: 'Bean Cafe'
}
export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}