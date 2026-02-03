'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocaleState } from './LocaleProvider';

function swapLocale(pathname, locale) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'es' || parts[0] === 'en') {
    parts[0] = locale;
  } else {
    parts.unshift(locale);
  }
  return '/' + parts.join('/');
}

export default function LocaleSwitcher({ locale }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { setLocale } = useLocaleState();

  const persistLocale = (nextLocale) => {
    if (typeof document === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `mapi_locale=${nextLocale}; path=/; max-age=${maxAge}`;
  };

  const handleSwitch = (nextLocale) => {
    if (nextLocale === locale) return;
    persistLocale(nextLocale);
    setLocale(nextLocale);
    const target = swapLocale(pathname, nextLocale);
    router.push(target);
  };

  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <button
        type="button"
        onClick={() => handleSwitch('es')}
        className={locale === 'es' ? 'text-[#fabf02]' : 'text-[#003933]'}
      >
        ES
      </button>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={() => handleSwitch('en')}
        className={locale === 'en' ? 'text-[#fabf02]' : 'text-[#003933]'}
      >
        EN
      </button>
    </div>
  );
}
