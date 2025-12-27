import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getBackendUrl } from "src/utils/backendUrl";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // 🔥 indispensable pour multi-domaines

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
          if (!res.ok || !user || !user.token) return null;

          return user; // SUCCESS
        } catch (error) {
          console.error("AUTHORIZE ERROR:", error);
          return null;
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) { return { ...token, ...user }; },
    async session({ session, token }) { session.user = token; return session; }
  },

  pages: { signIn: process.env.NEXT_SIGNINROUTE },
};

export default NextAuth(authOptions);
