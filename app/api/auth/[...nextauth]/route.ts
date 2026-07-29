import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        password: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: "1", name: "Admin", role: "admin" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin", 
  },
});

export { handler as GET, handler as POST };