import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone
} from 'lucide-react';
import { DetailedService, CLINIC_CONTACT, happySmilePhoto, treatmentRoomPhoto } from '../config/clinicData';

interface ServiceDetailModalProps {
  service: DetailedService | null;
  onClose: () => void;
  onBook: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ 
  service, 
  onClose, 
  onBook 
}) => {
  if (!service) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-cyan-100 overflow-hidden my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with soft cyan gradient */}
        <div className="bg-gradient-to-r from-[#e6f7fa] to-[#f0fbfd] p-5 sm:p-7 border-b border-cyan-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow-xs transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-cyan-800 text-xs font-bold mb-2 shadow-xs border border-cyan-200">
            <span>{service.category}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight pr-8">
            {service.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg leading-relaxed">
            {service.shortDesc}
          </p>

          {service.duration && (
            <div className="flex items-center space-x-2 mt-2.5 sm:mt-3 text-xs font-semibold text-cyan-900">
              <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Typical Duration: {service.duration}</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-7 space-y-5 sm:space-y-6 max-h-[58vh] sm:max-h-[68vh] overflow-y-auto">
          
          {/* Detailed Treatment Explanation */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              About This Treatment
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Clinical Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="bg-[#f8fdfe] p-3.5 sm:p-5 rounded-2xl border border-cyan-100">
              <h4 className="text-xs sm:text-sm font-bold text-[#0a2540] mb-2.5 sm:mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Key Patient Benefits</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Procedure */}
          {service.procedureSteps && service.procedureSteps.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-2.5 sm:mb-3">
                Procedure & Treatment Journey
              </h4>
              <div className="space-y-2 sm:space-y-2.5">
                {service.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who Needs It */}
          {service.whoNeedsIt && service.whoNeedsIt.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                Who Is This Treatment For?
              </h4>
              <ul className="space-y-1.5">
                {service.whoNeedsIt.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Frequently Asked Questions */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="border-t border-slate-100 pt-4 sm:pt-5">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-cyan-600" />
                <span>Common Questions</span>
              </h4>
              <div className="space-y-2.5 sm:space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-[#f0fbfd] border border-cyan-100 text-xs">
                    <p className="font-bold text-slate-900 mb-1">{faq.q}</p>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <a
            href={CLINIC_CONTACT.telLink}
            className="text-xs font-semibold text-slate-600 hover:text-cyan-800 flex items-center justify-center sm:justify-start space-x-1.5 py-1"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-600" />
            <span>Questions? Call {CLINIC_CONTACT.phone}</span>
          </a>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 sm:ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors text-center min-h-[38px]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(service.name);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 min-h-[38px]"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-200" />
              <span>Book Appointment For {service.name}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
