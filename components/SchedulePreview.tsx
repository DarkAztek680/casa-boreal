
'use client';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function SchedulePreview() {
  const schedule = [
    { day: 'Lunes', classes: ['7:00 AM - Principiante', '12:00 PM - Intermedio', '6:00 PM - Todos'] },
    { day: 'Martes', classes: ['8:00 AM - Intermedio', '5:30 PM - Principiante', '7:00 PM - Avanzado'] },
    { day: 'Miércoles', classes: ['7:00 AM - Todos', '12:00 PM - Principiante', '6:00 PM - Intermedio'] },
    { day: 'Jueves', classes: ['8:00 AM - Avanzado', '5:30 PM - Todos', '7:00 PM - Intermedio'] },
    { day: 'Viernes', classes: ['7:00 AM - Principiante', '12:00 PM - Todos', '6:00 PM - Avanzado'] },
    { day: 'Sábado', classes: ['9:00 AM - Todos', '11:00 AM - Principiante'] },
    { day: 'Domingo', classes: ['10:00 AM - Yoga & Barre', '5:00 PM - Restaurativa'] },
  ]

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long' })
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <section id="horarios" className="py-24 px-6 bg-casaCream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-casaCoffee mb-4">
            Horarios de <span className="font-semibold">Clases</span>
          </h2>
          <p className="text-casaCoffee/70 text-lg max-w-2xl mx-auto">
            Encuentra el momento perfecto para ti
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {schedule.map((day, index) => {
            const isToday = day.day === todayCapitalized
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${
                  isToday
                    ? 'bg-casaOlive/10 border-2 border-casaOlive'
                    : 'bg-white border border-casaCoffee/10'
                } transition-all hover:shadow-lg`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className={`w-5 h-5 ${isToday ? 'text-casaOlive' : 'text-casaCoffee/50'}`} />
                  <h3
                    className={`text-xl font-semibold ${
                      isToday ? 'text-casaOlive' : 'text-casaCoffee'
                    }`}
                  >
                    {day.day}
                  </h3>
                  {isToday && (
                    <span className="ml-auto text-xs bg-casaOlive text-white px-2 py-1 rounded-full">
                      Hoy
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {day.classes.map((classTime, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-casaCoffee/80 bg-casaBeige/50 rounded-lg px-3 py-2"
                    >
                      {classTime}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="#precios"
            className="inline-block px-8 py-4 border-2 border-casaOlive text-casaOlive rounded-full text-base font-medium hover:bg-casaOlive hover:text-white transition-all hover:scale-105"
          >
            Ver Horario Completo
          </a>
        </motion.div>
      </div>
    </section>
  )
}


