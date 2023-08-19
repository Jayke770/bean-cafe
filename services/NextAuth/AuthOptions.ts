import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuthMongodbAdapter from "@services/NextAuth/MongodbAdapter";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
const { NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
export const AuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  //@ts-ignore
  adapter: MongoDBAdapter(NextAuthMongodbAdapter),
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 15 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session) {
        //@ts-ignore
        session.user.id = token.sub;
        await dbConnect();
        const Userdata = await Users.findOne(
          { _id: { $eq: session.user.id } },
          { role: 1, _id: 0 }
        );
        session.user.role = Userdata?.role ?? "user";
      }
      return session;
    },
  },
  pages: {
    newUser: "/api/user/new",
  },
};
