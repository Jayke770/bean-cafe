import { type NextRequest, NextResponse } from "next/server";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  return NextResponse.json({ fsfs: 1 });
}
