'use client';

import Image from 'next/image';

const PackingListSection = ({ title, items }) => {
  return (
    <section>
      <h2 className="lg:text-center md:text-center border-b pb-2 border-dotted border-gray-400">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border border-dotted border-gray-300 p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="relative w-24 h-24 min-w-[96px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div>
              <h3>{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackingListSection;
