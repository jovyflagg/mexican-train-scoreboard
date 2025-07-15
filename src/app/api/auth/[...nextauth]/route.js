import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../../../utils/database";// Your MongoDB User model
import User from "../../../../../models/user"; // Your MongoDB User model
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        const { email, password } = await credentials;

        await connectToDatabase(); // Connect to the DB
        
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return the MongoDB user object (including _id)
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        // Attach the MongoDB _id to session?.user?._id
        session.user._id = token.userId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Attach MongoDB _id to the token (store it under userId instead of sub)
        token.userId = user?._id.toString();
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      const { db, bucket } = await connectToDatabase(); // Connect to the DB


      if (account.provider === "google") {
        // For Google login, find the user by email or create them if they don't exist
        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          // Create a new user in MongoDB and get the _id

          existingUser = await User.create({
            email: profile.email,
            name: profile.name,
            imageId: null
          });
        }

        // Pass the MongoDB user to NextAuth's flow
        user._id = existingUser._id;
      }

      return true; // Proceed with sign-in
    },
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Define the secret for NextAuth
  pages: {
    signIn: "/login", // Custom login page
  },
});

export { handler as GET, handler as POST };
