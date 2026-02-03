import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LightboxGallery from './LightboxGallery';
import TripTabs from './TripTabs';
import { getLocale } from '../../i18n';
import { buildMetadata, siteName, buildTouristTripLd, absoluteUrl } from '../../lib/seo';
import JsonLd from './JsonLd';

const API_BASE_URL = process.env.INTERNAL_API_BASE_URL || 'http://api:4000';

async function fetchTrip(slug, locale, category) {
  const base = new URL('/api/trips', API_BASE_URL);
  base.searchParams.set('slug', slug);
  base.searchParams.set('limit', '1');
  if (locale) base.searchParams.set('lang', locale);
  if (category) base.searchParams.set('category', category);

  const response = await fetch(base.toString(), { cache: 'no-store' });
  const data = await response.json();
  if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }

  if (locale && locale !== 'all') {
    const fallback = new URL('/api/trips', API_BASE_URL);
    fallback.searchParams.set('slug', slug);
    fallback.searchParams.set('limit', '1');
    fallback.searchParams.set('lang', 'all');
    if (category) fallback.searchParams.set('category', category);
    const fallbackRes = await fetch(fallback.toString(), { cache: 'no-store' });
    const fallbackData = await fallbackRes.json();
    if (fallbackData?.success && Array.isArray(fallbackData.data) && fallbackData.data.length > 0) {
      return fallbackData.data[0];
    }
  }

  const lastTry = new URL('/api/trips', API_BASE_URL);
  lastTry.searchParams.set('slug', slug);
  lastTry.searchParams.set('limit', '1');
  const lastRes = await fetch(lastTry.toString(), { cache: 'no-store' });
  const lastData = await lastRes.json();
  if (lastData?.success && Array.isArray(lastData.data) && lastData.data.length > 0) {
    return lastData.data[0];
  }

  return null;
}

function getImage(trip) {
  const first = Array.isArray(trip.gallery) ? trip.gallery[0] : null;
  if (first?.url) return first.url;
  const fallback = {
    machupicchu: '/images/MachuPicchu.webp',
    'inca-trail': '/images/incatrail.webp',
    salkantay: '/images/salkantay.webp',
    'rainbow-mountain': '/images/salkantay.webp',
  };
  return fallback[trip.category] || '/images/bg25.webp';
}

function stripHtml(value) {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function generateTourMetadata({ slug, category }) {
  const locale = getLocale(headers());
  const trip = await fetchTrip(slug, locale, category);
  if (!trip) {
    return buildMetadata({
      title: siteName,
      description: locale === 'en' ? 'Tour information' : 'Informacion del tour',
      path: `/${category ? `${category}/` : 'tours/'}${slug}`,
      locale: locale === 'en' ? 'en_US' : 'es_PE',
    });
  }

  const metaTitle = trip.meta_title || trip.title || siteName;
  const metaDescription =
    stripHtml(trip.meta_description || trip.highlight || trip.sub_title || trip.description) ||
    (locale === 'en' ? 'Tour information' : 'Informacion del tour');

  return buildMetadata({
    title: metaTitle,
    description: metaDescription,
    path: `/${category ? `${category}/` : 'tours/'}${slug}`,
    image: getImage(trip),
    locale: locale === 'en' ? 'en_US' : 'es_PE',
    type: 'article',
  });
}

export async function renderTourDetail({ slug, category }) {
  const locale = getLocale(headers());
  const trip = await fetchTrip(slug, locale, category);

  if (!trip) {
    notFound();
  }

  const localePrefix = locale === 'en' ? '/en' : '/es';
  const labels = {
    back: locale === 'en' ? 'Back to tours' : 'Volver a tours',
    duration: locale === 'en' ? 'Duration' : 'Duracion',
    price: locale === 'en' ? 'From' : 'Desde',
    highlights: locale === 'en' ? 'Highlights' : 'Resumen',
    details: locale === 'en' ? 'Tour details' : 'Detalles del tour',
    gallery: locale === 'en' ? 'Gallery' : 'Galeria',
    info: locale === 'en' ? 'Itinerary & info' : 'Itinerario y detalles',
    offer: locale === 'en' ? 'Special offer' : 'Oferta especial',
  };

  const price =
    trip.price !== undefined && trip.price !== null
      ? new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-PE', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(Number(trip.price))
      : null;

  const quickstats = Array.isArray(trip.quickstats) ? trip.quickstats : [];
  const infoSections = Array.isArray(trip.information) ? trip.information : [];
  const slugValue = trip.url_lang || trip.slug || slug;
  const categoryValue = category || trip.category || 'tours';
  const path = `${localePrefix}/${categoryValue}/${slugValue}`;
  const tripLd = buildTouristTripLd({
    name: trip.title,
    description: stripHtml(trip.meta_description || trip.highlight || trip.description),
    url: absoluteUrl(path),
    image: absoluteUrl(getImage(trip)),
    language: locale === 'en' ? 'en' : 'es',
    price: trip.price,
  });

  return (
    <section className="bg-white">
      <JsonLd data={tripLd} />
      <div className="relative h-[65vh] min-h-[420px]">
        <img
          src={getImage(trip)}
          alt={trip.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent"></div>
        <div className="absolute bottom-8 left-6 right-6 max-w-6xl mx-auto text-white">
          <Link href={`${localePrefix}/`} className="text-xs uppercase tracking-[0.3em] text-amber-200/90">
            {labels.back}
          </Link>
          <h1 className="text-3xl md:text-5xl font-semibold mt-3 drop-shadow">{trip.title}</h1>
          {trip.sub_title && <p className="text-lg md:text-xl text-slate-100 mt-2 drop-shadow">{trip.sub_title}</p>}
          <div className="flex flex-wrap items-center gap-6 mt-5">
            {trip.duration && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/90">{labels.duration}</p>
                <p className="text-lg font-semibold text-white drop-shadow">{trip.duration}</p>
              </div>
            )}
            {price && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/90">{labels.price}</p>
                <p className="text-lg font-semibold text-white drop-shadow">{price}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {(quickstats.length > 0 || trip.offer) && (
          <div className="rounded-3xl border border-slate-200 bg-white/80 px-6 py-5 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.5)]">
            <div className="flex flex-wrap items-center gap-6">
              {trip.offer && (
                <div className="rounded-full bg-amber-100/70 border border-amber-200 px-4 py-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-700">{labels.offer}</span>
                  <span className="ml-3 text-sm font-semibold text-amber-900">{trip.offer}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-6">
                {quickstats.map((stat) => (
                  <div key={`${stat.title}-${stat.content}`} className="min-w-[140px]">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                    <p className="text-base font-semibold text-slate-800">{stat.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {trip.highlight && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{labels.highlights}</h2>
              <p className="text-slate-600 mt-2">{stripHtml(trip.highlight)}</p>
            </div>
          )}

          {trip.description && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{labels.details}</h2>
              <div
                className="prose prose-slate max-w-none mt-3"
                dangerouslySetInnerHTML={{ __html: trip.description }}
              />
            </div>
          )}
        </div>

        {infoSections.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{labels.info}</h2>
            <TripTabs sections={infoSections} />
          </div>
        )}

        {Array.isArray(trip.gallery) && trip.gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{labels.gallery}</h2>
            <LightboxGallery images={trip.gallery} title={trip.title} />
          </div>
        )}
      </div>
    </section>
  );
}
