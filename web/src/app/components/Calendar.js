'use client'

import { useState, useEffect } from 'react';

const Calendar = ({ data, updatedAt, locale = 'es-PE', labels }) => {

    const [currentDate, setCurrentDate] = useState(null);
    const resolvedLocale = locale || 'es-PE';
    const resolvedLabels = labels || {
        lastUpdated: 'Última actualización',
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    };

    // Inicializar la fecha en el cliente
    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    // Si currentDate es null, no renderizar nada
    if (!currentDate) return null;

    // Obtener el año y mes actual
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Obtener el número de días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Obtener el día de la semana en que comienza el mes (0 = Domingo, 1 = Lunes, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Convertir el array de datos en un objeto para búsqueda rápida
    const availabilityData = data.reduce((acc, monthData) => {
        Object.entries(monthData).forEach(([date, availability]) => {
            acc[date] = availability;
        });
        return acc;
    }, {});

    // Generar los días del mes
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i).toISOString().split('T')[0]; // Formato YYYY-MM-DD
        days.push({ day: i, date, availability: availabilityData[date] || 0 });
    }

    // Obtener la fecha actual
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Verificar si el mes actual es el mes presente
    const isCurrentMonth = year === currentYear && month === currentMonth;

    // Verificar si el año actual es el año presente
    const isCurrentYear = year === currentYear;

    return (
        <div className="p-4 ">
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-inner">
                {/* Botón de mes anterior */}
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(month - 1)))}
                    className=""
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-tertiary hover:text-secondary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                    </svg>

                </button>

                {/* Selector de mes */}
                <select
                    value={month}
                    onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setCurrentDate(newDate);
                    }}
                    className="px-6 py-3 border-1 border-green-500 rounded shadow-inner bg-yellow-100 text-lg font-medium text-gray-700 focus:ring-2 focus:ring-yellow-500 transition-all duration-300 shadow-md shadow-yellow-300"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                        {new Date(year, i).toLocaleString(resolvedLocale, { month: 'long' })}
                    </option>
                    ))}
                </select>

                {/* Botón de mes siguiente */}
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(month + 1)))}
                    className=""
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-tertiary hover:text-secondary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>
                    
                </button>
            </div>

            
            {/* Última actualización */}
            <span className="block text-center text-sm text-gray-500 font-bold">
                {resolvedLabels.lastUpdated}: {new Date(updatedAt).toLocaleDateString(resolvedLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
            
            {/* Encabezado del mes */}
            <h3 className="text-xl font-bold text-center mt-2">
                {currentDate.toLocaleString(resolvedLocale, { month: 'long' })} {year}
            </h3>
            
            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-700 mt-2 mb-2">
                {resolvedLabels.daysShort.map((day) => (
                    <div key={day} className="py-1 bg-gray-200 rounded-md">{day}</div>
                ))}
            </div>
            
            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
                {/* Espacios vacíos para alinear el primer día */}
                {Array(firstDayOfMonth).fill(null).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                ))}
                
                {days.map(({ day, date, availability }) => (
                    <div
                        key={date}
                        className={`border p-2 rounded text-center flex flex-col items-center justify-start relative
                            ${availability === 0 ? 'bg-red-50 border-gray-300' :
                              availability >= 1 && availability <= 5 ? 'bg-orange-50 border-orange-300 hover:shadow-md hover:scale-100 cursor-pointer transition-all duration-200' :
                              'bg-green-50 border-green-300 hover:shadow-md hover:scale-100 cursor-pointer transition-all duration-200'}`}
                    >
                        <div className="text-xs text-gray-400 absolute top-1 right-1">{day}</div>
                        {availability !== undefined && (
                            <div className={`mt-4 px-2 py-1 text-sm font-semibold rounded ${availability === 0 ? 'text-red-400' :
                                availability >= 1 && availability <= 5 ? 'text-white bg-orange-400' :
                                ' text-white bg-green-400'}`}
                            >
                                {availability}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
