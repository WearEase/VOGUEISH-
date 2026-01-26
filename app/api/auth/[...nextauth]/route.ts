// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Buyer Sign In
    CredentialsProvider({
      id: "buyer-signin",
      name: "Buyer Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email,
            role: "buyer" 
          });

          if (!user) {
            throw new Error("No buyer found with this email");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.firstName + " " + user.lastName,
            role: "buyer",
          };
        } catch (error) {
          console.error("Buyer authentication error:", error);
          throw error;
        }
      },
    }),
    
    // Seller Sign In
    CredentialsProvider({
      id: "seller-signin",
      name: "Seller Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email,
            role: "seller" 
          });

          if (!user) {
            throw new Error("No seller found with this email");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.businessName || user.name,
            role: "seller",
          };
        } catch (error) {
          console.error("Seller authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect based on role after sign in
      if (url.includes("seller-signin")) {
        return `${baseUrl}/seller-dashboard`;
      }
      if (url.includes("buyer-signin")) {
        return `${baseUrl}/shop`;
      }
      return baseUrl;
    },
  },
  
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };