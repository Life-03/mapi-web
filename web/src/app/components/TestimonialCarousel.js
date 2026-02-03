'use client'
import { useState } from "react";

const testimonials = [
  {
    name: "María P.",
    comment: "¡Una experiencia inolvidable! El equipo fue muy profesional.",
  },
  {
    name: "Carlos R.",
    comment: "Los paisajes fueron impresionantes. Todo bien organizado.",
  },
  {
    name: "Lucía M.",
    comment: "Excelente atención y servicio desde el inicio hasta el final.",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((current + 1) % testimonials.length);

  return (
    <div className="max-w-xl mx-auto text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
      <div className="relative bg-white shadow-lg rounded-xl p-6 transition-all duration-500 border-t-4 border-green-500">
        <div className="flex justify-center mb-4">
          {/* Estrellas de calificación */}
          <div className="text-yellow-400">
            ★★★★☆
          </div>
        </div>
        <p className="text-gray-700 italic mb-4">&ldquo;{testimonials[current].comment}&rdquo;</p>
        <p className="text-sm font-semibold text-gray-900">- {testimonials[current].name}</p>

        <div className="flex justify-between mt-6">
          <button onClick={prev} className="text-blue-500 hover:text-blue-700">← Anterior</button>
          <button onClick={next} className="text-blue-500 hover:text-blue-700">Siguiente →</button>
        </div>
      </div>
    </div>
  );
}
