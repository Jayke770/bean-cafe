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
const ItemForm = z.object({
  image: z.any(),
  sizes: z.string(),
  addons: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  description: z.string(),
});
export async function POST(req: NextRequest) {
  const { formData } = req;
  try {
    const form = await formData();
    const data: z.infer<typeof ItemForm> = {
      image: form.get("image") as any,
      sizes: form.get("sizes") as any,
      addons: form.get("addons") as any,
      name: form.get("name") as any,
      price: parseInt(form.get("price") as any),
      description: form.get("description") as string,
    };
    const parse_form = ItemForm.safeParse(data);
    if (parse_form.success) {
      await EnsureUploadDir();
      const addons: any[] = JSON.parse(parse_form.data.addons);
      const sizes: any[] = JSON.parse(parse_form.data.sizes);
      if (addons.length <= 0) {
        return NextResponse.json({
          status: false,
          message: "Invalid Addon",
        });
      }
      if (sizes.length <= 0) {
        return NextResponse.json({
          status: false,
          message: "Invalid Sizes",
        });
      }
      const ItemId = nanoid();
      const upload_dir = path.join(process.cwd(), "files/items");
      const imageExt = parse_form.data.image.type;
      const imageFilename = `${ItemId}.${mime.getExtension(imageExt)}`;
      const imageFile = parse_form.data.image as Blob | null;
      //save file
      const buffer_image = Buffer.from((await imageFile?.arrayBuffer()) as any);
      await writeFile(`${upload_dir}/${imageFilename}`, buffer_image);
      await dbConnect();
      await items.create({
        addons: addons,
        created: parseInt(moment().format("x")),
        description: parse_form.data.description,
        image: imageFilename,
        name: parse_form.data.name,
        price: parse_form.data.price,
        sizes: parse_form.data.sizes,
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
