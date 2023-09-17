import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/dbConnect";
import Items from "@/models/items";
import Users from "@models/users";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
export const revalidate = 60;
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    try {
        if (session) {
            await dbConnect();
            const data = await Users.find({}, { name: 1, created: 1, email: 1 })
            return NextResponse.json(data);
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 });
    }
}
