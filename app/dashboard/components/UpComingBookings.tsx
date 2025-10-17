'use client';
import { CalendarX } from 'lucide-react';

export default function UpcomingBookings({
  bookings,
  onCancel,
}: {
  bookings: any[];
  onCancel: (id: string) => void;
}) {
  if (!bookings?.length)
    return (
      <div className="bg-white rounded-2xl p-6 border border-casaCoffee/10 text-casaCoffee/70">
        <p>No tienes clases próximas. ¡Reserva una para empezar! 💪</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading text-casaCoffee">Tus próximas clases</h2>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white border border-casaCoffee/10 p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <h3 className="font-semibold text-casaCoffee">{booking.class.name}</h3>
            <p className="text-sm text-casaCoffee/70">
              {booking.class.instructor} · {new Date(booking.class.startTime).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onCancel(booking.id)}
            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition"
          >
            <CalendarX className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
}
