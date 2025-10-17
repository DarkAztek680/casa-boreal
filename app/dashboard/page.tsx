'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import StatsGrid from './components/StatsGrid';
import UpComingBookings from './components/UpComingBookings';
import MembershipCard from './components/MembershipCard';
import useBookings from './hooks/useBookings';
import useMembership from './hooks/useMembership'; // ✅ correcto si usas export default

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { bookings, isError: bookingsError, error: bookingsErrorObj, isLoading: bookingsLoading, cancelBooking } = useBookings();
  const { membership, isError: membershipError, error: membershipErrorObj, isLoading: membershipLoading } = useMembership();

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.error('Usuario no autenticado. Redirigiendo al login.');
      router.push('/login');
    }
  }, [status, router]);

  if (bookingsLoading || membershipLoading) {
    console.error('Cargando datos: ', { bookingsLoading, membershipLoading });
    return (
      <div className="flex items-center justify-center min-h-screen bg-casaCream">
        <Loader2 className="animate-spin text-casaCoffee w-8 h-8" />
      </div>
    );
  }

  if (bookingsError || membershipError) {
    if (bookingsError) console.error('Error en bookings:', bookingsErrorObj);
    if (membershipError) console.error('Error en membership:', membershipErrorObj);
    return (
      <div className="flex items-center justify-center min-h-screen bg-casaCream">
        <p className="text-red-500">Hubo un error al cargar tu dashboard. Por favor, intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-casaCream px-6 py-10">
      <section className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-heading text-casaCoffee">
            ¡Hola, {session?.user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-casaCoffee/70">Aquí está tu resumen de Casa Boreal</p>
        </header>

        <StatsGrid membership={membership} />

        <MembershipCard membership={membership} />

        <UpComingBookings bookings={bookings} onCancel={cancelBooking} />
      </section>
    </main>
  );
}
