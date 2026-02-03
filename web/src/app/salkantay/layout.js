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

const titleEs = "Salkantay Trek | Disponibilidad y rutas";
const descriptionEs =
  "Consulta disponibilidad del Salkantay Trek, compara fechas y opciones de ruta, y planifica tu caminata con información clara.";
const titleEn = "Salkantay Trek | Availability & routes";
const descriptionEn =
  "Check Salkantay Trek availability, compare dates and route options, and plan your hike with clear information.";
const image = "/images/Salkantay_Trek.webp";

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? titleEn : titleEs,
    description: isEn ? descriptionEn : descriptionEs,
    path: "/salkantay",
    image,
    locale: isEn ? "en_US" : "es_PE",
  });
}

export default function SalkantayLayout({ children }) {
  const locale = getLocale(headers());
  const title = locale === "en" ? titleEn : titleEs;
  const description = locale === "en" ? descriptionEn : descriptionEs;
  const url = absoluteUrl("/salkantay");
  const pageLd = buildWebPageLd({ name: title, description, url });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: locale === "en" ? "Home" : "Inicio", url: absoluteUrl("/") },
    { name: "Salkantay", url },
  ]);
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Salkantay Trek",
    description:
      locale === "en"
        ? "High-altitude trekking route through the Andes and cloud forests on the way to Machu Picchu."
        : "Ruta de trekking de gran altitud por los Andes y bosques nubosos rumbo a Machu Picchu.",
    url,
    image: absoluteUrl(image),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
  };
  const faqLd = buildFaqLd(faqs.Salkantay);

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
