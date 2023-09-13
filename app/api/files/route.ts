import fs, { Stats } from "fs-extra";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ReadableOptions } from "stream";
import mime from "mime";
import dbConnect from "@/models/dbConnect";
import Item from "@/models/items";
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
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    let file_path = req.nextUrl.searchParams.get("file_path");
    const item_id = req.nextUrl.searchParams.get("item_id")
    if (item_id) {
      await dbConnect()
      const ItemData = await Item.findOne({ item_id: { $eq: item_id } }, { image: 1 })
      file_path = ItemData ? `files/${ItemData.image}` : `files/logo.png`
    }
    const imagePath = path.join(process.cwd(), `files/${type}/${file_path}`);
    let file = path.join(process.cwd(), `files/${type}/${file_path}`);
    if (!(await fs.pathExists(imagePath))) {
      file = path.join(process.cwd(), `files/logo.png`);
    }
    console.log(file_path)
    const stats: Stats = await fs.promises.stat(file);
    const data: ReadableStream<Uint8Array> = streamFile(file);
    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(file)}`,
        "content-type": mime.getType(file) as string,
        "content-length": stats.size + "",
      }),
    });
    return res;
  } catch (e) {
    console.log(e)
    const file = path.join(process.cwd(), `files/logo.png`);
    const stats: Stats = await fs.promises.stat(file);
    const data: ReadableStream<Uint8Array> = streamFile(file);
    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(file)}`,
        "content-type": mime.getType(file) as string,
        "content-length": stats.size + "",
      }),
    });
    return res;
  }
}
