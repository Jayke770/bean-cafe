import { NextRequest, NextResponse } from "next/server";
import Items from "@/models/items";
import addons from "@/models/addons";
import dbConnect from "@/models/dbConnect";
export const revalidate = 60;
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const category = (req.nextUrl.searchParams.get("category") as any) ?? "all";
    const skip = parseInt(req.nextUrl.searchParams.get("skip") ?? "0");
    const search = req.nextUrl.searchParams.get("search") as any
    let search_query = {}
    if (search) {
      const regexPattern = { $regex: search, $options: "i" }
      search_query = {
        $or: [
          { name: regexPattern },
          { description: regexPattern }
        ]
      }
    }
    await dbConnect();
    let data: any[] = []
    if (category === "best-sellers") {
      data = search ? await Items.find({
        $or: [
          { sold: { $gte: 1 } },
          { isBestSeller: true }
        ],
        ...search_query,
      }).populate({ path: "addons", model: addons }).skip(skip) : await Items.find({
        $or: [
          { sold: { $gte: 1 } },
          { isBestSeller: true }
        ]
      }).populate({ path: "addons", model: addons }).skip(skip)
    } else {
      data = search ? await Items.find(category === "all" ? { ...search_query } : { category: { $eq: category }, ...search_query }, { __v: 0, _id: 0 }).populate({ path: "addons", model: addons }).skip(skip) : await Items.find(category === "all" ? {} : { category: { $eq: category } }, { __v: 0, _id: 0 }).populate({ path: "addons", model: addons }).skip(skip)
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({}, { status: 500 });
  }
}