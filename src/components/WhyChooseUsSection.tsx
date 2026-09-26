import React from 'react';
import { Interactive3DCard } from './Interactive3DCard';
import whyChooseUsImage from '../assets/images/1789308123050.webp';

interface WhyChooseUsSectionProps {
  onOpenBooking: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = React.memo(({ onOpenBooking }) => {
  return (
    <section id="why-choose-us" className="py-2 sm:py-6 lg:py-8 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <Interactive3DCard className="w-full cursor-pointer" onClick={onOpenBooking}>
          <div className="w-full bg-[#f0fbfd] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            {/* Render the exact original uploaded image directly as the complete graphic */}
            <img
              src={whyChooseUsImage}
              alt="About Ganga Dental Clinic & Why Choose Us"
              className="w-full h-auto aspect-[1264/843] object-contain block rounded-2xl sm:rounded-3xl"
              loading="lazy"
              decoding="async"
              width={1264}
              height={843}
              referrerPolicy="no-referrer"
            />
          </div>
        </Interactive3DCard>
      </div>
    </section>
  );
});
