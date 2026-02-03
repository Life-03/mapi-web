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

const titleEs = "Camino Inca | Disponibilidad y permisos oficiales";
const descriptionEs =
  "Consulta disponibilidad del Camino Inca, fechas y opciones de ruta. Planifica tu caminata con información oficial y actualizada.";
const titleEn = "Inca Trail | Availability & official permits";
const descriptionEn =
  "Check Inca Trail availability, dates, and route options. Plan your hike with official, up-to-date information.";
const image = "/images/incatrail.webp";

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? titleEn : titleEs,
    description: isEn ? descriptionEn : descriptionEs,
    path: "/inca-trail",
    image,
    locale: isEn ? "en_US" : "es_PE",
  });
}

export default function IncaTrailCategoryLayout({ children }) {
  const locale = getLocale(headers());
  const title = locale === "en" ? titleEn : titleEs;
  const description = locale === "en" ? descriptionEn : descriptionEs;
  const url = absoluteUrl("/inca-trail");
  const pageLd = buildWebPageLd({ name: title, description, url });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: locale === "en" ? "Home" : "Inicio", url: absoluteUrl("/") },
    { name: locale === "en" ? "Inca Trail" : "Camino Inca", url },
  ]);
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: locale === "en" ? "Inca Trail" : "Camino Inca",
    description:
      locale === "en"
        ? "Iconic multi-day trek through the Andes leading to Machu Picchu via ancient Inca paths."
        : "Trek icónico de varios días por los Andes que llega a Machu Picchu por rutas incas.",
    url,
    image: absoluteUrl(image),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
  };
  const faqLd = buildFaqLd(faqs.Incatrail);

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
