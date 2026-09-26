import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import { BEFORE_AFTER_CASES, BeforeAfterItem, CLINIC_CONTACT } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

interface BeforeAfterProps {
  onOpenBooking: (serviceName?: string) => void;
}

interface HandComparisonSliderProps {
  item: BeforeAfterItem;
  heightClass?: string;
  onOpenModal?: () => void;
}

/**
 * Ultra-Responsive, Zero-Lag Before & After Comparison Slider
 * - Touch & Scroll Perfection: Allows free vertical page scrolling (touch-action: pan-y)
 *   while horizontal drag seamlessly controls the divider line.
 * - Pristine photo: Strictly ONLY clean 'BEFORE' and 'AFTER' badges on top (no text clutter).
 * - Zero bottom black bar / text clutter.
 */
export const HandComparisonSlider: React.FC<HandComparisonSliderProps> = ({
  item,
  heightClass = 'h-60 xs:h-64 sm:h-72 md:h-80',
  onOpenModal
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      setSliderPos(percent);
      rafIdRef.current = null;
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateSliderPosition(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      updateSliderPosition(e.clientX);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      isDraggingRef.current = false;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col bg-slate-900 select-none overflow-hidden group rounded-t-2xl">
      {/* Top Floating Control Bar - STRICTLY ONLY BEFORE & AFTER LABELS */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Left 'BEFORE' Label */}
        <span 
          className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-black tracking-wider transition-all shadow-md flex items-center space-x-1.5 ${
            sliderPos > 25 
              ? 'bg-rose-900/90 text-rose-100 border border-rose-400/40 backdrop-blur-md' 
              : 'bg-black/50 text-slate-400 border border-white/10'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
          <span>{item.beforeLabel || 'BEFORE'}</span>
        </span>

        {/* Right 'AFTER' Label */}
        <span 
          className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-black tracking-wider transition-all shadow-md flex items-center space-x-1.5 ${
            sliderPos < 75 
              ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-400/40 backdrop-blur-md' 
              : 'bg-black/50 text-slate-400 border border-white/10'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          <span>{item.afterLabel || 'AFTER'}</span>
        </span>
      </div>

      {/* Main Interactive Comparison Frame with touch-action: pan-y */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{ touchAction: 'pan-y' }}
        className={`relative ${heightClass} w-full overflow-hidden select-none cursor-ew-resize`}
      >
        {/* UNDER LAYER: AFTER Image (Expanded right half to full frame) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 pointer-events-none">
          <img
            src={item.image}
            alt={`${item.title} - After treatment outcome`}
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              maxWidth: 'none',
              objectFit: 'cover'
            }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* TOP LAYER: BEFORE Image (Expanded left half, GPU-clipped by sliderPos) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ 
            clipPath: `inset(0 calc(100% - ${sliderPos}%) 0 0)`,
            WebkitClipPath: `inset(0 calc(100% - ${sliderPos}%) 0 0)`
          }}
        >
          <img
            src={item.image}
            alt={`${item.title} - Before treatment initial condition`}
            style={{
              position: 'absolute',
              top: 0,
              left: '0%',
              width: '200%',
              height: '100%',
              maxWidth: 'none',
              objectFit: 'cover'
            }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* VERTICAL DIVIDER LINE & GRIP HANDLE */}
        <div 
          className="absolute top-0 bottom-0 z-10 pointer-events-none flex items-center justify-center -ml-[1.5px]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical white/cyan divider */}
          <div className="w-[3px] h-full bg-white shadow-[0_0_12px_rgba(6,182,212,0.8),0_0_4px_rgba(0,0,0,0.8)]" />

          {/* Center Grip Handle with ample touch area */}
          <div 
            className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#005f73] shadow-2xl flex items-center justify-center border-2 border-cyan-500 pointer-events-none transition-transform group-hover:scale-105"
          >
            <div className="flex items-center space-x-1 text-slate-800 font-extrabold text-[9px] sm:text-[10px]">
              <span className="text-[#005f73] font-bold">◀</span>
              <div className="w-[1.5px] h-3.5 bg-slate-300 rounded-full" />
              <span className="text-[#005f73] font-bold">▶</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfterSection: React.FC<BeforeAfterProps> = React.memo(({ onOpenBooking }) => {
  const [selectedCase, setSelectedCase] = useState<BeforeAfterItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Exactly 4 distinct clinical transformation categories
  const filters = [
    'All', 
    'Teeth Whitening', 
    'Braces & Aligners', 
    'Dental Implants', 
    'Gap Closure & Bonding'
  ];

  const filteredCases = useMemo(() => {
    return BEFORE_AFTER_CASES.filter(c => {
      if (activeFilter === 'All') return true;
      return c.category === activeFilter;
    });
  }, [activeFilter]);

  // Smooth scroll directly to Appointment section
  const handleBookSlotClick = (serviceCategory?: string) => {
    onOpenBooking(serviceCategory);
    const targetElement = document.getElementById('booking');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="before-after" className="py-10 sm:py-16 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4 text-left">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#005f73]" />
              <span>Real Patient Transformations (Verified Cases)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] tracking-tight">
              Before & After Transformations
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-medium mt-1">
              Drag the slider smoothly left or right to inspect the initial dental problem and clinical outcome.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBookSlotClick()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md min-h-[42px] cursor-pointer active:scale-98"
            >
              <span>Book Consultation ({CLINIC_CONTACT.phone})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs - Smooth horizontal scroll on phone & tablet */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[36px] flex items-center shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#005f73] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {filter === 'All' ? 'All (4 Cases)' : filter}
            </button>
          ))}
        </div>

        {/* Comparison Cards Grid - 1 Col on Phone/Tablet, 2 Cols on Desktop for Perfect Space */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full max-w-full">
          {filteredCases.map((item) => (
            <Interactive3DCard key={item.id}>
              <div className="bg-white h-full flex flex-col group text-left rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300">
                
                {/* Clean, Ultra-Responsive Comparison Slider */}
                <HandComparisonSlider 
                  item={item}
                  heightClass="h-56 xs:h-64 sm:h-72 md:h-80"
                  onOpenModal={() => setSelectedCase(item)}
                />

                {/* Card Details (Compact, Clean, NO clutter) */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
                  <div>
                    {/* Top Category and Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Treatment</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-[#0a2540] group-hover:text-[#005f73] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-700 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Card Bottom Actions: More Details & Direct Book Slot */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCase(item)}
                      className="text-xs font-bold text-[#005f73] hover:text-[#083b47] flex items-center space-x-1 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-cyan-50 transition-colors"
                    >
                      <span>More Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBookSlotClick(item.category)}
                      className="text-xs font-extrabold text-white bg-[#005f73] hover:bg-[#074755] cursor-pointer py-2 px-3.5 rounded-xl shadow-xs transition-all active:scale-98 flex items-center space-x-1.5"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>

      {/* Case Details High-Definition Modal (Opened by "More Details") */}
      {selectedCase && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCase(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-cyan-100 text-left max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#005f73] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {selectedCase.category} Treatment Statement
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
                  {selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Large Slider & Statement Details */}
            <div className="overflow-y-auto flex-1">
              <div className="p-4 sm:p-6 space-y-4">
                
                {/* Large Comparison Slider inside modal */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <HandComparisonSlider 
                    item={selectedCase}
                    heightClass="h-60 sm:h-76 md:h-88"
                  />
                </div>

                {/* Problem vs Implementation Statement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                    <span className="font-extrabold uppercase tracking-wider text-rose-800 text-[10px] block mb-1">
                      Problem Statement (BEFORE)
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedCase.beforeDetail}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <span className="font-extrabold uppercase tracking-wider text-emerald-800 text-[10px] block mb-1">
                      Implemented Result (AFTER)
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedCase.afterDetail}
                    </p>
                  </div>
                </div>

                {/* What Treatment was Implemented */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    What Treatment was Implemented
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedCase.description}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#005f73]" />
                      <span>Duration: {selectedCase.treatmentDuration || 'Single Sitting'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Doctor: {selectedCase.doctorSpecialist || 'Senior Specialist'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-200 text-center min-h-[38px] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  handleBookSlotClick(selectedCase.category);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs font-extrabold shadow-sm text-center min-h-[38px] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Book Appointment for this Treatment ({CLINIC_CONTACT.phone})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
