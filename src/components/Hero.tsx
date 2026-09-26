import React from 'react';
import heroImage from '../assets/images/file_00000000f6608211a0664b51a35a45b4-1.webp';
import { Interactive3DCard } from './Interactive3DCard';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = React.memo(({ onOpenBooking, onExploreServices }) => {
  return (
    <section id="home" className="relative w-full">
      <Interactive3DCard variant="cyan">
        <div className="relative w-full bg-white">
          <img
            src={heroImage}
            alt="Healthy Smiles Start Here - Ganga Dental Clinic"
            className="w-full h-auto aspect-[1720/914] object-contain block"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1720}
            height={914}
            referrerPolicy="no-referrer"
          />

          {/* Interactive Clickable Area for Book Appointment button in the banner */}
          <button
            id="hero-banner-book-appointment"
            type="button"
            onClick={onOpenBooking}
            aria-label="Book Appointment"
            title="Book Appointment"
            className="absolute left-[5.5%] top-[49.5%] w-[19.5%] h-[9%] sm:left-[6%] sm:top-[50.5%] sm:w-[18.5%] sm:h-[7%] rounded-lg sm:rounded-xl cursor-pointer transition-colors hover:bg-black/5 active:bg-black/15 focus:outline-none"
          />

          {/* Interactive Clickable Area for View Services button in the banner */}
          <button
            id="hero-banner-view-services"
            type="button"
            onClick={onExploreServices}
            aria-label="View Services"
            title="View Services"
            className="absolute left-[25%] top-[49.5%] w-[15%] h-[9%] sm:left-[25.5%] sm:top-[50.5%] sm:w-[14%] sm:h-[7%] rounded-lg sm:rounded-xl cursor-pointer transition-colors hover:bg-black/5 active:bg-black/15 focus:outline-none"
          />
        </div>
      </Interactive3DCard>
    </section>
  );
});
