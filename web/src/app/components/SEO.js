"use client";
export default function SEO({
  title = "Machu Picchu Availability - Información",
  description = "Consulta la disponibilidad de Machu Picchu y más con Machu Picchu Availability",
  keywords = "Disponibilidad Machu Picchu, Chachabamba, Qoriwayrachina, Salkantay, Camino Inca",
  image = {
    url: "/images/MachuPicchu.webp",
    width: 1200,
    height: 630,
    alt: "Machu Picchu panoramic view"
  },
  url = "https://machupicchuavailability.com",
  canonical = null, // Si es null, usa la URL base
  ogType = "website"
}) {
  const metaCanonical = canonical || url;

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.url} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      {image.alt && <meta property="og:image:alt" content={image.alt} />}

     
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.url} />

      
      <link rel="canonical" href={metaCanonical} />
    </>
  );
}
