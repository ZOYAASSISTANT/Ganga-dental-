import React from 'react';
import { AlertCircle, Phone, Clock, ArrowRight, ShieldAlert, HeartPulse } from 'lucide-react';
import { CLINIC_CONTACT, EMERGENCY_INFO } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

interface EmergencyProps {
  onOpenBooking: () => void;
}

export const EmergencySection: React.FC<EmergencyProps> = React.memo(({ onOpenBooking }) => {
  return (
    <section className="py-8 sm:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Emergency Alert Card with Interactive 3D Lift and Glow */}
        <Interactive3DCard variant="rose">
          <div className="p-5 sm:p-8 bg-gradient-to-r from-[#eef9fb] via-[#e2f5f8] to-[#f4fbfc] relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left: Info */}
              <div className="lg:col-span-8 space-y-2.5 sm:space-y-3 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Priority Emergency Care Available</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight">
                  {EMERGENCY_INFO.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {EMERGENCY_INFO.subtitle} If you are experiencing severe throbbing pain, bleeding, or an accidental tooth injury, do not wait.
                </p>

                {/* Common Emergencies Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {EMERGENCY_INFO.scenarios.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-white/90 border border-cyan-200 text-slate-700 text-[11px] sm:text-xs font-semibold"
                    >
                      • {item.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Emergency Hotline Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 justify-center">
                <a
                  href={CLINIC_CONTACT.telLink}
                  className="w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-101 active:scale-98 cursor-pointer text-center min-h-[44px]"
                >
                  <Phone className="w-4 h-4 animate-bounce shrink-0" />
                  <span className="truncate">Call Emergency: {CLINIC_CONTACT.phone}</span>
                </a>

                <a
                  href={CLINIC_CONTACT.getWhatsAppUrl('EMERGENCY: I need urgent same-day dental assistance.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 sm:px-6 rounded-2xl bg-[#005f73] hover:bg-[#074755] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer min-h-[40px] text-center"
                >
                  <span>WhatsApp Emergency Team</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

            </div>

          </div>
        </Interactive3DCard>

      </div>
    </section>
  );
});
