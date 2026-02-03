'use client'

import { useState, useEffect } from 'react';
import useClientLocale from '../components/useClientLocale';
import Calendar from "../components/Calendar";
import faqs from '../components/faqs';
import TourList from "../components/TourList";
import incatrailEs from "../../i18n/incatrail.es.json";
import incatrailEn from "../../i18n/incatrail.en.json";

export default function Page() {
  const locale = useClientLocale();
  const t = locale === "en" ? incatrailEn : incatrailEs;
  const calendarLocale = locale === "en" ? "en-US" : "es-PE";
  const calendarLabels = {
    lastUpdated: t["calendar.lastUpdated"],
    daysShort: t["calendar.daysShort"],
  };

  const [dataget, setFinancials] = useState({ data: [] });
  // Estados para el origen y destino
  const [origin, setOrigin] = useState('Cusco');
  const destinationLabel = locale === "en" ? "Inca Trail" : "Camino Inca";
  const [destination, setDestination] = useState(destinationLabel);
  //PREGUNTAS FRECUENTES
  const [openIndex, setOpenIndex] = useState(null);
  const selectedFaqs = locale === "en" ? "IncatrailEn" : "Incatrail";
  
  useEffect(() => {
    fetchFinancial();
  }, []);

  const fetchFinancial = async () => {
    try {
      const response = await fetch('/api?idRuta=1&idLugar=2');
      const data = await response.json();
      if (data.success) {
        console.log(data.data);
        setFinancials(data.data);
      }
    } catch (error) {
      console.error('Error fetching financial:', error);
    }
  };

 

  // Función para redirigir a Google Maps con los datos ingresados
  const handleViewRoute = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="relative w-full h-screen bg-cover bg-center mt-[-80]" style={{ backgroundImage: "url('/images/incatrail.webp')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative  text-center top-1/3 text-white grid grid-cols-1 md:grid-cols-2 gap-16 items-center ">
          {/* Columna 1: Título */}
          <div className="flex flex-col text-center justify-center items-center">
            <pre className='font-bold whitespace-pre-wrap break-words px-2'>{t["hero.subtitle"]}</pre>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold opacity-80">{t["hero.title"]}</h1>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className=" text-[#fea614] w-10 h-10 mx-auto animate-[moveDownDisappear_2s_infinite]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* Columna 2: Formulario para ingresar origen y destino */}
          <div className='mx-3 md:mx-10 lg:mx-20'>
            <div className="flex flex-col justify-items-center backdrop-blur-md shadow-lg p-6 rounded-lg">
              
            <span className=" text-xl md:text-2xl font-semibold">{t["route.title"]}</span>
            {/* Campos de entrada */}
              <label className='text-start'>{t["route.from"]}</label>
              <input
                type="text"
                placeholder={t["route.placeholder.from"]}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="my-2 p-2 rounded-md text-black"
              />
              <label  className='text-start'>{t["route.to"]}</label>
              <input
                type="text"
                placeholder={t["route.placeholder.to"]}
                value={destinationLabel}
                readOnly
                onChange={(e) => setDestination(e.target.value)}
                className="my-2 p-2 rounded-md text-black"
              />

              {/* Botón para ver la ruta */}
              <button
                onClick={handleViewRoute}
                className="mt-4 bg-[#fea614] px-6 py-3 rounded text-white font-semibold hover:bg-[#003933] hover:text-[#fea614]"
              >
                {t["route.button"]}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <div className='max-w-6xl mx-auto space-y-16 px-6'>
        <TourList category="inca-trail" slug="classic-inca-trail" />

        <div id="availability">
        
        <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Column */}
          <div>
            <h2>
              {t["section.intro.title"]}
            </h2>
            <p>{t["section.intro.p1"]}</p>
            <h3>{t["section.location.title"]}</h3>
            <p>
              {t["section.location.p1"]}
              <br/><strong>{t["section.location.strong"]}</strong>
            </p>
          </div>

          <div>
            <h3>{t["section.see.title"]}</h3>
            <p>{t["section.see.p1"]}</p>
            <span>
              <strong className='text-gray-600'>{t["section.see.lead"]}</strong>
              <ul className="list-disc pl-8 text-gray-600 my-4">
                {t["section.see.items"].map((item) => (
                  <li key={`${item.label}-${item.text}`}>
                    {item.label ? <strong className='text-secondary'>{item.label}</strong> : null}
                    {item.label ? ' ' : ''}{item.text}
                  </li>
                ))}
              </ul>
            </span>
            <span className="flex items-center justify-center flex-wrap">
              <div className="space-x-4">
                <button className="bg-secondary text-white px-4 py-2 rounded">
                  {t["section.contact"]}
                </button>
                <button className=" border border-primary text-primary hover:bg-primary hover:text-secondary px-4 py-2 rounded">
                  +51 940 291 818
                </button>
              </div>
            </span>
          </div>
        </div>

        <div>
          <h2 className='lg:text-center'>{t["section.availability.title"]}</h2>
          <p className='text-center'>{t["section.availability.p1"]}</p>
          {/* Cuadro de leyenda */}
          <div className="mt-8 text-center text-gray-600 space-y-4 lg:space-y-0 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              <span>{t["legend.none"]}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              <span>{t["legend.available"]}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
              <span>{t["legend.low"]}</span>
            </div>
          </div>
          <div className='bg-white'>
            <Calendar
              data={dataget.data}
              updatedAt={dataget.updatedAt}
              locale={calendarLocale}
              labels={calendarLabels}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Column */}
          <div>
            <h2>
              {t["section.recommendations.title"]}
            </h2>
            <h3>{t["section.recommendations.pack.title"]}</h3>
            <p>
              {t["section.recommendations.pack.p1"]}
            </p>
            <ul className="list-disc pl-8 space-y-2">
              {t["section.recommendations.pack.list"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p><strong>{t["section.recommendations.pack.tip"]}</strong></p>
          </div>

          <div>
            <h3>{t["section.recommendations.tips.title"]}</h3>
            <p>{t["section.recommendations.tips.p1"]}</p>
            {/* Recuadro de alerta */}
            <div className="bg-yellow-100 border-l-4 border-secondary text-blue-700 px-4 py-3 shadow-lg" role="alert">
              <p className="font-bold text-primary">{t["section.recommendations.alert.title"]}</p>
              <p className="text-sm mt-1">
                {t["section.recommendations.alert.p1"]}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center mb-6 ">{t["section.faq.title"]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white mb-16">
            {faqs[selectedFaqs].map((faq, index) => (
              <div key={index} className=" p-4 rounded shadow-md">
                <button
                  className="w-full text-left font-semibold text-lg py-2 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span>{openIndex === index ?  
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                    }
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700 mt-2">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>


    </>
  );
}
