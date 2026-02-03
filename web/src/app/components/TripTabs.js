'use client';

import { useMemo, useState } from 'react';

const ORDER = [
  'OVERVIEW',
  'ITINERARY',
  'INCLUSIONS',
  'PACKING LIST',
  'TOUR F.A.Q.',
  'PREGUNTAS FRECUENTES',
  'BEFORE YOU GO',
  'ANTES DE VIAJAR',
  'WHY HIKE WITH US?'
];

function normalizeTitle(title) {
  if (!title) return '';
  const normalized = String(title).trim().toUpperCase();
  if (normalized === 'FAQ' || normalized === 'FAQS' || normalized === 'F.A.Q.' || normalized === 'F.A.Q') {
    return 'TOUR F.A.Q.';
  }
  if (normalized === 'PREGUNTAS FRECUENTES') {
    return 'PREGUNTAS FRECUENTES';
  }
  return normalized;
}

function isUppercase(title) {
  const normalized = String(title || '').trim();
  if (!normalized) return false;
  return normalized === normalized.toUpperCase();
}

export default function TripTabs({ sections = [] }) {
  const tabs = useMemo(() => {
    const mapped = sections
      .filter((section) => section && section.title && section.content)
      .map((section) => ({
        ...section,
        key: normalizeTitle(section.title),
      }))
      .filter((section) => isUppercase(section.title));

    const ordered = [];
    ORDER.forEach((title) => {
      const match = mapped.find((item) => item.key === title);
      if (match) ordered.push(match);
    });

    mapped.forEach((item) => {
      if (!ordered.some((tab) => tab.key === item.key)) {
        ordered.push(item);
      }
    });

    return ordered;
  }, [sections]);

  const [activeKey, setActiveKey] = useState(() => (tabs[0]?.key ? tabs[0].key : ''));

  if (!tabs.length) return null;

  const activeTab = tabs.find((tab) => tab.key === activeKey) || tabs[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl">
      <div className="flex flex-wrap gap-6 border-b border-slate-200 px-6 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveKey(tab.key)}
            className={`relative pb-2 text-xs md:text-sm uppercase tracking-[0.2em] transition ${
              tab.key === activeKey
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.title}
            <span
              className={`absolute left-0 -bottom-[5px] h-[2px] w-full transition ${
                tab.key === activeKey ? 'bg-amber-400' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: activeTab.content }} />
      </div>
    </div>
  );
}
