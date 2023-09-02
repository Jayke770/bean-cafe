import { NextRequest, NextResponse } from "next/server";
import Items from "@/models/items";
import dbConnect from "@/models/dbConnect";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  try {
    const category = (req.nextUrl.searchParams.get("category") as any) ?? "all";
    const skip = parseInt(req.nextUrl.searchParams.get("skip") ?? "0");
    await dbConnect();
    const data = await Items.find(
      category === "all" ? {} : { category: { $eq: category } },
      { addons: 0, __v: 0, _id: 0 }
    )
      .skip(skip)
      .limit(20);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
