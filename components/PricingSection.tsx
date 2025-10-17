
'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Clase Individual',
      price: 350,
      period: 'por clase',
      features: [
        '1 clase de Barre',
        'Acceso a instalaciones',
        'Válido por 30 días',
      ],
      highlighted: false,
    },
    {
      name: 'Plan Mensual',
      price: 2400,
      period: '8 clases/mes',
      badge: 'Más Popular',
      features: [
        '8 clases por mes',
        'Acceso prioritario',
        'Toalla incluida',
        '10% descuento en productos',
      ],
      highlighted: true,
    },
    {
      name: 'Plan Ilimitado',
      price: 3200,
      period: 'clases ilimitadas',
      features: [
        'Clases ilimitadas',
        'Acceso prioritario a eventos',
        'Toalla y mat incluidos',
        '15% descuento en productos',
        'Invita un amigo gratis/mes',
      ],
      highlighted: false,
    },
  ]

  return (
    <section id="precios" className="py-24 px-6 bg-casaBeige">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-casaCoffee mb-4">
            Planes y <span className="font-semibold">Precios</span>
          </h2>
          <p className="text-casaCoffee/70 text-lg max-w-2xl mx-auto">
            Elige el plan perfecto para ti
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-white shadow-2xl scale-105 border-2 border-casaOlive'
                  : 'bg-casaCream shadow-sm hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-casaOlive text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-casaCoffee mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl font-bold text-casaCoffee">
                    ${plan.price}
                  </span>
                  <span className="text-casaCoffee/50 text-sm">MXN</span>
                </div>
                <p className="text-casaCoffee/60 text-sm">{plan.period}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-casaOlive/10 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-casaOlive" />
                    </div>
                    <span className="text-casaCoffee/80 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-full font-medium transition-all hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-casaOlive text-white hover:bg-casaCoffee shadow-lg'
                    : 'border-2 border-casaOlive text-casaOlive hover:bg-casaOlive hover:text-white'
                }`}
              >
                Elegir Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
