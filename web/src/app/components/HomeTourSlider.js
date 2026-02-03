'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useClientLocale from './useClientLocale';

const FEATURED_SLUGS = [];

const COPY = {
  es: {
    title: 'Tours destacados',
    subtitle: 'Experiencias recomendadas para tu viaje.',
    cta: 'Ver tour',
    from: 'Desde',
    duration: 'Duracion',
  },
  en: {
    title: 'Featured tours',
    subtitle: 'Recommended experiences for your trip.',
    cta: 'View tour',
    from: 'From',
    duration: 'Duration',
  },
};

function getImage(trip) {
  const first = Array.isArray(trip.gallery) ? trip.gallery[0] : null;
  if (first?.url) return first.url;
  const fallback = {
    machupicchu: '/images/MachuPicchu.webp',
    'inca-trail': '/images/incatrail.webp',
  };
  return fallback[trip.category] || '/images/MachuPicchu.webp';
}

function formatPrice(value, locale) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return null;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-PE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function HomeTourSlider() {
  const locale = useClientLocale();
  const t = COPY[locale] || COPY.es;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const localePrefix = locale === 'en' ? '/en' : '/es';

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ lang: locale, limit: '9' });
        if (FEATURED_SLUGS.length) {
          params.set('slugs', FEATURED_SLUGS.join(','));
        }
        const res = await fetch(`/api/trips?${params.toString()}`);
        const data = await res.json();
        if (active && res.ok) {
          const list = Array.isArray(data.data) ? data.data : [];
          setTrips(list);
          setActiveIndex(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [locale]);

  const slides = useMemo(() => {
    if (!trips.length) return [];
    const chunks = [];
    for (let i = 0; i < trips.length; i += 3) {
      chunks.push(trips.slice(i, i + 3));
    }
    return chunks;
  }, [trips]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  function next() {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }

  function prev() {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
        <p className="text-gray-600 mt-2">{t.subtitle}</p>
        <div className="mt-8 h-80 bg-white/60 rounded-3xl animate-pulse" />
      </section>
    );
  }

  if (!slides.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500">{t.title}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">{t.subtitle}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-400"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-400"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((group, groupIndex) => (
            <div key={`slide-${groupIndex}`} className="min-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.map((trip) => {
                  const price = formatPrice(trip.price, locale);
                  const slugValue = trip.url_lang || trip.slug;
                  const categoryValue = trip.category || 'tours';
                  const href = slugValue
                    ? `${localePrefix}/${categoryValue}/${slugValue}`
                    : `${localePrefix}/`;

                  return (
                    <article
                      key={trip._id}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.6)]"
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={getImage(trip)}
                          alt={trip.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/90">{t.from}</p>
                          <p className="text-xl font-semibold drop-shadow">{price || 'USD'}</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-500">{trip.category}</p>
                          <h3 className="text-xl font-semibold text-gray-800 mt-2">{trip.title}</h3>
                          {trip.sub_title && <p className="text-gray-600 mt-2">{trip.sub_title}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t.duration}</p>
                            <p className="text-base font-semibold text-gray-800">{trip.duration || '-'}</p>
                          </div>
                          <Link
                            href={href}
                            className="bg-[#fea614] px-4 py-2 rounded-full text-white text-sm font-semibold hover:bg-[#003933]"
                          >
                            {t.cta}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === activeIndex ? 'bg-amber-500' : 'bg-gray-300'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
