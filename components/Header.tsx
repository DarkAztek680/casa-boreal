'use client';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Qué es Barre', href: '#barre' },
    { name: 'Horarios', href: '#horarios' },
    { name: 'Precios', href: '#precios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-effect shadow-xl'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, '#inicio')}
          className="text-2xl lg:text-3xl font-heading font-semibold text-casaCoffee hover:text-casaOlive transition-colors"
        >
          Casa Boreal
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-casaCoffee hover:text-casaOlive transition-colors"
            >
              {link.name}
            </a>
          ))}
          {/* Botón dinámico con dropdown */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-casaOlive text-casaCream px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-casaCoffee hover:scale-105 border-2 border-casaOlive text-shadow-soft"
              >
                Hola, {session.user?.name}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' }); // Cerrar sesión y redirigir al inicio
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="bg-casaOlive text-casaCream px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-casaCoffee hover:scale-105 border-2 border-casaOlive text-shadow-soft"
            >
              Iniciar Sesión
            </a>
          )}
          {/* Botón de Reservar Clase */}
          <a
            href="#reservar"
            onClick={(e) => handleNavClick(e, '#reservar')}
            className="bg-casaOlive text-casaCream px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-casaCoffee hover:scale-105 border-2 border-casaOlive text-shadow-soft"
          >
            Reservar Clase
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-casaOlive"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-casaCream/95 backdrop-blur-md shadow-lg border-t border-casaCoffee/10">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-lg font-medium text-casaCoffee hover:text-casaOlive transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#reservar"
              onClick={(e) => handleNavClick(e, '#reservar')}
              className="block bg-casaOlive text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-casaCoffee transition-colors text-center text-shadow-soft"
            >
              Reservar Clase
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
