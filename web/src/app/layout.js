import { Oswald, Geist, Geist_Mono } from "next/font/google";
import {
  siteName,
  siteDescription,
  buildMetadata,
  buildOrganizationLd,
  buildWebSiteLd,
} from "../lib/seo";
import { headers } from "next/headers";
import { getLocale, getDictionary } from "../i18n";

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import JsonLd from "./components/JsonLd";
import { LocaleProvider } from "./components/LocaleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const locale = getLocale(headers());
  const isEn = locale === "en";
  return {
    metadataBase: new URL("https://machupicchuavailability.com"),
    ...buildMetadata({
      title: isEn
        ? `${siteName} | Availability & official routes`
        : `${siteName} | Disponibilidad y rutas oficiales`,
      description: isEn
        ? "Check real-time availability for Machu Picchu and official routes. Compare dates, review circuits, and plan your visit with up-to-date information."
        : siteDescription,
      path: "/",
      locale: isEn ? "en_US" : "es_PE",
    }),
  };
}

export default function RootLayout({ children }) {
  const locale = getLocale(headers());
  const t = getDictionary(locale);
  const websiteLd = buildWebSiteLd();
  const organizationLd = buildOrganizationLd();

  return (
    <html lang={locale}>
      <head>
        {/* Preload para la imagen de fondo */}
        <link rel="preload" href="/images/bg25.webp" as="image" type="image/webp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased flex flex-col min-h-screen`}
      >
        <JsonLd data={websiteLd} />
        <JsonLd data={organizationLd} />
        <LocaleProvider locale={locale}>
          <Navbar t={t} locale={locale} />
          <main className="flex-grow bg-scroll md:bg-fixed bg-[url('/images/bg25.webp')]">
            {children}
          </main>
          <a
            href="https://wa.me/51908885107"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale === "en" ? "Chat on WhatsApp" : "Chatear por WhatsApp"}
            className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/80"
            style={{ animation: "whatsappPulse 3s ease-in-out infinite" }}
          >
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d="M19.11 17.2c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.13-.23-.55-.46-.48-.64-.49h-.55c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.19 1.97 3 4.77 4.2.66.29 1.18.46 1.58.59.66.21 1.25.18 1.72.11.53-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33zM16.06 6.4c-5.31 0-9.62 4.31-9.62 9.62 0 1.7.44 3.3 1.21 4.69l-1.29 4.73 4.84-1.27c1.34.73 2.87 1.15 4.52 1.15 5.31 0 9.62-4.31 9.62-9.62 0-5.31-4.31-9.62-9.62-9.62zm0 17.48c-1.56 0-3-.45-4.22-1.23l-.3-.19-2.87.75.77-2.8-.2-.31c-.8-1.24-1.26-2.72-1.26-4.29 0-4.27 3.48-7.75 7.75-7.75s7.75 3.48 7.75 7.75-3.48 7.75-7.75 7.75z" />
            </svg>
          </a>
          <Footer t={t} />
        </LocaleProvider>
      </body>
    </html>
  );
}
