'use client'


import { useState } from 'react';

const Calendar1 = ({ data }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual

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

    // Navegación entre meses
    const handleMonthChange = (increment) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => handleMonthChange(-1)}
                    disabled={isCurrentMonth}
                    className={`px-4 py-2 ${
                        isCurrentMonth ? 'bg-gray-300' : 'bg-blue-500'
                    } text-white rounded`}
                >
                    Anterior
                </button>
                <h2 className="text-xl font-bold">
                    {currentDate.toLocaleString('es-PE', { month: 'long' })} {year}
                </h2>
                <button
                    onClick={() => handleMonthChange(1)}
                    disabled={isCurrentYear && month === 11} // Diciembre es el mes 11
                    className={`px-4 py-2 ${
                        isCurrentYear && month === 11 ? 'bg-gray-300' : 'bg-blue-500'
                    } text-white rounded`}
                >
                    Siguiente
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {/* Días de la semana */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-bold">
                        {day}
                    </div>
                ))}
                {/* Espacios vacíos para alinear el primer día del mes */}
                {Array(firstDayOfMonth)
                    .fill(null)
                    .map((_, index) => (
                        <div key={`empty-${index}`}></div>
                    ))}
                {/* Días del mes */}
                {days.map(({ day, date, availability }) => (
                    <div
                        key={date}
                        className={`p-2 border rounded text-center cursor-pointer`}
                    >
                        <div>{day}</div>
                        {availability !== undefined && (
                            <div className={`text-sm ${
                                availability === 0 ? 'text-red-500' :
                                availability >= 1 && availability <= 5 ? 'text-orange-500' :
                                'text-green-500'
                            }`}>
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
