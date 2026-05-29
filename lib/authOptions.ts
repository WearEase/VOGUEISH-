import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { randomUUID } from "crypto";

const getNameParts = (fullName: string | null | undefined) => {
  const cleanName = (fullName || "").trim();
  if (!cleanName) {
    return { firstName: "User", lastName: "" };
  }

  const [firstName, ...rest] = cleanName.split(" ");
  return { firstName, lastName: rest.join(" ") };
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      id: "google-buyer",
      name: "Google Buyer",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      id: "google-seller",
      name: "Google Seller",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      id: "buyer-signin",
      name: "Buyer Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();

          const user = await User.findOne({
            email: credentials.email,
            role: "buyer",
          });

          if (!user) {
            throw new Error("No buyer found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before signing in");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            role: "buyer",
          };
        } catch (error) {
          console.error("Buyer authentication error:", error);
          throw error;
        }
      },
    }),

    CredentialsProvider({
      id: "seller-signin",
      name: "Seller Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();

          const user = await User.findOne({
            email: credentials.email,
            role: "seller",
          });

          if (!user) {
            throw new Error("No seller found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before signing in");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.businessName || user.name || "Seller",
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
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account?.provider?.startsWith("google")) {
          return true;
        }

        if (!user.email) {
          console.error("NextAuth signIn: missing user.email on OAuth callback", { user, account });
          return false;
        }

        await connectDB();

        const role = account.provider === "google-seller" ? "seller" : "buyer";
        console.log("NextAuth signIn: provider", account.provider, "role", role, "email", user.email);

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser && existingUser.role !== role) {
          console.warn("NextAuth signIn: role mismatch for existing user", {
            email: user.email,
            existingRole: existingUser.role,
            requestedRole: role,
          });
          return "/login?error=AccountRoleMismatch";
        }

        if (existingUser) {
          if (!existingUser.isVerified) {
            existingUser.isVerified = true;
            existingUser.emailVerificationToken = undefined;
            existingUser.emailVerificationExpires = undefined;
            await existingUser.save();
          }

          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.name = existingUser.name || user.name;
          return true;
        }

        const { firstName, lastName } = getNameParts(user.name);
        const oauthPassword = await bcrypt.hash(randomUUID(), 12);

        const createdUser = await User.create({
          email: user.email,
          password: oauthPassword,
          role,
          name: user.name || `${firstName} ${lastName}`.trim(),
          firstName: role === "buyer" ? firstName : undefined,
          lastName: role === "buyer" ? lastName : undefined,
          businessName: role === "seller" ? user.name || "Seller" : undefined,
          gst: role === "seller" ? "PENDING-GST" : undefined,
          isVerified: true,
        });

        user.id = createdUser._id.toString();
        user.role = role;
        user.name = createdUser.name || user.name;
        return true;
      } catch (err) {
        console.error("NextAuth signIn callback error:", err);
        return false;
      }
    },

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
        session.user.role = token.role as "buyer" | "seller";
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
