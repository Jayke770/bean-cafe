import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import EnsureUploadDir from "@/services/ensureUploadDir";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import { writeFile } from "fs-extra";
import mime from "mime";
import path from "path";
import dbConnect from "@/models/dbConnect";
import items from "@/models/items";
import moment from "moment";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
const ItemForm = z.object({
  image: z.any(),
  sizes: z.string(),
  category: z.string(),
  addons: z.string(),
  name: z.string(),
  price: z.number().positive(),
  stocks: z.number().positive(),
  description: z.string(),
});
export const revalidate = 60;
export async function POST(req: NextRequest) {
  const { formData } = req;
  try {
    const form = await formData();
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
      await EnsureUploadDir();
      const addons: any[] = JSON.parse(parse_form.data.addons);
      const sizes: any[] = JSON.parse(parse_form.data.sizes);
      const ItemId = nanoid(12).toUpperCase();
      const upload_dir = path.join(process.cwd(), "files/items");
      const imageExt = parse_form.data.image.type;
      const imageFilename = `${ItemId}.${mime.getExtension(imageExt)}`;
      const imageFile = parse_form.data.image as Blob | null;
      //save file
      const buffer_image = Buffer.from((await imageFile?.arrayBuffer()) as any);
      await writeFile(`${upload_dir}/${imageFilename}`, buffer_image);
      await dbConnect();
      await items.create({
        item_id: ItemId,
        addons: addons,
        created: parseInt(moment().format("x")),
        description: parse_form.data.description,
        image: imageFilename,
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
      const error = fromZodError(parse_form.error, { prefix: null }).message;
      return NextResponse.json({
        status: false,
        message: fromZodError(parse_form.error).message,
      });
    }
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}
export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  try {
    if (session) {
      await dbConnect();
      const skip = parseInt(req.nextUrl.searchParams.get("skip") ?? "0");
      const data = await items.find({}, { __v: 0 }).skip(skip).limit(20);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({}, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
