'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocaleState } from './LocaleProvider';

const SUPPORTED = ['es', 'en'];

function inferFromPath(pathname) {
  if (pathname?.startsWith('/en')) return 'en';
  if (pathname?.startsWith('/es')) return 'es';
  return null;
}

function inferFromCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)mapi_locale=([^;]+)/);
  return match?.[1] && SUPPORTED.includes(match[1]) ? match[1] : null;
}

export default function useClientLocale() {
  const { locale: serverLocale, setLocale: setServerLocale } = useLocaleState();
  const pathname = usePathname() || '/';
  const [locale, setLocale] = useState(() => inferFromPath(pathname) || serverLocale || 'es');

  useEffect(() => {
    const windowPath = typeof window !== 'undefined' ? window.location.pathname : null;
    const pathLocale = inferFromPath(windowPath || pathname);
    if (pathLocale) {
      setLocale(pathLocale);
      if (pathLocale !== serverLocale) {
        setServerLocale(pathLocale);
      }
      return;
    }
    const docLocale = document?.documentElement?.lang;
    if (SUPPORTED.includes(docLocale)) {
      setLocale(docLocale);
      if (docLocale !== serverLocale) {
        setServerLocale(docLocale);
      }
      return;
    }
    const cookieLocale = inferFromCookie();
    if (cookieLocale) {
      setLocale(cookieLocale);
      if (cookieLocale !== serverLocale) {
        setServerLocale(cookieLocale);
      }
      return;
    }
    if (SUPPORTED.includes(serverLocale)) {
      setLocale(serverLocale);
      return;
    }
    setLocale('es');
  }, [pathname, serverLocale, setServerLocale]);

  return locale;
}
