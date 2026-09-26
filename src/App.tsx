/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { DoctorTeamSection } from './components/DoctorTeamSection';
import { SpecializedTreatmentsSection } from './components/SpecializedTreatmentsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ReviewsSection } from './components/ReviewsSection';
import { EmergencySection } from './components/EmergencySection';
import { InsurancePaymentSection } from './components/InsurancePaymentSection';
import { AppointmentAndVisitSection } from './components/AppointmentAndVisitSection';
import { Footer } from './components/Footer';
import { Interactive3DSection } from './components/Interactive3DSection';

const GangaAIAssistant = React.lazy(() =>
  import('./components/GangaAIAssistant').then((m) => ({ default: m.GangaAIAssistant }))
);

export default function App() {
  const [selectedBookingService, setSelectedBookingService] = useState<string>('');
  const [selectedBookingDoctor, setSelectedBookingDoctor] = useState<string>('');
  const [bookingHighlightTrigger, setBookingHighlightTrigger] = useState<number>(0);

  // Smooth cyan scroll progress bar across page
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleOpenBooking = useCallback((serviceOrDoctorName?: string) => {
    if (serviceOrDoctorName) {
      if (serviceOrDoctorName.includes('Dr.') || serviceOrDoctorName.includes('Consultation with')) {
        setSelectedBookingDoctor(serviceOrDoctorName.replace('Consultation with ', ''));
      } else {
        setSelectedBookingService(serviceOrDoctorName);
      }
    }
    setBookingHighlightTrigger(Date.now());

    // Scroll smoothly to exact position of #booking with header offset (stops perfectly at the form without overshooting)
    setTimeout(() => {
      const targetElement = document.getElementById('booking');
      if (targetElement) {
        const yOffset = -80;
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  }, []);

  const handleExploreServices = useCallback(() => {
    const targetElement = document.getElementById('services');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f7fcfd] text-slate-800 font-sans selection:bg-cyan-100 selection:text-cyan-950 relative overflow-x-hidden w-full max-w-full">
      
      {/* Top Cyan Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[#005f73] to-teal-400 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* 1. TOP HEADER */}
      <Navbar onOpenBooking={handleOpenBooking} />

      <main className="space-y-4 sm:space-y-8 md:space-y-10 px-3 sm:px-4 md:px-6 max-w-[1440px] mx-auto overflow-hidden sm:overflow-visible">
        {/* 2. HERO SECTION */}
        <Interactive3DSection>
          <Hero 
            onOpenBooking={handleOpenBooking} 
            onExploreServices={handleExploreServices}
          />
        </Interactive3DSection>

        {/* 3. COMPLETE DENTAL SERVICES (Top 6 + View All Services button) */}
        <Interactive3DSection>
          <ServicesSection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 4. ABOUT & WHY CHOOSE US PHOTO BANNER (Positioned directly below Our Dental Services) */}
        <Interactive3DSection id="why-choose-us" belowFold>
          <WhyChooseUsSection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 5. OUR DENTISTS / EXPERT TEAM */}
        <Interactive3DSection belowFold>
          <DoctorTeamSection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 6. SPECIALIZED DENTAL TREATMENTS (Implants, Root Canal, Emergency Care) */}
        <Interactive3DSection id="specialized-treatments" belowFold>
          <SpecializedTreatmentsSection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 7. BEFORE & AFTER */}
        <Interactive3DSection belowFold>
          <BeforeAfterSection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 10. PATIENT TESTIMONIALS */}
        <Interactive3DSection belowFold>
          <ReviewsSection />
        </Interactive3DSection>

        {/* 12. EMERGENCY DENTAL CARE */}
        <Interactive3DSection id="emergency" belowFold>
          <EmergencySection onOpenBooking={handleOpenBooking} />
        </Interactive3DSection>

        {/* 13. INSURANCE & PAYMENT */}
        <Interactive3DSection id="insurance" belowFold>
          <InsurancePaymentSection />
        </Interactive3DSection>

        {/* 11. APPOINTMENT BOOKING, 14. FAQ & 15. CONTACT / VISIT CLINIC */}
        <Interactive3DSection belowFold>
          <AppointmentAndVisitSection 
            initialService={selectedBookingService} 
            initialDoctor={selectedBookingDoctor}
            highlightTrigger={bookingHighlightTrigger}
          />
        </Interactive3DSection>
      </main>

      {/* 16. FOOTER */}
      <Interactive3DSection intensity="footer" className="mt-8" belowFold>
        <Footer />
      </Interactive3DSection>

      {/* 18. AI ASSISTANT ("Ganga AI Assistant") */}
      <React.Suspense fallback={null}>
        <GangaAIAssistant onOpenBooking={handleOpenBooking} />
      </React.Suspense>

    </div>
  );
}
