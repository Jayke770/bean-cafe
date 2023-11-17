import dbConnect from "@/models/dbConnect";
import settings from "@/models/settings";
import { NextRequest, NextResponse } from "next/server";
import { COD_MESSAGE, CURRENCY } from '@lib/constants'
import { z } from 'zod'
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import { fromZodError } from "zod-validation-error";
import { ApiResponse } from "@/types";
export async function GET(req: NextRequest) {
    try {
        const settingsData = await settings.findOne({}, { codMessage: 1, currency: 1 })
        if (settingsData) {
            return NextResponse.json(settingsData)
        } else {
            const data = await settings.create({ codMessage: COD_MESSAGE, currency: CURRENCY })
            return NextResponse.json(data)
        }
    } catch (e) {
        console.log("Error", e);
        return NextResponse.json(null, { status: 500 })
    }
}
const UpdateSettingsSchema = z.object({
    cod_message: z.string().nullish(),
    currency: z.string().nullish()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        let res: ApiResponse = { status: false }
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const data = await req.json()
            const validated_data = UpdateSettingsSchema.safeParse(data)
            if (validated_data.success) {
                const settingsData = await settings.findOne()
                if (settingsData) {
                    if (validated_data.data.cod_message) {
                        settingsData.codMessage = validated_data.data.cod_message
                    }
                    if (validated_data.data.currency) {
                        settingsData.currency = validated_data.data.currency
                    }
                    await settingsData.save()
                    return NextResponse.json({ ...res, status: true, message: "Successfully Updated" })
                } else {
                    return NextResponse.json({ ...res, message: "Try Again Later" })
                }
            } else {
                return NextResponse.json({
                    status: false,
                    message: fromZodError(validated_data.error).message,
                });
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        console.log("Error", e);
        return NextResponse.json(null, { status: 500 })
    }
}