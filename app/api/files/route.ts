import fs, { Stats } from "fs-extra";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ReadableOptions } from "stream";
import mime from "mime";
import dbConnect from "@/models/dbConnect";
import Item from "@/models/items";
import addons from "@/models/addons";
import stream from 'stream'
import { promisify } from 'util'
const pipeline = promisify(stream.pipeline)
function streamFile(
  path: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}
export const dynamic = 'force-dynamic'
export const revalidate = 10;
export async function GET(req: NextRequest): Promise<any> {
  try {
    const type: "item" | "addon" = req.nextUrl.searchParams.get("type") as any
    const id = req.nextUrl.searchParams.get("id")
    if (type && id) {
      await dbConnect()
      if (type === "item") {
        const itemData = await Item.findOne({ item_id: { $eq: id } }, { image: 1 })
        if (!itemData || !itemData?.image) throw new Error("Item not found")
        const image = await fetch(itemData.image)
        const image_buffer = await image.arrayBuffer()
        return new NextResponse(image_buffer, {
          status: 200,
          headers: new Headers({
            "content-type": image.headers.get('content-type') as string,
            "content-length": image.headers.get('content-length') as string
          }),
        });
      } else if (type === "addon") {
        const addonData = await addons.findOne({ id: { $eq: id } }, { image: 1 })
        if (!addonData || !addonData?.image) throw new Error("Addon not found")
        const image = await fetch(addonData.image)
        const image_buffer = await image.arrayBuffer()
        return new NextResponse(image_buffer, {
          status: 200,
          headers: new Headers({
            "content-type": image.headers.get('content-type') as string,
            "content-length": image.headers.get('content-length') as string
          }),
        });
      }
    } else {
      throw new Error("Invalid File")
    }
  } catch (e) {
    const file = path.join(process.cwd(), `files/logo.png`);
    const stats: Stats = await fs.promises.stat(file);
    const data: ReadableStream<Uint8Array> = streamFile(file);
    return new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(file)}`,
        "content-type": mime.getType(file) as string,
        "content-length": stats.size + "",
      }),
    });
  }
}
