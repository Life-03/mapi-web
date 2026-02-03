'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useClientLocale from './useClientLocale';

const STRINGS = {
  es: {
    title: 'Tours disponibles',
    empty: 'No hay tours disponibles por ahora.',
    loading: 'Cargando...',
    duration: 'Duracion',
    price: 'Precio',
  },
  en: {
    title: 'Available tours',
    empty: 'No tours available yet.',
    loading: 'Loading...',
    duration: 'Duration',
    price: 'Price',
  },
};

export default function TourList({ category, subcategory, slug, slugs }) {
  const locale = useClientLocale();
  const t = STRINGS[locale] || STRINGS.es;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const localePrefix = locale === 'en' ? '/en' : '/es';

  const labels = useMemo(
    () => ({
      category: locale === 'en' ? 'Category' : 'Categoria',
      duration: locale === 'en' ? 'Duration' : 'Duracion',
      from: locale === 'en' ? 'From' : 'Desde',
      view: locale === 'en' ? 'View tour' : 'Ver tour',
      details: locale === 'en' ? 'See details' : 'Ver detalles',
      startingAt: locale === 'en' ? 'Starting at' : 'Desde',
    }),
    [locale]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (subcategory) params.set('subcategory', subcategory);
        if (slug) params.set('slug', slug);
        if (Array.isArray(slugs) && slugs.length) params.set('slugs', slugs.join(','));
        if (locale) params.set('lang', locale);
        const response = await fetch(`/api/trips?${params.toString()}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Error');
        }
        if (active) {
          setTrips(data.data || []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Error');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [category, subcategory, slug, slugs, locale]);

  const categoryLabels = {
    'inca-trail': locale === 'en' ? 'Inca Trail' : 'Camino Inca',
    machupicchu: locale === 'en' ? 'Machu Picchu' : 'Machu Picchu',
    salkantay: 'Salkantay',
    'rainbow-mountain': locale === 'en' ? 'Rainbow Mountain' : 'Montana de Colores',
    'day-tours': locale === 'en' ? 'Day Tours' : 'Tours de un dia',
    'inca-jungle': locale === 'en' ? 'Inca Jungle' : 'Inca Jungle',
    ausangate: 'Ausangate',
    'alternative-tours': locale === 'en' ? 'Alternative Tours' : 'Tours Alternativos',
    'peru-packages': locale === 'en' ? 'Peru Packages' : 'Paquetes Peru',
  };

  const categoryRoutes = {
    'inca-trail': '/inca-trail',
    machupicchu: '/machupicchu',
    salkantay: '/salkantay',
    'rainbow-mountain': '/salkantay',
    'day-tours': '/',
    'inca-jungle': '/',
    ausangate: '/',
    'alternative-tours': '/',
    'peru-packages': '/',
  };

  function getCategoryLabel(categoryValue) {
    return categoryLabels[categoryValue] || categoryValue || (locale === 'en' ? 'Tours' : 'Tours');
  }

  function getCategoryHref(categoryValue) {
    const route = categoryRoutes[categoryValue];
    if (!route) return `${localePrefix}/`;
    return route === '/' ? `${localePrefix}/` : `${localePrefix}${route}`;
  }

  function formatPrice(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '';
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-PE', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  function stripHtml(value) {
    if (!value) return '';
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function getSummary(trip) {
    const raw = trip.highlight || trip.sub_title || trip.meta_description || '';
    const text = stripHtml(raw);
    if (!text) return '';
    return text.length > 180 ? `${text.slice(0, 177)}...` : text;
  }

  function getImage(trip) {
    const first = Array.isArray(trip.gallery) ? trip.gallery[0] : null;
    if (first?.url) return first.url;
    const fallback = {
      machupicchu: '/images/MachuPicchu.webp',
      'inca-trail': '/images/incatrail.webp',
      salkantay: '/images/salkantay.webp',
      'rainbow-mountain': '/images/salkantay.webp',
      'day-tours': '/images/bg25.webp',
      'inca-jungle': '/images/bg25.webp',
      ausangate: '/images/bg25.webp',
      'alternative-tours': '/images/bg25.webp',
      'peru-packages': '/images/bg25.webp',
    };
    return fallback[trip.category] || '/images/bg25.webp';
  }

  function getTripHref(trip) {
    const categoryValue = trip.category || '';
    const slugValue = trip.url_lang || trip.slug;
    if (!slugValue) return `${localePrefix}/`;
    if (categoryValue) {
      return `${localePrefix}/${categoryValue}/${slugValue}`;
    }
    return `${localePrefix}/tours/${slugValue}`;
  }

  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-slate-500">
              {locale === 'en' ? 'Curated experiences' : 'Experiencias curadas'}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">{t.title}</h2>
            <p className="text-slate-600 max-w-2xl">
              {locale === 'en'
                ? 'Handpicked itineraries with real-time availability, local guides, and flexible departures.'
                : 'Itinerarios seleccionados con disponibilidad real, guias locales y salidas flexibles.'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="w-10 h-[2px] bg-amber-400"></span>
            <span>{locale === 'en' ? 'Handpicked for you' : 'Seleccionados para ti'}</span>
          </div>
        </div>

        {loading && <p>{t.loading}</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && trips.length === 0 && <p>{t.empty}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const summary = getSummary(trip);
            const price = formatPrice(trip.price);
            const badgeLabel = trip.badge?.replace(/_/g, ' ') || '';
            const categoryLabel = getCategoryLabel(trip.category);
            const categoryHref = getCategoryHref(trip.category);
            const tripHref = getTripHref(trip);
            const quickstats = Array.isArray(trip.quickstats) ? trip.quickstats.slice(0, 3) : [];

            return (
              <article
                key={trip._id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.6)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImage(trip)}
                    alt={trip.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 text-white">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/90">
                        {labels.startingAt}
                      </span>
                      <p className="text-2xl font-semibold text-white drop-shadow">{price || t.price}</p>
                    </div>
                    {trip.duration && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/90">
                          {labels.duration}
                        </span>
                        <p className="text-lg font-semibold text-white drop-shadow">{trip.duration}</p>
                      </div>
                    )}
                  </div>
                  {badgeLabel && (
                    <span className="absolute top-4 left-4 rounded-full bg-amber-400 text-slate-900 text-xs font-semibold px-3 py-1 uppercase tracking-wider">
                      {badgeLabel}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <Link
                      href={categoryHref}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] tracking-[0.2em] hover:border-amber-400 hover:text-amber-600 transition"
                    >
                      {getCategoryLabel(trip.category)}
                    </Link>
                    {trip.offer && (
                      <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] tracking-[0.2em]">
                        {trip.offer}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">{trip.title}</h3>
                    {summary && <p className="text-slate-600 mt-2 leading-relaxed">{summary}</p>}
                  </div>

                  {quickstats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                      {quickstats.map((stat) => (
                        <div key={`${stat.title}-${stat.content}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.title}</p>
                          <p className="font-semibold text-slate-700">{stat.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={tripHref}
                      className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-white text-sm font-semibold hover:bg-primary transition"
                    >
                      {labels.view}
                    </a>
                    <Link
                      href={categoryHref}
                      className="text-sm font-semibold text-slate-700 hover:text-amber-500 transition"
                    >
                      {labels.details} · {categoryLabel}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
