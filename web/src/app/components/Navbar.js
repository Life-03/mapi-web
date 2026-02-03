"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LocaleSwitcher from "./LocaleSwitcher";
import useClientLocale from "./useClientLocale";
import es from "../../i18n/es.json";
import en from "../../i18n/en.json";

export default function Navbar({ t, locale }) {
  const [isOpen, setIsOpen] = useState(false);

  const clientLocale = useClientLocale();
  const currentLocale = clientLocale || locale || "es";
  const activeDict = currentLocale === "en" ? en : es;
  const prefix = currentLocale ? `/${currentLocale}` : "";
  const links = [
    { name: activeDict["nav.machu"] || t?.["nav.machu"] || "MACHU PICCHU", url: `${prefix}/machupicchu` },
    { name: activeDict["nav.chachabamba"] || t?.["nav.chachabamba"] || "CHACHABAMBA", url: `${prefix}/chachabamba` },
    { name: activeDict["nav.qoriwayrachina"] || t?.["nav.qoriwayrachina"] || "QORIWAYRACHINA", url: `${prefix}/qoriwayrachina` },
    { name: activeDict["nav.salkantay"] || t?.["nav.salkantay"] || "SALKANTAY", url: `${prefix}/salkantay` },
    { name: activeDict["nav.incatrail"] || t?.["nav.incatrail"] || "CAMINO INCA", url: `${prefix}/inca-trail` }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-16">
          
          <Link href={prefix || "/"} className="flex items-center gap-2">
            <Image
              src="/assets/logo.webp"
              width={64}
              height={64}
              className="w-16 h-16"
              alt="Logo de Machu Picchu Availability"
              priority
            />
            <span className="text-xl font-bold text-[#003933]">MACHU <span className="text-[#fabf02]">PICCHU</span> AVAILABILITY  </span>
          </Link>


          
          
          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex space-x-6 items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="text-[#003933] hover:text-[#fabf02]"
              >
                {link.name}
              </Link>
            ))}
            <LocaleSwitcher locale={currentLocale} />
          </div>

          {/* Botón de menú en móviles */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>
      
      {/* Menú desplegable en móviles */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md py-2 absolute w-full">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              {link.name}
            </Link>
          ))}
          <div className="px-4 py-2">
            <LocaleSwitcher locale={currentLocale} />
          </div>
        </div>
      )}
    </nav>
  );
}
