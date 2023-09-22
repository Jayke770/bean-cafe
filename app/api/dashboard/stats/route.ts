import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/dbConnect";
import Items from "@/models/items";
import Users from "@models/users";
import Orders from "@/models/orders";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  try {
    if (session) {
      await dbConnect();
      const items = await Items.count();
      const users = await Users.count();
      const orders = await Orders.count()
      return NextResponse.json({
        items,
        users,
        orders
      });
    } else {
      return NextResponse.json({}, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
