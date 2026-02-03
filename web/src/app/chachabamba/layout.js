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

const titleEs = "Chachabamba | Disponibilidad y acceso";
const descriptionEs =
  "Consulta disponibilidad y detalles de acceso a Chachabamba para el Camino Inca Corto. Planifica tu visita con información actualizada.";
const titleEn = "Chachabamba | Availability & access";
const descriptionEn =
  "Check availability and access details for Chachabamba on the Short Inca Trail. Plan your visit with up-to-date information.";
const image = "/images/chachabamba.webp";

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? titleEn : titleEs,
    description: isEn ? descriptionEn : descriptionEs,
    path: "/chachabamba",
    image,
    locale: isEn ? "en_US" : "es_PE",
  });
}

export default function ChachabambaLayout({ children }) {
  const locale = getLocale(headers());
  const title = locale === "en" ? titleEn : titleEs;
  const description = locale === "en" ? descriptionEn : descriptionEs;
  const url = absoluteUrl("/chachabamba");
  const pageLd = buildWebPageLd({ name: title, description, url });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: locale === "en" ? "Home" : "Inicio", url: absoluteUrl("/") },
    { name: "Chachabamba", url },
  ]);
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Chachabamba",
    description:
      locale === "en"
        ? "Inca ceremonial site on the Short Inca Trail, before reaching Wiñay Wayna."
        : "Sitio ceremonial inca en el Camino Inca Corto, antes de llegar a Wiñay Wayna.",
    url,
    image: absoluteUrl(image),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
  };
  const faqLd = buildFaqLd(faqs.Chachabamba);

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
