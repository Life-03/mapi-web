'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import useClientLocale from "./components/useClientLocale";
import { getDictionary } from "../i18n";
import HomeTourSlider from "./components/HomeTourSlider";

export default function Home() {
  const locale = useClientLocale();
  const t = getDictionary(locale);
  const prefix = `/${locale}`;
  const destinations = [
    { name: t["home.dest.machu"], url: `${prefix}/machupicchu`, image: "/images/MachuPicchu.webp" },
    { name: t["home.dest.salkantay"], url: `${prefix}/salkantay`, image: "/images/Salkantay_Trek.webp" },
    { name: t["home.dest.incatrail"], url: `${prefix}/inca-trail`, image: "/images/incatrail.webp" },
    { name: t["home.dest.chachabamba"], url: `${prefix}/chachabamba`, image: "/images/chachabamba.webp" },
    { name: t["home.dest.qoriwayrachina"], url: `${prefix}/qoriwayrachina`, image: "/images/qoriwayrachina.webp" },
  ];

  const [weatherData, setWeatherData] = useState({
    humidity: 0,
    wind: 0,
    temperature: 0,
    altitude: 2430, // Fijo para Machu Picchu
    date: "", // Se actualizará con la fecha actual
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const LAT = -13.1631; // Machu Picchu
        const LON = -72.5450;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();

        // Obtener la fecha y el día actual
        const date = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString(locale === "en" ? "en-US" : "es-PE", options);

        setWeatherData({
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m, // En m/s
          temperature: data.current.temperature_2m,
          altitude: 2430, // Fijo
          date: formattedDate, // Fecha en español
        });
      } catch (error) {
        console.error("Error obteniendo datos del clima:", error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Se actualiza cada 60s

    return () => clearInterval(interval);
  }, [locale]);
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen mt-[-80]">
        <Image
          src="/images/MachuPicchu.webp"
          alt="Machu Picchu landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center text-white">
          <h1 className="text-6xl md:text-8xl font-bold opacity-80">{t["home.hero.title"]}</h1>
          <a href={`${prefix}/machupicchu`}>
            <button className="mt-6 bg-[#fea614] px-6 py-3 rounded text-white font-semibold hover:bg-[#003933] hover:text-[#fea614]">
              {t["home.hero.cta"]}
            </button>
          </a>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center space-y-4  p-4 rounded-xl shadow-lg backdrop-blur-md">
          {/* Fecha */}
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-0">{t["home.hero.today"]}</p>
            <span className="text-lg font-bold text-gray-300">{weatherData.date}</span>
          </div>
          {/* Clima */}
          <div className="flex space-x-6">
            <div className="flex flex-col items-center">
              {/* Ícono de humedad (gota) */}
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 5 9 5 14C5 18.4183 8.58172 22 13 22C17.4183 22 21 18.4183 21 14C21 9 14 2 14 2H12Z" />
              </svg>
              <span className="text-sm text-gray-300">{t["home.hero.humidity"]}</span>
              <span className="text-md font-bold text-gray-300">{weatherData.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              {/* Ícono de viento */}
              <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 12H20M4 6H16M8 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-gray-300">{t["home.hero.wind"]}</span>
              <span className="text-md font-bold text-gray-300">{weatherData.wind} m/s</span>
            </div>
            <div className="flex flex-col items-center">
              {/* Ícono de temperatura (termómetro) */}
              <svg className="w-6 h-6 text-[#fea614]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A2 2 0 0 0 10 4V14.17A3.001 3.001 0 0 0 12 22A3 3 0 0 0 14 18.17V4A2 2 0 0 0 12 2Z" />
              </svg>
              <span className="text-sm text-gray-300">{t["home.hero.temperature"]}</span>
              <span className="text-md font-bold text-gray-300">{weatherData.temperature}°C</span>
            </div>
            <div className="flex flex-col items-center">
              {/* Ícono de montaña (altura) */}
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 21H21L12 2Z" />
              </svg>
              <span className="text-sm text-gray-300">{t["home.hero.height"]}</span>
              <span className="text-md font-bold text-gray-300">{weatherData.altitude} m</span>
            </div>
          </div>
        </div>
      </div>
      <HomeTourSlider />
      <section className="max-w-6xl mx-auto space-y-16 px-6">
        <div className=" mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Column */}
          <div>
            <h2 className="text-gray-800 mb-4">
              {t["home.intro.title"]}
            </h2>
            <p className="text-gray-600">
              {t["home.intro.p1"]}
              <br />
              <strong>{t["home.intro.strong"]}</strong>
            </p>
            <h3 className="text-gray-800 mt-6">
              {t["home.intro.subtitle"]}
            </h3>
            <p className="text-gray-600">
              {t["home.intro.p2"]}
            </p>
          </div>

          {/* Computer Frame Column className="font-semibold" */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Computer Frame */}
            <div className="border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg">
              {/* Screen */}
              <div className="bg-gray-900 p-2 flex justify-center items-center">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/images/calendar.webp"
                    alt={t["home.calendar.alt"]}
                    fill
                    sizes="(max-width: 768px) 90vw, 450px"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Base */}
              <div className="bg-gray-800 h-4 w-3/4 mx-auto mt-2 rounded-b-lg"></div>
            </div>
          </div>
        </div>

        {/* Grid de Destinos */}
        <div id="availability">
          <h2 className="text-gray-800 text-center">
            {t["home.section.availability.title"]}
          </h2>

          <div className="flex flex-wrap justify-center gap-8">
            {destinations.map((dest, index) => (
              <a
                href={dest.url}
                key={index}
                className="bg-white rounded shadow-md overflow-hidden transform hover:scale-105 transition duration-300 w-full sm:w-[45%] lg:w-[30%] max-w-sm"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={dest.image}
                    alt={`${t["home.dest.altPrefix"]} ${dest.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover rounded-t"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{dest.name}</h3>
                    <p className="text-[#fabf02] mt-2 font-semibold">
                      {t["home.section.availability.cta"]}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/images/icons/ico_calendar.webp"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                      alt={t["home.icon.calendar.alt"]}
                      loading="lazy"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          
          <h2 className="lg:text-center">{t["home.circuits.title"]}</h2>
          <p className="lg:text-center">
          {t["home.circuits.p1"]}
          </p>
          {/* Circuitos y Rutas */}
          <div className="mb-16">
            <h3 className="mb-6 text-center">{t["home.circuits.subtitle"]}</h3>
            <div className=" bg-[url('/images/MachuPicchumap.webp')] bg-cover bg-center bg-no-repeat flex flex-wrap justify-center gap-8  p-2 md:p-5 lg:p-10 shadow-lg rounded">
              
              {/* Circuito 1 */}
              <div className="bg-white p-6 rounded shadow-md">
                <h4>{t["home.circuits.c1.title"]}</h4>
                <ul className="list-disc pl-5 text-gray-600 mt-2">
                  <li>{t["home.circuits.c1.r1"]}</li>
                  <li>{t["home.circuits.c1.r2"]}</li>
                  <li>{t["home.circuits.c1.r3"]}</li>
                  <li>{t["home.circuits.c1.r4"]}</li>
                </ul>
              </div>

              {/* Circuito 2 */}
              <div className="bg-white p-6 rounded shadow-md">
                <h4>{t["home.circuits.c2.title"]}</h4>
                <ul className="list-disc pl-5 text-gray-600 mt-2">
                  <li>{t["home.circuits.c2.r1"]}</li>
                  <li>{t["home.circuits.c2.r2"]}</li>
                </ul>
              </div>

              {/* Circuito 3 */}
              <div className="bg-white p-6 rounded shadow-md">
                <h4>{t["home.circuits.c3.title"]}</h4>
                <ul className="list-disc pl-5 text-gray-600 mt-2">
                  <li>{t["home.circuits.c3.r1"]}</li>
                  <li>{t["home.circuits.c3.r2"]}</li>
                  <li>{t["home.circuits.c3.r3"]}</li>
                  <li>{t["home.circuits.c3.r4"]}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3>{t["home.booking.title"]}</h3>
            <p className="text-lg text-gray-600">
              {t["home.booking.p1"]}
            </p>
            <a href="https://lifexpeditions.com/" target="_blank" rel="noopener noreferrer" className="bg-[#fabf02] text-white py-3 px-6 rounded text-lg inline-block">
              {t["home.booking.cta"]}
            </a>
          </div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
          <div>
            <h2 className="mb-6 text-2xl">{t["home.plan.title"]}</h2>
            <p>{t["home.plan.p1"]}</p>
            <p>{t["home.plan.p2"]}</p>
          </div>
          <div className="relative aspect-video border-[8px] border-[#333] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden mt-6">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/gjjaY9IOYx0?rel=0&modestbranding=1"
              title="Video de YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

        </div>
        
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 items-center pb-16">
          {Array.from({ length: 8 }).map((_, index) => (
            <Image
              key={index}
              src={`/images/icons/L${index + 1}.png`}
              width={180}
              height={180}
              alt={`Logo ${index + 1}`}
              className="w-45 h-45 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </>
  );
}
