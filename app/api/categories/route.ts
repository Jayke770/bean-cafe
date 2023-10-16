import { NextRequest, NextResponse } from "next/server";
import categories from '@models/categories'
export const revalidate = 60;
export async function GET() {
    try {
        const data = await categories.find({}, { type: 1, created: 1 })
        return NextResponse.json(data)
    } catch (e) {
        return NextResponse.json({}, { status: 500 });
    }
}