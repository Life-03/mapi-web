'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const LocaleContext = createContext({
  locale: 'es',
  setLocale: () => {},
});

export function LocaleProvider({ locale: initialLocale, children }) {
  const [locale, setLocale] = useState(initialLocale || 'es');
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleState() {
  return useContext(LocaleContext);
}
