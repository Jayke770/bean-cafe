import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { z } from 'zod'
import dbConnect from '@/models/dbConnect';
import { ApiResponse } from '@/types';
import Email from '@/services/email';
const emailHandler = new Email("Bean Cafe")
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    let res: ApiResponse = {}
    try {
        if (session) {
            await dbConnect()
            if (session?.user?.email) emailHandler.send({ receiver: session.user.email, subject: "Check out", body: "test checkout" })
            res = {
                status: false,
                message: "Under Maintenance!"
            }
            return NextResponse.json(res);
        } else {
            return NextResponse.json({}, { status: 500 });
        }
    } catch (e: any) {
        return NextResponse.json({}, { status: 500 });
    }
}