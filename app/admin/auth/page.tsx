import Card from './card'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { redirect } from 'next/navigation'
export default async function AdminAuth() {
    const session = await getServerSession(AuthOptions)
    if (session?.user?.role === "admin") redirect("/admin/dashboard")
    return (
        <>
            <Card />
        </>
    )
}