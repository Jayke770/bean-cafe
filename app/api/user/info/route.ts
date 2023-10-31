import { z } from 'zod'
import dbConnect from '@/models/dbConnect'
import users from '@/models/users'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'
import { fromZodError } from "zod-validation-error";
const UpdateAccountSchema = z.object({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone_number: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            let res: ApiResponse = { status: false }
            const formData = await req.json()
            const parse_data = UpdateAccountSchema.safeParse(formData)
            if (parse_data.success) {
                await dbConnect()
                const userData = await users.findOne({ _id: { $eq: session.user.id } })
                if (userData) {
                    //check if the number is not in used 
                    if (parse_data.data.email || parse_data.data.phone_number) {
                        const email_or_phone_number_found = await users.findOne({
                            $or: [
                                { email: { $eq: parse_data.data.email } },
                                { phone_number: { $eq: parse_data.data.phone_number } }
                            ]
                        })
                        if (email_or_phone_number_found) {
                            res = { ...res, status: false, message: "Invalid Email or Phone Number" }
                        } else {
                            userData.name = parse_data.data.name
                            userData.address = parse_data.data.address
                            userData.phone_number = parse_data.data.phone_number
                            userData.email = parse_data.data.email
                            res = { ...res, status: true, message: "Successfully Updated" }
                        }
                    } else {
                        userData.name = parse_data.data.name
                        userData.address = parse_data.data.address
                        res = { ...res, status: true, message: "Successfully Updated" }
                    }
                    await userData.save()
                    return NextResponse.json(res)
                } else {
                    return NextResponse.json({ ...res, message: "User Not Found" })
                }
            } else {
                return NextResponse.json({ ...res, message: fromZodError(parse_data?.error, { prefix: null }).message })
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 500 })
    }
}