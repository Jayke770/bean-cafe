import { AuthOptions } from '@/services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Data from './data'
import { type Metadata } from 'next'
export const metadata: Metadata = {
    title: "Order Information"
}
export default async function OrderInfo() {
    const session = await getServerSession(AuthOptions)
    if (session?.user.role === "user" || !session) redirect("/auth")
    return <Data />
}