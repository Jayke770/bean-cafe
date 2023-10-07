import { DefaultUser, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuthMongodbAdapter from "@services/NextAuth/MongodbAdapter";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import moment from "moment-timezone";
import { z } from 'zod'
import { fromZodError } from "zod-validation-error";
import bcrypt from 'bcrypt'
const { NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const SignUpFom = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  address: z.string().nonempty(),
  password: z.string().nonempty(),
  confirm_password: z.string().nonempty(),
  type: z.union([z.literal("signup"), z.literal("login")])
}).passthrough()
const LoginFom = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
  type: z.union([z.literal("signup"), z.literal("login")])
})
export const AuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Bean Cafe",
      credentials: {
        name: {},
        email: {},
        address: {},
        password: {},
        confirm_password: {},
        type: {}
      },
      async authorize(credentials, req) {
        try {
          const data = credentials
          let res: DefaultUser | null = null
          if (data?.type === "signup") {
            const parse_signUp_form = SignUpFom.safeParse(data)
            if (parse_signUp_form.success) {
              const userData = await Users.findOne({ email: { $regex: new RegExp(parse_signUp_form.data.email, "i") } })
              if (!userData) {
                const hashed_password = await bcrypt.hash(parse_signUp_form.data.password, 10)
                if (parse_signUp_form.data.password === parse_signUp_form.data.confirm_password) {
                  const newUser = await Users.create({
                    address: parse_signUp_form.data.address,
                    created: parseFloat(moment().format("x")),
                    email: parse_signUp_form.data.email,
                    name: parse_signUp_form.data.name,
                    role: "user",
                    image: null,
                    password: hashed_password
                  })
                  res = {
                    id: newUser._id.toString(),
                    email: newUser.email,
                    image: newUser.image,
                    name: newUser.name
                  }
                } else {
                  throw new Error("Password not the same")
                }
              } else {
                throw new Error("Email already taken")
              }
            } else {
              throw new Error(fromZodError(parse_signUp_form.error).message)
            }
          }
          if (data?.type === "login") {
            const parse_login_form = LoginFom.safeParse(data)
            if (parse_login_form.success) {
              const userData = await Users.findOne({ email: { $eq: parse_login_form.data.email } }, { name: 1, email: 1, image: 1 })
              if (userData) {
                const isValidPassword = await bcrypt.compare(parse_login_form.data.password, userData?.password ?? "")
                res = isValidPassword ? {
                  id: userData._id.toString(),
                  email: userData.email,
                  image: userData.image,
                  name: userData.name
                } : null
              } else {
                res = null
              }
            }
          }
          return res
        } catch (e: any) {
          console.log(e)
          throw new Error(e.message)
        }
      },
    }),
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
          { role: 1, _id: 0, status: 1 }
        );
        session.user.role = Userdata?.role ?? "user";
        session.user.status = Userdata?.status ?? "new";
        session.user.address = Userdata?.address
        session.user.phone_number = Userdata?.phone_number
        session.user.created = Userdata?.created
        await Users.updateOne(
          { _id: { $eq: session.user.id } },
          { $set: { status: "old", created: parseFloat(moment().format("x")) } }
        );
      }
      return session;
    },
  },
  pages: {
    newUser: "/api/user/new"
  },
};
