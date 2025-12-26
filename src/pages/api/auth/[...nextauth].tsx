import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getBackendUrl } from "src/utils/backendUrl";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { username, password } = credentials as any;

          const res = await fetch(`${getBackendUrl()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          const user = await res.json();

          if (!res.ok || !user || !user.token) {
            console.error("LOGIN FAILED:", user);
            return null;
          }

          console.log("LOGIN SUCCESS:", user);
          return user;
        } catch (error) {
          console.error("AUTHORIZE ERROR:", error);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Force la redirection vers la production
      return `${process.env.NEXTAUTH_URL}/home`;
    }
  },

  pages: {
    signIn: process.env.NEXT_SIGNINROUTE || "/login",
  }
};

export default NextAuth(authOptions);
