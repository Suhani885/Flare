"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square rounded-3xl bg-surface" />;
  }

  return (
    <div>
      <div className="mb-4 aspect-square overflow-hidden rounded-3xl bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                active === i ? "border-primary-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
