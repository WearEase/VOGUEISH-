import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "buyer" | "seller";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "buyer" | "seller";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "buyer" | "seller";
  }
}

export {};