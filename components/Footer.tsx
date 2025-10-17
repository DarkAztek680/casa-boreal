'use client';
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Qué es Barre', href: '#barre' },
    { name: 'Horarios', href: '#horarios' },
    { name: 'Precios', href: '#precios' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contacto" className="bg-casaCoffee text-casaBeige">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-heading font-semibold mb-3">
              Casa Boreal
            </h3>
            <p className="text-casaBeige/70 text-sm leading-relaxed">
              Transforma tu cuerpo y mente en un espacio de bienestar y conexión
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-casaBeige/70 hover:text-casaOlive transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-casaBeige/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Puebla, México</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:+522221234567"
                  className="text-casaBeige/70 hover:text-casaOlive transition-colors"
                >
                  +52 (222) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:hola@casaboreal.com"
                  className="text-casaBeige/70 hover:text-casaOlive transition-colors"
                >
                  hola@casaboreal.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-casaBeige/10 rounded-full flex items-center justify-center hover:bg-casaOlive transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-casaBeige/10 rounded-full flex items-center justify-center hover:bg-casaOlive transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-casaBeige/10 rounded-full flex items-center justify-center hover:bg-casaOlive transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-casaBeige/10 pt-8">
          <p className="text-center text-casaBeige/60 text-sm">
            © {new Date().getFullYear()} Casa Boreal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
