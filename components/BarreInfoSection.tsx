
'use client';
import { motion } from 'framer-motion';
import { Activity, Heart, Users } from 'lucide-react';

export default function BarreInfoSection() {
  const cards = [
    {
      icon: Activity,
      title: 'Qué es Barre',
      description:
        'Una práctica única que combina ballet, pilates y yoga en movimientos de bajo impacto que tonifican y fortalecen todo tu cuerpo.',
    },
    {
      icon: Heart,
      title: 'Beneficios',
      description:
        'Mejora tu postura, flexibilidad y fuerza muscular. Tonifica músculos profundos mientras conectas mente y cuerpo en cada movimiento.',
    },
    {
      icon: Users,
      title: 'Para quién es',
      description:
        'Para todos los niveles y edades. No necesitas experiencia en ballet. Ideal si buscas un entrenamiento efectivo y consciente.',
    },
  ]

  return (
    <section id="barre" className="py-24 px-6 bg-casaCream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-casaCoffee mb-4">
            ¿Qué es <span className="font-semibold">Barre</span>?
          </h2>
          <p className="text-casaCoffee/70 text-lg max-w-2xl mx-auto">
            Descubre una práctica transformadora
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-casaCoffee/5 hover-lift"
              whileHover={{ y: -10 }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-casaOlive/10 to-casaCoffee/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <card.icon className="w-8 h-8 text-casaOlive group-hover:text-casaCoffee transition-colors duration-300" />
                </motion.div>
                <motion.h3
                  className="text-2xl font-semibold text-casaCoffee mb-4 group-hover:text-casaOlive transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  className="text-casaCoffee/70 leading-relaxed text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {card.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
