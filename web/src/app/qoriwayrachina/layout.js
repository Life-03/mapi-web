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

const titleEs = "Qoriwayrachina | Disponibilidad y acceso";
const descriptionEs =
  "Consulta disponibilidad y detalles de acceso a Qoriwayrachina. Revisa fechas y planifica tu visita con información confiable.";
const titleEn = "Qoriwayrachina | Availability & access";
const descriptionEn =
  "Check availability and access details for Qoriwayrachina. Review dates and plan your visit with reliable information.";
const image = "/images/qoriwayrachina.webp";

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? titleEn : titleEs,
    description: isEn ? descriptionEn : descriptionEs,
    path: "/qoriwayrachina",
    image,
    locale: isEn ? "en_US" : "es_PE",
  });
}

export default function QoriwayrachinaLayout({ children }) {
  const locale = getLocale(headers());
  const title = locale === "en" ? titleEn : titleEs;
  const description = locale === "en" ? descriptionEn : descriptionEs;
  const url = absoluteUrl("/qoriwayrachina");
  const pageLd = buildWebPageLd({ name: title, description, url });
  const breadcrumbLd = buildBreadcrumbLd([
    { name: locale === "en" ? "Home" : "Inicio", url: absoluteUrl("/") },
    { name: "Qoriwayrachina", url },
  ]);
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Qoriwayrachina",
    description:
      locale === "en"
        ? "Remote Inca archaeological site in Cusco, accessed by train or Inca Trail."
        : "Sitio arqueológico inca remoto en Cusco, con acceso por tren o Camino Inca.",
    url,
    image: absoluteUrl(image),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
  };
  const faqLd = buildFaqLd(faqs.Qoriwayrachina);

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
