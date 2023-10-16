import { NextRequest, NextResponse } from "next/server";
import Items from "@/models/items";
import dbConnect from "@/models/dbConnect";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  try {
    const category = (req.nextUrl.searchParams.get("category") as any) ?? "all";
    const skip = parseInt(req.nextUrl.searchParams.get("skip") ?? "0");
    await dbConnect();
    let data: any[] = []
    if (category === "best-seller") {
      data = await Items.find({ sold: { $gte: 1 } })
    } else {
      data = await Items.find(
        category === "all" ? {} : {
          category: { $eq: category },
        }, { __v: 0, _id: 0 }).populate({ path: "addons" }).skip(skip)
    }
    return NextResponse.json(data);
  } catch (e) {
    console.log(e)
    return NextResponse.json({}, { status: 500 });
  }
}
