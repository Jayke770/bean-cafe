import NextAuth from "next-auth";
import { AuthOptions } from "@/services/NextAuth/AuthOptions";
const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };
