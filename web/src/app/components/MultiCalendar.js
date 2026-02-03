'use client'
const MultiCalendar = ({ data, currentDate, locale = 'es-PE', daysShort }) => {
    

    
    if (!currentDate) return null;
    const resolvedLocale = locale || 'es-PE';
    const resolvedDaysShort = daysShort || ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i).toISOString().split('T')[0];
        days.push({ day: i, date, availability: data[date] || 0 });
    }

    return (
        <div className="p-4">
    {/* Título del mes */}
    <h4 className="text-xl font-bold text-center mt-2">
        {currentDate.toLocaleString(resolvedLocale, { month: 'long' })} {year}
    </h4>

    {/* Días de la semana */}
    <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-700 mt-2 mb-2">
        {resolvedDaysShort.map((day) => (
            <div key={day} className="py-1 bg-gray-200 rounded-md">{day}</div>
        ))}
    </div>

    {/* Días del mes */}
    <div className="grid grid-cols-7 gap-1">
        {/* Espacios vacíos para alinear el primer día */}
        {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
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
                        'text-white bg-green-400'}`}
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

export default MultiCalendar;
