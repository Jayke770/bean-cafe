import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import mime from "mime";
import { fromZodError } from "zod-validation-error";
import { writeFile, pathExists, mkdir } from "fs-extra";
import { nanoid } from "nanoid";
import dbConnect from "@/models/dbConnect";
import Addons from "@/models/addons";
import path from "path";
import moment from "moment-timezone";
import EnsureUploadDir from "@lib/ensureUploadDir";
const AddonForm = z.object({
  name: z.string(),
  category: z.string(),
  image: z.any(),
  options: z.string(),
});
export async function POST(req: NextRequest) {
  const { formData } = req;
  try {
    const form = await formData();
    const data: z.infer<typeof AddonForm> = {
      category: form.get("category") as any,
      name: form.get("name") as any,
      options: form.get("options") as any,
      image: form.get("image") as any,
    };
    const parse_form = AddonForm.safeParse(data);
    if (parse_form.success) {
      await EnsureUploadDir();
      const imageId = nanoid();
      const imageExt = parse_form.data.image.type;
      const imageFile = parse_form.data.image as Blob | null;
      //save file
      const upload_dir = path.join(process.cwd(), "files/addons");
      const buffer_image = Buffer.from((await imageFile?.arrayBuffer()) as any);
      await writeFile(
        `${upload_dir}/${imageId}.${mime.getExtension(imageExt)}`,
        buffer_image
      );
      await dbConnect();
      await Addons.create({
        category: parse_form.data.category,
        created: parseInt(moment().format("x")),
        name: parse_form.data.name,
        image_id: imageId,
        options: JSON.parse(parse_form.data.options),
      });
      return NextResponse.json({
        status: true,
        message: "Successfully Saved!",
      });
    } else {
      console.log(fromZodError(parse_form.error).message);
      return NextResponse.json({ status: false, message: "Validation Error" });
    }
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}
