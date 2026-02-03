import { siteUrl } from "../lib/seo";

const API_BASE_URL = process.env.INTERNAL_API_BASE_URL || "http://api:4000";

async function fetchTrips() {
  const url = new URL("/api/trips", API_BASE_URL);
  url.searchParams.set("limit", "200");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  if (!data?.success || !Array.isArray(data.data)) return [];
  return data.data;
}

function normalizeSlug(trip) {
  return trip.url_lang || trip.slug || "";
}

function buildTourUrls(trips) {
  const entries = [];
  trips.forEach((trip) => {
    const slug = normalizeSlug(trip);
    const category = trip.category || "tours";
    if (!slug) return;
    const langs = trip.lang === "all" || !trip.lang ? ["es", "en"] : [trip.lang];
    langs.forEach((lang) => {
      entries.push({
        url: `${siteUrl}/${lang}/${category}/${slug}`,
        lastModified: trip.updatedAt ? new Date(trip.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });
  return entries;
}

export default async function sitemap() {
  const now = new Date();
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/machupicchu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/salkantay`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/incatrail`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/inca-trail`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/chachabamba`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/qoriwayrachina`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const trips = await fetchTrips();
  const tourEntries = buildTourUrls(trips);

  return [...staticRoutes, ...tourEntries];
}
