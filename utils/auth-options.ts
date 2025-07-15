import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { generateRandomSlug } from "./generateSlug";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectViaMongoose();

          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user) {
            console.log("No user found with this email");
            return null;
          }

          if (!user.password) {
            console.log(
              "User has no password set (possibly signed up with Google)"
            );
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.log("Password comparison failed");
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            slug: user.slug,
            // username: user.username,
            image: user.image,
            isPublic: user.isPublic,
            theme: user.theme,
            plan: user.plan || "free",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectViaMongoose();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            slug: generateRandomSlug(user.email),
            // username: null,
            image: user.image,
            isPublic: true,
            theme: "teal",
            plan: "free", 
            location: user.location,
            website: user.website,
            socialMedia: user.socialMedia,
          });

          user.id = newUser._id.toString();
          user.slug = newUser.slug;
          // user.username = newUser.username;
          user.image = newUser.image;
          user.isPublic = newUser.isPublic;
          user.theme = newUser.theme;
          user.location = newUser.location;
          user.website = newUser.website;
          user.socialMedia = newUser.socialMedia;
        } else {
          user.id = existingUser._id.toString();
          user.slug = existingUser.slug;
          // user.username = existingUser.username;
          user.image = existingUser.image;
          user.isPublic = existingUser.isPublic;
          user.theme = existingUser.theme;
          user.location = existingUser.location;
          user.website = existingUser.website;
          user.socialMedia = existingUser.socialMedia;
          user.plan = existingUser.plan || "free"; 
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub || (token.id as string);
        // session.user.username = token.username as string;
        session.user.location = token.location;
        session.user.slug = token.slug;
        session.user.website = token.website;
        session.user.socialMedia = token.socialMedia as {
          twitter?: string;
          linkedin?: string;
          instagram?: string;
          email?: string;
        };
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.isPublic = token.isPublic as boolean;
        session.user.theme = token.theme as string;
        session.user.plan = token.plan as "free" | "pro" | "lifetime";
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.slug = user.slug;
        // token.username = user.username;
        token.location = user.location;
        token.website = user.website;
        token.socialMedia = user.socialMedia;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.isPublic = user.isPublic;
        token.theme = user.theme;
        token.plan = user.plan || "free";
      }
      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      if (trigger === "update" && session) {
        // if (session.username) token.username = session.username;
        if (session.slug) token.slug = session.slug;
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
        if (session.isPublic !== undefined) token.isPublic = session.isPublic;
        if (session.theme) token.theme = session.theme;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
};
