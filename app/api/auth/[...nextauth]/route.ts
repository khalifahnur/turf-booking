import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  clearLoginFailures,
  loginThrottled,
  recordLoginFailure,
  verifyAdminPassword,
} from "@/lib/admin-auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        password: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials, req) {
        const forwarded = req?.headers?.["x-forwarded-for"];
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || "unknown";

        if (loginThrottled(ip)) return null;

        if (verifyAdminPassword(credentials?.password)) {
          clearLoginFailures(ip);
          return { id: "1", name: "Admin", role: "admin" };
        }
        recordLoginFailure(ip);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // an admin session lasts a working day, not 30 days
  },
  callbacks: {
    // Carry the role into the token so API routes can require it.
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
  },
  pages: {
    signIn: "/admin",
  },
});

export { handler as GET, handler as POST };
