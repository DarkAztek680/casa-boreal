'use client';

import { useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setMessage('Por favor, completa el CAPTCHA.');
      return;
    }

    console.log('Formulario enviado con:', { email, password, captchaToken }); // Agregado para depuración

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, captchaToken }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Cuenta creada exitosamente.');
      setTimeout(() => router.push('/dashboard'), 2000); // Redirige al dashboard después de 2 segundos
    } else {
      setMessage(data.error || 'Error al crear la cuenta.');
    }
  };

  return (
    <main className="bg-gradient-to-br from-casaBeige via-casaCream to-casaBeige min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full border border-casaCoffee/20">
        <h1 className="text-4xl font-heading text-casaCoffee mb-8 text-center">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-casaCoffee">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full border border-casaCoffee/20 rounded-lg p-3 focus:ring-casaOlive focus:border-casaOlive shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-casaCoffee">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full border border-casaCoffee/20 rounded-lg p-3 focus:ring-casaOlive focus:border-casaOlive shadow-sm"
              required
            />
          </div>
          <ReCAPTCHA
            sitekey="6LfRxuYrAAAAAAd8TJUv865Z-d2Xrr9DmC3VlONx"
            onChange={(token) => setCaptchaToken(token || '')}
          />
          <button
            type="submit"
            className="w-full bg-casaCoffee text-casaBeige py-3 rounded-lg font-medium hover:bg-casaOlive transition-all shadow-lg hover:shadow-xl"
          >
            Registrarse
          </button>
        </form>
        {message && <p className="mt-6 text-center text-red-500">{message}</p>}
      </div>
    </main>
  );
}