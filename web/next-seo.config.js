'use client';
const siteUrl = "https://machupicchuavailability.com";

const seoConfig = {
  title: "Machu Picchu Availability – Disponibilidad y rutas oficiales",
  description:
    "Consulta disponibilidad de tickets para Machu Picchu, Camino Inca, Salkantay y otros destinos. Planifica tu visita y reserva con anticipación.",
  canonical: siteUrl,
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteUrl,
    site_name: "Machu Picchu Availability",
    images: [
      {
        url: `${siteUrl}/images/MachuPicchu.webp`,
        width: 1200,
        height: 630,
        alt: "Vista panorámica de Machu Picchu",
      },
    ],
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "author",
      content: "Machu Picchu Availability",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "keywords",
      content: "Disponibilidad Machu Picchu, Chachabamba, Qoriwayrachina, Salkantay, Camino Inca",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
};

export default seoConfig;
