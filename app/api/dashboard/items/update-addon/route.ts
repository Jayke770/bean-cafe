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
import { ApiResponse } from "@/types";
const UpdateAddonSchema = z.object({
    addon_id: z.string(),
    item_id: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    let res: ApiResponse = { status: false }
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const parse_data = UpdateAddonSchema.safeParse(await req.json())
            if (parse_data.success) {
                await dbConnect()
                const itemData = await items.findOne({ item_id: { $eq: parse_data.data.item_id } }).populate({ path: "addons", model: addons })
                if (itemData) {
                    const isAddonFound = itemData.addons.find(x => x.id === parse_data.data.addon_id)
                    if (isAddonFound) {
                        //remove addon
                        await itemData.updateOne({ $pull: { addons: isAddonFound._id } })
                        return NextResponse.json({ ...res, status: true, message: "Addon Successfully Updated" })
                    } else {
                        //add new addon 
                        const AddOnData = await addons.findOne({ id: { $eq: parse_data.data.addon_id } })
                        if (AddOnData) {
                            itemData.addons.push(AddOnData._id)
                            await itemData.save()
                            return NextResponse.json({ ...res, status: true, message: "Addon Successfully Updated" })
                        } else {
                            return NextResponse.json({ ...res, message: "Addon not found" })
                        }
                    }
                } else {
                    return NextResponse.json({ ...res, message: "Item not found" })
                }
            } else {
                return NextResponse.json({ ...res, message: fromZodError(parse_data.error, { prefix: null }).message });
            }
        } else {
            return NextResponse.json(null, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json(null, { status: 500 });
    }
}