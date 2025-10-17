import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const notificationsConfig = [
  { id: 'email_reservation', title: 'Confirmación de reservación', description: 'Recibe un correo cuando confirmes una clase.' },
  { id: 'email_reminder', title: 'Recordatorio 24h antes de clase', description: 'Recibe un correo recordatorio antes de tu clase.' },
  { id: 'email_membership', title: 'Membresía por vencer', description: 'Recibe un correo cuando tu membresía esté por vencer.' },
  { id: 'email_newsletter', title: 'Boletín semanal', description: 'Recibe noticias y actualizaciones semanales.' },
  { id: 'email_offers', title: 'Ofertas y promociones', description: 'Recibe ofertas exclusivas y promociones.' },
];

const NotificationsSection = () => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await fetch('/api/user/notifications');
        if (!response.ok) throw new Error('Error al cargar preferencias de notificaciones');
        const data = await response.json();
        setPreferences(data); // Establece las preferencias cargadas desde la API
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error desconocido');
        }
      }
    };
    fetchNotificationPreferences();
  }, []);

  const handleToggle = async (id: string) => {
    const updatedPreferences = { ...preferences, [id]: !preferences[id] };
    setPreferences(updatedPreferences);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPreferences),
      });
      if (!response.ok) throw new Error('Error al guardar preferencias');
      toast.success('Preferencias actualizadas');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error desconocido');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
      <ul>
        {notificationsConfig.map(({ id, title, description }) => (
          <li key={id} className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
              className={`w-10 h-6 rounded-full border-2 ${preferences[id] ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}
              onClick={() => handleToggle(id)}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${preferences[id] ? 'translate-x-4' : 'translate-x-0'}`}
              ></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsSection;