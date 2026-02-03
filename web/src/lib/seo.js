export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://machupicchuavailability.com";

export const siteName = "Machu Picchu Availability";
export const siteDescription =
  "Consulta la disponibilidad de Machu Picchu y rutas oficiales en tiempo real. Compara fechas, revisa circuitos y planifica tu visita con información actualizada.";
export const siteImage = "/images/MachuPicchu.webp";
export const siteLocale = "es_PE";
export const siteLanguage = "es";

export function absoluteUrl(path = "/") {
  if (!path) return siteUrl;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function buildFaqLd(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildMetadata({ title, description, path = "/", image, type = "website", keywords, locale = siteLocale }) {
  const url = absoluteUrl(path);
  const metaTitle = title || siteName;
  const metaDescription = description || siteDescription;
  const metaImage = absoluteUrl(image || siteImage);

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale,
      siteName,
      url,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildWebSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    inLanguage: siteLanguage,
  };
}

export function buildOrganizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteImage),
    image: absoluteUrl(siteImage),
  };
}

export function buildWebPageLd({ name, description, url, language = siteLanguage }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    description,
    inLanguage: language,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: absoluteUrl("/"),
    },
  };
}

export function buildBreadcrumbLd(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildTouristTripLd({
  name,
  description,
  url,
  image,
  language = siteLanguage,
  price,
  currency = "USD",
  providerName = siteName,
}) {
  if (!name || !url) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description: description || siteDescription,
    url,
    inLanguage: language,
    image: image ? [image] : undefined,
    provider: {
      "@type": "Organization",
      name: providerName,
      url: absoluteUrl("/"),
    },
  };

  if (price !== undefined && price !== null && price !== "" && !Number.isNaN(Number(price))) {
    data.offers = {
      "@type": "Offer",
      priceCurrency: currency,
      price: Number(price),
      availability: "https://schema.org/InStock",
      url,
    };
  }

  return data;
}
