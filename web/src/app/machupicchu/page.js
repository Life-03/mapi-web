'use client'

import { useEffect, useState } from "react";
import useClientLocale from "../components/useClientLocale";
import MultiCalendar from "../components/MultiCalendar";
import faqs  from '../components/faqs';
import PackingListSection from "../components/PackingListSection";
import TourList from "../components/TourList";
import machuEs from "../../i18n/machu.es.json";
import machuEn from "../../i18n/machu.en.json";

export default function Page() {
    const locale = useClientLocale();
    const t = locale === "en" ? machuEn : machuEs;
    const showAvailability = false;

    const [dataget, setFinancials] = useState({ data: [] });
    const [currentDate, setCurrentDate] = useState(() => new Date());
    // Estados para el origen y destino
    const [origin, setOrigin] = useState('Cusco');
    const [destination, setDestination] = useState('Machu Picchu');
    //para las preguntas frecuentes
    const selectedFaqs = locale === "en" ? "MachuPicchuEn" : "MachuPicchu"; 
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        fetchFinancial();
    }, []);

    const fetchFinancial = async () => {
        try {
            const response = await fetch('/api?idRuta=11&idLugar=1');
            const data = await response.json();
            if (data.success) {
                setFinancials(data.data);
            }
        } catch (error) {
            console.error('Error fetching financial:', error);
        }
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const transformData = (data) => {
        const transformedData = {};

        data.forEach(monthData => {
            Object.entries(monthData).forEach(([time, dates]) => {
                if (!transformedData[time]) {
                    transformedData[time] = {};
                }
                Object.entries(dates).forEach(([date, availability]) => {
                    transformedData[time][date] = availability;
                });
            });
        });

        return transformedData;
    };

    const transformedData = transformData(dataget.data);

    // Función para redirigir a Google Maps con los datos ingresados
    const handleViewRoute = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    };

    //funtio para fqs
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const machuPicchuItems = [
        {
            name: t["pack.item1.name"],
            description: t["pack.item1.desc"],
            image: '/images/PackingList/MochilaPequenia.webp',
        },
        {
            name: t["pack.item2.name"],
            description: t["pack.item2.desc"],
            image: '/images/PackingList/BastonesTrekking.webp',
        },
        {
            name: t["pack.item3.name"],
            description: t["pack.item3.desc"],
            image: '/images/PackingList/Calzadocomodoresistente.webp',
        },
        {
            name: t["pack.item4.name"],
            description: t["pack.item4.desc"],
            image: '/images/PackingList/RopaAdecuada.webp',
        },
        {
            name: t["pack.item5.name"],
            description: t["pack.item5.desc"],
            image: '/images/PackingList/DineroEfectivo.webp',
        },
        {
            name: t["pack.item6.name"],
            description: t["pack.item6.desc"],
            image: '/images/PackingList/Documentation.webp',
        },
        {
            name: t["pack.item7.name"],
            description: t["pack.item7.desc"],
            image: '/images/PackingList/Camarafotográfica.webp',
        },
        {
            name: t["pack.item8.name"],
            description: t["pack.item8.desc"],
            image: '/images/PackingList/SnacksAlimentosEnergéticos.webp',
        },
        {
            name: t["pack.item9.name"],
            description: t["pack.item9.desc"],
            image: '/images/PackingList/Botelladeagua reutilizable.webp',
        },
        {
            name: t["pack.item10.name"],
            description: t["pack.item10.desc"],
            image: '/images/PackingList/ProtectorSolarRepelente.webp',
        },
      ];

    return (
        <>
            <div className="relative w-full h-screen bg-cover bg-center mt-[-80]" style={{ backgroundImage: "url('/images/MachuPicchu-hero.webp')" }}>
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
                        value="Machu Picchu"
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
                <TourList category="machupicchu" />

                {showAvailability ? (
                <div id="availability">
                <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Text Column */}
                    <div>
                        <h2>
                            {t["section.intro.title"]}
                        </h2>
                        <p>{t["section.intro.p1"]}</p>
                        <p><strong>{t["section.intro.p2"]}</strong></p>
                        <h3>{t["section.location.title"]}</h3>
                        <p>{t["section.location.p1"]}</p>
                    </div>

                    <div>
                        <h3>{t["section.see.title"]}</h3>
                        <span>
                        <strong className='text-gray-600'>{t["section.see.lead"]}</strong>
                        <ul className="list-disc pl-8 text-gray-600 my-4">
                            <li>{t["section.see.item1"]}</li>
                            <li>{t["section.see.item2"]}</li>
                            <li>{t["section.see.item3"]}</li>
                            <li>{t["section.see.item4"]}</li>
                            <li>{t["section.see.item5"]}</li>
                            <li>{t["section.see.item6"]}</li>
                            <li>{t["section.see.item7"]}</li>
                            <li>{t["section.see.item8"]}</li>
                            <li>{t["section.see.item9"]}</li>
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

                <div className='p-2'>
                    <div className=''>
                        <h2 className='text-center'>{t["section.availability.title"]}</h2>
                        <p className='text-center'>{t["section.availability.p1"]}</p>
                    </div>
                    <div className="flex justify-center items-center mb-4">
                        <select
                            value={month}
                            onChange={(e) => {
                                const newDate = new Date(currentDate);
                                newDate.setMonth(parseInt(e.target.value));
                                setCurrentDate(newDate);
                            }}
                            className="px-8 py-2 border rounded"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>
                                    {new Date(year, i).toLocaleString(locale === "en" ? 'en-US' : 'es-PE', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className='block text-center text-sm text-gray-500 font-bold'>{t["section.updated"]} {new Date(dataget.updatedAt).toLocaleDateString(locale === "en" ? 'en-US' : 'es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>

                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        {Object.entries(transformedData).map(([time, timeData]) => (
                            <div key={time} className="bg-white">
                                <h3 className="text-2xl text-center font-bold my-2">{locale === "en" ? "Time" : "Hora"}: {time}</h3>
                                <MultiCalendar
                                    data={timeData}
                                    currentDate={currentDate}
                                    locale={locale === "en" ? "en-US" : "es-PE"}
                                    daysShort={t["calendar.daysShort"]}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Text Column */}
                    <div>
                        <h2>
                        {t["section.recommendations.title"]}
                        </h2>
                        <h3>{t["section.recommendations.before"]}</h3>
                        <p>{t["section.recommendations.before.p1"]}</p>
                    </div>

                    <div>
                        <h3>{t["section.recommendations.during"]}</h3>
                        <p>{t["section.recommendations.during.p1"]}</p>
                        {/* Recuadro de alerta */}
                        <div className="bg-yellow-100 border-l-4 border-secondary text-blue-700 px-4 py-3 shadow-lg" role="alert">
                        <p className="font-bold text-primary">{t["section.recommendations.tip.title"]}</p>
                        <p className="text-sm mt-1">
                        {t["section.recommendations.tip.p1"]}</p>
                        </div>
                    </div>
                </div>

                <PackingListSection title={t["section.pack.title"]} items={machuPicchuItems} />

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

        </>
    )
}
