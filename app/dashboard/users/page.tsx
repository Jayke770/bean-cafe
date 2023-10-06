import UsersData from "./data";
import { AuthOptions } from '@/services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
export default async function Users() {
    const session = await getServerSession(AuthOptions)
    if (session?.user.role === "user" || !session) redirect("/auth")
    return <UsersData />
}