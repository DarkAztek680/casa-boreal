
'use client';
import { motion } from 'framer-motion';
import { Dumbbell, User, Waves, Brain } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Dumbbell,
      title: 'Tonificación',
      description:
        'Trabaja músculos profundos con movimientos isométricos que esculpen y definen tu cuerpo de forma natural.',
    },
    {
      icon: User,
      title: 'Postura',
      description:
        'Fortalece tu core y espalda, mejorando tu alineación corporal y reduciendo dolores crónicos.',
    },
    {
      icon: Waves,
      title: 'Flexibilidad',
      description:
        'Combina estiramientos controlados que aumentan tu rango de movimiento de forma segura y efectiva.',
    },
    {
      icon: Brain,
      title: 'Mindfulness',
      description:
        'Conecta con tu respiración y movimiento, reduciendo estrés mientras fortaleces cuerpo y mente.',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  }

  return (
    <section className="py-24 px-6 bg-casaBeige">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-casaCoffee mb-4">
            Beneficios de <span className="font-semibold">Barre</span>
          </h2>
          <p className="text-casaCoffee/70 text-lg max-w-2xl mx-auto">
            Transforma tu cuerpo y mente con cada clase
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={item}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              className={`relative rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                index % 2 === 0 ? 'bg-white' : 'bg-casaCream'
              } hover-lift group`}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-casaOlive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-start gap-6">
                <motion.div
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-casaOlive/10 to-casaCoffee/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className="w-8 h-8 text-casaOlive group-hover:text-casaCoffee transition-colors duration-300" />
                </motion.div>
                <div className="flex-1">
                  <motion.h3
                    className="text-2xl font-semibold text-casaCoffee mb-3 group-hover:text-casaOlive transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <motion.p
                    className="text-casaCoffee/70 leading-relaxed"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {benefit.description}
                  </motion.p>
                </div>
              </div>

              {/* Subtle animated border */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-casaOlive to-casaCoffee"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
