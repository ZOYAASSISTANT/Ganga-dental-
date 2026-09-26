import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { CLINIC_CONTACT } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

import dentalImplantsImage from '../assets/images/file_00000000e27481fdbfaa8527b914624c.webp';
import rootCanalImage from '../assets/images/1789307261894.webp';
import emergencyCareImage from '../assets/images/file_000000005c04820b83485bb35a6aa8b9.webp';

interface SpecializedTreatmentsProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const SpecializedTreatmentsSection: React.FC<SpecializedTreatmentsProps> = React.memo(({ onOpenBooking }) => {
  const treatments = useMemo(() => [
    {
      id: 'implants',
      title: 'Dental Implants - Permanent Smile Solution',
      image: dentalImplantsImage,
      action: () => onOpenBooking('Dental Implants')
    },
    {
      id: 'rct',
      title: 'Root Canal Treatment - Save Your Natural Tooth',
      image: rootCanalImage,
      action: () => onOpenBooking('Root Canal Treatment')
    },
    {
      id: 'emergency',
      title: 'Emergency Dental Care - Quick Relief, When You Need It',
      image: emergencyCareImage,
      action: () => {
        window.location.href = CLINIC_CONTACT.telLink;
      }
    }
  ], [onOpenBooking]);

  return (
    <section id="specialized-treatments" className="py-8 sm:py-12 lg:py-16 bg-[#f7fcfd] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-[#005f73] text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Specialized Dental Care</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a2540] tracking-tight">
            Specialized Dental Treatments
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-normal mt-1.5 sm:mt-2 leading-relaxed">
            Advanced restorative care, pain-free root canals, and urgent dental assistance.
          </p>
        </div>

        {/* 3 Specialized Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {treatments.map((item) => (
            <Interactive3DCard 
              key={item.id} 
              className="h-full cursor-pointer"
              onClick={item.action}
            >
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                {/* Render the exact original uploaded image directly as the complete graphic */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto aspect-square object-contain block rounded-2xl"
                  loading="lazy"
                  decoding="async"
                  width={1254}
                  height={1254}
                  referrerPolicy="no-referrer"
                />
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>
    </section>
  );
});
