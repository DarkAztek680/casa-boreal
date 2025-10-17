'use client';


import React, { useState, useEffect } from 'react';

// Placeholder class data structure
interface ClassEvent {
  id: string;
  name: string;
  instructor: string;
  level: string;
  startTime: string;
  endTime: string;
  capacity: number;
}


const fetchClasses = async (): Promise<ClassEvent[]> => {
  const res = await fetch('/api/classes');
  if (!res.ok) return [];
  const data = await res.json();
  // Adapt API response to ClassEvent[]
  return data.map((cls: any) => ({
    id: cls.id,
    name: cls.name,
    instructor: cls.instructor,
    level: cls.level,
    startTime: cls.startTime,
    endTime: cls.endTime,
    capacity: cls.capacity,
  }));
};

const CalendarManager: React.FC = () => {
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);
  const [newClass, setNewClass] = useState<ClassEvent>({ id: '', name: '', instructor: '', level: 'Principiante', startTime: '', endTime: '', capacity: 20 });

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase? Se cancelarán todas las reservas existentes.')) return;

    const res = await fetch(`/api/classes/${classId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchClasses().then(setClasses);
    } else {
      alert('Error al eliminar la clase. Inténtalo de nuevo.');
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.instructor || !newClass.startTime || !newClass.endTime) return;
    // POST to API
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newClass.name,
        instructor: newClass.instructor,
        level: newClass.level,
        startTime: newClass.startTime,
        endTime: newClass.endTime,
        capacity: newClass.capacity
      })
    });
    if (res.ok) {
      fetchClasses().then(setClasses);
      setNewClass({ id: '', name: '', instructor: '', level: 'Principiante', startTime: '', endTime: '', capacity: 20 });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Calendario y Clases</h1>

      {/* Sección para agregar nuevas clases */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Agregar Nueva Clase</h2>
        <p className="text-sm text-gray-600 mb-4">Complete todos los campos para crear una nueva clase en el calendario. La clase aparecerá automáticamente en el calendario de usuarios.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Clase</label>
            <input
              type="text"
              placeholder="Ej: Yoga Vinyasa, Pilates Mat"
              value={newClass.name}
              onChange={e => setNewClass({ ...newClass, name: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <small className="text-xs text-gray-500">Nombre descriptivo de la clase que verán los usuarios</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <input
              type="text"
              placeholder="Ej: María González, Juan Pérez"
              value={newClass.instructor}
              onChange={e => setNewClass({ ...newClass, instructor: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <small className="text-xs text-gray-500">Nombre del instructor que impartirá la clase</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
            <select
              value={newClass.level}
              onChange={e => setNewClass({ ...newClass, level: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <small className="text-xs text-gray-500">Nivel de dificultad para filtrar clases</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
            <input
              type="number"
              placeholder="20"
              value={newClass.capacity}
              onChange={e => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 20 })}
              className="border rounded px-3 py-2 w-full"
              min="1"
              max="50"
            />
            <small className="text-xs text-gray-500">Número máximo de estudiantes permitidos</small>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              value={newClass.startTime}
              onChange={e => setNewClass({ ...newClass, startTime: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <small className="text-xs text-gray-500">Cuándo comienza la clase</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de Fin</label>
            <input
              type="datetime-local"
              value={newClass.endTime}
              onChange={e => setNewClass({ ...newClass, endTime: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <small className="text-xs text-gray-500">Cuándo termina la clase</small>
          </div>
        </div>

        <button
          onClick={handleAddClass}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!newClass.name || !newClass.instructor || !newClass.startTime || !newClass.endTime}
        >
          Agregar Clase
        </button>
        <small className="block mt-2 text-xs text-gray-500">Crea la clase y la guarda en la base de datos. Aparecerá en el calendario de usuarios para reservas.</small>
      </div>
      {/* Sección de clases programadas */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Clases Programadas</h2>
        <p className="text-sm text-gray-600 mb-4">Lista de todas las clases creadas. Estas clases son visibles para los usuarios en el calendario principal y pueden ser reservadas.</p>

        {classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay clases programadas aún.</p>
            <small>Crea tu primera clase usando el formulario de arriba.</small>
          </div>
        ) : (
          <ul className="space-y-2">
            {classes.map(cls => (
              <li key={cls.id} className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm">
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800 mb-2">{cls.name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><strong>Instructor:</strong> {cls.instructor}</div>
                    <div><strong>Nivel:</strong>
                      <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                        cls.level === 'Principiante' ? 'bg-green-100 text-green-800' :
                        cls.level === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cls.level}
                      </span>
                    </div>
                    <div><strong>Capacidad:</strong> {cls.capacity} estudiantes</div>
                    <div><strong>Horario:</strong> {new Date(cls.startTime).toLocaleDateString()} {new Date(cls.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(cls.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                    title="Eliminar esta clase permanentemente"
                  >
                    🗑️ Eliminar
                  </button>
                  <small className="block mt-1 text-xs text-gray-500 text-center">Elimina la clase y cancela todas las reservas</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarManager;
