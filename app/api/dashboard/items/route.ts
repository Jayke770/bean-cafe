import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import dbConnect from "@/models/dbConnect";
import addons from "@/models/addons";
import items from "@/models/items";
import moment from "moment";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import { ImgbbUpload } from "@/services/imgbb";
import { ApiResponse } from "@/types";
const ItemForm = z.object({
  image: z.any(),
  sizes: z.string(),
  category: z.string(),
  addons: z.string(),
  name: z.string(),
  price: z.number().optional(),
  stocks: z.number().optional(),
  description: z.string(),
});
export const revalidate = 60;
export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  try {
    if (session?.user?.role === "admin" || session?.user?.role === "staff") {
      const form = await req.formData();
      const data: z.infer<typeof ItemForm> = {
        image: form.get("image") as any,
        sizes: form.get("sizes") as any,
        addons: form.get("addons") as any,
        name: form.get("name") as any,
        description: form.get("description") as string,
        category: form.get("category") as any,
        stocks: parseFloat((form.get("stocks") as any) ?? "0"),
        price: parseFloat((form.get("price") as any) ?? "0"),
      };
      const parse_form = ItemForm.safeParse(data);
      if (parse_form.success) {
        const selected_addons: string[] = JSON.parse(parse_form.data.addons);
        const addonsData = await addons.find({ id: { $in: selected_addons } }, { _id: 1 })
        const sizes: any[] = JSON.parse(parse_form.data.sizes);
        const ItemId = nanoid(12).toUpperCase();
        const imageFile = parse_form.data.image as Blob | null;
        if ((imageFile?.size ?? 0) > 0) {
          //save file
          const buffer_image = Buffer.from((await imageFile?.arrayBuffer()) as any);
          const uploaded_image = await ImgbbUpload(buffer_image.toString("base64"))
          await dbConnect();
          await items.create({
            item_id: ItemId,
            addons: addonsData,
            created: parseInt(moment().format("x")),
            description: parse_form.data.description,
            image: uploaded_image.url,
            name: parse_form.data.name,
            category: parse_form.data.category,
            sizes: sizes,
            price: parse_form.data.price,
            stocks: parse_form.data.stocks,
          });
          return NextResponse.json({
            status: true,
            message: "Successfully Saved!",
          });
        } else {
          return NextResponse.json({
            status: false,
            message: "Invalid Item Image!",
          });
        }
      } else {
        return NextResponse.json({
          status: false,
          message: fromZodError(parse_form.error).message,
        });
      }
    } else {
      return NextResponse.json(null, { status: 401 });
    }
  } catch (e: any) {
    return NextResponse.json(null, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  try {
    if (session?.user?.role === "admin" || session?.user?.role === "staff") {
      await dbConnect();
      const skip = parseInt(req.nextUrl.searchParams.get("skip") ?? "0");
      const id = req.nextUrl.searchParams.get("id")
      const category = req.nextUrl.searchParams.get("category")
      let data: any
      if (id) {
        data = await items.findOne({ item_id: { $eq: id } }, { __v: 0 }).populate({ path: "addons", model: addons }).skip(skip)
      } else if (category !== "all") {
        data = await items.find({ category: { $eq: category?.toLowerCase() } }, { __v: 0 }).populate({ path: "addons", model: addons }).skip(skip)
      } else {
        data = await items.find({}, { __v: 0 }).populate({ path: "addons", model: addons }).skip(skip)
      }
      return NextResponse.json(data);
    } else {
      return NextResponse.json({}, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
const DeleteItemSchema = z.object({
  id: z.string()
})
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  let res: ApiResponse = { status: false }
  try {
    if (session?.user?.role === "admin" || session?.user?.role === "staff") {
      const validated_data = DeleteItemSchema.safeParse(await req.json())
      if (validated_data.success) {
        const itemData = await items.findOne({ item_id: { $eq: validated_data.data.id } })
        if (itemData) {
          await itemData.deleteOne()
          return NextResponse.json({ ...res, status: true, message: "Item Deleted" });
        } else {
          return NextResponse.json({ ...res, message: "Item Not Found" });
        }
      } else {
        return NextResponse.json({ ...res, message: fromZodError(validated_data.error).message });
      }
    } else {
      return NextResponse.json({}, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
