import type { UserRole, UserStatus } from "@/types";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
      phone_number?: string;
      address?: string,
      created?: number
    } & DefaultSession["user"];
  }
}
