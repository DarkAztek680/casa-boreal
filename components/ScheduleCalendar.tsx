import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale/es';

const LEVEL_COLORS: Record<string, string> = {
  Principiante: 'bg-green-100 text-green-800',
  Intermedio: 'bg-yellow-100 text-yellow-800',
  Avanzado: 'bg-red-100 text-red-800',
};

// Simulación: hook para obtener créditos del usuario
function useUserCredits() {
  // Reemplaza con lógica real si tienes el hook
  const [credits, setCredits] = useState<number>(5);
  useEffect(() => {
    // fetch('/api/user/membership').then(...)
    setCredits(5); // Simulación
  }, []);
  return credits;
}

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function ScheduleCalendar() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [instructors, setInstructors] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const credits = useUserCredits();

  const fetchClasses = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('startDate', weekStart.toISOString());
    params.append('endDate', addDays(weekStart, 6).toISOString());
    if (selectedLevel) params.append('level', selectedLevel);
    if (selectedInstructor) params.append('instructor', selectedInstructor);
    fetch(`/api/classes?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setLoading(false);
        setInstructors([...new Set(data.map((c: any) => c.instructor))] as string[]);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, [weekStart, selectedLevel, selectedInstructor]);

  const handleReserve = (cls: any) => {
    setSelectedClass(cls);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClass(null);
  };

  const handleSuccess = () => {
    fetchClasses();
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-casaOlive text-white" onClick={() => setWeekStart(addDays(weekStart, -7))}>Semana anterior</button>
            <span className="font-bold text-casaCoffee">{format(weekStart, 'd MMM', { locale: es })} - {format(addDays(weekStart, 6), 'd MMM', { locale: es })}</span>
            <button className="px-3 py-1 rounded bg-casaOlive text-white" onClick={() => setWeekStart(addDays(weekStart, 7))}>Semana siguiente</button>
          </div>
          <div className="flex gap-2">
            <select className="border rounded px-2 py-1" value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
              <option value="">Todos los niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <select className="border rounded px-2 py-1" value={selectedInstructor} onChange={e => setSelectedInstructor(e.target.value)}>
              <option value="">Todos los instructores</option>
              {instructors.map((inst: string) => <option key={inst} value={inst}>{inst}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayDate = addDays(weekStart, index);
            const dayClasses = classes.filter(
              cls => isSameDay(new Date(cls.startTime), dayDate)
            );

            return (
              <div key={index} className="p-4 border rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-semibold mb-2">{day} ({dayClasses.length} clases)</h3>
                <div className="max-h-40 overflow-y-auto">
                  {dayClasses.length > 0 ? (
                    dayClasses.map(cls => (
                      <div
                        key={cls.id}
                        className={`p-2 mb-2 rounded-lg ${LEVEL_COLORS[cls.level]}`}
                      >
                        <p className="text-sm font-medium">{cls.name}</p>
                        <p className="text-xs">{format(new Date(cls.startTime), 'HH:mm')}</p>
                        <button
                          className="mt-2 text-blue-500 hover:underline"
                          onClick={() => handleReserve(cls)}
                        >
                          Reservar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Sin clases</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal de reservación */}
      {selectedClass && (
        <BookingModal
          classData={{ ...selectedClass, id: selectedClass.id.toString() }}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          credits={credits}
        />
      )}
    </>
  );
}
