import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { getBackendUrl } from "src/utils/backendUrl";
import CryptoJS from "crypto-js";

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
      const { username, password } = credentials as any ;
      const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_KEY ;
      const decryptedPassword = CryptoJS.AES.decrypt(password, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      const decryptedUsername = CryptoJS.AES.decrypt(username, SECRET_KEY).toString(CryptoJS.enc.Utf8);

      const url=getBackendUrl('auth/login')
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: decryptedUsername, password: decryptedPassword }),
      });

      const user = await res.json();


  if (!res.ok) {
    // 🔥 On remonte TOUT le message backend
    throw new Error(
      JSON.stringify({
        status: res.status,
        code: user.code,
        message: user.description
      })
    );
  }

return user; // ✅ SUCCESS
    } catch (error) {
      console.error("AUTHORIZE ERROR:", error);

    throw new Error(error.message || "Erreur de connexion");

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
