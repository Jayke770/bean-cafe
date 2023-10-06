import UsersPage from './main'
import { AuthOptions } from '@/services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
export default async function Users() {
    const session = await getServerSession(AuthOptions)
    if (session?.user.role !== "admin") redirect("/home")
    return <UsersPage />
}