import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook'; // ✅ Import Facebook
import type { NextAuthOptions } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User as DBUser } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existingUser = await DBUser.findOne({ email: user.email });
        if (!existingUser) {
          await DBUser.create({
            email: user.email,
            fullName: user.name,
            isAdmin: false,
          });
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token }) {
      try {
        await connectDB();
        const dbUser = await DBUser.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.isAdmin = dbUser.isAdmin;
          token.fullName = dbUser.fullName;
          token.birthDate = dbUser.birthDate;
          token.mobileNumber = dbUser.mobileNumber;
          token.address = dbUser.address;
        }
        return token;
      } catch (error) {
        console.error('JWT error:', error);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.fullName = token.fullName;
        session.user.birthDate = token.birthDate;
        session.user.mobileNumber = token.mobileNumber;
        session.user.address = token.address;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
