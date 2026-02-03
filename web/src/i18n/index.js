import es from './es.json';
import en from './en.json';

const dictionaries = { es, en };

export function getLocale(headers) {
  if (!headers) return 'es';
  const headerLocale = headers.get?.('x-locale') || headers['x-locale'];
  if (headerLocale) return headerLocale;
  const cookieHeader = headers.get?.('cookie') || headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)mapi_locale=([^;]+)/);
    if (match?.[1]) return match[1];
  }
  return 'es';
}

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.es;
}
