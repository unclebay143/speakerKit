import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectViaMongoose from "@/lib/db";


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

          const user = await User.findOne({ email: credentials.email.toLowerCase() });
        
          if (!user) {
            console.log("No user found with this email");
            return null;
          }

          if (!user.password) {
            console.log("User has no password set (possibly signed up with Google)");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log("Password comparison failed");
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
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
            username: null,
            image: user.image,
          });

          user.id = newUser._id.toString();
          user.username = newUser.username;
        } else {
          user.id = existingUser._id.toString();
          user.username = existingUser.username;
        }
      }

      return true;
    },

   async session({ session, token }) {
    if (session.user && token) {
      session.user.id = token.sub || token.id as string;
      session.user.username = token.username as string;
      session.user.name = token.name;
      session.user.email = token.email;
    }
    return session;
  },
  async jwt({ token, user, trigger, session }) {
    if (user) {
      token.id = user.id;
      token.username = user.username;
      token.name = user.name;
      token.email = user.email;
    }
    if (trigger === "update" && session?.username) {
      token.username = session.username;
    }
    
    return token;
  }
},
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true"
  },
};