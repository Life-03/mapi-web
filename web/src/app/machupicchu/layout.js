import {
  absoluteUrl,
  buildBreadcrumbLd,
  buildFaqLd,
  buildMetadata,
  buildWebPageLd,
} from "../../lib/seo";
import { headers } from "next/headers";
import { getLocale } from "../../i18n";
import JsonLd from "../components/JsonLd";
import faqs from "../components/faqs";

const titleEs = "Machu Picchu | Disponibilidad, tickets y circuitos oficiales";
const descriptionEs =
  "Consulta disponibilidad de Machu Picchu, circuitos oficiales y rutas recomendadas. Revisa cupos y planifica tu visita con información actualizada.";
const titleEn = "Machu Picchu | Availability, tickets & official circuits";
const descriptionEn =
  "Check Machu Picchu availability, official circuits, and recommended routes. Review capacity and plan your visit with up-to-date information.";
const image = "/images/MachuPicchu-hero.webp";

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? titleEn : titleEs,
    description: isEn ? descriptionEn : descriptionEs,
    path: "/machupicchu",
    image,
    locale: isEn ? "en_US" : "es_PE",
  });
}

export default function MachuPicchuLayout({ children }) {
  const locale = getLocale(headers());
  const title = locale === "en" ? titleEn : titleEs;
  const description = locale === "en" ? descriptionEn : descriptionEs;
  const url = absoluteUrl("/machupicchu");
  const pageLd = buildWebPageLd({ name: title, description, url });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: locale === "en" ? "Home" : "Inicio", url: absoluteUrl("/") },
    { name: "Machu Picchu", url },
  ]);
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Machu Picchu",
    description:
      locale === "en"
        ? "Inca citadel in the Cusco region and one of the most visited cultural sites in South America."
        : "Ciudadela inca en la región Cusco y uno de los sitios culturales más visitados de Sudamérica.",
    url,
    image: absoluteUrl(image),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Machu Picchu",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.1631,
      longitude: -72.545,
    },
  };
  const faqLd = buildFaqLd(faqs.MachuPicchu);

  return (
    <>
      <JsonLd data={pageLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={attractionLd} />
      <JsonLd data={faqLd} />
      {children}
    </>
  );
}
