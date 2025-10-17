import './globals.css';
import ClientLayout from './client-layout'; // asegúrate que la ruta sea correcta
import SessionProvider from './SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Casa Boreal - Barre en Puebla',
  description: 'Transforma tu cuerpo y mente con clases de Barre en Puebla...',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  console.log('Sesión inicial:', session);

  return (
    <html lang="es">
      <body>
        <SessionProvider session={session ?? undefined}>
          <ClientLayout session={session ?? undefined}>
            {children}
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}