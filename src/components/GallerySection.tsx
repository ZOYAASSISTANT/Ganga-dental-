import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CLINIC_GALLERY, GalleryPhoto } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['All', 'Clinic Interior', 'Treatment Rooms', 'Dental Equipment', 'Doctors'];

  const filteredPhotos = CLINIC_GALLERY.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <section id="gallery" className="py-8 sm:py-14 bg-[#f0fbfd] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2540] tracking-tight">
            Our Clinic in Pictures
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Take a Virtual Tour of Ganga Dental Clinic
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-[#005f73] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-cyan-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <Interactive3DCard
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="cursor-pointer"
            >
              <div className="group h-full flex flex-col text-left bg-white">
                {/* Image Box */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover overlay with expand button */}
                  <div className="absolute inset-0 bg-cyan-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/95 text-[#005f73] flex items-center justify-center shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[#005f73] text-[11px] font-bold shadow-xs">
                    {photo.category}
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-center">
                  <h3 className="font-extrabold text-sm text-[#0a2540] group-hover:text-[#005f73] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-cyan-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-80 sm:h-[420px] bg-black">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-white">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                {lightboxPhoto.category}
              </span>
              <h3 className="text-xl font-extrabold text-[#0a2540] mt-0.5">
                {lightboxPhoto.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {lightboxPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
