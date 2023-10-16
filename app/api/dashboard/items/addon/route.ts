import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import dbConnect from "@/models/dbConnect";
import Addons from "@/models/addons";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/services/NextAuth/AuthOptions";
import { ImgbbUpload } from '@services/imgbb'
import { nanoid } from "nanoid";
const AddonForm = z.object({
  name: z.string(),
  category: z.string(),
  image: z.any(),
  price: z.number().positive(),
  stocks: z.number().positive(),
});
export const revalidate = 60;
export async function POST(req: NextRequest) {
  const { formData } = req;
  try {
    const form = await formData();
    const data: z.infer<typeof AddonForm> = {
      category: form.get("category") as any,
      name: form.get("name") as any,
      price: parseFloat((form.get("price") as any) ?? "0"),
      stocks: parseFloat((form.get("stocks") as any) ?? "0"),
      image: form.get("image") as any,
    };
    const parse_form = AddonForm.safeParse(data);
    if (parse_form.success) {
      const imageFile = parse_form.data.image as Blob | null;
      if ((imageFile?.size ?? 0) > 0) {
        //save file
        const buffer_image = Buffer.from((await imageFile?.arrayBuffer()) as any);
        const uploaded_image = await ImgbbUpload(buffer_image.toString("base64"))
        const AddonId = nanoid(12).toUpperCase();
        await dbConnect();
        await Addons.create({
          category: parse_form.data.category,
          created: parseInt(moment().format("x")),
          name: parse_form.data.name,
          image: uploaded_image.url,
          price: parse_form.data.price,
          stocks: parse_form.data.stocks,
          id: AddonId
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
      console.log(fromZodError(parse_form.error).message);
      return NextResponse.json({ status: false, message: "Validation Error" });
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
      const type = req.nextUrl.searchParams.get("type");
      const data = await Addons.find({ category: { $eq: type } }, { __v: 0 }).skip(skip).limit(20);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({}, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
