import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { getBackendUrl } from "src/utils/backendUrl";

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",

      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text"},
        password: { label: "Password", type: "password"}
      },
    async authorize(credentials) {
    try {
      const { username, password } = credentials as any;
      const url=getBackendUrl('auth/login')
      console.log('sdsdsd',url)
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const user = await res.json();

      if (!res.ok) {
        console.error("LOGIN FAILED:", user);
        return null; // ✅ PAS DE THROW
      }

      if (!user || !user.token) {
        return null;
      }
      console.error("LOGIN :", user);
      return user; // ✅ SUCCESS
    } catch (error) {
      console.error("AUTHORIZE ERROR:", error);

return null; // ✅ TOUJOURS
    }
}

    })
  ],

  session: {
    strategy: "jwt",
  },

  //secret: process.env.NEXTAUTH_SECRET,
  callbacks: {

    async jwt({token, user, account}) {
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user=token;


return session;
    },
  },

  pages: {
    signIn: process.env.NEXT_SIGNINROUTE,
  },
}

export default NextAuth(authOptions)
