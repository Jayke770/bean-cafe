import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "Bean Cafe - Admin Authentication",
    description: 'Bean Cafe'
}
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}