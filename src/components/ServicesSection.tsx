import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Smile, 
  ShieldCheck, 
  Activity, 
  Baby, 
  HeartHandshake, 
  ShieldAlert, 
  Scissors, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Award,
  ArrowRight,
  Calendar,
  Clock,
  Phone,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ALL_SERVICES, DetailedService, CLINIC_CONTACT } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

const ServiceDetailModal = React.lazy(() =>
  import('./ServiceDetailModal').then((m) => ({ default: m.ServiceDetailModal }))
);

interface ServicesSectionProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = React.memo(({ onOpenBooking }) => {
  const [selectedService, setSelectedService] = useState<DetailedService | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  // Helper to get matching Lucide icon
  const getServiceIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-[#005f73] group-hover:text-white group-hover:scale-110 transition-all duration-300" };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Anchor': return <ShieldCheck {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Baby': return <Baby {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'AlertCircle': return <AlertCircle {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Award': return <Award {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <ShieldCheck {...props} />;
    }
  };

  const categories = [
    { id: 'All', label: 'All Services' },
    { id: 'Essential Care', label: 'General & Preventive' },
    { id: 'Cosmetic', label: 'Cosmetic & Whitening' },
    { id: 'Restorative', label: 'Implants & Crowns' },
    { id: 'Orthodontics', label: 'Braces & Aligners' },
    { id: 'Root Canal', label: 'Root Canal (RCT)' },
    { id: 'Child Care', label: 'Pediatric Care' },
    { id: 'Emergency', label: 'Emergency & Surgery' }
  ];

  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter(service => {
      if (activeCategory === 'All') return true;
      if (activeCategory === 'Essential Care') return service.category === 'Essential Care' || service.category === 'Gum Care';
      if (activeCategory === 'Cosmetic') return service.category === 'Cosmetic' || service.category === 'Aesthetic' || service.category === 'Teeth Whitening' || service.category === 'Smile Makeover';
      if (activeCategory === 'Restorative') return service.category === 'Restorative' || service.category === 'Prosthodontics' || service.category === 'Dental Implants';
      if (activeCategory === 'Orthodontics') return service.category === 'Orthodontics' || service.category === 'Braces';
      if (activeCategory === 'Root Canal') return service.category === 'Endodontics';
      if (activeCategory === 'Child Care') return service.category === 'Child Care';
      if (activeCategory === 'Emergency') return service.category === 'Surgical' || service.category === 'Urgent';
      return service.category === activeCategory;
    });
  }, [activeCategory]);

  const displayedServices = useMemo(() => {
    return showAllServices || activeCategory !== 'All'
      ? filteredServices
      : filteredServices.slice(0, 6);
  }, [filteredServices, showAllServices, activeCategory]);

  return (
    <section id="services" className="py-10 sm:py-16 lg:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4 text-left">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-[#005f73] text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Comprehensive Oral Care</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a2540] tracking-tight">
              Our Dental Services
            </h2>
            <p className="text-xs sm:text-base text-slate-500 font-normal mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
              Complete, gentle, and hospital-grade dental treatments designed for every member of your family—from preventative checkups to advanced smile restorations.
            </p>
          </div>

          {/* Quick Count Badge */}
          <div className="self-start md:self-auto flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-cyan-50/70 border border-cyan-200 text-[11px] sm:text-xs font-bold text-[#005f73]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{filteredServices.length} Treatment Options Available</span>
          </div>
        </div>

        {/* Category Filter Tabs with edge-to-edge mobile scroll */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 sm:mb-10 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 min-h-[38px] flex items-center shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#005f73] text-white shadow-md shadow-cyan-950/20 scale-[1.02]'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-cyan-50 hover:text-[#005f73]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Full Width Services Grid (Clean 4-column desktop / 2-column tablet / 1-column mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedServices.map((service) => (
            <Interactive3DCard key={service.id}>
              <div className="h-full bg-white p-4 sm:p-6 flex flex-col justify-between group text-left relative overflow-hidden">
                {/* Top Accent Line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-[#005f73] to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Header: Icon + Category Badge */}
                  <div className="flex items-start justify-between mb-3.5 sm:mb-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 border border-cyan-100/90 flex items-center justify-center group-hover:bg-[#005f73] transition-all duration-300 shadow-2xs shrink-0">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-semibold tracking-wide border border-slate-200/60">
                      {service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base sm:text-lg text-[#0a2540] mb-1.5 sm:mb-2 leading-snug group-hover:text-[#005f73] transition-colors">
                    {service.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed mb-3 sm:mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Session Duration Tag */}
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Session: {service.duration || '30 - 45 mins'}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3.5 sm:pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="font-bold text-[#005f73] hover:text-[#074755] flex items-center space-x-1 group/btn py-1.5 cursor-pointer min-h-[36px]"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onOpenBooking(service.name)}
                    className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-[#005f73] text-[#005f73] hover:text-white font-bold flex items-center space-x-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer min-h-[36px]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

        {/* View All Services / Show Less Toggle Button */}
        {filteredServices.length > 6 && (
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllServices(!showAllServices)}
              className="inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 rounded-2xl bg-[#005f73] hover:bg-[#074755] text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-950/15 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[44px]"
            >
              <span>
                {showAllServices 
                  ? 'Show Less (Top 6 Services)' 
                  : `View All Services (${filteredServices.length} Treatments Available)`}
              </span>
              {showAllServices ? (
                <ChevronUp className="w-4 h-4 text-cyan-200" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-200" />
              )}
            </button>
          </div>
        )}

        {/* Bottom Helpful Consultation Banner */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-50/90 via-[#f0fbfd] to-cyan-50/90 border border-cyan-200/70 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs text-left">
          <div className="space-y-1 sm:space-y-1.5 w-full md:w-auto">
            <h4 className="text-base sm:text-xl font-extrabold text-[#0a2540]">
              Not sure which dental treatment is right for you?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Schedule a comprehensive oral examination with our dental specialists. We will examine your teeth and design a clear, transparent treatment plan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onOpenBooking('General Consultation')}
              className="px-5 py-3 sm:py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-900/15 transition-all flex items-center justify-center space-x-2 active:scale-95 min-h-[42px]"
            >
              <Calendar className="w-4 h-4 text-cyan-200" />
              <span>Book Consultation</span>
            </button>
            <a
              href={CLINIC_CONTACT.telLink}
              className="px-5 py-3 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#005f73] border border-cyan-200 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center space-x-2 min-h-[42px]"
            >
              <Phone className="w-4 h-4 text-[#005f73]" />
              <span>{CLINIC_CONTACT.phone}</span>
            </a>
          </div>
        </div>

      </div>

      {/* Individual Service Detail Modal (Lazy loaded when opened) */}
      {selectedService && (
        <React.Suspense fallback={null}>
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBook={(name) => {
              setSelectedService(null);
              onOpenBooking(name);
            }}
          />
        </React.Suspense>
      )}
    </section>
  );
});
