'use client'

import useSWR from 'swr';
// Fetch upcoming classes
function useUpcomingClasses() {
  const { data, error, isLoading } = useSWR('/api/classes', (url) => fetch(url).then(res => res.json()));
  return {
    classes: data,
    isLoading,
    isError: error,
  };
}
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  LogOut,
  Settings,
  TrendingUp,
  User,
  XCircle,
  Award,
} from 'lucide-react'

// Add the Booking type definition
interface Booking {
  id: string;
  class: {
    name: string;
    instructor: string;
    startTime: string;
    level: string;
  };
  status: string;
}

export default function Dashboard() {
  const [bookingFeedback, setBookingFeedback] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const { classes: upcomingClasses, isLoading: isClassesLoading, isError: isClassesError } = useUpcomingClasses();
  const { data: session, status } = useSession()
  const router = useRouter()

  const {
    membership,
    isLoading: isMembershipLoading,
    isError: isMembershipError,
  } = useSWR('/api/membership', (url) => fetch(url).then(res => res.json()))

  const {
    stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSWR('/api/stats', (url) => fetch(url).then(res => res.json()))

  const {
    bookings: upcomingBookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useSWR('/api/bookings', (url) => fetch(url).then(res => res.json()))

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || isMembershipLoading || isStatsLoading || isBookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-casaOlive mx-auto mb-4"></div>
          <p className="text-casaCoffee">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (isMembershipError || isStatsError || isBookingsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-casaCoffee">
            Hubo un error al cargar tu dashboard. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    )
  }

  const daysUntilExpiry = membership?.endDate
    ? Math.ceil(
        (new Date(membership.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-casaCoffee/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-heading font-semibold text-casaCoffee">
                Casa Boreal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 hover:bg-casaBeige rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-casaCoffee" />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 bg-casaCoffee text-white rounded-full hover:bg-casaOlive transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Calendario semanal de clases */}
        <div className="mb-8">
          <ScheduleCalendar />
        </div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-light text-casaCoffee mb-2">
            Hola, <span className="font-semibold">{session?.user?.name || 'Bienvenido'}</span>
          </h2>
          <p className="text-casaCoffee/70">Aquí está tu resumen de actividades</p>
        </div>

        {/* Stats Grid */}
  <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Total Clases</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {stats?.totalClasses || 0}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Este mes</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {stats?.classesThisMonth || 0}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Asistencia</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {stats?.attendanceRate || 0}%
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Membresía</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {membership?.planType || 'Sin membresía'}
            </h3>
            <p className="text-casaCoffee/70">
              {membership?.isActive ? `Activa, vence en ${daysUntilExpiry} días` : 'Inactiva'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Créditos</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {membership?.creditsLeft ?? 0}
            </h3>
            <p className="text-casaCoffee/70">
              {membership?.isActive ? `Activa, vence en ${daysUntilExpiry} días` : 'Inactiva'}
            </p>
          </div>
        </div>

        {/* Membership Card */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {/* ...existing 4 cards... */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-casaOlive" />
              </div>
              <span className="text-casaCoffee/50">Créditos</span>
            </div>
            <h3 className="text-2xl font-bold text-casaCoffee">
              {membership?.creditsLeft ?? 0}
            </h3>
            <p className="text-casaCoffee/70">
              {membership?.isActive ? `Activa, vence en ${daysUntilExpiry} días` : 'Inactiva'}
            </p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-casaCoffee mb-4">
            Próximas Clases
          </h3>
          <ul className="space-y-4">
            {upcomingBookings?.map((booking: Booking) => {
              const diffHours = (new Date(booking.class.startTime).getTime() - new Date().getTime()) / (1000 * 60 * 60);
              return (
                <li
                  key={booking.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-casaCoffee/5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-casaCoffee">
                        {booking.class.name}
                      </h4>
                      <p className="text-casaCoffee/70">
                        {formatDate(booking.class.startTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                      {booking.status === 'confirmed' && diffHours >= 2 && (
                        <button
                          className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm hover:bg-red-200 transition"
                          onClick={async () => {
                            if (window.confirm('¿Seguro que quieres cancelar esta clase? No se reembolsarán créditos.')) {
                              const res = await fetch(`/api/bookings/${booking.id}`, {
                                method: 'PUT',
                              });
                              const data = await res.json();
                              if (res.ok) {
                                window.location.reload();
                              } else {
                                alert(data.error || 'Error al cancelar la clase');
                              }
                            }
                          }}
                        >Cancelar</button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}