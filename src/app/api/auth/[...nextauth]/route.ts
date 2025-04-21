import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

// Extend the session types to include id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// This is a simple authentication for demo purposes
// In a real-world application, you would want to fetch the admin user from the database
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // In production, use hashed password stored in env

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For a real application, we would query the database here
        // For this demo, we'll do a simple check against environment variables
        if (credentials.email !== ADMIN_EMAIL) {
          return null;
        }

        // In a real app, we'd check the hashed password in the database
        // For this demo, we'll use a simple equality check
        const isPasswordValid = credentials.password === ADMIN_PASSWORD;

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: '1',
          name: 'Admin User',
          email: ADMIN_EMAIL,
        };
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 