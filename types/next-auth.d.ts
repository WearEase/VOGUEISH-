declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "buyer" | "seller";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "buyer" | "seller";
  }
}