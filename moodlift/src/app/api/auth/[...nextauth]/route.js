import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "../../../../../db";
import User from "../../../../../models/userSchema";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          await connect();
          const user = await User.findOne({ username });
          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
            console.log("error: ", error)
        }
      },
    })
  ],
  session: {
    strategy: "jwt"
  },
  jwt: {
    signingKey: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async session({session, token}) {
      session.user = token.user
      return session;
    },
    async jwt({token, user}) {
      if (user) {
        token.user = user
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};