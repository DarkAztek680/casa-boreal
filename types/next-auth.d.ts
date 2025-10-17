import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
    avatar?: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: User;
  }
}