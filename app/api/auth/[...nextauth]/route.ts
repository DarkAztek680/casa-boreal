import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // ajusta la ruta si tu archivo está en otro lugar

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };