// lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { AuthOptions } from 'next-auth';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id.toString(),
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            name: user.name,
            avatar: user.avatar,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.role = user.role; // Propagate role
        token.name = user.name; // Propagate name
        token.avatar = user.avatar; // Propagate avatar
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: String(token.id),
        email: token.email ?? '',
        isAdmin: Boolean(token.isAdmin),
        role: token.role, // Include role in session
        name: token.name, // Include name in session
        avatar: token.avatar, // Include avatar in session
      };
      return session;
    },
  },
};

export async function validateUserWithMembership(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  // Check for active membership
  const membership = await prisma.membership.findFirst({
    where: {
      user: { id: user.id }, // Updated to use user relation
      expiresAt: { gt: new Date() },
    },
  });

  if (!membership) return null;

  // Return user and membership details
  return {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    membership,
  };
}