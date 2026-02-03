'use client';

import { useEffect, useState } from 'react';
import useClientLocale from '../components/useClientLocale';

const COPY = {
  es: {
    title: 'Acceso al dashboard',
    subtitle: 'Ingresa tus credenciales para continuar.',
    userLabel: 'Usuario',
    passLabel: 'Contrasena',
    button: 'Continuar',
    hint: 'Si no recuerdas tus credenciales, avisa al administrador.',
    stored: 'Acceso correcto. Redirigiendo...',
    error: 'Credenciales invalidas.',
  },
  en: {
    title: 'Dashboard access',
    subtitle: 'Enter your credentials to continue.',
    userLabel: 'Username',
    passLabel: 'Password',
    button: 'Continue',
    hint: 'If you forgot your credentials, contact the administrator.',
    stored: 'Access granted. Redirecting...',
    error: 'Invalid credentials.',
  },
};

export default function SignInClient() {
  const locale = useClientLocale();
  const t = COPY[locale] || COPY.es;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!username.trim() || !password) return;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error('Invalid');
      }
      setMessage(t.stored);
      window.location.href = `/${locale}/admin`;
    } catch {
      setError(t.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Machu Picchu Availability</p>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-sm text-slate-400">{t.subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2 block">
            <span className="text-xs uppercase tracking-wide text-slate-400">{t.userLabel}</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
              placeholder="admin"
            />
          </label>
          <label className="space-y-2 block">
            <span className="text-xs uppercase tracking-wide text-slate-400">{t.passLabel}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
              placeholder="********"
            />
          </label>
          <button type="submit" className="w-full bg-amber-500 text-slate-950 py-3 rounded-lg font-semibold">
            {t.button}
          </button>
        </form>

        <p className="text-xs text-slate-500">{t.hint}</p>
        {message && <p className="text-xs text-emerald-400">{message}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
