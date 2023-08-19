import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import { getServerSession } from "next-auth";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import { UserRole } from "@/types";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  try {
    if (session) {
      const userRole: UserRole = "user";
      await dbConnect();
      await Users.updateOne(
        { _id: { $eq: session?.user?.id } },
        { $set: { role: userRole } }
      );
      const redirect_url =
        req.nextUrl.searchParams.get("callbackUrl") ??
        `${req.nextUrl.host}/home`;
      return NextResponse.redirect(redirect_url);
    } else {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
