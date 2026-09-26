import React from 'react';
import { CreditCard, FileCheck, ShieldCheck, Percent } from 'lucide-react';
import { INSURANCE_PAYMENT_INFO } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

export const InsurancePaymentSection: React.FC = React.memo(() => {
  return (
    <section className="py-8 sm:py-14 bg-[#f0fbfd] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight">
            {INSURANCE_PAYMENT_INFO.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {INSURANCE_PAYMENT_INFO.subtitle}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {INSURANCE_PAYMENT_INFO.highlights.map((item, idx) => (
            <Interactive3DCard key={idx}>
              <div className="p-4 sm:p-5 h-full bg-white text-left flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#005f73] mb-3">
                    {idx === 0 && <FileCheck className="w-5 h-5" />}
                    {idx === 1 && <ShieldCheck className="w-5 h-5" />}
                    {idx === 2 && <CreditCard className="w-5 h-5" />}
                    {idx === 3 && <Percent className="w-5 h-5" />}
                  </div>

                  <h3 className="font-extrabold text-sm text-[#0a2540] mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-50 flex items-center text-[11px] font-semibold text-cyan-800">
                  <span>Verified Transparency</span>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>
    </section>
  );
});
