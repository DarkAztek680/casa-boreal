
'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-casaOlive/20 to-casaCoffee/10 rounded-full blur-3xl float-animation"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            scale: [1, 0.9, 1],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-casaCoffee/15 to-casaBeige/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-casaOlive/5 rounded-full blur-2xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-casaCoffee mb-8 leading-tight">
            Descubre tu
            <span className="block font-semibold text-casaOlive mt-4">
              fuerza interior
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-casaCoffee/80 mb-12 max-w-2xl mx-auto font-light"
        >
          Barre en Puebla • Transforma tu cuerpo y mente en un espacio de bienestar y conexión
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="#precios"
            className="bg-casaCream text-casaCoffee px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-casaBeige hover:scale-105 border-2 border-casaCoffee"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Primera Clase Gratis
          </motion.a>
          <motion.a
            href="#horarios"
            className="border-2 border-casaCoffee text-casaCoffee bg-white px-10 py-4 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-casaCoffee hover:text-white hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Horarios
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-casaOlive/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-casaOlive rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
