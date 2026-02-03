import { NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';
const localeCookieName = 'mapi_locale';

const adminPaths = ['/admin', '/es/admin', '/en/admin'];

function shouldIgnore(pathname) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images')
  );
}

function isAdminPath(pathname) {
  return adminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isAuthorized(request) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';
  if (!sessionToken) {
    return false;
  }

  try {
    const cookie = request.cookies.get('admin_session')?.value || '';
    return cookie === sessionToken;
  } catch {
    return false;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isRsc = request.headers.get('RSC') === '1';
  const isPrefetch = request.headers.get('next-router-prefetch') === '1';
  const isData = request.headers.get('x-nextjs-data') === '1';

  if (shouldIgnore(pathname)) {
    return NextResponse.next();
  }

  if (isAdminPath(pathname) && !isAuthorized(request)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    return NextResponse.redirect(redirectUrl);
  }

  const parts = pathname.split('/');
  const maybeLocale = parts[1];

  if (locales.includes(maybeLocale)) {
    const headers = new Headers(request.headers);
    headers.set('x-locale', maybeLocale);

    const rewriteUrl = request.nextUrl.clone();
    const stripped = `/${parts.slice(2).join('/')}`;
    rewriteUrl.pathname = stripped === '/' ? '/' : stripped.replace(/\/$/, '') || '/';

    const response = NextResponse.rewrite(rewriteUrl, { request: { headers } });
    response.cookies.set(localeCookieName, maybeLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const preferredLocale = locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  if (isRsc || isPrefetch || isData) {
    const headers = new Headers(request.headers);
    headers.set('x-locale', preferredLocale);
    return NextResponse.next({ request: { headers } });
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|assets|images).*)'],
};
