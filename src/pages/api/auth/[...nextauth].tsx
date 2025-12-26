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
          console.log('Url before auth',getBackendUrl())
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
  cookies: {
  sessionToken: {
    name: 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false, // 🔥 CRITIQUE EN HTTP
    },
  },
},

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
      console.log('dsdsdssdsdsdd',baseUrl,process.env.NEXTAUTH_URL,url)

return `${baseUrl}`;
    }
  },

  pages: {
    signIn: process.env.NEXT_SIGNINROUTE,
  }
};

export default NextAuth(authOptions);
