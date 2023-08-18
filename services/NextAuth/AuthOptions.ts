import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuthMongodbAdapter from "@services/NextAuth/MongodbAdapter";
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
      }
      return session;
    },
  },
};
