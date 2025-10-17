'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ScheduleCalendar from '../components/ScheduleCalendar';
import BookingModal from '../components/BookingModal';

// Simulación: hook para obtener créditos del usuario
function useUserCredits() {
  // Reemplaza con lógica real si tienes el hook
  const [credits] = useState<number>(5);
  return credits;
}

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0); // Para revalidar datos
  const credits = useUserCredits();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleReserve = (cls: any) => {
    setSelectedClass(cls);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClass(null);
  };

  const handleSuccess = () => {
    setCalendarKey(prev => prev + 1); // Forzar re-render/revalidación
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-casaCoffee/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-casaCoffee">Reserva tu Clase</h1>
            <span className="text-casaOlive font-bold">Créditos disponibles: {credits}</span>
          </div>
          <Link href="/dashboard" className="px-4 py-2 bg-casaCoffee text-white rounded-full hover:bg-casaOlive transition-all font-bold">Regresar al Dashboard</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <ScheduleCalendar key={calendarKey} />
        <BookingModal
          classData={selectedClass}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          credits={credits}
        />
      </main>
    </div>
  );
}

// Protección con SSR
export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}
