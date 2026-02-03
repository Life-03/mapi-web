'use client';

import { useMemo, useState } from 'react';

export default function LightboxGallery({ images = [], title = '' }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const activeImage = useMemo(() => {
    if (activeIndex === null) return null;
    return images[activeIndex] || null;
  }, [activeIndex, images]);

  function close() {
    setActiveIndex(null);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <button
            key={image.url || image.public_id || index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 focus:outline-none"
          >
            <img
              src={image.url}
              alt={image.alt || title}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition"></div>
            <span className="absolute bottom-4 right-4 rounded-full bg-white/80 text-slate-900 text-xs font-semibold px-3 py-1">
              Zoom
            </span>
          </button>
        ))}
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-zoom-out"
            onClick={close}
            aria-label="Close"
          />
          <div className="relative max-w-5xl w-full">
            <button
              type="button"
              onClick={close}
              className="absolute -top-10 right-0 text-white text-sm uppercase tracking-[0.3em]"
            >
              Close
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={activeImage.url}
                alt={activeImage.alt || title}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              {activeImage.alt && (
                <div className="p-4 text-sm text-slate-600">{activeImage.alt}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
